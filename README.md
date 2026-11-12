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

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs the Next.js dev server. |
| `pnpm lint` | ESLint (Next.js config + Prettier compatibility). |
| `pnpm format` | Checks formatting with Prettier (`pnpm format:write` fixes it). |
| `pnpm typecheck` | `tsc --noEmit`, TypeScript `strict: true`. |
| `pnpm test` | Vitest + Testing Library + axe (Seam A: view-rendering tests, fixture content only). |
| `pnpm build` | Static export (`output: "export"`) to `out/`. |
| `pnpm preview` | Serves the built `out/` folder over plain HTTP on `localhost:4173` so you can review the production build locally. `develop` is never deployed — this is how Flame previews changes before a release. |

`design/` and `docs/` are vendored reference material (the approved design
prototype and the planning docs): excluded from lint, format, tests and
Tailwind's source scanning, and never built.

## Editing content

Every visitor-facing string lives in one typed file, `src/content/site.ts`.
Strings not yet real start with the `[Placeholder]` marker, which renders as
a neutral dashed tag — replace the marker and the text together. (Ticket 02
fills in the full content shape; this pointer will grow with it.)

## Fonts

Self-hosted at build via `next/font` (no request to Google at runtime):

- [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) —
  Rodrigo Fuenzalida / Instrument, [SIL Open Font License 1.1](https://openfontlicense.org/).
- [DM Mono](https://fonts.google.com/specimen/DM+Mono) — Colophon Foundry,
  [SIL Open Font License 1.1](https://openfontlicense.org/).

## Deploy and release

_Added in ticket 17._
