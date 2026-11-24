# Logoforge Skill

Real brand logos in your UI, installed by your coding agent.

```bash
npx skills add terravidhal/logoforge-skill
```

Works with Claude Code, Codex, Cursor, Gemini CLI, OpenCode, and any agent that reads
`SKILL.md`.

Your agent stops drawing, inventing, or guessing logos. It resolves each brand on
[Logoforge](https://logoforge.terravidhal.me), installs the official React component or
SVG, and builds the section you asked for.

## What it does

- Finds the right Logoforge slug through the MCP server, the JSON API, or the shadcn registry.
- Installs real logos with `npx shadcn@latest add @logoforge/<slug>`, or copies the component/SVG
  when the project does not use shadcn.
- Builds "Works with", "Trusted by", integrations, footer, comparison-table, and
  "Sign in with" sections.
- Enforces brand rules: no redrawing, no distortion, original colors or mono, clear space,
  accessible names, and light/dark support.

## Install

One command, then pick your agent:

```bash
npx skills add terravidhal/logoforge-skill -a claude-code
npx skills add terravidhal/logoforge-skill -a codex
npx skills add terravidhal/logoforge-skill -a cursor
npx skills add terravidhal/logoforge-skill -a gemini-cli
npx skills add terravidhal/logoforge-skill -a opencode
```

`-g` installs for the current user. `--copy` copies instead of linking. `--list`
previews what will be installed.

Manual copy:

```bash
cp -r skills/logoforge ~/.claude/skills/logoforge             # Claude Code
cp -r skills/logoforge ~/.agents/skills/logoforge             # Codex
cp -r skills/logoforge ~/.cursor/skills/logoforge             # Cursor
cp -r skills/logoforge ~/.gemini/skills/logoforge             # Gemini CLI
cp -r skills/logoforge ~/.config/opencode/skills/logoforge    # OpenCode
```

### MCP server (recommended)

The skill also works with the JSON API. Connecting the read-only MCP server gives the
agent live slugs, variants, install commands, and section code:

```bash
claude mcp add --transport http logoforge https://logoforge.terravidhal.me/mcp
```

Cursor: add `{"mcpServers":{"logoforge":{"url":"https://logoforge.terravidhal.me/mcp"}}}`
to `.cursor/mcp.json`. VS Code: add the same URL under `servers` in `.vscode/mcp.json`.
The server needs no key and no account.

## Example prompts

> Add a Trusted by section with the logos of Stripe, Vercel, Supabase, and GitHub.
> Grayscale, and it must work in dark mode.

> Build an integrations page for our payment, auth, and database providers.

> Add a "Sign in with Google" button next to the GitHub one.

> Replace this hand-drawn Notion logo with the real one.

## What it will not do

- Redraw, trace, or approximate a logo.
- Use a screenshot, a random web image, or a file of unknown origin.
- Invent a slug, component name, or variant.
- Add a brand that is not a real customer, partner, or integration.
- Imply an affiliation that does not exist.

## Logoforge

- Site and gallery: https://logoforge.terravidhal.me
- Docs: https://logoforge.terravidhal.me/docs
- API: https://logoforge.terravidhal.me/api/logos.json
- shadcn registry: https://logoforge.terravidhal.me/r/registry.json
- MCP: https://logoforge.terravidhal.me/mcp
- Logo requests: https://github.com/terravidhal/logoforge/issues/new?template=logo-request.md

Logoforge covers 1,031 developer brands. If a brand is missing, the skill points to the
official request form instead of inventing a logo.

## License

MIT for this repository. Logos are trademarks of their owners; see
[TRADEMARKS.md](TRADEMARKS.md).
