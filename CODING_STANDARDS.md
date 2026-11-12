# Coding Standards

Team-wide rules for Flame's coding team (Engineer builds to them, Reviewer checks every PR against them).
Agreed with Flame on 2026-11-11. This master copy lives at `/Volumes/SSD1/workspace/code/_standards/CODING_STANDARDS.md`; every repo carries a copy at its root. Rules that apply to one project only go in a **Project-specific rules** section at the bottom of that repo's copy and override this file where they conflict.

---

## 1. Git and workflow

1. **Long-lived branches:** `main` = live (only deploy source) and `develop` = integration. `develop` is the default branch.
2. **Ticket branches** are cut from `develop`: `engineer/<ticket-no>-<short-name>` (e.g. `engineer/03-contact-section`).
3. **Every Engineer PR targets `develop`** and is **squash-merged**, one ticket = one PR.
4. **Release** = a PR `develop` → `main`, opened only when Flame says "release", merged **only by Flame** with a **merge commit** (not squash, so the branches stay in sync). No hotfix branches for now: fixes go through `develop` and a release.
5. **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) in English: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `ci:`, `perf:`, `style:`. Imperative mood, subject ≤ 72 chars.
6. **PR size:** aim for **< ~400 changed lines**, not counting lockfiles and generated files. If a ticket would be bigger, it goes back to the planner to split.
7. **PR body:** what and why, how it was verified (real commands + output), screenshots for UI changes, manual steps for Flame, open questions.
8. **CI (GitHub Actions) on every PR:** lint + typecheck + tests (+ coverage gate for Go) + production build must all pass. A red PR is never approved. Flame protects `main` and `develop` (PR required, CI must pass).
9. Never force-push shared branches, never commit directly to `main` or `develop`, never change repo settings or secrets.

## 2. TypeScript / Next.js

1. **TypeScript `strict: true`.** No `any` (use `unknown` + narrowing); no `@ts-ignore` (use `@ts-expect-error` with a reason, only when unavoidable); no non-null `!` without a comment saying why it's safe.
2. **UI = shadcn/ui + Tailwind CSS only** (Flame, 2026-11-11): components come from **shadcn/ui** (added with its CLI into `src/components/ui/`, themed through its CSS variables), styling is **Tailwind** only. No other component or styling libraries (MUI, Chakra, Mantine, CSS-in-JS, Sass, etc.) and no extra animation libraries without Flame's OK; motion uses Tailwind/CSS (shadcn's `tw-animate-css`).
3. **Next.js App Router**, **Server Components by default**; add `"use client"` only where the browser is needed (state, effects, event handlers, browser APIs), as low in the tree as possible.
4. **Static-export sites** (GitHub Pages): `output: "export"`; no server-only features (API routes, server actions, middleware); `next/image` with `unoptimized: true` or pre-sized images.
5. **Lint/format:** ESLint (Next.js config, `eslint-config-prettier`) + Prettier. Formatting is never argued in review; the tools decide.
6. **Structure:**
   ```
   src/app/          routes (page.tsx, layout.tsx, route groups)
   src/components/   reusable UI components (shadcn/ui primitives in src/components/ui/)
   src/lib/          logic, data, utilities (framework-free where possible)
   *.test.ts(x)      next to the code they test
   ```
7. **Naming:** files and folders `kebab-case` (`project-card.tsx`); React components `PascalCase` (`ProjectCard`); functions/variables `camelCase`; constants `UPPER_SNAKE_CASE` only for true constants.
8. **Package manager: pnpm** (never npm/yarn in a pnpm repo). `pnpm-lock.yaml` always committed.

## 3. Go

1. `gofmt` + `go vet` + **golangci-lint** (default linters) clean.
2. **Errors:** always handled; wrap with context using `fmt.Errorf("doing x: %w", err)`; compare with `errors.Is/As`; no `panic` outside `main` (and tests).
3. **`context.Context`** is the first parameter of anything that does I/O or may block, and is passed through, never stored in structs.
4. **Structure:**
   ```
   cmd/<app>/main.go   wiring only (config, logger, start)
   internal/...        all application code
   pkg/...             only for code genuinely shared with other repos
   ```
