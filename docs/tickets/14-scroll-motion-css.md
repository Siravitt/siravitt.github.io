# 14: Scroll motion (CSS layer)

**What to build:** The page comes alive as the visitor scrolls, with no animation library and no JavaScript. Ten effects arrive:
- a 2 px amber progress line along the header's bottom edge;
- a 2 px ink line under the nav word of the section in view;
- the hero's code lines type in on load;
- the hero's highlighted line steps down the file and the hero eases away at two depths;
- headings, rows, cards and entries rise in as they enter;
- the Stack tool rows assemble from both sides;
- the Experience rail draws down to a line 60 % down the screen and lights each dot as it passes;
- About's highlighted phrase brightens;
- in-page jumps glide.

Visitors who ask for reduced motion, have JavaScript off, print the page, or use a browser without scroll timelines all see the finished picture, the same as the design screenshots. Nothing shifts layout.

**Blocked by:** 06, 07, 08, 11, 12

**Design refs:** DESIGN.md §7 Rules, §7.1 rows 1–10, 12 and 13 (row 11 = ticket 16; row 14 = ticket 07's hover), §7.2 layers 1–2, §7.3, §7.4, §7.5 part 1 (smooth scroll only under `prefers-reduced-motion: no-preference`), §7.5 part 4; `prototype/scroll.css` sections "0. rest" and "1. native" (the "2. fallback" rules belong to ticket 15); screenshots `home-motion-1440-1-hero-exit.png`, `-2-stack-assemble.png`, `-3-timeline-draws.png`.

**Decisions (binding):**
- The rules from `scroll.css` "0. rest" + "1. native" move into one stylesheet of their own, imported by the root layout (not into the theme block of `globals.css`, to avoid a hotspot), with the `@keyframes` beside them. Tailwind arbitrary properties are fine where they are shorter.
- All scroll-linked rules sit inside `@media (prefers-reduced-motion: no-preference) and (scripting: enabled) { @supports (animation-timeline: view()) and (timeline-scope: --a) { … } }`. The hero type-in (row 3) is a plain load animation outside the `@supports`, still inside the reduced-motion guard.
- Stagger indices (`--i`) and `--dx`/`--dy` come from the hooks the section tickets left. The header gains the progress element and a nav-spy span per link (both `aria-hidden`).
- `timeline-scope` lists only the **visible** sections' timelines (visible-sections rule from 03), so a hidden section leaves no dangling timeline (§7.4).
- `scroll-behavior: smooth` on `<html>` only under `prefers-reduced-motion: no-preference` (Tailwind `motion-safe:scroll-smooth`).
- Only `transform` and `opacity` animate (plus the About phrase's colour, as designed). No pinning, snapping, wheel smoothing or scroll-jacking.
- Verification: jsdom does not run CSS animations, so the motion criteria are checked by hand with recorded evidence (README decision 9). The automated tests cover what renders.

**Acceptance criteria:**
- [ ] Seam A: the header contains a progress element and one nav-spy element per nav link, all hidden from the accessibility tree. The accessible names of the nav links are unchanged ("About", not "About" + extra text).
- [ ] Seam A: with `projects: []`, the root element's `timeline-scope` value (or the element that carries it) doesn't name the projects timeline.
- [ ] Seam A: axe reports no violations on the home view (decorative elements stay hidden).
- [ ] Manual, Chrome at 1440 and 390, recording or frame screenshots in the PR. Each §7.1 row 1–10 and 13 behaves as specified: progress 0→100 %; the nav line hands over between words in the 40–60 % band; code lines type in by about 1.4 s; the highlight steps from `name` to `privacy` (phone: to line 8) while the hero exits 0–60 %; the hero's three depths ease away; the reveals finish within each element's first 180 px; the Stack rows close in from both sides in reading order; the rail's tip sits on the 60 % line and dots light as it reaches them; the About phrase brightens; nav, logo and "See projects" jumps glide. The frames match the three `home-motion-*` screenshots.
- [ ] Manual, **Review Focus 3**: with DevTools "Emulate CSS prefers-reduced-motion: reduce", and separately with JavaScript disabled, the page looks like `home-desktop-1440.png` / `home-mobile-390.png`. Every block is visible, the rail is drawn, the dots are lit and the highlight is on `name`. Under reduced motion the nav line jumps instead of travelling and anchor jumps are instant.
- [ ] Manual: in a browser without scroll timelines (Firefox), nothing is hidden. The page shows the rest state; the fallback motion is ticket 15.
- [ ] Lighthouse mobile in the PR: all four ≥ 90 and CLS 0.
- [ ] Build, lint, type-check and tests pass.
