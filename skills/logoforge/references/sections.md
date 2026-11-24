# Six ready-to-use sections

Each recipe assumes the logos are installed in `components/logos/<slug>.tsx`. Replace the
example brands with the ones the user actually needs. The example slugs below exist on
Logoforge; the *relationships* are placeholders.

Common rules:

- Wrap a logo in a visible label or a `sr-only` span when you pass `title=""`, so the
  link or button still has an accessible name.
- Use mono for quiet strips and footers; use color for integration cards and sign-in.
- If a logo has no mono file, keep it in color or apply `opacity-70 grayscale` as a layout
  filter. Never recolor the SVG itself.
- Adapt the container, heading, and spacing classes to the project. Do not add an
  animation library for a logo grid.
- Marquees need `motion-reduce:animate-none`, and duplicated logos need `aria-hidden`.

## 1. Works with

A quiet strip of tools the product really works with. Mono logos, names visible, so each
logo is decorative (`title=""`).

```tsx
import { FigmaLogo } from "@/components/logos/figma";
import { GithubLogo } from "@/components/logos/github";
import { LinearLogo } from "@/components/logos/linear";
import { NotionLogo } from "@/components/logos/notion";
import { StripeLogo } from "@/components/logos/stripe";

const tools = [
  { name: "Figma", logo: <FigmaLogo variant="mono" title="" className="h-5 w-auto" /> },
  { name: "GitHub", logo: <GithubLogo variant="mono" title="" className="h-5 w-auto" /> },
  { name: "Linear", logo: <LinearLogo variant="mono" title="" className="h-5 w-auto" /> },
  { name: "Notion", logo: <NotionLogo variant="mono" title="" className="h-5 w-auto" /> },
  { name: "Stripe", logo: <StripeLogo variant="mono" title="" className="h-5 w-auto" /> },
];

export function WorksWith() {
  return (
    <section aria-labelledby="works-with" className="py-14">
      <div className="mx-auto max-w-5xl px-6">
        <h2
          id="works-with"
          className="text-center text-sm font-medium text-muted-foreground"
        >
          Works with the tools you already use
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {tools.map(({ name, logo }) => (
            <li
              key={name}
              className="flex items-center justify-center gap-2.5 text-muted-foreground"
            >
              {logo}
              <span className="text-sm font-medium">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

Only list a tool if the integration is real. A logo here is a compatibility claim.

## 2. Trusted by

A customer wall. Use only real customers; the brands below are examples.

```tsx
import { GithubLogo } from "@/components/logos/github";
import { LinearLogo } from "@/components/logos/linear";
import { NotionLogo } from "@/components/logos/notion";
import { StripeLogo } from "@/components/logos/stripe";
import { SupabaseLogo } from "@/components/logos/supabase";
import { VercelLogo } from "@/components/logos/vercel";

const customers = [
  { name: "Vercel", logo: <VercelLogo variant="mono" title="" className="h-7 w-auto" /> },
  { name: "Stripe", logo: <StripeLogo variant="mono" title="" className="h-7 w-auto" /> },
  { name: "Supabase", logo: <SupabaseLogo variant="mono" title="" className="h-7 w-auto" /> },
  { name: "Linear", logo: <LinearLogo variant="mono" title="" className="h-7 w-auto" /> },
  { name: "Notion", logo: <NotionLogo variant="mono" title="" className="h-7 w-auto" /> },
  { name: "GitHub", logo: <GithubLogo variant="mono" title="" className="h-7 w-auto" /> },
];