5. **Logging: [zerolog](https://github.com/rs/zerolog)** (structured, leveled). Never `fmt.Println`/`log.Println` for application logs. One logger created in `main`, passed down (or via context).
6. Idiomatic Go naming (`MixedCaps`, short receiver names, no stutter like `user.UserService`). **Every exported identifier has a doc comment** starting with its name.
7. Interfaces are small and defined where they're used (consumer side).

## 4. Comments, docs, language

1. Code, comments, commit messages and docs in **English**.
2. Comments explain **why** (intent, trade-offs, non-obvious constraints), not what the code already says. No commented-out code.
3. **Every repo has a README:** what it is, how to run it locally, how to test, how it deploys, required env vars (pointing to `.env.example`).

## 5. Errors, logging, privacy

1. No empty `catch` blocks and no swallowed errors: handle, wrap/re-throw, or report.
2. Every page/screen has a designed **error state** and **empty state** (and loading state where data loads).
3. **Never log secrets, tokens or personal data** (emails, names, IDs tied to a person).

## 6. Testing

1. **Test-first** (red → green) at the **agreed test seams** from the spec, one vertical slice at a time (Engineer's `tdd` skill).
2. **Every acceptance criterion in a ticket has a test** that proves it.
3. Tests check behaviour through public interfaces, not internals; expected values are literals/worked examples, never recomputed the way the code does it; mock only at system boundaries (external APIs, time, randomness).
4. **TypeScript:** **Vitest** + **Testing Library** (test what the user sees: text, roles). No coverage-% target.
5. **Playwright** end-to-end tests only once a project has real user flows (forms, login, payments). Browsers install to the SSD (`PLAYWRIGHT_BROWSERS_PATH`).
6. **Go:** standard `testing` package with **table-driven tests**; no testify. **Coverage ≥ 80%**, measured as the total over `./internal/...` with `go test -coverprofile` (excluding `cmd/` and generated code). **CI fails the PR below 80%.**

## 7. Quality bar (UI)

1. **Accessibility: WCAG 2.2 AA** — contrast, full keyboard navigation, visible focus, alt text, semantic HTML, labelled form controls.
2. **Lighthouse (mobile) ≥ 90** for Performance, Accessibility, Best Practices and SEO, checked by the Reviewer before approval. ("For now" — Flame may revise.)

## 8. Dependencies and secrets

1. Prefer the **standard library** and dependencies already in the project. Every **new dependency** needs a one-line reason in the PR (what it does that we shouldn't write ourselves).
2. **Lockfiles are always committed** (`pnpm-lock.yaml`, `go.sum`).
3. **No secrets in code, commits, logs or PR text.** Every environment variable is listed in **`.env.example`** with a fake value; real `.env*` files are git-ignored.

## 9. Toolchain and versions

1. **Node 26 LTS**, pinned in `.nvmrc` and `package.json` `engines`; **pnpm** version pinned in `package.json` `packageManager`.
2. **Go** version pinned in `go.mod` (`go` + `toolchain` lines).
3. **Local agent environment:** before working, run `source /Volumes/SSD1/workspace/tools/dev-env.sh`. It puts pnpm (installed on the SSD) on `PATH` and sends every cache (pnpm store, npm, Go modules/build, golangci-lint, Playwright) to `/Volumes/SSD1/workspace/.cache/`. Nothing gets installed or cached in the home folder.

## 10. Releases and versions

1. **Websites:** no version numbers. A merge to `main` is the release; Git history is the record.
2. **Go tools and libraries:** semver tags (`v1.2.0`) on `main` with GitHub release notes generated from the Conventional Commit messages.

---

## Project-specific rules

_siravitt.github.io — added by ticket 01 (2026-11-12)._

1. **Must-keep URLs (release blockers):** `/privacy.html` must stay at that exact top-level path with its exact policy text (Google's OAuth consent screen links to it). `trailingSlash` in `next.config.ts` must stay at its default `false` — `true` would turn `/privacy.html` into `privacy/index.html` and break that link. The home page footer (added in ticket 04) must carry the exact line `Daedalus — personal assistant app used only by its owner · Privacy` on every page, "Privacy" linking to `/privacy.html`, because Google's OAuth consent screen also depends on `/` describing the Daedalus app it authenticates.
2. **Content file:** `src/content/site.ts` holds the site's one typed content object — an approved exception to rule 2.6's `src/lib` data convention, because every ticket after 01 reads and edits it directly.
3. **No third-party requests at runtime:** no analytics, no tracking, no cookie banner, no remote font requests (fonts are self-hosted via `next/font`). Any new dependency that calls out to a third-party service at runtime needs Flame's sign-off first.
4. **Placeholder convention:** every not-yet-real string in `site.ts` starts with the `[Placeholder]` marker (`src/lib/placeholder.ts`); the renderer shows it as a neutral dashed tag and keeps the marker text in the DOM. Ticket 05's release guard scans the built site for this marker (plus `example.com` and `linkedin.com/in/placeholder`) and fails a PR into `main` while any remains.
