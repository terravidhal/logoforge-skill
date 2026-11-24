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
    <section id="works-with" aria-labelledby="works-with-title" className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2
          id="works-with-title"
          className="text-center text-sm font-medium tracking-tight text-muted-foreground"
        >
          Works with the tools you already use
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
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
