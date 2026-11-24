# Install a Logoforge logo

Resolve the slug first, then install the exact component or file. Every install writes
one self-contained React component (or one SVG). There is no npm logo package.

## React with shadcn

`@logoforge` is in the official shadcn registry directory, so a recent CLI needs no
configuration:

```bash
npx shadcn@latest add @logoforge/stripe

# several at once
npx shadcn@latest add @logoforge/vercel @logoforge/supabase @logoforge/github
```

The file lands in `components/logos/<slug>.tsx`. It imports only `react`; no dependency,
CSS, or other file is added.

The full registry URL works everywhere, including older CLI versions:

```bash
npx shadcn@latest add https://logoforge.terravidhal.me/r/stripe.json
```

### Older CLI: declare the namespace once

Add this to `components.json`, then use `@logoforge/<slug>` as above:

```json
{
  "registries": {
    "@logoforge": "https://logoforge.terravidhal.me/r/{name}.json"
  }
}
```

### No `components.json`

The shadcn CLI offers to run `shadcn init` first, which edits the global CSS and adds a
`lib/utils` helper. If the user does not want that, use the manual React path below
instead.

### Update a logo

Brands redraw their marks. Pull the current file with:

```bash
npx shadcn@latest add @logoforge/stripe --overwrite
```

## React without shadcn

Use the MCP tool `get_logo_component({ slug })`, or read the registry item and write its
content to the components folder:

```bash
mkdir -p components/logos
curl -s https://logoforge.terravidhal.me/r/stripe.json \
  | jq -r '.files[0].content' > components/logos/stripe.tsx
```

Then import the exported component (`StripeLogo` for `stripe`):

```tsx
import { StripeLogo } from "@/components/logos/stripe";

export function Example() {
  return <StripeLogo className="h-6 w-auto" />;
}
```

Adjust the import path to the project's alias if it is not `@/`. The file is TypeScript
by default; for plain JavaScript, rename it to `.jsx` and remove the type lines.

## Vue, Svelte, Astro, plain HTML

Download the exact SVG, or use `get_logo_svg({ slug, variant })`:

```bash
mkdir -p public/logos
curl -s https://logoforge.terravidhal.me/logos/stripe/icon.svg \
  -o public/logos/stripe.svg
```

As an image:

```html
<img src="/logos/stripe.svg" alt="Stripe" style="height: 24px; width: auto" />
```

`alt` is required. Use `alt=""` only when an adjacent visible text already names the
brand.

Inline SVG (needed for `currentColor` mono):

```html
<svg role="img" aria-label="Stripe" ...>...</svg>
```

Use `aria-hidden="true"` instead of `role`/`aria-label` when the adjacent text names the
brand. Never edit the SVG's paths, colors, or `viewBox`.

Dark mode with `<img>`: swap the file instead of filtering it. Use the `icon-dark` file
when it exists and the theme is dark:

```html
<picture>
  <source srcset="/logos/github/icon-dark.svg" media="(prefers-color-scheme: dark)" />
  <img src="/logos/github/icon.svg" alt="GitHub" style="height: 24px; width: auto" />
</picture>
```

If the theme is class-based rather than OS-based, switch `src` from the theme state. When
there is no dark variant, use `icon-mono` inline with the theme's text color.

## A whole "Trusted by" section

Use `build_logo_cloud` with 3–12 slugs:

```
build_logo_cloud({
  logos: ["vercel", "stripe", "linear", "supabase"],
  layout: "grid",
  style: "gray",
  names: false,
  heading: "Trusted by teams shipping with"
})
```

It returns the React code, a one-command install, and a visual builder link. The direct
install is:

```bash
npx shadcn@latest add "https://logoforge.terravidhal.me/r/cloud.json?logos=vercel,stripe,linear,supabase&layout=grid&style=gray"
```

It writes `components/logo-cloud.tsx` and installs every logo it imports. Options:
`layout=grid|marquee|bento`, `style=gray|color`, `names=1`, `heading=<text>`.

## After installing

1. Check the file exists in `components/logos/<slug>.tsx` (or your components folder).
2. Check the import resolves and the component name matches the one returned by Logoforge.
3. Run the project's checks:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Remove a logo by deleting its component file and its imports. Do not remove anything
else.
