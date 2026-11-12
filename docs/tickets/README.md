# Portfolio v1: tickets

Status: draft for Flame's approval · Card: t_6a74a197 · Written 2026-11-12

- Spec: `docs/spec.md` (all OPEN items decided)
- Design (approved v4.1, 2026-11-12): `design/DESIGN.md`, `design/prototype/` (index, privacy, 404, `scroll.css`, `scroll.js`, `brand/`, `assets/icons/`), `design/screenshots/`
- Coding Standards (binding): `/Volumes/SSD1/workspace/code/_standards/CODING_STANDARDS.md` (the repo copy arrives in ticket 01)

One ticket = one engineer card = one PR into `develop` (squash), branch `engineer/NN-<slug>`. Every PR stays under
~400 changed lines (lockfiles, generated files, copied binary/SVG assets and verbatim copies don't count).

## Breakdown

| # | Ticket | Blocked by | Delivers |
|---|---|---|---|
| 01 | [Scaffold, CI and the hero tracer](01-scaffold-ci-hero-tracer.md) | none | Next.js static export with pins, lint, tests, CI on every PR; the H1 name, role and pitch rendered from `site.ts`; `docs/` + `design/` committed |
| 02 | [Content model and test fixture](02-content-model.md) | 01 | The full typed `site.ts` with every placeholder and the 4 mock projects, and one shared test fixture, so later tickets never fight over the content file |
| 03 | [Page skeleton, header and navigation](03-page-skeleton-header-nav.md) | 02 | Sticky header, keycap/secondary buttons, desktop nav, no-JS mobile menu, one shell per section with anchor + H2, empty list → section and nav link hidden |
| 04 | [Footer, privacy page and 404](04-footer-privacy-404.md) | 03 | The Daedalus line on every page, `/privacy.html` with the verbatim policy, the styled 404; legacy root files removed |
| 05 | [Built-site checks and release guard](05-built-site-checks-release-guard.md) | 04 | Seam B tests on `out/` in CI (must-keep URL, text, footer, no third-party origins) and the placeholder release guard on PRs into `main` |
| 06 | [Hero: editor picture, facts and calls to action](06-hero-editor-facts-ctas.md) | 03 | The full hero: sand frame with the drawn `site.ts` editor and deploy card, facts row, Email + See projects |
| 07 | [About and Stack sections](07-about-stack.md) | 03 | About statement + paragraphs; Stack rows and the one-colour marks panel |
| 08 | [Projects section: cards](08-projects-cards.md) | 03 | Project cards with badge, links, role/outcome, tags; the bare card; long-copy and count edge cases |
| 09 | [Project visuals: panel, image, terminal and checklist](09-project-visuals-terminal-checklist.md) | 08 | The sand panel under a card, an optional real image, and two drawn mini-UIs (static final frame) |
| 10 | [Project visual: diff review](10-project-visual-diff-review.md) | 09 | The third drawn mini-UI (review bot suggestion, static final frame) |
| 11 | [Experience timeline](11-experience-timeline.md) | 03 | Experience entries on the rail with dots, period, Current badge, highlights, tags |
| 12 | [Contact closing footer](12-contact-closing.md) | 04 | Contact heading, GitHub/LinkedIn links, the big Email keycap, Sections/Elsewhere columns above the legal row |
| 13 | [SEO metadata, favicon and share image](13-seo-favicon-og.md) | 05 | Title, description, canonical, Open Graph/Twitter, theme colour, the designer's icon set and OG image; Seam B asserts them |
| 14 | [Scroll motion (CSS layer)](14-scroll-motion-css.md) | 06, 07, 08, 11, 12 | DESIGN §7.1 rows 1–10, 12–13 in CSS: progress line, nav line, hero type-in/steps/parallax, reveals, stack assemble, rail + dots, About phrase, smooth jumps; rest state = final picture |
| 15 | [ScrollMotion: focus after jumps and the fallback](15-scroll-motion-component.md) | 14 | The one client component: focus follows in-page jumps (every browser), IntersectionObserver/rAF fallback for browsers without scroll timelines, closes the mobile menu on a link tap |
| 16 | [Project mini-UI motion (play once)](16-project-demo-motion.md) | 10, 15 | The three mini-UIs play their run once when their card scrolls in (pending Q2) |
| 17 | [Deploy workflow and release checklist](17-deploy-workflow-release-checklist.md) | 05 | GitHub Actions deploy to Pages from `main` only (guard re-checked before upload); README release checklist + rollback |

Parallel lanes after 03: {04 → 05 → 13, 17}, {04 → 12}, {06}, {07}, {08 → 09 → 10}, {11}. Then 14 → 15 → 16.

```
01 → 02 → 03 ─┬─ 04 ─┬─ 05 ─┬─ 13
              │      │      └─ 17
              │      └─ 12 ──────────┐
              ├─ 06 ─────────────────┤
              ├─ 07 ─────────────────┼─ 14 → 15 ─┐
              ├─ 08 ─┬───────────────┤           ├─ 16
              │      └─ 09 → 10 ─────┼───────────┘
              └─ 11 ─────────────────┘
```

## Decisions made in these tickets (binding for every engineer; Flame can overrule when approving)

1. **Placeholders:** every placeholder string in `site.ts` starts with `[Placeholder]` (the spec's rule, which the release guard relies on), and the renderer shows the marker as the neutral dashed tag (DESIGN §6). This puts more tags on the page than the prototype, which shows one per block. It is temporary: none of it ships.
2. **Release-guard markers:** `[Placeholder]`, `example.com`, `linkedin.com/in/placeholder` (the spec's three) plus the literal `Mock project` (the mock badge), so a real title on a card that still has the mock badge cannot go live. The guard scans every `.html` and `.txt` (RSC payload) file in `out/`.
3. **Commands and CI names** (README, CI and the deploy workflow all use them): `pnpm lint`, `pnpm typecheck`, `pnpm test` (Seam A), `pnpm build` (static export to `out/`), `pnpm test:site` (Seam B, after a build), `pnpm check:release` (the guard, after a build), `pnpm preview` (serve `out/` locally). Workflow `CI` with jobs `verify` and `release-guard`; workflow `Deploy`.
4. **One content file, one fixture:** ticket 02 writes the whole content shape and the whole placeholder content up front, plus one shared test fixture. Later tickets only read them, except 09 and 10, which add the mini-UI data they introduce.
5. **One component per section** from ticket 03, so the parallel section tickets each touch only their own section.
6. **Drawings:** the hero editor and the project mini-UIs are pictures (`role="img"` + label, inner markup `aria-hidden`, nothing focusable inside). Values the hero editor shows (name, role, pitch, GitHub, privacy path) come from `site.ts`, so the picture updates with Flame's copy. The window chrome (file names, `zsh`, keywords) lives in the component. Mini-UI data lives on the project in `site.ts`.
7. **Links:** all links open in the same tab (no "opens in a new tab" text needed). The glyph follows the target: ↗ when it leaves the site, → when it stays on it.
8. **In-page anchors:** on the home page, nav links are `#about` and so on; on privacy and 404 they are `/#about` and so on, and the logo goes to `/`.
9. **Motion verification:** jsdom runs no CSS animations, so ticket 14's motion criteria are checked by hand. The PR carries screenshots or recordings at 1440 and 390, with and without reduced motion and JS. Everything else is automated.
10. **Lighthouse:** every PR that changes a rendered page records Lighthouse mobile scores of the locally served static build (spec story 39). All four must be ≥ 90.

## Review Focus (the 5 conditions no test exercises that are most likely to bite a real visitor)

1. **Long real copy at 320 px and 200% zoom.** Examples: a long project title, a long organisation name, a long email address, an unbroken URL. Nothing may scroll sideways or clip, except the hero editor's lines, which end in an ellipsis. Owners: **06, 08, 11, 12**.
2. **Exact characters in the must-keep text.** The policy's straight apostrophes (`owner's`, U+0027), the Daedalus line's em dash (U+2014) and middle dot (U+00B7). React writes `'` as `&#x27;` in HTML, so built-site checks must compare decoded text. No formatter or typography step may change these characters. Owners: **04, 05**.
3. **JavaScript off, or the script fails.** The mobile menu still opens and its links work. Every revealed block is visible, and nothing waits for a scroll. Owners: **03, 14**.
4. **List counts at the edges.** 1 or 6 projects (an odd count leaves a single card in the last row), a single experience entry, a stack item without an icon, a project with an image but no links, an emptied list. Owners: **07, 08, 09, 11**.
5. **Deep link or reload on `/#experience`, Firefox (no scroll timelines), back/forward.** The heading lands under the sticky header (72 px, phone 56 px). Blocks above the screen are shown at once, not left hidden. Focus follows. Owners: **15** (and 03 for the offset).

## Questions for Flame (tickets are written to the recommendation; the answer changes only the ticket named)

- **Q1: Mobile menu (ticket 03).** DESIGN §6 names shadcn's Sheet. The spec asks for a menu that works without JavaScript unless you approve a client component, and Sheet needs JS. (a, **recommended**) A no-JS disclosure (`<details>`) styled like the design's top sheet, closed after a link tap by ticket 15's script. (b) shadcn Sheet as designed: a second client component, and the menu does nothing with JS off.
- **Q2: Project mini-UI motion (ticket 16).** The prototype loops each mini-UI with a pause button. That needs a lot of client JS, and WCAG 2.2.2 requires the pause button for a loop. (a, **recommended**) Each one plays once (about 3 s) when its card scrolls in, then rests on its final frame. No loop, so no pause button, and it reuses ticket 15's observer. (b) Loop as in the prototype, with a pause button: a bigger ticket, likely to be split. (c) Static final frame only: drop ticket 16.

## Changes
- 2026-11-12: first breakdown (17 tickets).

## Approval
- **Approved by Flame 2026-11-12.** Q1 mobile menu → **(a)** no-JS `<details>` menu styled as the design's top sheet (no shadcn Sheet). Q2 project mini-UIs → **(a)** play once (~3 s) when the card scrolls in, no loop, no pause button.
- Build order (one PR at a time, each merged into `develop` by Flame before the next starts): 01 → 02 → … → 17.
