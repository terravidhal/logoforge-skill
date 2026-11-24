import { StripeLogo } from "@/components/logos/stripe";
import { SupabaseLogo } from "@/components/logos/supabase";
import { VercelLogo } from "@/components/logos/vercel";

const builtWith = [
  {
    name: "Vercel",
    href: "https://vercel.com",
    logo: <VercelLogo variant="mono" title="" className="h-5 w-auto" />,
  },
  {
    name: "Supabase",
    href: "https://supabase.com",
    logo: <SupabaseLogo variant="mono" title="" className="h-5 w-auto" />,
  },
  {
    name: "Stripe",
    href: "https://stripe.com",
    logo: <StripeLogo variant="mono" title="" className="h-5 w-auto" />,
  },
];

export function BuiltWith() {
  return (
    <footer id="built-with" className="border-t border-border/60 py-8">
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
