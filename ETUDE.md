# ETUDE — `logoforge-skill`

> Étude de conception pour un dépôt open source (MIT) qui apprend aux agents de codage
> à poser les **vrais logos de marques** dans une interface, via **Logoforge**, au lieu
> de les redessiner, de les inventer ou de les prendre au hasard sur le web.
>
> Date : 2026-11-24 · Statut : étude terminée, implémentation à venir · Langue du produit : anglais.

---

## 1. Résumé exécutif

Le dépôt à créer est un **skill** au sens Agent Skills : un dossier contenant un `SKILL.md`
avec un frontmatter `name` / `description`, des références markdown et, si besoin, des scripts.
Il s'installe en une commande (`npx skills add …`) dans Claude Code, Codex, Cursor, Gemini CLI,
OpenCode et la plupart des agents compatibles, avec en complément les installations « plugin »
propres à Claude Code et Codex.

La valeur du skill n'est pas de générer des logos : c'est d'**empêcher** l'agent d'en générer.
Il doit lui apprendre à :

1. détecter l'intention (« Works with », « Trusted by », page d'intégrations, pied de page,
   tableau comparatif, bouton « Sign in with ») ;
2. résoudre chaque marque en slug Logoforge fiable (MCP `search_logos`, sinon API JSON) ;
3. installer le composant React officiel (`npx shadcn@latest add @logoforge/<slug>`) ou
   récupérer le SVG exact pour les stacks non-React ;
