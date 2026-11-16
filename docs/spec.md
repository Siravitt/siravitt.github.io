# Portfolio v1 — Spec

Status: draft (Flame confirms via Daedalus) · Source: grilling 2026-11-11 · Card: t_cf233aaf

## Problem Statement

Siravit Tanratanavijit ("Flame") is a software developer (Go backend, Next.js frontend) with no portfolio. His only public site, `https://siravitt.github.io/`, is two unstyled HTML files that exist for one reason: Google's OAuth consent screen for his private Daedalus Calendar app points at the homepage (`/`) and the privacy policy (`/privacy.html`). A recruiter or tech lead who lands there today learns nothing about him: what he builds, with which stack, or how well.

He wants that same address to become a one-page developer portfolio that leads with projects and stack, without breaking the two URLs Google depends on. He also wants to write the real copy himself later without editing components, and he does not want anything placeholder or mock to go live.

## Solution

Rebuild `https://siravitt.github.io/` as a fast, accessible, dark-only, English-only, one-page portfolio. It is a Next.js (App Router) static export styled only with shadcn/ui + Tailwind and deployed to GitHub Pages by GitHub Actions from `main`.

- One page with six sections in a fixed order: **Hero** (name, role, one-line pitch) → **About** → **Stack** → **Projects** → **Experience** → **Contact** (email, GitHub, LinkedIn links; no form).
- Every visitor-facing string comes from one typed content file, `src/content/site.ts`. For v1 it holds clearly marked placeholders, and the projects are mock. The name `Siravit Tanratanavijit` and the GitHub URL `https://github.com/Siravitt` are real.
- `/privacy.html` stays at the exact same URL with the exact same policy text, restyled to match. A site-wide footer carries "Daedalus — personal assistant app used only by its owner · Privacy", where "Privacy" links to `/privacy.html`.
- The site gets a favicon and an Open Graph share image built from his name. It has no analytics, no tracking, no cookie banner and no third-party requests at runtime.
- Work lands on `develop` only. `main` (live) is released only after Flame has replaced every placeholder. A CI release guard enforces this (confirmed, see Testing Decisions).

## User Stories

**Recruiter / tech lead (primary audience)**
1. As a recruiter, I want to see Siravit's full name and role in the first screen, so that I know right away whose site this is and what he does.
2. As a recruiter, I want a one-line pitch under the name, so that I can tell in seconds whether he fits the role I'm hiring for.
3. As a tech lead, I want a clear, grouped stack/skills section, so that I can check his languages, frameworks and tools against my team's stack.
4. As a tech lead, I want each project to show what it is, what he did, the stack used and the outcome, so that I can judge what he builds and how well.
5. As a tech lead, I want links to a project's code and/or live demo where they exist, so that I can check the work myself.
6. As a recruiter, I want an experience section with role, organisation, period and key contributions per entry, so that I can follow his career at a glance.
7. As a recruiter, I want a short About section, so that I get a sense of the person behind the work.
8. As a recruiter, I want to contact him by email in one click, so that I can reach out without hunting for an address.
9. As a recruiter, I want links to his GitHub and LinkedIn profiles, so that I can check his wider presence.
10. As any visitor, I want to jump straight to a section (e.g. Projects) from the top of the page, so that I don't have to scroll through everything.
11. As a visitor on a phone, I want the page to be easy to read and use at 390 px wide, so that I can review him on the go.
12. As a visitor on a slow mobile connection, I want the page to load fast, so that I don't give up before it renders.
13. As a visitor, I want the site to work with JavaScript disabled or blocked, so that every section, link and the privacy page still work.
14. As a visitor, I want no tracking scripts or cookie banners, so that the visit is quick and private.
15. As a visitor who mistypes a URL, I want a styled "page not found" page with a way back home, so that I am not stranded.

