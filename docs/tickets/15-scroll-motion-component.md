# 15: ScrollMotion: focus after jumps and the fallback

**What to build:** This ticket adds the site's one client component, `<ScrollMotion />`, rendered once in the root layout. It renders nothing visible. Its first job runs in every browser, including under reduced motion. After any in-page jump (nav words, logo, "See projects", footer Sections, skip link, back/forward between sections), keyboard focus moves to the section, so the next Tab continues from there and a screen reader reads it. The glide, the hash and the history entry stay the browser's own. Its second job: in browsers without CSS scroll timelines (Firefox today, older Safari), it drives the same motion as ticket 14 with one IntersectionObserver and one rAF-throttled scroll read. Its third job: an in-page link tapped inside the open mobile menu closes the menu.

**Blocked by:** 14

**Design refs:** DESIGN.md §7.2 layer 3, §7.3, §7.4 "One client component", §7.5 part 3 (focus follows the jump: `tabindex="-1"` if missing, `focus({ preventScroll: true })`, left click without modifier keys + `hashchange`, one frame later), §7.5 part 4; `prototype/scroll.js` (the whole body; parts 0, 1, 2) and `prototype/scroll.css` section "2. fallback" (the `html.sm-io` rules).

**Decisions (binding):**
- One `"use client"` component returning `null`, with its effects mirroring `scroll.js`. Every effect returns a cleanup that disconnects the observer, removes the listeners and removes `sm-io`. No other client JS is added.
- The order of exits is fixed: focus handling is set up first and always. The fallback then exits if reduced motion is requested, if `CSS.supports('animation-timeline: view()')` **and** `CSS.supports('timeline-scope: --a')` are both true, or if `IntersectionObserver` is missing.
- Hidden states live only under `html.sm-io`, which only this component adds, so a failed script hides nothing. The fallback CSS goes into ticket 14's motion stylesheet.
- Menu close: a click on `a[href^="#"]` inside the header's open disclosure removes its `open` state (Q1 answer a). If Flame chose Sheet in Q1, this part is dropped.
- Tests stub `matchMedia`, `CSS.supports`, `IntersectionObserver` and `requestAnimationFrame` (browser boundaries, per Standards §6.3).

**Acceptance criteria:**
- [ ] Test: clicking a link with `href="#projects"` moves focus, one animation frame later, to the element with id `projects`. That element now has `tabindex="-1"` if it had none, and focus was called with `preventScroll: true`.
- [ ] Test: a `hashchange` to `#experience` moves focus to that section.
- [ ] Test: a click with Ctrl, Meta, Shift or Alt held, a non-left button, or an already default-prevented click does not move focus. A hash naming no element does nothing and throws nothing.
- [ ] Test: with `prefers-reduced-motion: reduce`, focus handling still works and `sm-io` is **not** added.
- [ ] Test: when both `CSS.supports` checks are true, `sm-io` is not added and no observer is created. When either is false, `sm-io` is added and every `[data-rv]` block plus the stack board is observed.
- [ ] Test (**Review Focus 5**): an observed block whose top is already above the viewport (a deep link or a jump past it) gets `is-in` at once, even though it isn't intersecting.
- [ ] Test: tapping an in-page link inside the open menu closes the menu.
- [ ] Test: unmounting removes `sm-io`, disconnects the observer and removes the listeners (a later click focuses nothing).
- [ ] Manual, Firefox at 1440 and 390 (PR recording). Reveals, stack assemble, rail + dots, hero steps and parallax, progress line and the nav's current word all play through the fallback. Opening `/#experience` directly or reloading there shows Experience and everything above it, with no hidden block, and the heading sits under the 72/56 px header. Back/forward between sections moves focus.
- [ ] Manual, Chrome with keyboard only: Tab to "Projects" in the nav, press Enter, press Tab. Focus lands on the first link inside Projects, and the section showed the inset focus bar.
- [ ] Lighthouse mobile in the PR: all four ≥ 90 (the component adds no measurable blocking time).
- [ ] Build, lint, type-check and tests pass.