4. composer la section demandée en respectant les règles de marque (pas de déformation,
   couleurs d'origine ou mono, espace autour), l'accessibilité (`alt`, `aria-label`,
   `title=""` quand un label visible est présent) et le clair/sombre ;
5. vérifier le résultat avec une checklist explicite avant de rendre la main.

Décision structurante : **le skill ne contient aucun logo et ne redessine jamais**. Il pointe
vers Logoforge comme source de vérité, avec trois interfaces déjà en production : registry
shadcn, serveur MCP et API JSON.

---

## 2. Périmètre

### Dans le périmètre

- Un dépôt `logoforge-skill` sous licence MIT, README et `SKILL.md` en anglais.
- Un skill nommé `logoforge`, installable en une ligne, compatible multi-agents.
- Un workflow guidé pour les sections et composants UI qui affichent des marques tierces.
- Des références courtes : patterns de sections, règles de marque, accessibilité, stacks,
  dépannage.
- Des garde-fous : jamais de logo inventé, redessiné, déformé, recoloré arbitrairement ou
  récupéré sur une source non officielle.
- Une vérification finale (checklist) et, si possible, des evals.

### Hors périmètre

- Créer un logo pour la marque de l'utilisateur (c'est le rôle d'un skill de logo-design).
- Héberger, modifier ou republier les logos Logoforge.
- Comptes, clés API, paiement, télémétrie.
- `git push`, `npm publish`, création de compte : interdits dans cet exercice.
- Toute promesse juridique : les logos restent des marques de leurs propriétaires.

---

## 3. Logoforge — source de vérité

### 3.1 Adresses et commandes réelles

Toutes les valeurs ci-dessous viennent de `ref/site` (`README.md`, `lib/site.ts`,
`lib/registry.ts`, `lib/api.ts`, `lib/component-name.ts`, `lib/mcp-tools.ts`,
`app/docs/*`, `docs/05-REGISTRY-MCP-API.md`).

| Élément | Valeur |
|---|---|
| Site | `https://logoforge.terravidhal.me` |
| Galerie | `https://logoforge.terravidhal.me/#logos` |
| Page d'un logo | `https://logoforge.terravidhal.me/logos/<slug>` |
| Logo cloud builder | `https://logoforge.terravidhal.me/cloud` |
| Docs | `https://logoforge.terravidhal.me/docs` |
| Registry index | `https://logoforge.terravidhal.me/r/registry.json` |
| Registry item | `https://logoforge.terravidhal.me/r/<slug>.json` |
| Registry cloud | `https://logoforge.terravidhal.me/r/cloud.json?...` |
| MCP (streamable HTTP) | `https://logoforge.terravidhal.me/mcp` |
| API tous les logos | `https://logoforge.terravidhal.me/api/logos.json` |
| API un logo | `https://logoforge.terravidhal.me/api/logos/<slug>.json` |
| Fichiers SVG | `https://logoforge.terravidhal.me/logos/<slug>/<variant>.svg` |
| Dépôt des logos | `https://github.com/terravidhal/logoforge` |

Installation d'un composant :

```bash
npx shadcn@latest add @logoforge/stripe
npx shadcn@latest add @logoforge/vercel @logoforge/supabase @logoforge/github
```

`@logoforge` est référencé dans l'annuaire officiel shadcn depuis le 2026-10-02
(d'après `docs/05-REGISTRY-MCP-API.md`), donc aucune configuration n'est nécessaire sur un
projet shadcn récent. Pour les anciens CLI, il reste possible de déclarer le namespace :

```json
{
  "registries": {
    "@logoforge": "https://logoforge.terravidhal.me/r/{name}.json"
  }
}
```

Et l'URL complète fonctionne partout :

```bash
npx shadcn@latest add https://logoforge.terravidhal.me/r/stripe.json
```

Mise à jour d'un logo :

```bash
npx shadcn@latest add @logoforge/stripe --overwrite
```

### 3.2 Données, variantes, composants

Chaque logo possède un `slug`, un nom, des alias, des catégories, une couleur de marque
(`hex`), une URL de guidelines, et un sous-ensemble de variantes :

| Variante | Rôle |
|---|---|
| `icon` | Marque seule, couleurs d'origine. Toujours présente. |
| `icon-mono` | Marque seule en `currentColor`. Présente si le logo s'y prête. |
| `icon-dark` | Fichier adapté aux fonds sombres (marques quasi noires). |
| `wordmark` | Lockup complet (marque + nom), couleurs d'origine. |
| `wordmark-dark` | Lockup complet pour fonds sombres. |

Des variantes « officielles » peuvent exister en plus (`official-icon`,
`official-lockup-horizontal`, `official-wordmark`, etc.), publiées telles quelles par la marque.
Le skill doit **lire les variantes disponibles** dans la réponse API / MCP au lieu de deviner
un nom de fichier.

Composant React installé : `components/logos/<slug>.tsx`, nom exporté `<PascalCase>Logo`
(ex. `StripeLogo`, `NextjsLogo`). Props documentées dans `app/docs/react/page.tsx` :

| Prop | Type | Défaut | Usage |
|---|---|---|---|
| `variant` | `"color" \| "mono"` | `"color"` | Couleurs d'origine ou `currentColor`. |
| `type` | `"icon" \| "wordmark"` | `"icon"` | Marque seule ou lockup. |
| `mode` | `"auto" \| "light" \| "dark"` | `"auto"` | Bascule avec la classe `.dark` (Tailwind). |
| `title` | `string` | nom de la marque | Nom accessible (`role="img"`). `""` = décoratif. |
| `...props` | `SVGProps` | — | `className`, `width`, `height`, etc. |

Le composant n'installe **qu'un seul fichier** et n'ajoute aucune dépendance npm : il n'importe
que `react`. Supprimer un logo = supprimer ce fichier.

### 3.3 MCP — outils disponibles

Serveur read-only, sans clé ni compte, sur `https://logoforge.terravidhal.me/mcp`.

| Outil | Ce qu'il renvoie |
|---|---|
| `search_logos` | Slugs, noms, catégories, variantes, commande d'installation. |
| `list_categories` | Catégories et nombre de logos. |
| `get_logo` | Détail d'un logo, URLs SVG, nom du composant, extraits d'usage, installation. |
| `get_logo_svg` | SVG brut d'une variante, prêt à coller. |
| `get_logo_component` | Source TypeScript complète du composant. |
| `build_logo_cloud` | Code React d'une section « Trusted by », installation en une commande, lien vers le builder. |

Configurations clientes (reprises de `app/docs/mcp/page.tsx`) :

```bash
# Claude Code
claude mcp add --transport http logoforge https://logoforge.terravidhal.me/mcp
```

```json
// Cursor : .cursor/mcp.json ou ~/.cursor/mcp.json
{ "mcpServers": { "logoforge": { "url": "https://logoforge.terravidhal.me/mcp" } } }
```

```json
// Windsurf : ~/.codeium/windsurf/mcp_config.json
{ "mcpServers": { "logoforge": { "serverUrl": "https://logoforge.terravidhal.me/mcp" } } }
```

```json
// VS Code : .vscode/mcp.json
{ "servers": { "logoforge": { "type": "http", "url": "https://logoforge.terravidhal.me/mcp" } } }
```

Le MCP est le chemin **préféré** du skill : il donne les slugs, les variantes réellement
disponibles, les commandes d'installation et le code de la section, sans scraping ni devinette.
L'API JSON est le **fallback** quand le MCP n'est pas branché ou que l'agent n'a pas d'accès
réseau structuré.

### 3.4 API JSON et SVG

- `/api/logos.json` : tous les logos + catégories + compteur.
- `/api/logos/<slug>.json` : un logo, ses sources, licences, variantes, commande d'installation.
- `/logos/<slug>/<variant>.svg` : fichiers directs.
- Statique, cacheable, CORS ouvert, sans clé.
- Bonne pratique recommandée par la doc : cacher l'index côté client plutôt que le refetcher
  à chaque page vue.

### 3.5 Règles de marque, licences, accessibilité

Ce que dit le site (`/legal`, `/docs/react`, FAQ) et ce que le skill doit transformer en
contraintes opérationnelles :

- **Marque ≠ licence du fichier.** Une licence libre couvre le fichier, pas la marque.
  Usage typique autorisé : désigner le produit (page d'intégrations, « built with »,
  bouton de connexion). Toute présence n'implique ni affiliation ni endorsement.
- **Ne jamais déformer** : pas d'étirement, pas de rotation, pas de recadrage, pas de
  changement de proportions, pas d'ajout d'ombre ou de glow sur le logo.
- **Couleurs** : couleurs d'origine par défaut. Le mono est autorisé (`currentColor`).
  Le grisé/grayscale est un choix de mise en page, pas une modification du fichier.
- **Espace autour** : prévoir une marge cohérente (padding de la cellule, `gap`), ne pas
  coller le logo au texte ou aux bords.
- **Taille** : `size-*` ou `h-* w-auto` pour conserver le ratio. Jamais `width` et `height`
  arbitraires qui écrasent le ratio.
- **Accessibilité** : par défaut le composant est annoncé comme une image nommée.
  À côté d'un label visible, passer `title=""` pour éviter la double lecture.
  Pour un SVG inline non-React : `role="img"` + `aria-label`, ou `aria-hidden="true"`
  si un texte adjacent porte déjà l'information. Pour une image : `alt` obligatoire,
  `alt=""` si décorative.
- **Clair/sombre** : utiliser `mode="auto"` quand la variante sombre existe ; sinon
  `variant="mono"` + couleur de texte du thème. Ne pas poser un logo noir sur fond noir.
- **Demande de retrait** : si une marque demande le retrait, renvoyer vers la page légale
  de Logoforge ; le site s'engage à traiter sous 72 h.

### 3.6 Ce que le skill ne doit jamais faire

- Dessiner, tracer, approximer ou « recréer » un logo.
- Utiliser un logo trouvé sur Google Images, un screenshot, un PNG flou ou un fichier
  d'origine inconnue.
- Modifier le SVG (couleurs, formes, viewBox) pour « mieux rentrer » dans la maquette.
- Inventer un slug, un nom de composant ou une variante.
- Utiliser un logo pour suggérer un partenariat inexistant.
- Installer un package npm de logos alors que le registry shadcn suffit.
- Copier le code d'un site tiers.

---

## 4. Étude des cinq dépôts de skills

Méthode : lecture des README, arborescences GitHub et `SKILL.md` ; aucune copie de contenu.
Les chiffres d'étoiles ne sont pas un critère de conception (ils bougent) ; ce sont les
**invariants de format et de distribution** qui nous intéressent.

### 4.1 `forrestchang/andrej-karpathy-skills`

**Nature.** Un seul fichier de comportement (`CLAUDE.md`) dérivé d'observations publiques
sur les erreurs des LLM, doublé d'un skill et d'un plugin Claude Code.

**Arborescence clé.**

```
.claude-plugin/marketplace.json
.claude-plugin/plugin.json
.cursor/rules/karpathy-guidelines.mdc
CLAUDE.md
CURSOR.md
EXAMPLES.md
README.md
skills/karpathy-guidelines/SKILL.md
```

**Haut du README.** Un encart pour un autre projet de l'auteur, puis le titre, une phrase
qui dit exactement ce que c'est, puis les problèmes et la solution sous forme de tableau.
L'installation arrive après la démonstration de valeur.

**Frontmatter.** `name`, `description` (très orientée déclenchement : « Use when writing,
reviewing, or refactoring code… »), `license: MIT`.

**Installation.** Deux voies : plugin Claude Code (`/plugin marketplace add` puis
`/plugin install`) ou récupération du `CLAUDE.md` par `curl` (projet neuf ou ajout à un
fichier existant). Une règle Cursor dédiée est fournie.

**Leçons.** Un skill peut être minuscule et n'avoir qu'une idée forte. La description doit
énumérer les situations où l'agent doit l'activer. Fournir un chemin « plugin » et un chemin
« fichier » couvre plus d'utilisateurs.

### 4.2 `mattpocock/skills`

**Nature.** Une collection de skills d'ingénierie et de productivité, avec une discipline
d'installation très travaillée et un écosystème de plugins multi-agents.

**Arborescence clé.**

```
.claude-plugin/{marketplace,plugin}.json
.codex-plugin (via le format plugin)
.agents/{adr,install-block.md,invocation.md,writing-docs.md}
skills/engineering/<skill>/SKILL.md
skills/productivity/<skill>/SKILL.md
skills/.../agents/openai.yaml
scripts/check-frontmatter.mjs
package.json
```

**Haut du README.** Un visuel de marque, un badge skills.sh, un titre, une promesse
(« skills that I use every day to do real engineering »), puis immédiatement une section
« Installation (30-second setup) » avec des onglets par agent. Le pourquoi vient après.

**Frontmatter.** Minimal : `name`, `description` ; parfois `disable-model-invocation: true`
pour les skills qui doivent être appelés explicitement (`/grill-me`). Le corps peut être
un simple routeur vers un autre skill.

**Installation.** Une commande par agent : plugin Claude Code, marketplace Codex, marketplace
GitHub Copilot, `gemini skills install <repo> --path …`, et `npx skills add owner/repo -a <agent>`
pour tout le reste. Le README précise qu'il faut choisir **une** méthode par agent pour éviter
les doublons.

**Leçons.** Le README est un mode d'emploi, pas un manifeste. La compatibilité multi-agents
se démontre par des commandes concrètes. Un script de vérification du frontmatter est un
investissement rentable. Les skills peuvent être des routeurs légers qui renvoient vers un
skill « primitif » plus détaillé.

### 4.3 `Leonxlnx/taste-skill` (le dépôt « taste-skill »)

**Nature.** Un skill de direction artistique front-end, très populaire, qui vise à supprimer
les pages génériques produites par les LLM. Un seul skill principal, beaucoup d'assets.

**Arborescence clé.**

```
.claude-plugin/{marketplace.json}
.codex-plugin/plugin.json
.agents/plugins/marketplace.json
install.sh
assets/
examples/
skills/taste-skill/SKILL.md
skills/taste-skill/assets/…
```

**Haut du README.** Un hero visuel, le nom du produit, une promesse courte et mémorable,
puis la commande d'installation en évidence, puis les agents compatibles (logos), puis les
détails. Le prix (open source) et les sponsors sont visibles mais ne passent pas avant
l'installation.

**Frontmatter.** `name` (nom d'installation, distinct du nom marketing), `description` très
longue et riche en déclencheurs : type de tâche, stacks, symptômes (« looks generic »,
« templated », « AI-made »), cas voisins. C'est presque un routeur sémantique.

**Installation.** `npx skills add Leonxlnx/taste-skill`, plugin Claude Code, plugin Codex,
`install.sh` depuis un clone. La doc insiste sur le fait que toutes les méthodes installent
le même dossier.

**Leçons.** Un nom marketing et un nom d'installation peuvent différer. La description est
le vrai mécanisme de découverte : elle doit contenir le vocabulaire de l'utilisateur, pas
seulement celui du produit. Les assets lourds doivent rester **dans** le dossier du skill
pour être emportés par l'installation.

### 4.4 `kaankiziltug/logo-design-skill` (le dépôt « logo-design-skill »)

**Nature.** Un skill de conception de logos, du brief aux fichiers de production, avec une
bibliothèque de références SVG et des outils Python. C'est le contre-exemple utile : il
apprend à **créer** un logo, pas à **utiliser** un logo existant.

**Arborescence clé.**

```
.claude-plugin/{marketplace,plugin}.json
README.md
TRADEMARKS.md
LICENSE
evals/evals.json
skills/logo-design/SKILL.md
skills/logo-design/references/…
skills/logo-design/scripts/…
skills/logo-design/assets/library/…
tests/
tools/
```

**Haut du README.** Titre explicite, badges (sponsor, tests), image de démonstration,
paragraphe « what it is » avec la liste des agents compatibles, puis les capacités en puces,
puis l'installation.

**Frontmatter.** `name`, `description` très détaillée (processus, types de marques, tests,
outils) qui inclut les formulations utilisateur (« even if they don't say the word logo »).

**Installation.** Plugin Claude Code, copie manuelle du dossier dans `~/.claude/skills/` ou
`.claude/skills/`, upload zip pour Claude.ai, `npx skills add` et copie pour les autres agents.
Un `TRADEMARKS.md` séparé traite explicitement le statut des marques de la bibliothèque.

**Leçons.** Un skill sérieux sépare **instructions**, **références**, **scripts** et **assets**.
Il documente les limites (pas de garantie de clearance, licences de polices, honnêteté sur ce
qui n'a pas été testé). Il fournit des evals. Le skill `logoforge` doit reprendre cette
discipline, et surtout **ne pas** dupliquer ce dépôt : il doit au contraire interdire la
création de logos de marques tierces.

### 4.5 `anthropics/skills`

**Nature.** Le dépôt de référence d'Anthropic : collection de skills d'exemple, spec Agent
Skills, template, plugins.

**Arborescence clé.**

```
.claude-plugin/marketplace.json
README.md
THIRD_PARTY_NOTICES.md
skills/<skill>/SKILL.md
skills/<skill>/LICENSE.txt
spec/
template/SKILL.md
```

**Haut du README.** Une note sur le standard Agent Skills, un badge skills.sh, le titre,
une définition courte de ce qu'est un skill, puis les liens officiels. Ensuite seulement :
le contenu du dépôt, l'essai dans Claude Code / Claude.ai / API, et la recette d'un skill
minimal.

**Frontmatter.** Deux champs obligatoires seulement : `name` (minuscules, tirets) et
`description` (ce que fait le skill et quand l'utiliser). Des champs optionnels comme
`license` sont acceptés.

**Installation.** Marketplace de plugins Claude Code, upload dans Claude.ai, API Claude.
Le README montre aussi la structure minimale d'un skill.

**Leçons.** La simplicité du format est la feature : un dossier, un `SKILL.md`, deux champs.
Le template officiel est volontairement vide. Un `THIRD_PARTY_NOTICES.md` est nécessaire dès
qu'on embarque des assets de tiers. La description doit dire **quoi** et **quand**.

### 4.6 Tableau comparatif

| Dépôt | Force principale | Format | Installation mise en avant | Enseignement pour nous |
|---|---|---|---|---|
| andrej-karpathy-skills | Une idée forte, un fichier | `CLAUDE.md` + skill + plugin | Plugin Claude, `curl` | Description = déclencheur ; proposer un chemin minimal |
| mattpocock/skills | Distribution multi-agents | collection de skills + manifests | une commande par agent | README = mode d'emploi ; script de lint du frontmatter |
| taste-skill | Découverte par la description | 1 skill + assets | `npx skills add`, plugins | Nom marketing ≠ nom d'installation ; assets dans le skill |
| logo-design-skill | Rigueur process + références | skill + references + scripts + evals | plugin, copie, `npx skills add` | Séparer instructions/références/scripts ; documenter les limites |
| anthropics/skills | Standard + template | skills + spec + plugins | marketplace, API | `name` + `description` suffisent ; notices de tiers |

---

## 5. Synthèse : les invariants d'un skill qui « explose »

1. **Une promesse en une phrase, en haut du README.** Le visiteur doit comprendre en trois
   secondes, puis voir la commande d'installation sans scroller.
2. **Une commande d'installation universelle** (`npx skills add owner/repo`) et des variantes
   par agent pour ceux qui veulent un plugin ou une copie manuelle.
3. **Un `SKILL.md` court et actionnable**, avec une `description` qui contient le vocabulaire
   des utilisateurs et des symptômes, pas seulement le nom du produit.
4. **Divulgation progressive** : le `SKILL.md` donne le workflow et les règles dures ; les
   détails vivent dans `references/` ; les outils dans `scripts/`. L'agent ne charge que ce
   dont il a besoin.
5. **Des garde-fous explicites.** Les meilleurs skills disent aussi ce qu'il ne faut pas faire.
6. **Des manifests multi-agents** : `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/`.
7. **Zéro dépendance inutile.** Un skill doit s'installer sans build, sans serveur, sans clé.
8. **Une vérification finale.** Checklist, evals ou test script : l'agent doit pouvoir prouver
   qu'il a fini.
9. **Une licence claire** et, si des assets tiers existent, un fichier de notices.
10. **Un README qui assume le marketing sans mentir** : captures, exemples, limite honnête,
    pas de promesse d'affiliation.

---

## 6. Architecture proposée du dépôt

### 6.1 Arborescence

```
logoforge-skill/
├── README.md
├── LICENSE                      # MIT
├── TRADEMARKS.md                # logos = marques de leurs propriétaires
├── CONTRIBUTING.md
├── ETUDE.md                     # ce document
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── .codex-plugin/
│   └── plugin.json
├── .agents/
│   └── plugins/
│       └── marketplace.json
├── .github/
│   └── workflows/
│       └── check.yml            # lint frontmatter + liens + JSON
├── skills/
│   └── logoforge/
│       ├── SKILL.md
│       ├── references/
│       │   ├── sections.md      # Works with, Trusted by, intégrations, footer, tableau, sign-in
│       │   ├── brand-rules.md   # marque, couleurs, espace, tailles, interdits
│       │   ├── accessibility.md # alt/aria/title, contrastes, dark mode
│       │   ├── stacks.md        # React/Next, Vue, Svelte, Astro, HTML, Tailwind
│       │   └── troubleshooting.md
│       └── scripts/
│           └── check-snippet.mjs  # optionnel : vérifie slugs, imports, alt/aria
├── evals/
│   └── evals.json
└── assets/
    └── readme/…                 # captures ou GIF, pas de logos de marques
```

**Point clé :** les références et scripts sont **dans** `skills/logoforge/`. C'est ce dossier
que `npx skills add` copie et que les plugins embarquent. Un fichier à la racine ne suivrait
pas l'installation.

### 6.2 `SKILL.md` — frontmatter proposé

```yaml
---
name: logoforge
description: >-
  Use real brand logos in a UI instead of drawing, inventing, or guessing them.
  Use when adding a "Works with", "Trusted by", "Built with", integrations,
  customers, partners, comparison-table, footer, or "Sign in with" section;
  when a page needs the logo of Stripe, GitHub, Vercel, Supabase, Figma, Slack,
  OpenAI, Google, AWS, or any developer tool; or when the user asks to add,
  replace, fix, or verify brand logos. Resolves logos through Logoforge (MCP,
  JSON API, or shadcn registry), installs the official component, and enforces
  brand, light/dark, and accessibility rules. Never redraws a logo.
license: MIT
---
```

Notes :

- `name` doit correspondre au dossier (`logoforge`) et au nom utilisé par `--skill`.
- La description est longue **exprès** : c'est le mécanisme de routage de l'agent.
- On peut ajouter `allowed-tools` plus tard si nécessaire, mais ce n'est pas requis.

### 6.3 Corps du `SKILL.md` — plan

1. **Non-négociable** : jamais redessiner ; toujours partir du fichier officiel Logoforge.
2. **Quand l'utiliser / quand ne pas l'utiliser** (création d'un logo de marque → autre skill).
3. **Workflow en 7 étapes** :
   - 0. Lire la stack et l'intention.
   - 1. Inventorier les marques réellement présentes dans le produit.
   - 2. Résoudre les slugs (MCP `search_logos` en premier, API en fallback).
   - 3. Installer (`shadcn add`) ou récupérer le SVG selon la stack.
   - 4. Choisir le pattern de section dans `references/sections.md`.
   - 5. Appliquer `references/brand-rules.md` et `references/accessibility.md`.
   - 6. Vérifier (checklist + script éventuel).
4. **Interfaces Logoforge** : extraits MCP, API, registry, composant.
5. **Patterns UI** : renvoi vers `references/sections.md`, avec le code exact du composant.
6. **Règles dures** : marque, couleurs, mono, espace, ratio, dark, a11y, affiliation.
7. **Dépannage** : MCP absent, CLI shadcn absent, ancien CLI, logo sans variante mono,
   logo absent du catalogue, build SSR.
8. **Contrat de sortie** : ce que l'agent doit montrer à l'utilisateur (fichiers modifiés,
   commandes exécutées, logos utilisés, vérifications faites, limites).

### 6.4 README — structure cible (anglais)

```markdown
# Logoforge Skill

Real brand logos in your UI, installed by your coding agent.

`npx skills add terravidhal/logoforge-skill`

Works with Claude Code, Codex, Cursor, Gemini CLI, OpenCode, and any agent that reads SKILL.md.

[badges: MIT | skills.sh | Logoforge]

## What it does
- Stops your agent from drawing or guessing brand logos.
- Finds the real logo on Logoforge, installs it as a component or SVG.
- Builds "Works with", "Trusted by", integrations, footers, comparison tables,
  and "Sign in with" buttons.
- Enforces brand, light/dark, and accessibility rules.

## Install
(one command per agent, plugin variants, manual copy)

## Example prompt
"Add a Trusted by section with the logos of Stripe, Vercel, Supabase,
and GitHub. Grayscale, dark-mode safe."

## What it will not do
- Redraw a logo.
- Guess a file from the web.
- Imply a partnership that does not exist.

## Logoforge
(link, MCP URL, API, registry, license)

## License
MIT. Logos are trademarks of their owners.
```

Le propriétaire GitHub `terravidhal` est l'hypothèse la plus cohérente avec
`github.com/terravidhal/logoforge` ; à confirmer avant publication (rien n'est poussé dans
cet exercice).

### 6.5 Contenu des références

- **`sections.md`** : pour chaque pattern, le markup, les classes Tailwind, les pièges
  (heading, ordre, `title=""` quand le nom est visible, marquee `aria-hidden` sur le clone,
  bento, tableau comparatif, bouton de connexion). Réutiliser les idées du générateur
  `lib/cloud.ts` (grid, marquee, bento) sans copier le code du site.
- **`brand-rules.md`** : couleurs d'origine vs mono, pas de déformation, ratio, espace
  minimal, tailles minimales, fonds autorisés, interdiction d'ombre/glow, guidelines par
  marque quand disponibles, mention de marque.
- **`accessibility.md`** : nom accessible par défaut, `title=""` près d'un label, `alt`
  pour `<img>`, `role="img"` + `aria-label` pour SVG inline, contraste, `aria-hidden` pour
  les doublons de marquee, reduced motion.
- **`stacks.md`** : React/Next (composant), Vue/Svelte/Astro (SVG inline ou `<img>`),
  HTML statique, Tailwind v3/v4, absence de Tailwind (`mode="light"|"dark"` ou mono).
- **`troubleshooting.md`** : MCP non configuré, pas de `components.json`, ancien CLI,
  variante absente, logo absent, réseau bloqué, build qui casse à cause d'un import.

---

## 7. Workflow du skill, en détail

### Étape 0 — Lire la stack et l'intention

L'agent identifie le framework, la présence de shadcn/Tailwind, la structure des composants,
et le type de section demandé. Il ne devine pas : il lit `package.json`, `components.json`,
les fichiers voisins.

### Étape 1 — Inventorier les marques

Extraire les marques du brief ou du produit. Ne pas ajouter de marques « pour remplir ».
Si l'utilisateur demande « des logos de clients », demander la liste réelle : un logo affiché
peut impliquer une relation commerciale.

### Étape 2 — Résoudre les slugs

Ordre de préférence :

1. MCP `search_logos` (et `get_logo` pour les variantes).
2. `GET /api/logos.json` + recherche locale (nom, alias, catégorie).
3. Page `/logos/<slug>` si l'agent a un navigateur.

Toujours vérifier que le slug existe et que la variante demandée existe. Ne jamais fabriquer
un slug à partir du nom.

### Étape 3 — Installer ou récupérer

- React + shadcn : `npx shadcn@latest add @logoforge/<slug>` (plusieurs slugs en une commande).
- React sans shadcn : `get_logo_component` ou « Copy React » sur la page du logo, coller
  dans `components/logos/<slug>.tsx`.
- Vue/Svelte/Astro/HTML : `get_logo_svg` ou `/logos/<slug>/<variant>.svg`.
- Section entière : `build_logo_cloud` ou `npx shadcn@latest add "<site>/r/cloud.json?..."`.

### Étape 4 — Composer la section

Choisir le pattern, garder le markup simple, réutiliser les composants existants du projet
(container, section, heading), ne pas introduire de librairie d'animation pour une grille
de logos. Respecter l'ordre fourni par l'utilisateur.

### Étape 5 — Appliquer les règles de marque

Couleurs d'origine par défaut ; mono si l'utilisateur veut du gris ou si le design l'exige ;
jamais de recolor arbitraire ; espace autour ; ratio ; taille cohérente entre logos ;
`h-* w-auto` plutôt que des dimensions fixes.

### Étape 6 — Accessibilité et thèmes

Nom accessible, `title=""` si label visible, `alt`/`aria-label`, contraste, dark mode
(`mode="auto"` ou mono), `prefers-reduced-motion` pour les marquees.

### Étape 7 — Vérifier

Checklist :

- [ ] Chaque logo vient de Logoforge (slug vérifié).
- [ ] Aucun SVG dessiné à la main, aucun fichier d'origine inconnue.
- [ ] Aucune déformation, aucun recolor non demandé.
- [ ] Les variantes utilisées existent réellement.
- [ ] Les noms accessibles sont corrects ; pas de double lecture.
- [ ] Le rendu tient en clair et en sombre.
- [ ] Les imports pointent vers les bons fichiers.
- [ ] Le build/typecheck passe (si disponible).
- [ ] Les marques affichées correspondent à une réalité produit.

---

## 8. Compatibilité multi-agents

### 8.1 Installation universelle

```bash
# Toute la collection (ici un seul skill)
npx skills add terravidhal/logoforge-skill

# Un agent précis
npx skills add terravidhal/logoforge-skill -a claude-code
npx skills add terravidhal/logoforge-skill -a codex
npx skills add terravidhal/logoforge-skill -a cursor
npx skills add terravidhal/logoforge-skill -a gemini-cli
npx skills add terravidhal/logoforge-skill -a opencode
```

Le CLI `skills` (Vercel Labs, npm `skills`, Node ≥ 22.20) écrit une copie canonique dans
`.agents/skills/` et crée les liens vers les dossiers propres à chaque agent. `-g` installe
au niveau utilisateur ; `--copy` copie au lieu de lier ; `--list` permet de prévisualiser.

### 8.2 Plugins

```bash
# Claude Code
/plugin marketplace add terravidhal/logoforge-skill
/plugin install logoforge@logoforge-skill

# Codex
codex plugin marketplace add terravidhal/logoforge-skill
codex plugin add logoforge@logoforge-skill

# Gemini CLI (si l'on veut le chemin git)
gemini skills install https://github.com/terravidhal/logoforge-skill.git --path skills
```

Les commandes Codex/Gemini sont celles observées dans les dépôts étudiés ; elles dépendent de
la version installée. Le README doit renvoyer vers la doc de chaque outil plutôt que promettre
une commande éternelle.

### 8.3 Copie manuelle

```bash
git clone https://github.com/terravidhal/logoforge-skill.git
cp -r logoforge-skill/skills/logoforge ~/.claude/skills/logoforge     # Claude Code
cp -r logoforge-skill/skills/logoforge ~/.agents/skills/logoforge       # Codex/Cursor/…
cp -r logoforge-skill/skills/logoforge ~/.gemini/skills/logoforge      # Gemini CLI
cp -r logoforge-skill/skills/logoforge ~/.config/opencode/skills/logoforge
```

### 8.4 Matrice

| Agent | `-a` | Projet | Global |
|---|---|---|---|
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `codex` | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| Gemini CLI | `gemini-cli` | `.agents/skills/` | `~/.gemini/skills/` |
| GitHub Copilot | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| OpenCode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |

Les chemins viennent de la documentation du CLI `skills`. En cas de doute, `.agents/skills/`
est le point commun le plus sûr.

---

## 9. Distribution, licence, croissance

- **Licence MIT** pour le code et les textes du skill.
- **`TRADEMARKS.md`** : les logos ne sont pas sous MIT ; ils restent la propriété de leurs
  marques. Le skill ne les embarque pas, il pointe vers Logoforge.
- **Pas de npm publish** : le dépôt est un skill git, pas un package. `npx skills add` suffit.
- **README avant/après** : une capture d'une section « Trusted by » générée par l'agent,
  et une capture d'un logo dessiné à la main « avant », pour matérialiser le problème.
- **Page skills.sh** : une fois le dépôt public, `npx skills add` et le listing skills.sh
  assurent la découvrabilité.
- **Message de commit / release** : versions sémantiques dans `plugin.json`, `CHANGELOG.md`
  optionnel au début.
- **Appel à l'action** : « Ask your agent: add a Trusted by section with … ».
- **Preuve sociale** : exemples réels (sections, pages d'intégration), pas de faux clients.

---

## 10. Qualité, tests, sécurité

- **Lint du frontmatter** : vérifier `name`, `description`, cohérence avec le dossier.
- **Validation JSON** : manifests et evals.
- **Liens** : vérifier les URLs Logoforge et les chemins internes.
- **Evals** : 5 à 10 prompts types, avec critères vérifiables :
  1. « Ajoute une section Trusted by avec Stripe, Vercel, Supabase, GitHub en gris. »
  2. « Mets le logo PostgreSQL à côté du titre de la section base de données, mono, 20 px. »
  3. « Remplace ce logo dessiné à la main par le vrai logo Notion. »
  4. « Ajoute un bouton Sign in with Google. »
  5. « Fais un tableau comparatif avec les logos de nos concurrents. »
  6. « Le logo GitHub disparaît en mode sombre, corrige. »
  7. « Ajoute les logos de nos clients [liste]. »
  8. « Utilise ce SVG trouvé sur le web » → doit refuser et proposer Logoforge.
- **Sécurité** : aucun script réseau caché, aucune télémétrie, aucun secret. Les commandes
  exécutées sont explicites. Le skill ne doit pas installer de package non demandé.
- **Revue humaine** : les skills s'exécutent avec les permissions de l'agent ; le README
  doit inviter à lire les fichiers avant installation (bonne pratique du CLI `skills`).

---

## 11. Risques et mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| L'agent redessine quand même un logo | Très élevé | Règle « never redraw » en tête de `SKILL.md`, checklist, refus explicite dans les evals |
| Slug inventé / variante inexistante | Élevé | Toujours résoudre via MCP/API ; lire les variantes ; jamais deviner |
| MCP non configuré | Moyen | Fallback API JSON documenté ; commande d'installation MCP dans le README |
| Ancien CLI shadcn | Moyen | Snippet `components.json` + URL complète `/r/<slug>.json` |
| Logo absent du catalogue | Moyen | Demander l'ajout via GitHub/issue ; ne pas substituer un logo proche |
| Logo mal utilisé (partenariat implicite) | Élevé (juridique) | Règle d'affiliation, demander la liste réelle des clients/partenaires |
| Dark mode cassé | Moyen | `mode="auto"` si variante sombre, sinon mono ; checklist clair/sombre |
| Accessibilité (double lecture) | Moyen | `title=""` près d'un label ; `alt`/`aria-label` corrects |
| Dérive du catalogue | Faible | Le skill ne fige aucun slug dans le code ; il interroge la source |
| Dépendance à une URL unique | Faible | Documenter MCP + API + registry ; cache côté client |

---

## 12. Plan d'implémentation proposé

Chaque étape se termine par un commit local (pas de push, pas de publish).

1. **ETUDE.md** — ce document. Commit `docs: study skill repos and design logoforge-skill`.
2. **Squelette** — `README.md`, `LICENSE`, `TRADEMARKS.md`, arborescence, manifests plugins.
   Commit `chore: scaffold logoforge skill repository`.
3. **`SKILL.md`** — workflow, règles dures, interfaces, checklist. Commit
   `feat: add logoforge skill instructions`.
4. **Références** — `sections.md`, `brand-rules.md`, `accessibility.md`, `stacks.md`,
   `troubleshooting.md`. Commit `docs: add skill references`.
5. **README final** — installation multi-agents, exemple de prompt, limites, captures.
   Commit `docs: write install-first README`.
6. **Qualité** — evals, script de vérification, workflow CI. Commit
   `test: add evals and skill checks`.
7. **Revue finale** — liens, frontmatter, cohérence des commandes, relecture anglaise.
   Commit `chore: final review`.

### Critères d'acceptation

- `npx skills add <repo> --list` trouve le skill `logoforge`.
- Le `SKILL.md` contient `name: logoforge` et une description déclencheuse.
- Le README affiche la commande d'installation dans les dix premières lignes.
- Aucune instruction ne demande de redessiner un logo.
- Les URLs Logoforge sont exactes et testables.
- Les règles d'accessibilité et de dark mode sont explicites.
- La licence MIT et le statut des marques sont clairs.
- Les manifests JSON sont valides et pointent vers `./skills/logoforge`.

---

## 13. Sources consultées

### Logoforge (local)

- `ref/site/README.md`
- `ref/site/lib/site.ts`, `lib/registry.ts`, `lib/api.ts`, `lib/component-name.ts`,
  `lib/mcp-tools.ts`, `lib/cloud.ts`, `lib/logos.ts`, `lib/faqs.ts`
- `ref/site/app/docs/{shadcn,mcp,api,react}/page.tsx`
- `ref/site/app/legal/page.tsx`
- `ref/site/docs/05-REGISTRY-MCP-API.md`
- `ref/site/components/landing/{hero,ship-ways}.tsx`

### Dépôts de skills (publics)

- `github.com/forrestchang/andrej-karpathy-skills` — README, `skills/karpathy-guidelines/SKILL.md`,
  `.claude-plugin/marketplace.json`, arborescence.
- `github.com/mattpocock/skills` — README, `.claude-plugin/{marketplace,plugin}.json`,
  `skills/productivity/grill-me/SKILL.md`, arborescence.
- `github.com/Leonxlnx/taste-skill` — README, `.claude-plugin/marketplace.json`,
  `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `skills/taste-skill/SKILL.md`.
- `github.com/kaankiziltug/logo-design-skill` — README, `.claude-plugin/*`,
  `skills/logo-design/SKILL.md`, arborescence.
- `github.com/anthropics/skills` — README, `.claude-plugin/marketplace.json`,
  `template/SKILL.md`, `skills/brand-guidelines/SKILL.md`, arborescence.

### Outillage

- `github.com/vercel-labs/skills` — README et référence du CLI `npx skills`.
- Documentation des chemins d'installation par agent (`docs/agents.md` du CLI `skills`).
- `agentskills.io` — standard Agent Skills (référencé par `anthropics/skills`).

---

## 14. Décisions à confirmer avant la publication

1. **Propriétaire GitHub** : `terravidhal/logoforge-skill` (hypothèse) ou autre organisation.
2. **Nom d'installation** : `logoforge` (recommandé) vs `logoforge-logos`.
3. **Périmètre initial** : React/shadcn seulement, ou inclure Vue/Svelte/Astro/HTML dès la v1.
4. **MCP** : le README doit-il l'installer automatiquement via un script, ou seulement le
   documenter ? Recommandation : documenter, ne jamais modifier la config de l'utilisateur
   sans accord.
5. **Captures README** : faut-il des screenshots de sections réelles ? Si oui, utiliser des
   marques fictives pour l'« avant » et de vraies marques correctement utilisées pour l'« après ».
6. **Evals** : exécution manuelle ou CI avec un agent ? Recommandation : evals JSON + script
   de vérification déterministe (slugs, imports, `alt`/`aria`), pas d'appel LLM en CI.
