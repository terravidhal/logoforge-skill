import { LinearLogo } from "@/components/logos/linear";
import { StripeLogo } from "@/components/logos/stripe";
import { SupabaseLogo } from "@/components/logos/supabase";

const integrations = [
  {
    name: "Stripe",
    description: "Payments, billing, and subscriptions.",
    href: "https://stripe.com",
    logo: <StripeLogo title="" className="h-8 w-auto" />,
  },
  {
    name: "Supabase",
    description: "Postgres, auth, and storage.",
    href: "https://supabase.com",
    logo: <SupabaseLogo title="" className="h-8 w-auto" />,
  },
  {
    name: "Linear",
    description: "Issue tracking for product teams.",
    href: "https://linear.app",
    logo: <LinearLogo title="" className="h-8 w-auto" />,
  },
];

export function Integrations() {
  return (
    <section id="integrations" aria-labelledby="integrations-title" className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="integrations-title"
              className="text-2xl font-semibold tracking-tight text-balance"
            >
              Integrations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect the services your team already pays for.
            </p>
          </div>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map(({ name, description, href, logo }) => (
            <li key={name}>
              <a
                href={href}
                className="flex h-full flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
