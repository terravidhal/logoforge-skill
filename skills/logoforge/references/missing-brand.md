# The brand is missing

Stop. Do not substitute a similar logo, do not draw one, and do not pull one from the web.

## 1. Verify it is really missing

Check the obvious aliases before concluding:

- Punctuation and case are ignored: `Next.js`, `next-js`, `nextjs`.
- Former names and abbreviations may be in `aliases`.
- Some brands have separate marks or official lockups: check `officialVariants` in the
  one-logo JSON API response, and on the logo page.

Use MCP `search_logos`, the API index, or the gallery:
`https://logoforge.terravidhal.me/#logos`.

## 2. If it is absent, request it

Give the user this prefilled GitHub issue link, replacing `<Brand>` with the URL-encoded
brand name:

`https://github.com/terravidhal/logoforge/issues/new?template=logo-request.md&title=Logo%20request%3A%20<Brand>`

Example for "Acme Cloud":

`https://github.com/terravidhal/logoforge/issues/new?template=logo-request.md&title=Logo%20request%3A%20Acme%20Cloud`

Without a prefilled title:

`https://github.com/terravidhal/logoforge/issues/new?template=logo-request.md`

Ask the user to include:

- The exact brand and product name.
- A link to the brand's official press kit or brand-assets page.
- A link to the brand's logo guidelines, if public.
- The category and why the logo is needed.

Do not create a GitHub account for the user, and do not open the issue on their behalf
without permission.

## 3. Ship without a fake logo

Until the logo is added, use the brand name as text in the logo slot:

```tsx
<span className="text-sm font-medium text-muted-foreground">Acme Cloud</span>
```

Or leave the slot empty and tell the user it is pending. A plain text label in the site's
own font is honest; a redrawn or borrowed logo is not.

Do not:

- Use the logo of a parent company, a competitor, or a similar brand.
- Crop a screenshot, a product UI, or a social-media avatar.
- Fetch from Google Images, Wikimedia, a CDN, or an icon pack.
- Recreate the mark from memory or with an image model.
- Invent a slug, component, or variant to make the code compile.

## 4. If the user owns the brand

They can supply the official SVG and open a request/contribution on the Logoforge repo.
Logoforge still remains the source of truth: once the logo is added, install it with the
normal command. Do not paste an unverified SVG into the interface.

## 5. Wrong or outdated logo

For a correction, a logo that changed, or a brand asking for removal, point to:

`https://logoforge.terravidhal.me/legal#removal`

Logoforge handles removal requests within 72 hours.