export function TrustedBy() {
  return (
    <section aria-labelledby="trusted-by" className="border-y border-border/60 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 id="trusted-by" className="text-center text-sm text-muted-foreground">
          Trusted by teams at
        </h2>
        <ul className="mt-8 grid grid-cols-2 items-center gap-x-10 gap-y-8 sm:grid-cols-3">
          {customers.map(({ name, logo }) => (
            <li key={name} className="flex justify-center text-muted-foreground">
              {logo}
              <span className="sr-only">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

For a marquee or bento layout, use `build_logo_cloud` instead of writing the animation
by hand. It returns the code and a one-command install. The marquee clone must be
`aria-hidden` and the animation must stop under `prefers-reduced-motion`.

## 3. Integrations page

Cards with a color logo, a name, a one-line description, and a link. The name is visible,
so the logo is decorative.

```tsx
import { LinearLogo } from "@/components/logos/linear";
import { StripeLogo } from "@/components/logos/stripe";
import { SupabaseLogo } from "@/components/logos/supabase";

const integrations = [
  {
    name: "Stripe",
    description: "Payments, billing, and subscriptions.",
    href: "/integrations/stripe",
    logo: <StripeLogo title="" className="h-8 w-auto" />,
  },
  {
    name: "Supabase",
    description: "Auth, database, and storage.",
    href: "/integrations/supabase",
    logo: <SupabaseLogo title="" className="h-8 w-auto" />,
  },
  {
    name: "Linear",
    description: "Issue tracking for product teams.",
    href: "/integrations/linear",
    logo: <LinearLogo title="" className="h-8 w-auto" />,
  },
];

export function Integrations() {
  return (
    <section aria-labelledby="integrations" className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 id="integrations" className="text-2xl font-semibold tracking-tight">
          Integrations
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map(({ name, description, href, logo }) => (
            <li key={name}>
              <a
                href={href}
                className="flex h-full flex-col gap-4 rounded-xl border border-border/60 p-5 transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="flex h-10 items-center">{logo}</div>
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

Link to the real integration page. Do not label a product as integrated before the
integration exists.

## 4. Footer

A "Built with" strip. Logos only, so the accessible name must come from the link.

```tsx
import { StripeLogo } from "@/components/logos/stripe";
import { SupabaseLogo } from "@/components/logos/supabase";
import { VercelLogo } from "@/components/logos/vercel";

const builtWith = [
  { name: "Vercel", href: "https://vercel.com", logo: <VercelLogo variant="mono" title="" className="h-5 w-auto" /> },
  { name: "Supabase", href: "https://supabase.com", logo: <SupabaseLogo variant="mono" title="" className="h-5 w-auto" /> },
  { name: "Stripe", href: "https://stripe.com", logo: <StripeLogo variant="mono" title="" className="h-5 w-auto" /> },
];

export function BuiltWith() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground">Built with</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {builtWith.map(({ name, href, logo }) => (
            <li key={name}>
              <a
                href={href}
                className="flex items-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {logo}
                <span className="sr-only">{name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
```

If a brand name is visible next to the logo, keep `title=""` and drop the `sr-only` span.
Only list tools the product actually uses.

## 5. Comparison table

Logos in the column headers, always paired with the brand name. This is GitHub vs GitLab;
replace the columns and verify every claim.

```tsx
import { GithubLogo } from "@/components/logos/github";
import { GitlabLogo } from "@/components/logos/gitlab";

const columns = [
  { name: "GitHub", logo: <GithubLogo title="" className="h-6 w-auto" /> },
  { name: "GitLab", logo: <GitlabLogo title="" className="h-6 w-auto" /> },
];

const rows = [
  { feature: "Issue tracking", values: [true, true] },
  { feature: "Built-in CI/CD", values: [true, true] },
  { feature: "Self-hosted option", values: [true, true] },
];

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="sr-only">Comparison of GitHub and GitLab features</caption>
        <thead>
          <tr className="border-b border-border/60">
            <th scope="col" className="py-3 pr-4 font-medium">
              Feature
            </th>
            {columns.map(({ name, logo }) => (
              <th key={name} scope="col" className="px-4 py-3 text-center font-medium">
                <span className="flex flex-col items-center gap-2">
                  {logo}
                  <span>{name}</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ feature, values }) => (
            <tr key={feature} className="border-b border-border/60">
              <th scope="row" className="py-3 pr-4 font-normal text-muted-foreground">
                {feature}
              </th>
              {values.map((value, i) => (
                <td key={columns[i].name} className="px-4 py-3 text-center">
                  {value ? "Yes" : "No"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

The name in the header is the accessible label; the logo is decorative. Keep the table
inside `overflow-x-auto` on small screens.

## 6. Sign in with

A provider button with the brand mark and visible text. The text names the action, so the
logo is decorative.

```tsx
import { GithubLogo } from "@/components/logos/github";
import { GoogleLogo } from "@/components/logos/google";

export function SignInButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        className="inline-flex h-10 items-center justify-center gap-2.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <GithubLogo title="" className="h-5 w-5" />
        <span>Sign in with GitHub</span>
      </button>
      <button
        type="button"
        className="inline-flex h-10 items-center justify-center gap-2.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <GoogleLogo title="" className="h-5 w-5" />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}
```

Use `<a href>` instead of `<button>` when the provider is a redirect, and keep the same
text and focus styles. Follow the provider's sign-in branding guidelines when they exist
(the logo page links them). Do not recolor the mark or build a fake provider button.

Only show a provider the product really supports. A sign-in button is a functional claim,
not decoration.

## Final checks for every pattern

- [ ] Brands are real integrations, customers, or partners.
- [ ] Each logo is imported from `components/logos/<slug>` and matches the resolved slug.
- [ ] `title=""` is paired with visible text or `sr-only`; otherwise the default brand
      name is the accessible name.
- [ ] Mono logos inherit the theme text color; color logos are legible in light and dark.
- [ ] Heights are consistent, widths are automatic, and there is clear space.
- [ ] Links and buttons have a visible focus state; marquees respect reduced motion.