**Accessibility**
16. As a keyboard user, I want to reach every link and control in a logical order, with a clearly visible focus indicator that sticky elements never hide, so that I can use the whole site without a mouse.
17. As a keyboard or screen-reader user, I want a "skip to content" link and proper landmarks and headings (one H1 = his name, one H2 per section), so that I can move around efficiently.
18. As a screen-reader user, I want descriptive link names (e.g. "GitHub profile", "Source code for <project>") and alt text on any image, so that I understand where links go.
19. As a low-vision visitor, I want all text and UI elements to meet WCAG 2.2 AA contrast on the dark theme, so that I can read everything.
20. As a visitor who has asked for reduced motion, I want animation turned down or off, so that the page is comfortable to use.

**Sharing / discovery**
21. As someone sharing the link in Slack, LinkedIn or Discord, I want a branded preview (title, description, image with his name), so that the link looks professional.
22. As a visitor, I want a recognisable favicon in the browser tab, so that I can find the site among open tabs.
23. As a recruiter searching his name, I want an accurate page title and description in search results, so that I click the right site.

**Daedalus / Google OAuth (Flame as app owner)**
24. As Flame, I want `https://siravitt.github.io/privacy.html` to keep serving the same policy text at the same URL, so that my Google OAuth consent screen keeps working without changes at Google.
25. As Flame, I want every page's footer to show "Daedalus — personal assistant app used only by its owner · Privacy" with "Privacy" linking to `/privacy.html`, so that the homepage Google points to still names the app and links its policy.
26. As Flame, I want the privacy page restyled in the new design with a way back to the portfolio, so that the site looks like one product.
27. As Flame, I want CI to fail if the privacy URL, its policy text or the Daedalus footer line goes missing or changes, so that no PR can break the OAuth setup by accident.

**Flame as content owner**
28. As Flame, I want all text (hero, About, Stack, Projects, Experience, Contact, section titles, page description) in one file, `src/content/site.ts`, so that I can replace it without touching components.
29. As Flame, I want every placeholder to be obviously marked in that file and on the page, so that I can find and replace each one and nobody mistakes mock content for real.
30. As Flame, I want the content file to be typed, so that a typo or missing required field fails typecheck before it ships.
31. As Flame, I want to add or remove projects, experience entries, stack groups and items by editing lists, so that the page grows with my career without code changes.
32. As Flame, I want optional fields (project links, project image, end date for a current role) to be left out cleanly, so that the page never shows empty boxes or broken links.
33. As Flame, I want a section whose list I have emptied to drop out of the page and its nav link (confirmed — DECIDED 3), so that the page never shows an empty section.
34. As Flame, I want to preview the built site locally before release, so that I can check my real content exactly as it will go live.

**Flame as releaser / the team**
35. As Flame, I want CI (lint, typecheck, test, build) to run on every PR to `develop` and `main`, so that only green work is merged.
36. As Flame, I want a GitHub Actions workflow that builds the static site and deploys it to GitHub Pages on every push to `main` (and on manual trigger), so that releasing means merging the release PR.
37. As Flame, I want PRs into `main` to fail while any placeholder or mock content remains (confirmed — DECIDED 2), so that nothing fake goes live by mistake.
38. As Flame, I want a short release checklist in the README (Pages settings, merge, live checks, rollback), so that the first release doesn't take down the OAuth pages.
39. As the Reviewer, I want each UI PR to report Lighthouse mobile scores (≥ 90 in all four categories) and a keyboard/axe accessibility pass, so that the quality bar is checked before approval.

## Implementation Decisions

