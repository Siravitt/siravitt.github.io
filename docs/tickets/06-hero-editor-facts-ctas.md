# 06: Hero: editor picture, facts and calls to action

**What to build:** The first screen is the finished hero. On the left: the role line, the H1 name and the pitch (from 01), a primary keycap "Email Siravit" and a secondary "See projects ↓" that jumps to Projects. On desktop, a facts row follows (Works in / Code / Based in). On the right, a warm sand "lit" frame holds a drawn code editor showing this site's own `site.ts`, with a "Deploy to GitHub Pages" card overlapping it. The editor shows the live values from `site.ts` (name, role, pitch, GitHub, privacy path), so the picture updates when Flame writes his copy. Screen readers get the picture as one image with a label.

**Blocked by:** 03

**Design refs:** DESIGN.md §1, §2 (`--frame` sand, code colours, highlighted line: 2 px `--primary` edge on `--primary-tint`), §2b (hero frame = flat `--frame`), §4 (< 1024: hero stacks, facts hidden; < 640: editor drops its file tree and shows the first 8 lines), §6 rows Primary CTA, Secondary, Hero facts, Hero editor; §6a (phones: primary full width, secondary becomes an underlined text link); §8 focus on a lit frame (dark ring); `prototype/index.html` `<section class="hero">`; screenshots home 1440 + 390, `home-motion-1440-1-hero-exit.png` (for 14).

**Decisions (binding):**
- The art is `role="img"` with the accessible name `site.hero.artLabel`. Everything inside is `aria-hidden`, with no focusable elements.
- Editor lines (14, as in the prototype): comment `// src/content/site.ts`; `export const site = {`; `person: {`; `name: "…"`; `role: "…"`; `pitch: "…"`; `},`; `contact: {`; `github: "…"` (shown without `https://`); `},`; `daedalus: {`; `privacy: "…"`; `},`; `} satisfies Site;`. The quoted values come from `site`; keywords, file tree, window title (`siravitt.github.io`) and the deploy card text are drawing chrome in the component. The highlight bar sits on line 4 (`name`) at rest. Each line carries its index so ticket 14 can stagger the type-in, and the highlight is its own element so 14 can move it.
- A value longer than its line ends in an ellipsis on one line; it never wraps or widens the editor.
- The facts come from `site.hero.facts` (0–3), and a fact with `href` renders as a text link (↗ when it leaves the site). An empty list renders no facts row and no separator.
- "See projects" is rendered only when the Projects section is visible (visible-sections rule from 03), so it never points at a missing anchor.

**Acceptance criteria:**
- [ ] Seam A (fixture): the hero has the role, the H1 name and the pitch in that DOM order. It has a link named by the fixture's `contact.emailLabel` with `mailto:` + the fixture email, and a link named by `hero.secondaryLabel` with `href="#projects"`.
- [ ] Seam A: with `projects: []`, the "See projects" link is absent.
- [ ] Seam A: an element with role `img` is named by the fixture's `artLabel` and contains no focusable elements.
- [ ] Seam A: the facts list renders each fixture fact as term + definition, a fact with `href` renders as a link to that URL, and with `facts: []` no description list is rendered.
- [ ] Seam A: the editor drawing contains the fixture's name, role and pitch values. When the content changes, the drawing changes with it; no hard-coded name in the drawing.
- [ ] Seam A: axe reports no violations on the home view.
- [ ] **Review Focus 1:** with a 200-character pitch and a 60-character role in the fixture, the page has no horizontal scroll at 320 px and at 200 % zoom (manual, PR screenshot). The editor lines end in an ellipsis.
- [ ] Manual check, with screenshots at 1440 and 390 in the PR, against `screenshots/home-desktop-1440.png` / `home-mobile-390.png`: the two-column layout at ≥ 1024 px and the stacked one below it; the facts row is desktop only; on phones the file tree is hidden and only the first 8 lines show; the deploy card overlaps the editor; the highlighted line is on `name`.
- [ ] Nothing in the hero causes layout shift on load (Lighthouse CLS 0 in the PR's Lighthouse run; all four scores ≥ 90).
- [ ] Build, lint, type-check and tests pass.
