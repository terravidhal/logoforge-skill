# Examples — six logo recipes

A minimal Next.js app that shows the six sections the Logoforge skill builds:

| # | Recipe | File |
|---|---|---|
| 1 | Works with | `components/sections/works-with.tsx` |
| 2 | Trusted by | `components/sections/trusted-by.tsx` |
| 3 | Integrations page | `components/sections/integrations.tsx` |
| 4 | Built-with footer | `components/sections/built-with.tsx` |
| 5 | Comparison table | `components/sections/comparison-table.tsx` |
| 6 | Sign in with | `components/sections/sign-in-buttons.tsx` |

Everything is rendered on `/`, plus a `/before-after` page used for the README image.

## Run it

```bash
cd examples
npm install
npm run dev
```

Open http://localhost:3000. The theme toggle in the header switches light and dark.

Production check:

```bash
npm run build
npm run start
```

## The logos are real

`components/logos/<slug>.tsx` contains the **unmodified** component source served by the
Logoforge registry (`https://logoforge.terravidhal.me/r/<slug>.json`). They are vendored so the
example builds offline and every change is reviewable.

In a real project, do not copy files by hand. Install them with the shadcn CLI:

```bash
npx shadcn@latest add @logoforge/figma @logoforge/github @logoforge/gitlab @logoforge/google \
  @logoforge/linear @logoforge/notion @logoforge/stripe @logoforge/supabase @logoforge/vercel
```

To refresh the vendored files from the live registry:

```bash
npm run fetch:logos
```

Each component takes `variant` (`color` / `mono`), `type` (`icon` / `wordmark`), `mode`
(`auto` / `light` / `dark`, only for logos with a dark file), and `title` (the accessible
name; pass `""` when a visible label already names the brand).

## How the recipes stay correct

- **No redrawing.** Every mark is the published Logoforge file.
- **No distortion.** Sizes use `h-* w-auto` (or `size-*` for square marks) so the viewBox
  ratio is preserved.
- **Original colors, or mono.** Grayscale strips use `variant="mono"`; cards use brand color.
- **Dark mode.** Components with an `icon-dark` file use `mode="auto"` and swap on the
  `.dark` class. The others use mono or their original colors, which stay legible.
- **Accessibility.** Decorative logos pass `title=""` and are hidden from screen readers;
  the visible text (or an `sr-only` span) carries the name.
- **Honest claims.** "Trusted by" and "Integrations" are demo copy; replace them with real
  customers and integrations.

## Screenshots

`npm run screenshots` starts the production build and writes 1440 px and 390 px captures
in light and dark to `../assets/readme/`, plus the before/after image. It needs a Playwright
Chromium build (`npx playwright install chromium`).

## Trademarks

Brand names and logos belong to their owners. They are used here for identification only.
See the repository's [TRADEMARKS.md](../TRADEMARKS.md).