### Stack and hosting
- **Next.js, App Router, static export** (`output: "export"`). No API routes, server actions, middleware, ISR, or anything else that needs a server. Use the latest stable Next.js at build time.
- **UI: shadcn/ui primitives + Tailwind CSS only.** No other component, styling, icon-font or animation library unless Flame OKs it. Motion is Tailwind/CSS only (shadcn's `tw-animate-css`) and respects `prefers-reduced-motion`. Icons, if used, come from shadcn's default icon set (lucide) or inline SVG. Any new dependency needs a one-line reason in its PR.
- **Server Components by default.** The target is **zero custom client components**: section navigation is plain anchor links, and if a mobile menu is needed it must work without JS (e.g. CSS/`<details>`) unless Flame approves a client component.
- **TypeScript strict**, pnpm, Node LTS pinned per the Coding Standards; ESLint + Prettier.
- **Hosting: GitHub Pages user site** (`Siravitt/siravitt.github.io`), served at the domain root, so **no base path / asset prefix**. Deployed by a GitHub Actions workflow that uploads the static export as a Pages artifact. Jekyll is not involved.
- **`metadataBase` = `https://siravitt.github.io`** so that canonical and Open Graph URLs are absolute.
- **Images:** `next/image` with `unoptimized: true` and pre-sized, modern-format assets (or plain `<img>` with explicit width/height). No runtime image service.
- **Fonts:** self-hosted at build time via `next/font` (at most two families, subset to Latin). No requests to Google Fonts or any other third party at runtime.
- **No third-party requests at all at runtime**: no analytics, tag managers, embeds, CDNs or cookies.

### Must-keep items (release blockers if broken)
| Item | Requirement |
|---|---|
| `https://siravitt.github.io/` | Serves the portfolio home page. Its footer shows the Daedalus line with a working Privacy link. |
| `https://siravitt.github.io/privacy.html` | Same URL, HTTP 200. Heading "Privacy Policy" plus this policy text, verbatim: "This app is used only by its owner to create events in the owner's own Google Calendar. No data is shared with third parties or stored outside the owner's machine." Restyled only. Navigation chrome (header, footer, link home) may be added; the policy wording may not change and nothing may be added to it. |
| Footer line (every page) | "Daedalus — personal assistant app used only by its owner · Privacy", with "Privacy" linking to exactly `/privacy.html`. |
| Export file naming | The privacy route must be emitted as a top-level `privacy.html`. This needs Next's default `trailingSlash: false`, which must not be changed (otherwise it becomes `privacy/index.html` and the URL breaks). |

- The privacy page is a normal App Router route ("privacy"). Do **not** also ship a raw `privacy.html` in the public assets; it would collide with the generated file.
- The two legacy root files (`index.html`, `privacy.html`) are removed from `develop` when the Next.js app replaces them, and their text moves into the content file. This does not touch the live site: Pages keeps serving legacy `main` until the release.

### Modules
- **Content module: `src/content/site.ts`** (path fixed by Flame). This is the single source of every visitor-facing string. It exports one typed `site` object, and the content types live next to it. It contains:
  - `person`: full name (real: `Siravit Tanratanavijit`), role (placeholder), one-line pitch (placeholder).
  - `meta`: page title pattern and meta description (placeholder; the description falls back to the pitch).
  - `sections`: the visible title of each of the six sections (e.g. "Projects"). Defaults are fine but must be editable.
  - `about`: one or more paragraphs (placeholder).
  - `stack`: an ordered list of groups, each with a group name (e.g. "Backend") and an ordered list of items (placeholder; samples may use his known stack, Go and Next.js, but stay marked). No proficiency levels or percentages.
  - `projects`: an ordered list. Each project has a title, a one-line summary, a short description (problem → what he built), his role, stack tags, an outcome/impact line, optional links (source, live), and an optional image with **required alt text when an image is present**. v1 ships 3–4 **mock** projects, each visibly marked as sample.
  - `experience`: an ordered list. Each entry has role, organisation, start, end (optional = "Present"), and 2–4 highlights, with optional stack tags. All placeholder; no real-looking employers or dates.
  - `contact`: optional short intro line, email (placeholder), GitHub URL (real: `https://github.com/Siravitt`), LinkedIn URL (placeholder).
  - `daedalus`: footer line text, privacy link path and privacy policy heading + text. This block is marked **"must-keep — Google OAuth, do not edit"** in the file and guarded by tests.
  - Purely technical accessibility strings (e.g. "Skip to content", "opens in a new tab") may live in components; everything else visitors read lives here.
- **Placeholder convention:** every placeholder string starts with the literal marker `[Placeholder]`. The placeholder email uses the reserved `example.com` domain. The placeholder LinkedIn URL uses an obviously fake profile slug containing `placeholder`. Mock projects are marked the same way. The release guard checks for exactly these markers.
- **Home page view:** a presentational component that takes the content object as a prop and renders the six sections in fixed order. Each section has a stable anchor id (`hero`/top, `about`, `stack`, `projects`, `experience`, `contact`) and an H2, and the name is the page's only H1. The home route only passes `site` into it. This prop boundary is the main test seam.
- **Section components** (one per section) plus small shared pieces: section shell (anchor, heading, spacing), project card, experience entry, stack group, external link (consistent "opens in new tab" handling if new tabs are used), site header with in-page nav, and site footer with the Daedalus line.
- **Privacy page view:** renders the `daedalus` policy heading and text inside the shared header/footer.
- **Not-found page:** a styled `404.html` (static export emits it, and Pages serves it for unknown paths) with a link home. This is the site's error state per the Coding Standards.
- **Empty states:** optional fields render nothing when absent (no empty link rows or image boxes). A section whose list is empty is omitted together with its nav link (confirmed — DECIDED 3).
- **Metadata:** Next.js Metadata API. Title, description, canonical, `lang="en"`, `theme-color` matching the dark background, Open Graph (title, description, URL, type website, 1200×630 image) and Twitter `summary_large_image`. The privacy page gets its own title/description and canonical `/privacy.html`.
- **Favicon + OG image:** **static files supplied by the Designer** (favicon `.ico` + SVG/PNG icon + Apple touch icon; OG 1200×630 PNG), wired through Next's file-based metadata conventions. They are not generated at build time, so no image-generation runtime or extra dependency is needed. They show **only his name** (plus decoration, no placeholder copy), so they don't need redoing when Flame writes the real content.

### CI/CD (GitHub Actions)
- **CI workflow** on every PR to `develop` and `main`: install (pnpm, frozen lockfile) → lint → typecheck → unit/component tests → production build → built-site checks (see Testing). All of them must pass.
- **Release guard** (confirmed — DECIDED 2): an extra CI job that runs only on PRs whose base is `main`. It fails if the built site contains any placeholder marker. It can also be run locally as a script.
- **Deploy workflow:** triggers on push to `main` plus manual dispatch. It builds the export and deploys it to the `github-pages` environment with the official Pages actions (configure → upload artifact → deploy). It has a single concurrency group and does not cancel a deploy already in progress. It is "ready" when merged to `develop`; its first real run is the release.
- Agents never change repo settings. Pages source, environment rules and branch-protection status checks are Flame's steps (see Further Notes).

### Repo housekeeping
- **README** per the Coding Standards: what the site is, local dev, test, local preview of the static build, how it deploys, the release checklist, and how to edit content (pointing to `src/content/site.ts` and the placeholder convention). No env vars are needed, so `.env.example` is not needed unless one is added.
- **`CODING_STANDARDS.md` copy at the repo root** (the Standards require it in every repo). Its **Project-specific rules** section records: the must-keep URLs/footer line and why; `trailingSlash` must stay false; the content file lives at `src/content/site.ts` (an approved exception to the `src/lib` data convention); no runtime third-party requests; and the placeholder convention + release guard.

## Design Inputs

- **Pages in v1:**
  1. **Home** (one page): Hero → About → Stack → Projects → Experience → Contact, plus header (name/monogram + in-page nav to the sections) and footer.
  2. **Privacy** (`/privacy.html`): "Privacy Policy" heading + the verbatim policy paragraph, same header/footer, a clear way back to the portfolio.
  3. **Not found** (404): short message + link home. Small; same shell.
- **Audience and emphasis:** recruiters and tech leads. Projects and Stack carry the visual weight ("here's what I build and how well"). Hero is short and gets the visitor to Projects fast (e.g. a primary link to Projects and a secondary link to Contact). About and Experience are supporting.
- **Content per section** (all from the content file; Flame supplies the real copy later; the prototype uses visibly marked placeholders, `[Placeholder] …`):
  - Hero: name **Siravit Tanratanavijit** (real, exact spelling), role, one-line pitch.
  - About: 1–3 short paragraphs.
  - Stack: grouped lists of items (e.g. Languages / Backend / Frontend / Infra & tools). No skill bars, percentages or star ratings.
  - Projects: 3–4 mock cards, each with title, one-line summary, short description, role, stack tags, outcome/impact line, optional source/live links, optional image. Design one card with **no links and no image** too.
  - Experience: entries with role, organisation, period, 2–4 highlights, optional stack tags. Design a "current role" (no end date) variant.
  - Contact: optional one-line intro + three links: email (`mailto:`), GitHub (`https://github.com/Siravitt`), LinkedIn. No form.
  - Footer (every page): "Daedalus — personal assistant app used only by its owner · Privacy" (Privacy → `/privacy.html`). It can sit quietly, but it must be visible and readable (AA contrast), not hidden or collapsed.
- **Look:** **dark only, no toggle, no light theme.** Flame gave no references, so the Designer picks a clean, technical direction and Flame judges it on the prototype. Express the theme as shadcn CSS variables (one dark palette set as the only theme).
- **Language:** English only.
- **Brand assets to deliver:** favicon set + Open Graph image 1200×630, both from his name only, in the site's style.
- **Constraints the design must meet** (the build is judged on them):
  - Buildable with shadcn/ui primitives + Tailwind only. Motion must be achievable with CSS/Tailwind and must turn off under `prefers-reduced-motion`. Avoid designs that need client JavaScript (scroll-driven JS effects, carousels, tabs, filters); if one is essential, flag it for Flame.
  - WCAG 2.2 AA: text contrast ≥ 4.5:1 (large text ≥ 3:1), UI/focus indicators ≥ 3:1, visible focus on every interactive element, focus not hidden behind a sticky header (anchor scroll offset), targets ≥ 24×24 px, readable at 200% zoom and 320 px width without horizontal scroll.
  - Lighthouse mobile ≥ 90: at most two font families, no large hero images or video, no heavy decorative effects that hurt LCP/CLS.
  - Layouts must hold with real content of different lengths: long names/titles, 1 vs 6 projects, and empty optional fields.
- **States to show:** hover and focus for links/buttons/cards, the project card without links/image, and the 404 page. Empty sections are not designed (DECIDED 3: they are hidden).

## Testing Decisions

- **A good test here** checks what a visitor or Google's crawler gets: rendered text, roles, landmarks, headings, link names and `href`s, and the files and markup in the built site. It never checks component internals, class names or Tailwind output. Expected values are literals. Per the Standards, tests are written first at the agreed seams, one vertical slice at a time, and every ticket acceptance criterion gets a test.
- **Tests must not depend on Flame's placeholder copy.** Component tests render the views with a **test fixture content object**, so Flame can rewrite the content file without breaking CI. The only real-content literals tests may assert are the must-keep ones (name spelling, GitHub URL, Daedalus footer line, privacy path and policy text).
- **Seam A — view rendering** (confirmed by Flame 2026-11-11): Vitest + Testing Library render the home page view and the privacy page view with fixture content. Covers: six sections in order with the right headings and anchor ids; one H1; nav links target the section anchors; project/experience/stack lists render every item and omit absent optional fields; empty-list behaviour (DECIDED 3: section + nav link hidden); contact links (`mailto:`, GitHub, LinkedIn) have correct `href`s and accessible names; the footer line and Privacy link (`/privacy.html`) appear on both views; the privacy view shows the policy verbatim. Plus an automated axe check per view (dev-only dependency, DECIDED 5).
- **Seam B — built-site checks** (confirmed by Flame 2026-11-11): a test suite that runs after `pnpm build` against the static export output. It asserts: `index.html`, `privacy.html` (top level, not a folder) and `404.html` exist; `privacy.html` contains the policy heading + text verbatim; every page's footer has the Daedalus line linking to `/privacy.html`; the home page has title, description, canonical, `lang="en"` and Open Graph/Twitter tags with absolute `https://siravitt.github.io/...` URLs, and the referenced OG image and favicon files exist in the output; no `<script>`/`<link>`/`<img>` points to a third-party origin. The **release guard** (DECIDED 2) is a mode of this seam: on PRs into `main`, fail if any `[Placeholder]` marker, `example.com` email or placeholder LinkedIn slug appears in the output.
- **Typecheck** enforces the content shape (required fields, alt text when an image is set); no extra runtime validation library.
- **Not automated in v1:** Lighthouse and the manual keyboard/screen-reader pass. The Reviewer runs Lighthouse (mobile) against the locally served static build and records the four scores in the review. All four must be ≥ 90. No Playwright (no user flows such as forms or login, per the Standards).
- **Prior art:** none. The repo has no code or tests yet.

## Out of Scope

- Blog, i18n / any language other than English, CMS, contact form, CV/résumé download (later), analytics or any tracking, cookie banner, light theme or theme toggle.
- Real content. v1 ships placeholders + mock projects, and Flame writes the real copy before release.
- Multiple pages beyond Home, Privacy and 404. No per-project detail pages.
- Custom domain, sitemap/robots files, Lighthouse CI automation, Playwright E2E.
- Any change to the Daedalus app, its Google Cloud OAuth settings, or the privacy policy wording.
- Changing repo settings (Pages source, environments, branch rules). Those are Flame's manual steps.

## Further Notes

**Release checklist (Flame, at release time; goes into the README):**
1. Real content replaced in `src/content/site.ts`, and the release guard is green on the `develop` → `main` PR.
2. Repo Settings → Pages → Source: switch to **GitHub Actions** right before merging. Do not merge while Pages still serves `main` from a branch: Pages would publish the Next.js source and `/privacy.html` would 404.
3. Check that the `github-pages` environment allows deployments from `main`. The repo's default branch is `develop`, and the environment's branch rule may only allow the default branch. To verify when switching.
4. Merge the release PR with a merge commit (per the Standards) and watch the deploy workflow.
5. Live check right after deploy: `/` loads; `/privacy.html` returns the exact policy text; the footer Privacy link works; the OG preview renders (e.g. paste the URL into Discord).
6. **Rollback** if the deploy fails or the privacy page breaks: revert the release merge on `main`, which restores the legacy `index.html`/`privacy.html` on `main`, and switch Pages back to "Deploy from a branch: `main` / root".
7. After the first CI run on a PR, add the CI checks as required status checks in the `main`/`develop` rulesets (pending from repo setup).

**Notes**
- Showing the email address as plain `mailto:` text exposes it to scrapers. Flame accepted this trade-off by choosing email with no contact form; noted only.
- If Daedalus ever needs Google's full app verification, a homepage whose main content is a personal portfolio, with the app only in the footer, may need a fuller app description. Today's setup (personal app, owner-only) only needs the URLs to keep working.
- How Flame previews: `develop` is never deployed. He previews by building and serving the static export locally (README documents the commands).

**DECIDED by Flame (2026-11-11, all as recommended) — formerly OPEN:**
- **DECIDED 1 (yes) — Test seams.** Proposed: Seam A (render the home and privacy views with fixture content) + Seam B (checks on the built static site, including must-keep URLs/text). Recommended: accept both.
- **DECIDED 2 (yes) — Release guard.** Proposed: a CI job on PRs into `main` that fails while any `[Placeholder]` marker, `example.com` email or placeholder LinkedIn URL is still in the built site. Recommended: yes, because it turns "nothing fake goes live" into an automatic check.
- **DECIDED 3 (yes) — Empty sections.** If a list (projects, experience, stack) is empty, recommended: hide that section and its nav link. Alternative: show a short "coming soon" line.
- **DECIDED 4 (yes) — 404 page.** The Coding Standards require a designed error state, so the spec includes a small styled 404 page in v1. Confirm it's OK to include.
- **DECIDED 5 (yes) — Automated accessibility check.** Add axe (dev-only test dependency) to the Seam A tests? Recommended: yes. It catches contrast/label/landmark regressions on every PR. The Reviewer's manual keyboard pass stays.

## Revision history
- 2026-11-11 — Flame answered OPEN 1–5: all yes (seams A + B, release guard on PRs into main, hide empty sections + nav link, styled 404 in v1, axe as dev-only test dependency). Edited by Daedalus.
