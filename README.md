# siravitt.github.io

Siravit Tanratanavijit's ("Flame") developer portfolio: a fast, accessible,
dark-only, one-page site built with Next.js (App Router, static export) and
styled with shadcn/ui + Tailwind CSS only. It is served from GitHub Pages,
and its only other job is keeping two URLs Google's OAuth consent screen
depends on working: `/` and `/privacy.html`.

See `docs/spec.md` for the full spec and `design/DESIGN.md` for the approved
design system (v4.1). Each unit of work is one ticket under `docs/tickets/`,
built as one PR into `develop`.

## Prerequisites

- **Node 26** (pinned in `.nvmrc` and `package.json` `engines`) and **pnpm**
  (pinned in `package.json` `packageManager`).
- Run this once per shell, before any `pnpm`/`node` command:
  ```sh
  source /Volumes/SSD1/workspace/tools/dev-env.sh
  ```
  It puts the SSD-installed pnpm on `PATH` and points every cache (pnpm
  store, npm) at the SSD instead of the home folder.
- Install dependencies: `pnpm install`

## No environment variables

The site has no server, no API keys and no analytics, so there is nothing to
put in a `.env` file. `.env.example` does not exist for the same reason.

## Commands

| Command              | What it does                                                                                                                                                                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`           | Runs the Next.js dev server.                                                                                                                                                                                                                                                                                               |
| `pnpm lint`          | ESLint (Next.js config + Prettier compatibility).                                                                                                                                                                                                                                                                          |
| `pnpm format`        | Checks formatting with Prettier (`pnpm format:write` fixes it).                                                                                                                                                                                                                                                            |
| `pnpm typecheck`     | `tsc --noEmit`, TypeScript `strict: true`.                                                                                                                                                                                                                                                                                 |
| `pnpm test`          | Vitest + Testing Library + axe (Seam A: view-rendering tests, fixture content only).                                                                                                                                                                                                                                       |
| `pnpm build`         | Static export (`output: "export"`) to `out/`.                                                                                                                                                                                                                                                                              |
| `pnpm test:site`     | Seam B: built-site checks against `out/` — the three pages exist (no HTML under `out/privacy/`), the privacy policy and Daedalus footer line are verbatim on every page, metadata (`lang`, canonical, `noindex`), and no page loads a script/stylesheet/image/frame from a third-party origin. Run after `pnpm build`.     |
| `pnpm check:release` | The release guard: scans every `.html`/`.txt` file in `out/` for a placeholder or mock marker (`[Placeholder]`, `example.com`, `linkedin.com/in/placeholder`, `Mock project`) and exits non-zero while any remains. Run after `pnpm build`; CI runs it only on PRs into `main`. Flame can run it locally before a release. |
| `pnpm preview`       | Serves the built `out/` folder over plain HTTP on `localhost:4173` so you can review the production build locally. `develop` is never deployed — this is how Flame previews changes before a release.                                                                                                                      |

`design/` and `docs/` are vendored reference material (the approved design
prototype and the planning docs): excluded from lint, format, tests and
Tailwind's source scanning, and never built.

## Editing content

Every visitor-facing string lives in one typed file, `src/content/site.ts`,
which exports a single `site` object plus the types next to it. Its blocks:
`person`, `meta`, `hero`, `sections`, `about`, `stack`, `projects`,
`experience`, `contact`, `footer`, `labels`, `notFound` and `daedalus`. A
typo or a missing required field fails `pnpm typecheck` before it ships.

- **Placeholders.** A string that isn't real yet starts with the
  `[Placeholder]` marker and renders as a neutral dashed tag — replace the
  marker and the text together. `pnpm check:release` (ticket 05) fails a PR
  into `main` while any of these guard markers remain in the built site:
  the `[Placeholder]` marker, the `example.com` placeholder email domain,
  the `linkedin.com/in/placeholder` slug, or the literal `Mock project`
  badge on a project card.
- **Empty sections.** Setting `projects`, `experience` or `stack.groups` to
  an empty list hides that section and its nav link; nothing else needs to
  change.
- **Optional fields.** Leave out what you don't have: a project's `links`,
  `visual`, `badge` or `tags`; an experience entry's `end` date (absent
  means current) or `tags`; a section's `tagline` or `intro`. A missing
  field renders nothing — no empty link row, no empty picture box.
- **The `daedalus` block must not be edited.** It carries the exact text
  Google's OAuth consent screen for the Daedalus app depends on (the
  footer line, `/privacy.html`, the policy heading and text).
  `src/content/site.daedalus.test.tsx` guards it in CI.

## Fonts

Self-hosted at build via `next/font` (no request to Google at runtime):

- [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) —
  Rodrigo Fuenzalida / Instrument, [SIL Open Font License 1.1](https://openfontlicense.org/).
- [DM Mono](https://fonts.google.com/specimen/DM+Mono) — Colophon Foundry,
  [SIL Open Font License 1.1](https://openfontlicense.org/).

## Deploy and release

_Added in ticket 17._

## Credits

Marks drawn in the Stack panel (DESIGN.md §6b) are one-colour SVGs from
[Simple Icons](https://github.com/simple-icons/simple-icons) 15.22.0 (CC0-1.0),
copied unchanged to `public/icons/stack/`: Go, TypeScript, PostgreSQL, Redis,
Next.js, React, Tailwind CSS, Docker, GitHub Actions and Git. The brand marks
stay trademarks of their respective owners; they're used only to name the
tools listed in `site.ts`.

## Legacy root files

`index.html` and `privacy.html` at the repo root were the pre-Next.js site.
Ticket 04 removes them from `develop` (their text now lives in
`src/content/site.ts`'s `daedalus` block and renders at `/` and
`/privacy.html` through the Next.js app). **The live site keeps serving the
old files from `main`** until the first release off `develop`; removing them
here does not take anything offline.
