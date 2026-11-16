# 01: Scaffold, CI and the hero tracer

**What to build:** The repo becomes a Next.js (App Router) static-export project on `develop` that builds, lints, type-checks and tests in CI on every PR. A visitor opening the built `index.html` sees the dark page with Siravit's full name as the only H1. The role line sits above it and the one-line pitch below, all read from `src/content/site.ts`. A `[Placeholder]` string shows the neutral dashed tag. This thin slice runs through every layer (content → view → test → build → CI) so every later ticket lands on a green pipeline. The approved spec and design are committed with it.

**Blocked by:** None (can start immediately).

**Design refs:** DESIGN.md §2 (the whole `:root` token block, dark only, no `.dark` block), §3 (type: Instrument Sans with the `wdth` axis + DM Mono, two weights), §4 (container, spacing scale), §6 "Placeholder tag"; hero text column in `prototype/index.html` (`.hero__role`, `h1`, `.hero__lead`); `screenshots/home-desktop-1440.png` / `home-mobile-390.png` (top of page).

**Decisions (binding):**
- Latest stable Next.js, React, Tailwind v4 and shadcn/ui (CLI init into `src/components/ui/`, `src/lib/utils`). `output: "export"`, `images.unoptimized: true`, `trailingSlash` left at its default `false`, with a comment saying why it must stay `false` (it keeps `/privacy.html` a top-level file). No base path.
- Node 26 in `.nvmrc` and `engines`; pnpm pinned in `packageManager`; `pnpm-lock.yaml` committed. Run `source /Volumes/SSD1/workspace/tools/dev-env.sh` locally first (caches on the SSD).
- Commands (README decision 3): `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm preview` (serves `out/` over http on localhost; no new runtime dependency).
- Workflow `CI`, job `verify`: on `pull_request` to `develop` and `main`. Steps: checkout → pnpm + Node from the pins → `pnpm install --frozen-lockfile` → lint → typecheck → test → build. Later tickets add steps to this job.
- Tests: Vitest + Testing Library (jsdom) + axe-core through a Vitest matcher (dev-only; DECIDED 5). Tests render views with a **fixture** content object, never with `site.ts`, except where they assert must-keep literals.
- Content module: `src/content/site.ts` exports one typed `site` object. For now it has `person` (name: real, `Siravit Tanratanavijit`; role and pitch as `[Placeholder] …` copied from the prototype) and `meta` (title from DESIGN §9). Ticket 02 completes the shape, so keep the types small and next to the file.
- The home route only passes `site` into a presentational home view that takes the content as a prop. This prop boundary is Seam A.
- Placeholder rendering: a string starting with `[Placeholder]` renders that marker as the dashed tag (DESIGN §6) followed by the rest. The marker text stays in the DOM, which the release guard depends on. Strings without the marker render as plain text.
- `metadataBase` = `https://siravitt.github.io`; `<html lang="en">`; `color-scheme: dark`.
- Line budget: the `docs/` + `design/` import goes in its own first commit (`docs: add spec, tickets and approved design v4.1`), and the verbatim Coding Standards copy also doesn't count toward the ~400 lines. Its **Project-specific rules** section does count.

**Acceptance criteria:**
- [ ] `pnpm build` writes a static export to `out/` with `out/index.html`. Opening it over `pnpm preview` shows the name, role and pitch on the `--background` #0a0c0f ground in Instrument Sans (H1 at weight 500, DESIGN §3 sizes).
- [ ] Seam A: rendering the home view with the fixture shows exactly one H1, whose text is the fixture's name. The fixture's role and pitch texts are present, and a fixture string with the `[Placeholder]` marker still contains the text `[Placeholder]`.
- [ ] Seam A: axe reports no violations on the rendered home view.
- [ ] Fonts are self-hosted via `next/font`: no file in `out/` references `fonts.googleapis.com` or `fonts.gstatic.com` (grep output in the PR; ticket 05 automates it).
- [ ] TypeScript `strict: true`. ESLint (Next config + `eslint-config-prettier`) and Prettier are configured. `design/` and `docs/` are excluded from lint, format, tests and **Tailwind's source scanning**, so the CSS holds no utilities generated from the prototype HTML.
- [ ] `.gitignore` covers `node_modules`, `.next`, `out`, `.env*` (except `.env.example`), every `.taste-skill/` directory and headless-Chrome profile/probe folders (`chrome-*`, `probe-*`, `shot-*`). `git status` after the commit shows `design/prototype/.taste-skill/` as ignored, and none of it is committed.
- [ ] `docs/` (spec + tickets) and `design/` (DESIGN.md, CHANGELOG.md, prototype, screenshots, brand) are committed. The legacy root `index.html` and `privacy.html` are left alone; ticket 04 replaces them.
- [ ] The CI workflow runs on this PR and is green. Its `verify` job runs install (frozen lockfile), lint, typecheck, test and build.
- [ ] `CODING_STANDARDS.md` is a verbatim copy of the master at the repo root. Its **Project-specific rules** section records: the must-keep URLs and footer line and why (Google OAuth); `trailingSlash` must stay `false`; the content file lives at `src/content/site.ts` (an approved exception to the `src/lib` data rule); no third-party requests at runtime; the placeholder convention and the release guard.
- [ ] README covers what the site is, prerequisites (Node/pnpm pins, `dev-env.sh`), dev, test, build, local preview, how content is edited (pointer; ticket 02 expands it), that no env vars are needed (so no `.env.example`), and font credits (Instrument Sans and DM Mono, SIL OFL 1.1). Deploy and release sections are marked "added in ticket 17".
- [ ] PR records Lighthouse mobile scores for the locally served build (all four ≥ 90).
- [ ] Build, lint, type-check and tests pass.
