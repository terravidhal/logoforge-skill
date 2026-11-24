/**
 * Download the exact component files served by the Logoforge shadcn registry.
 *
 * The example vendors those files so that `npm install && npm run build` works
 * offline and the diff stays reviewable. In a real project, install them with
 * `npx shadcn@latest add @logoforge/<slug>` instead of running this script.
 */
import { mkdir, writeFile } from "node:fs/promises";

const SLUGS = [
  "figma",
  "github",
  "gitlab",
  "google",
  "linear",
  "notion",
  "stripe",
  "supabase",
  "vercel",
];

const base = process.env.LOGOFORGE_BASE_URL ?? "https://logoforge.terravidhal.me";
const outDir = new URL("../components/logos/", import.meta.url);

await mkdir(outDir, { recursive: true });

for (const slug of SLUGS) {
  const url = `${base}/r/${slug}.json`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`${slug}: ${response.status} ${response.statusText} (${url})`);
  }

  const item = await response.json();
  const file = item.files?.[0];
  if (!file?.content) {
    throw new Error(`${slug}: registry item has no component source`);
  }
  if (!file.content.includes("export function")) {
    throw new Error(`${slug}: unexpected component source`);
  }

  await writeFile(new URL(`${slug}.tsx`, outDir), file.content, "utf8");
  console.log(`wrote components/logos/${slug}.tsx (${item.title})`);
}

console.log(`\n${SLUGS.length} logos fetched from ${base}`);
