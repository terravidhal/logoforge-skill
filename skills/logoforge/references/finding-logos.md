# Find the right Logoforge slug

A slug is not the brand name lowercased. Resolve it on Logoforge, then read the exact
component name, variants, and install command from the response. Never invent a slug.

## Order of resolution

1. **MCP server** — if `search_logos` and `get_logo` are available.
2. **JSON API** — if MCP is not connected.
3. **Logo page** — if the agent has a browser: `https://logoforge.terravidhal.me/logos/<slug>`.
4. **Missing** — request the logo, do not substitute.

## MCP server

Server URL: `https://logoforge.terravidhal.me/mcp` (read-only, no key, no account).

```
search_logos({ query: "next.js" })
search_logos({ query: "stripe", category: "payments", limit: 10 })
get_logo({ slug: "stripe" })
```

`search_logos` returns the matching slugs with their name, categories, brand color,
variants, component name, install command, and logo page.

`get_logo({ slug })` returns the definitive record for one logo. Use its `variants` and
`svg` object to know which files exist. Do not probe for `icon-mono`, `wordmark`, or a
dark file that is absent.

If the tool answers `No logo matches "<query>"`, go to
[missing-brand.md](missing-brand.md). Do not search the web for a replacement.

## JSON API

Both endpoints are static, cacheable, CORS-open, and need no key.

```bash
# All logos: { count, categories, logos: [...] }
curl -s https://logoforge.terravidhal.me/api/logos.json

# One logo
curl -s https://logoforge.terravidhal.me/api/logos/stripe.json
```

Search the index locally instead of fetching it per page view. Example with `jq`:

```bash
curl -s https://logoforge.terravidhal.me/api/logos.json \
  | jq -r '.logos[]
      | select(((.name // "") + " " + ((.aliases // []) | join(" ")) + " " + .slug)
          | ascii_downcase | contains("stripe"))
      | "\(.slug)\t\(.name)"'
```

Inspect one logo before installing:

```bash
curl -s https://logoforge.terravidhal.me/api/logos/stripe.json \
  | jq '{slug, component, variants: (.svg | keys), install, guidelines}'
```

Expected shape (verified on `stripe`):

```json
{
  "slug": "stripe",
  "name": "Stripe",
  "aliases": [],
  "categories": ["payments"],
  "hex": "#635bff",
  "guidelines": null,
  "page": "https://logoforge.terravidhal.me/logos/stripe",
  "svg": {
    "icon": "https://logoforge.terravidhal.me/logos/stripe/icon.svg",
    "icon-mono": "https://logoforge.terravidhal.me/logos/stripe/icon-mono.svg",
    "wordmark": "https://logoforge.terravidhal.me/logos/stripe/wordmark.svg"
  },
  "component": "StripeLogo",
  "install": "npx shadcn@latest add @logoforge/stripe",
  "registry": "https://logoforge.terravidhal.me/r/stripe.json"
}
```

Fields to trust:

| Field | Use |
|---|---|
| `slug` | Registry item and file path. Never derive it yourself. |
| `component` | Exported React component (`StripeLogo`). Never derive it yourself. |
| `svg` keys | The variants that really exist. |
| `install` | The command to run. |
| `guidelines` | The brand's public guidelines, when known. |
| `officialVariants` | Brand-published files, when present (`official-lockup-horizontal`, …). This field is in the JSON API response and on the logo page; the MCP `get_logo` tool returns the standard variants only. |

## Matching rules

- Case, accents, dots, and dashes are ignored by search: `Next.js`, `next-js`, and
  `nextjs` find the same candidate.
- Check `aliases`. A brand may be indexed under an abbreviation or a former name.
- If several results match, choose the exact brand and product the user means — not a
  similar name, a parent company, or a competitor.
- A broad category (for example `auth`) is not proof of compatibility. Only the user can
  confirm that a product is a real integration, customer, or partner.
- Verify the `slug` and the needed `variants` in the one-logo response before writing any
  import or install command.

## Never

- Guess the slug from the brand name.
- Use a similar logo because the exact brand is missing.
- Take an SVG from Google Images, a screenshot, a PNG, a CDN, or an unknown icon pack.
- Create a Logoforge account, or open an issue on the user's behalf without permission.

## If the brand is absent

Give the user this prefilled request link, replacing `<Brand>` with the URL-encoded name:

`https://github.com/terravidhal/logoforge/issues/new?template=logo-request.md&title=Logo%20request%3A%20<Brand>`

The request should include a link to the official brand asset page and the brand's
guidelines. See [missing-brand.md](missing-brand.md).
