/**
 * Record the short README demo GIF: scroll through the six recipes in light mode,
 * switch to dark, and continue to the sign-in section. Frames come from Playwright and
 * are assembled by ffmpeg. Run `npm run build` in examples/ first, then `npm run demo`
 * from the repository root.
 */
import { spawn } from "node:child_process";
import { access, mkdir, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const examplesRoot = fileURLToPath(new URL("..", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const outGif = path.join(repoRoot, "assets", "demo.gif");
const framesDir = path.join(examplesRoot, ".demo-frames");
const port = Number(process.env.PORT ?? 3178);
const origin = `http://127.0.0.1:${port}`;
const nextBin = path.join(examplesRoot, "node_modules", "next", "dist", "bin", "next");

async function assertBuilt() {
  try {
    await access(path.join(examplesRoot, ".next", "BUILD_ID"));
  } catch {
    throw new Error("No production build found. Run `npm run build` in examples/ first.");
  }
}

async function chromiumExecutable() {
  const cache = path.join(os.homedir(), ".cache", "ms-playwright");
  let entries = [];
  try {
    entries = await readdir(cache);
  } catch {
    return undefined;
  }
  const revisions = entries
    .filter((entry) => /^chromium-\d+$/.test(entry))
    .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
  for (const revision of revisions) {
    const candidate = path.join(cache, revision, "chrome-linux64", "chrome");
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next cached revision.
    }
  }
  return undefined;
}

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server did not answer on ${origin}`);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: repoRoot, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code}`));
    });
  });
}

async function main() {
  await assertBuilt();
  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });
  await mkdir(path.dirname(outGif), { recursive: true });

  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: examplesRoot,
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));

  let browser;
  try {
    await waitForServer();

    try {
      browser = await chromium.launch();
    } catch (error) {
      const executablePath = await chromiumExecutable();
      if (!executablePath) throw error;
      browser = await chromium.launch({ executablePath });
    }

    const context = await browser.newContext({
      viewport: { width: 1120, height: 720 },
      colorScheme: "light",
      deviceScaleFactor: 1,
    });
    await context.addInitScript(() => localStorage.setItem("theme", "light"));
    const page = await context.newPage();

    let frame = 0;
    const shot = async () => {
      frame += 1;
      await page.screenshot({
        path: path.join(framesDir, `frame-${String(frame).padStart(3, "0")}.png`),
      });
    };

    const offset = (selector) =>
      page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.getBoundingClientRect().top + window.scrollY : 0;
      }, selector);

    const hold = async (count) => {
      for (let i = 0; i < count; i += 1) {
        await page.waitForTimeout(90);
        await shot();
      }
    };

    const scrollTo = async (target, steps) => {
      const start = await page.evaluate(() => window.scrollY);
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const position = Math.round(start + (target - start) * eased);
        await page.evaluate((value) => window.scrollTo(0, value), position);
        await page.waitForTimeout(70);
        await shot();
      }
    };

    await page.goto(origin, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    await hold(4);
    await scrollTo((await offset("#works-with")) - 72, 8);
    await hold(3);
    await scrollTo((await offset("#trusted-by")) - 72, 8);
    await hold(3);
    await scrollTo((await offset("#integrations")) - 72, 8);
    await hold(3);
    await page.click('button[aria-label="Toggle color theme"]');
    await hold(3);
    await scrollTo((await offset("#sign-in")) - 72, 10);
    await hold(4);

    console.log(`captured ${frame} frames`);

    await run("ffmpeg", [
      "-y",
      "-loglevel",
      "error",
      "-f",
      "image2",
      "-framerate",
      "12",
      "-start_number",
      "1",
      "-i",
      path.join(framesDir, "frame-%03d.png"),
      "-vf",
      "scale=920:-2:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle",
      "-loop",
      "0",
      outGif,
    ]);
    console.log(`wrote ${path.relative(repoRoot, outGif)}`);
  } finally {
    await rm(framesDir, { recursive: true, force: true });
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
