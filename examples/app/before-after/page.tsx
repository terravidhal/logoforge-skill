import Link from "next/link";

import { FigmaLogo } from "@/components/logos/figma";
import { GithubLogo } from "@/components/logos/github";
import { NotionLogo } from "@/components/logos/notion";
import { StripeLogo } from "@/components/logos/stripe";
import { ThemeToggle } from "@/components/theme-toggle";

const before = [
  {
    name: "Stripe",
    issue: "wrong shape, rotated, guessed purple",
    mark: (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-9 w-9 -rotate-12">
        <rect width="48" height="48" rx="9" fill="#7a5af8" />
        <path
          d="M16 17c5-4 15-3 15 2 0 4-7 4-11 6-4 2-3 8 2 8 4 0 8-1 10-3"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "GitHub",
    issue: "invented animal, wrong proportions, no dark file",
    mark: (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-8 w-8 rotate-3">
        <circle cx="24" cy="26" r="14" fill="#2f2f2f" />
        <path d="M12 14l5-7 4 8z" fill="#2f2f2f" />
        <path d="M36 14l-5-7-4 8z" fill="#2f2f2f" />
        <circle cx="19" cy="24" r="2.2" fill="#ffffff" />
        <circle cx="29" cy="24" r="2.2" fill="#ffffff" />
        <path d="M20 32c2 3 6 3 8 0" fill="none" stroke="#ffffff" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Notion",
    issue: "offset letter, stretched square, flat black",
    mark: (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-10 w-7 skew-y-3">
        <rect width="48" height="48" rx="4" fill="#111111" />
        <text
          x="27"
          y="36"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Georgia, serif"
          fontSize="34"
          fontWeight="700"
        >
          N
        </text>
      </svg>
    ),
  },
  {
    name: "Figma",
    issue: "misaligned circles, arbitrary colors, wrong order",
    mark: (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-8 w-11 rotate-6">
        <circle cx="15" cy="12" r="8" fill="#ff7262" />
        <circle cx="30" cy="14" r="8" fill="#f24e1e" />
        <circle cx="13" cy="27" r="8" fill="#a259ff" />
        <circle cx="31" cy="28" r="8" fill="#1abcfe" />
        <circle cx="20" cy="38" r="7" fill="#0acf83" />
      </svg>
    ),
  },
];

const after = [
  { name: "Stripe", logo: <StripeLogo title="" className="h-9 w-auto" /> },
  { name: "GitHub", logo: <GithubLogo title="" className="h-9 w-auto" /> },
  { name: "Notion", logo: <NotionLogo title="" className="h-9 w-auto" /> },
  { name: "Figma", logo: <FigmaLogo title="" className="h-9 w-auto" /> },
];

const changes = [
  ["Source", "Fabricated from memory", "Exact component from Logoforge"],
  ["Geometry", "Rotated, stretched, misaligned", "Original viewBox, h-* w-auto"],
  ["Color", "Guessed brand color", "Original color, or currentColor mono"],
  ["Dark mode", "Disappears on dark", "icon-dark via mode=\"auto\", or mono"],
  ["Accessibility", "Unnamed decorative SVG", "Named image, or hidden next to text"],
] as const;

export default function BeforeAfterPage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <header className="flex items-center justify-between py-5">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          ← Back to the recipes
        </Link>
        <ThemeToggle />
      </header>

      <main className="pb-16">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          The difference
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Before and after Logoforge
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground">
          On the left, the kind of marks an agent invents when it has no source of truth. On the
          right, the same brands as the real Logoforge components, at a consistent height, with
          their original artwork.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <section
            aria-labelledby="before-title"
            className="rounded-2xl border border-dashed border-border bg-muted/40 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="before-title" className="text-sm font-semibold">
                Before
              </h2>
              <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                drawn by an agent
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Invented geometry, guessed colors, no accessible name.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-4">
              {before.map(({ name, issue, mark }) => (
                <li
                  key={name}
                  className="rounded-xl border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex h-12 items-center">{mark}</div>
                  <p className="mt-3 text-sm font-medium">{name}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{issue}</p>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="after-title"
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="after-title" className="text-sm font-semibold">
                After
              </h2>
              <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                Logoforge components
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Real files, real ratios, original colors, light and dark safe.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-4">
              {after.map(({ name, logo }) => (
                <li
                  key={name}
                  className="rounded-xl border border-border/70 bg-background p-4"
                >
                  <div className="flex h-12 items-center">{logo}</div>
                  <p className="mt-3 text-sm font-medium">{name}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    installed from the registry
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="changes-title" className="mt-12">
          <h2 id="changes-title" className="text-lg font-semibold tracking-tight">
            What changed
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Differences between hand-drawn logos and Logoforge components
              </caption>
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-2 font-medium">
                    Hand-drawn
                  </th>
                  <th scope="col" className="px-4 py-2 font-medium">
                    Logoforge
                  </th>
                </tr>
              </thead>
              <tbody>
                {changes.map(([aspect, bad, good]) => (
                  <tr key={aspect} className="border-b border-border/60 last:border-0">
                    <th scope="row" className="py-3 pr-4 font-medium">
                      {aspect}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{bad}</td>
                    <td className="px-4 py-3">{good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-10 max-w-2xl rounded-lg border border-border/70 bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
          The marks on the left are intentionally wrong and exist only to illustrate the problem.
          All brand names and logos are trademarks of their owners. The real components come from{" "}
          <a
            href="https://logoforge.terravidhal.me"
            className="font-medium text-foreground underline underline-offset-4"
          >
            logoforge.terravidhal.me
          </a>
          .
        </p>
      </main>
    </div>
  );
}
