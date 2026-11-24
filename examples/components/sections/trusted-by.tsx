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
    <section
      id="trusted-by"
      aria-labelledby="trusted-by-title"
      className="border-y border-border/60 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2
          id="trusted-by-title"
          className="text-center text-sm font-medium tracking-tight text-muted-foreground"
        >
          Trusted by teams at
        </h2>
        <ul className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-9 sm:grid-cols-3">
          {customers.map(({ name, logo }) => (
            <li key={name} className="flex justify-center text-muted-foreground">
              {logo}
              <span className="sr-only">{name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Illustrative brands. Replace them with your real customers.
        </p>
      </div>
    </section>
  );
}
