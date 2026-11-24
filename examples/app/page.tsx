import Link from "next/link";

import { BuiltWith } from "@/components/sections/built-with";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { Integrations } from "@/components/sections/integrations";
import { SignInButtons } from "@/components/sections/sign-in-buttons";
import { TrustedBy } from "@/components/sections/trusted-by";
import { WorksWith } from "@/components/sections/works-with";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "#works-with", label: "Works with" },
  { href: "#trusted-by", label: "Trusted by" },
  { href: "#integrations", label: "Integrations" },
  { href: "#comparison", label: "Comparison" },
  { href: "#sign-in", label: "Sign in" },
  { href: "#built-with", label: "Footer" },
];

const facts = ["6 recipes", "9 real logos", "light & dark", "accessible names"];

export default function HomePage() {
  return (
    <div id="top">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link href="#top" className="flex items-center gap-2 text-sm font-semibold">
            <span
              aria-hidden="true"
              className="grid size-6 place-items-center rounded-md bg-foreground text-[10px] font-bold text-background"
            >
              LF
            </span>
            Logoforge Skill
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              examples
            </span>
          </Link>

          <nav aria-label="Sections" className="hidden items-center gap-5 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[-12rem] mx-auto h-[24rem] max-w-3xl rounded-full bg-[radial-gradient(closest-side,var(--color-accent),transparent)] blur-2xl"
          />
          <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Logoforge skill · examples
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Real brand logos, not drawings.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Six production-ready sections built with the real Logoforge React components:
              Works with, Trusted by, integrations, comparison table, Sign in with, and a
              built-with footer. No hand-made SVG, no invented marks, no random web images.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {facts.map((fact) => (
                <span
                  key={fact}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {fact}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#works-with"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Browse the recipes
              </a>
              <Link
                href="/before-after"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Before / after
              </Link>
            </div>

            <div className="mt-10 max-w-xl rounded-xl border border-border/70 bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Install the skill
              </p>
              <code className="mt-2 block font-mono text-sm text-foreground">
                npx skills add terravidhal/logoforge-skill --skill logoforge
              </code>
              <p className="mt-2 text-xs text-muted-foreground">
                Then ask your agent for the section. It resolves each brand on Logoforge before
                writing JSX.
              </p>
            </div>

            <p className="mt-8 max-w-2xl rounded-lg border border-border/70 bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
              Demo content only. Brands, customers, and integrations shown here are examples,
              not claims about this project or its authors.
            </p>
          </div>
        </section>

        <WorksWith />
        <TrustedBy />
        <Integrations />
        <ComparisonTable />
        <SignInButtons />
        <BuiltWith />
      </main>

      <div className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            Components installed from the{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="https://logoforge.terravidhal.me"
            >
              Logoforge
            </a>{" "}
            registry. Logos are trademarks of their owners.
          </p>
          <p>
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="https://github.com/terravidhal/logoforge-skill"
            >
              logoforge-skill
            </a>{" "}
            · MIT
          </p>
        </div>
      </div>
    </div>
  );
}
