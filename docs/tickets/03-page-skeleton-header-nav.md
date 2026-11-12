# 03: Page skeleton, header and navigation

**What to build:** A visitor on the home page gets a sticky header. Its skip link, the "S" mark + name (back to top), the in-page nav to About, Stack, Projects, Experience and Contact, and the keycap "Email Siravit" button all work with the keyboard. On phones (< 1024 px) the same links sit behind a menu button that works **without JavaScript**. Each nav word jumps to its section, which already exists as a shell: anchor id, one H2 with the section's title, and the right spacing. The section stops right under the header. When Flame empties `projects`, `experience` or `stack`, that section and its nav link both disappear. This ticket also brings the button variants every later ticket uses.

**Blocked by:** 02

**Design refs:** DESIGN.md §4 (container, nav height 72/56 px, breakpoints: surname hidden < 1280, menu < 1024; jump offset), §6 rows Nav bar, Mobile menu, Skip link, Primary CTA, Secondary; §6a (Buttons: keycap `default` with the ↵ key chip, `secondary` = active line with ↓, `link`, `size: xl`; reduced-motion rules); §7.1 row 12 (nav word underline sweep), §7.5 parts 2–3 (scroll-margin, section focus bar); §8 (Focus, Hover, Empty list, Tap targets); `prototype/index.html` `<header class="nav">`; screenshots home 1440 + 390 (top bar).

**Decisions (binding):**
- **Mobile menu (Q1, recommended answer):** a no-JS disclosure (`<details>`/`<summary>`) styled as the design's top sheet: the menu button is 44×44, then the same five links in 48 px rows and the primary button full width. Ticket 15 closes it after a link tap. If Flame picks shadcn Sheet instead, this part becomes a client component, and the JS-off criterion below is dropped.
- Section shells are one component per section (`hero`/`#top` on `<main>`, then `about`, `stack`, `projects`, `experience`, and `contact` as the page's closing `<footer id="contact">`). Each takes its slice of the content and renders the shell and H2. Bodies are left for tickets 06, 07, 08, 11 and 12, so each of those touches only its own section.
- One pure function decides the visible sections from the content: `projects`, `experience` and `stack` are hidden when their list is empty (a stack group with no items doesn't count). About and Contact always show. The nav, the footer's Sections column (12) and the motion timelines (14) all use it.
- The H2 renders `Title.` followed by the muted `tagline` when one is set (prototype "Stack. The languages…"), and `Title` alone otherwise. The nav word is the `title`.
- Every section shell carries `tabIndex={-1}`, `scroll-margin-top` = header height (72 px, phone 56 px) and the keyboard focus style from §7.5 (a 2 px `--ring` inset bar down its left edge, no outline).
- The header component takes the page context. On home, the links are `#about` and so on, and the logo is `#top`. On other pages (ticket 04) the links are `/#about` and the logo is `/`.
- Buttons come from shadcn's Button (cva) edited per §6a, plus a small `Kbd` chip (`aria-hidden`). The accessible name is the label only. No key handlers.

**Acceptance criteria:**
- [ ] Seam A (fixture): the nav has accessible name "Main" and five links named by the fixture's section titles, in order, with `href` `#about`, `#stack`, `#projects`, `#experience` and `#contact`. The sections exist with those ids, in that order, each with exactly one H2 named after its title. The page still has exactly one H1.
- [ ] Seam A: with `projects: []` the Projects section and its nav link are both absent, and likewise for `experience: []` and `stack: []` (also a stack whose groups all have no items). About and Contact stay.
- [ ] Seam A: the skip link "Skip to content" is the first focusable element and targets `#top`. The logo link's accessible name contains the full name (`Siravit Tanratanavijit`) even where the surname is visually hidden. The header's Email link has `href` `mailto:` + the fixture email, and its accessible name is exactly the fixture's `contact.emailLabel` (the ↵ chip is hidden from the accessibility tree).
- [ ] Seam A: the menu control is reachable by keyboard, is named from `labels.menu`, exposes its expanded/collapsed state, and contains the same five links and the Email button.
- [ ] Seam A: axe reports no violations on the home view.
- [ ] Manual (PR screenshots, 1440 + 390). The header is sticky: 72 px on desktop and 56 px on phones, `--background` at 90 % with blur and a bottom hairline. The surname is hidden below 1280 px and the nav collapses into the menu below 1024 px. The keycap shows hover (chip sinks, 1 px lift), press and focus-visible (2 px `--ring`, 2 px offset) as in §6a, and under reduced motion only colours and shadows change. Activating a nav word lands the section's top at 72 px (56 px on phones), and keyboard focus on the section shows the inset bar.
- [ ] **Review Focus 3:** with JavaScript disabled in the browser, the phone menu opens and closes and each link jumps to its section (PR note).
- [ ] Every link and button is at least 44 px tall on touch (tap targets, §8).
- [ ] PR records Lighthouse mobile scores (all four ≥ 90).
- [ ] Build, lint, type-check and tests pass.

> **Flame's decision (2026-11-12):** mobile menu = option (a), a no-JS `<details>` menu styled as the design's top sheet. Do not use shadcn Sheet.
