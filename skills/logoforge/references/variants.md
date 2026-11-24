# Variants, props, and dark mode

A logo only has the variants Logoforge returns. Read them before writing JSX:

```bash
curl -s https://logoforge.terravidhal.me/api/logos/github.json | jq '.svg | keys'
```

Expected for GitHub: `icon`, `icon-mono`, `icon-dark`, `wordmark`, `wordmark-dark`.
For Stripe: `icon`, `icon-mono`, `wordmark`. Never assume a variant exists.

## The variants

| Variant | What it is | When it exists |
|---|---|---|
| `icon` | The mark alone, original colors. | Always. |
| `icon-mono` | The mark as one `currentColor` shape. | When the mark stays readable in one color. |
| `icon-dark` | The mark for dark backgrounds. | For near-black marks such as GitHub, Vercel, Notion. |
| `wordmark` | Mark plus brand name, original colors. | When the brand has a lockup. |
| `wordmark-dark` | The lockup for dark backgrounds. | When the brand has a dark lockup. |
| `official-*` | A file published by the brand, kept as published (`official-lockup-horizontal`, `official-icon`, `official-wordmark`, …). | When Logoforge records an official file. |

Read `officialVariants` in the API/MCP response. The shadcn item names for those files
are listed in `https://logoforge.terravidhal.me/r/registry.json`; do not derive their
suffix yourself.

## Component props

The installed component exposes only the props its files support.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `variant` | `"color" \| "mono"` | `"color"` | Brand colors, or `currentColor`. |
| `type` | `"icon" \| "wordmark"` | `"icon"` | The mark alone, or the full lockup. |
| `mode` | `"auto" \| "light" \| "dark"` | `"auto"` | Picks the light/dark file. Only on logos with a dark variant. |
| `title` | `string` | the brand name | Accessible name (`role="img"`). `""` makes it decorative. |
| `...props` | `SVGProps` | — | `className`, `style`, `width`, `height`, events. |

`mode="auto"` follows the `.dark` class (the shadcn/Tailwind convention). Without
Tailwind, pass `mode="light"` or `mode="dark"` from your own theme state, or use
`variant="mono"`, which works everywhere. Do not pass `mode` to a component that does not
declare it — check the installed file or its TypeScript errors.

## Choose the right variant

| Context | Use |
|---|---|
| "Works with" / grayscale strip | `variant="mono"` with `text-muted-foreground`. |
| "Trusted by" grid | Mono for a quiet look; color when the brands should stand out. |
| Integrations cards | Color `icon`, or `type="wordmark"` if the lockup exists. |
| Footer | Mono, or color with `mode="auto"`. |
| Sign-in button | Icon plus visible text (`title=""`). Use the wordmark only if the provider's guidelines allow it. |
| Dark hero / dark panel | `mode="auto"` if a dark variant exists; otherwise mono with a light text color. |
| Exact brand lockup | An `official-*` variant from the brand. |
| Comparison-table header | Icon or wordmark, `title=""`, because the column header already names the brand. |

## Sizing and clear space

The SVG defaults to `height="1em"` with its width following the aspect ratio.

```tsx
<StripeLogo className="h-6 w-auto" />
<GithubLogo className="size-8" variant="mono" />
```

- Prefer `h-* w-auto`; use `size-*` only for square marks.
- Do not set a width and height that fight the ratio.
- Keep the same visual height across a row, not the same width: marks have different
  aspect ratios.
- Leave padding or `gap` around the logo; never touch text or cell borders.
- No shadow, glow, outline, rotation, crop, or arbitrary scale.

## Dark mode

- Near-black marks vanish on dark. Use the `icon-dark` / `wordmark-dark` file through
  `mode="auto"` (or `mode="dark"`), or use mono.
- Color marks (Stripe, Figma, Google) often have no dark file. Keep the original color and
  check contrast; use mono if the background competes with the brand color.
- Mono is the safe universal fallback: it uses `currentColor`, so set
  `text-foreground`, `text-muted-foreground`, or another theme color on a parent.
- Never use CSS `invert` or `brightness` to fake dark mode. A `grayscale`/`opacity`
  treatment for a quiet logo strip is a layout choice, not a dark-mode fix; prefer mono,
  and never edit the SVG fill.
- Check the result in light and dark, not just one.

## Never

- Invent a variant or pass a variant that the logo does not have.
- Change the `viewBox` or paths to make a logo fit.
- Recolor a brand mark outside the provided color/mono files.
- Swap in a similar brand because the exact variant is missing.
