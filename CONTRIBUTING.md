# Contributing

Thanks for improving the Logoforge skill. This repository is instructions and example code,
not a logo library.

## Ground rules

- Never add, redraw, trace, or approximate a brand logo. Logoforge is the source.
- Never claim a brand is a customer, partner, or integration without a real relationship.
- Keep the skill usable by every agent that reads `SKILL.md`; no build step, no key, no
  telemetry.
- Keep examples honest: demo brands are labelled as examples, not claims.

## What to change where

| Change | Files |
|---|---|
| Triggering, workflow, hard rules | `skills/logoforge/SKILL.md` |
| Finding a slug, API/MCP usage | `skills/logoforge/references/finding-logos.md` |
| Install paths, shadcn, non-React stacks | `skills/logoforge/references/installing.md` |
| Variants, props, dark mode, sizing | `skills/logoforge/references/variants.md` |
| Section recipes | `skills/logoforge/references/sections.md` |
| Missing brand / removal | `skills/logoforge/references/missing-brand.md` |
| Demo app | `examples/` |
| README screenshots | `assets/readme/` |
| README demo GIF | `assets/demo.gif` (regenerate with `npm run demo`) |
| Evaluation prompts | `evals/evals.json` |

If you change a recipe, update both the reference and the matching file in
`examples/components/sections/`.

## Refresh the vendored logo components

The example keeps the exact registry output so it builds offline. Do not edit those files by
hand. Refresh them from Logoforge:

```bash
cd examples
npm run fetch:logos
```

In a real project, install with the shadcn CLI instead:

```bash
npx shadcn@latest add @logoforge/stripe
```

## Checks

```bash
npm run lint                 # frontmatter, links, JSON, assets
cd examples
npm ci
npm run build
npm run screenshots          # optional: needs Playwright Chromium
cd ..
npm run demo                 # optional: regenerates assets/demo.gif, needs ffmpeg
```

`npm run lint` must pass. A section change should keep the example building in light and
dark, at 1440 px and 390 px.

## Commit style

Use a short imperative subject, for example:

- `docs: add a comparison-table recipe`
- `fix: keep mono logos visible on dark`
- `chore: refresh vendored logo components`

Keep unrelated changes out of the same commit.

## Trademarks

By contributing you agree that your text and code are licensed under MIT, and that no
trademark rights are granted. See [TRADEMARKS.md](TRADEMARKS.md).
