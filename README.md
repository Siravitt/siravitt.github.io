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

## Deploy

The `Deploy` workflow (`.github/workflows/deploy.yml`) publishes the site to
GitHub Pages. It triggers on every `push` to `main` and on manual
`workflow_dispatch`; both its jobs carry `if: github.ref ==
'refs/heads/main'`, so a manual dispatch from any other branch (including
`develop`) does nothing. It re-builds the static export, re-runs the
built-site checks and the release guard (`pnpm test:site` and
`pnpm check:release`, a second line of defence after the PR guard), then
uploads and deploys it with the official Pages actions. A single
`pages` concurrency group with `cancel-in-progress: false` means a deploy in
progress always finishes before the next one starts.

**`develop` is never deployed.** To preview the production build locally,
run `pnpm build && pnpm preview` and open `http://localhost:4173`.

The workflow is ready as soon as it lands on `develop`; its first real run
is the release itself, triggered by merging the release PR into `main` (see
the checklist below).

## Release checklist

Flame's steps, at release time, in order. Steps 2, 3 and 7 are one-time
repo settings only Flame can change (agents never touch them); steps 1, 4
and 5 — and 6 if it's needed — happen every release.

1. All placeholder and mock content in `src/content/site.ts` is replaced:
   none of `check:release`'s guard markers (`src/lib/release-guard.ts`)
   remain anywhere in the built site — the literal strings
   `[Placeholder]`, `example.com`, `linkedin.com/in/placeholder`, or
   `Mock project`. Run `pnpm build && pnpm check:release` locally and keep
   fixing content until it exits `0` before opening the release PR;
   `release-guard` (the CI job that runs only on PRs into `main` — it's
   `skipped`, not run, on PRs into `develop`) must also be green on the
   `develop` → `main` release PR itself.
2. Settings → Pages → Source → **GitHub Actions**, right before merging.
   Never merge while Pages still deploys `main` from a branch: Pages would
   then publish the Next.js source tree instead of the built site, and
   `/privacy.html` would 404.
3. Check that the `github-pages` environment allows `main`. The repo's
   default branch is `develop`, so the environment's branch rule may only
   allow `develop` — update it to also allow (or allow only) `main`, or the
   deploy job's environment gate will block the run.
4. Merge the release PR with a **merge commit** (per the Coding Standards,
   so `main` and `develop` stay in sync) and watch the `Deploy` workflow
   run.
5. Live checks right after deploy: `/` loads; `/privacy.html` shows the
   exact policy text; the footer Privacy link works; the Open Graph preview
   renders (for example by pasting the URL into Discord).
6. **Rollback** if the deploy fails or `/privacy.html` breaks: revert the
   release merge commit on `main` (restoring the legacy `index.html` /
   `privacy.html` that were serving before), and switch Pages back to
   "Deploy from a branch: `main` / root".
7. After the first CI run on a PR, add `verify` and `release-guard` as
   required status checks in the `main`/`develop` branch rulesets.

## Credits

Marks drawn in the Stack panel (DESIGN.md §6b) are one-colour SVGs from
[Simple Icons](https://github.com/simple-icons/simple-icons) 15.22.0 (CC0-1.0),
copied unchanged to `public/icons/stack/`: Go, TypeScript, PostgreSQL, Redis,
Next.js, React, Tailwind CSS, Docker, GitHub Actions and Git. The brand marks
stay trademarks of their respective owners; they're used only to name the
tools listed in `site.ts`.

The small Go mark in the review-bot picture (DESIGN.md §6 Icons) is a colour
SVG from [gilbarbara/logos](https://github.com/gilbarbara/logos) (CC0-1.0),
copied unchanged to `public/icons/go.svg`. The mark stays Go's trademark;
it's used only to name the tool in the mock project's drawing.

The GitHub mark in the Contact footer (DESIGN.md §6 "Contact / footer") is a
one-colour SVG from [gilbarbara/logos](https://github.com/gilbarbara/logos)
(CC0-1.0), inlined unchanged (path data) in `src/components/icons/github-icon.tsx`
with `fill="currentColor"`. The LinkedIn mark beside it is a one-colour SVG
from [Simple Icons](https://github.com/simple-icons/simple-icons) 10.4.0
(CC0-1.0; current Simple Icons releases no longer ship LinkedIn, 10.4.0 does),
inlined unchanged in `src/components/icons/linkedin-icon.tsx`. Both marks
stay their owners' trademarks; they're used only to name the profile links.

## Legacy root files

`index.html` and `privacy.html` at the repo root were the pre-Next.js site.
Ticket 04 removes them from `develop` (their text now lives in
`src/content/site.ts`'s `daedalus` block and renders at `/` and
`/privacy.html` through the Next.js app). **The live site keeps serving the
old files from `main`** until the first release off `develop`; removing them
here does not take anything offline.
