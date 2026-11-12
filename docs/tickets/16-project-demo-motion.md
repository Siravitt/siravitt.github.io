# 16: Project mini-UI motion (play once)

**What to build:** When a project card scrolls into view, its drawn mini-UI plays its little story once and then rests on the finished picture already on the page. The terminal types `go test ./...`, its results stream in with ticks, and PASS appears. The checklist ticks its items and fills its bar to "3 of 5". The review window shows the old line, then the suggestion lands and the chip turns to "Applied". Each run takes about 3 s. There is no loop, so no pause button is needed (WCAG 2.2.2 only applies to motion lasting more than 5 s). With reduced motion or JavaScript off, the picture is simply finished.

**Written to Q2's recommended answer (a).** If Flame picks (b) loop + pause button, this ticket is rewritten and probably split. If he picks (c) static only, it is dropped.

**Blocked by:** 10, 15

**Design refs:** DESIGN.md §7.1 row 11 (adapted: once instead of a loop), §7 Rules (transform/opacity only, `--ease-enter`), §7.3 (reduced motion: final frame); the kit fragments `prototype/assets/ui/terminal-run/fragment.js`, `checklist/fragment.js`, `diff-review/fragment.js` (reference for the story of each run, not code to port); screenshots home 1440 (cards at rest = the final frame).

**Decisions (binding):**
- The trigger comes from `<ScrollMotion />` (15). In **every** browser where motion is allowed, its observer adds `is-in` to a project's visual the first time the visual is 15 % in view. Blocks already above the viewport are marked at once and show the final frame. This extends the existing component; it adds no second one.
- The runs are CSS keyframes with per-element delays from the indices ticket 09/10 left (type-in = characters revealed with `steps()` on the mono command; lines and ticks = opacity/transform; bar = `scaleX`). Total ≤ 3.2 s per visual, `animation-fill-mode: both`, one iteration.
- The hidden start states exist only under a class that the script adds (`sm-io` or a sibling class), never at rest, so without JS nothing is ever hidden.
- No element changes its box size during a run (CLS 0). Text that "arrives" is already in the DOM and only fades or moves in.

**Acceptance criteria:**
- [ ] Test: with motion allowed, a project visual gets `is-in` when its observer entry intersects, and a visual above the viewport gets it at once.
- [ ] Test: with `prefers-reduced-motion: reduce`, no visual gets `is-in` and no start-state class is added to the root.
- [ ] Seam A: the visuals' accessible names and hidden text are unchanged by this ticket (09/10 tests stay green).
- [ ] Manual, Chrome and Firefox at 1440 and 390 (PR recording). Each of the three visuals plays its run once when its card scrolls in, finishes in ≤ 3.2 s on the same picture as the screenshot, and does not replay on scrolling back. Under reduced motion and with JS off, the final frame shows at once.
- [ ] Lighthouse mobile in the PR: all four ≥ 90, CLS 0.
- [ ] Build, lint, type-check and tests pass.

> **Flame's decision (2026-11-12):** option (a) — each mini-UI plays once (~3 s) when its card scrolls in; no loop, no pause button.
