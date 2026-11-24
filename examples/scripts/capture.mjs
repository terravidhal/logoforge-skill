/**
 * Capture the four README screenshots (1440 px and 390 px, light and dark) plus the
 * before/after image. Run `npm run build` first, then `npm run screenshots`.
 */
import { spawn } from "node:child_process";
import { access, mkdir, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = fileURLToPath(new URL("../../assets/readme/", import.meta.url));
const port = Number(process.env.PORT ?? 3177);
const origin = `http://127.0.0.1:${port}`;
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

async function assertBuilt() {
  try {
    await access(path.join(root, ".next", "BUILD_ID"));
  } catch {
    throw new Error("No production build found. Run `npm run build` first.");
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

async function main() {
  await assertBuilt();
  await mkdir(outDir, { recursive: true });

  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: root,
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

    const viewports = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "mobile", width: 390, height: 844 },
    ];

    for (const viewport of viewports) {
      for (const theme of ["light", "dark"]) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: theme,
          deviceScaleFactor: 1,
        });
        await context.addInitScript((value) => {
          localStorage.setItem("theme", value);
        }, theme);
        const page = await context.newPage();
        await page.goto(origin, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);
        const file = path.join(outDir, `example-${viewport.name}-${theme}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`captured ${path.basename(file)}`);
        await context.close();
      }
    }

    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      colorScheme: "light",
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${origin}/before-after`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "before-after.png"), fullPage: true });
    console.log("captured before-after.png");
    await context.close();
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
