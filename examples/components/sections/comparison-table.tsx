import { GithubLogo } from "@/components/logos/github";
import { GitlabLogo } from "@/components/logos/gitlab";

const columns = [
  {
    name: "GitHub",
    logo: <GithubLogo title="" className="h-6 w-auto" />,
  },
  {
    name: "GitLab",
    logo: <GitlabLogo title="" className="h-6 w-auto" />,
  },
];

const rows = [
  { feature: "Issue tracking", values: [true, true] },
  { feature: "Built-in CI/CD", values: [true, true] },
  { feature: "Self-hosted option", values: [true, true] },
];

export function ComparisonTable() {
  return (
    <section
      id="comparison"
      aria-labelledby="comparison-title"
      className="py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2
          id="comparison-title"
          className="text-2xl font-semibold tracking-tight text-balance"
        >
          Compare the two
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Brand names live in the column headers, so the logos stay decorative.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
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
                <tr key={feature} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="py-3 pr-4 font-normal text-muted-foreground">
                    {feature}
                  </th>
                  {values.map((value, index) => (
                    <td key={columns[index].name} className="px-4 py-3 text-center">
                      {value ? "Yes" : "No"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
