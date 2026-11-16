# 09: Project visuals: panel, image, terminal and checklist

**What to build:** A project can now carry a picture under its card text, set in `site.ts`. The picture sits on a warm sand panel (228 px tall, 200 px on phones) with the soft sand mesh. It is either a real image Flame adds later (with required alt text) or one of the drawn mini-UIs from the design. This ticket builds two of them, each shown as its finished picture: a **terminal** that ran `go test ./...` with each package passing and a PASS line (first mock project), and a **checklist** "Due this week" with 3 of 5 ticked and its progress bar (second mock project). The third mini-UI is ticket 10; motion is ticket 16.

**Blocked by:** 08

**Design refs:** DESIGN.md §2 (`--frame`, `--frame-foreground`, `--frame-muted`; amber never on sand), §2b (project panel = `--frame` + the three radial gradients, the site's only gradient; `--frame-accent` decorative only), §5 (panel `rounded-lg`), §6 row Project card ("Optional panel… 228 px tall, phone 200 px"), §8 (focus ring on a lit frame is dark); `prototype/index.html` first two `article.proj` panels; the mini-UI styles in `prototype/assets/ui/base.css`, `terminal-run/fragment.css`, `checklist/fragment.css` (reference for the look: rebuild with Tailwind, don't copy the kit); screenshots home 1440 + 390.

**Decisions (binding):**
- The content type extends `visual` with demo kinds (README decision 6: the data lives on the project in `site.ts`):
  - `{ kind: "terminal", label, title, branch, command, results: { path, time }[] (1–5), summary }`. Prototype: title `booking/api`, branch `main`, command `go test ./...`, three results, summary `in 1.61s`.
  - `{ kind: "checklist", label, title, items: { text, done }[] (1–6) }`. The count "k of n" and the bar width come from `done`, not from extra fields.
  - `label` is the picture's accessible name (required).
- The image kind renders with explicit `width`/`height` (no layout shift), `loading="lazy"`, inside the same panel, using the `alt` from content. `next/image` with `unoptimized` or a plain `img`, whichever is simpler.
- Each mini-UI is its own self-contained window with its own ground (as in the prototype), drawn as the finished frame, `aria-hidden` inside the panel's `role="img"`. Nothing focusable inside; the prototype's "Apply"-style controls are not built.
- The mock content in `site.ts` gets a terminal visual on project 1 and a checklist on project 2, with the prototype's text. Mini-UI text inside a drawing does not carry `[Placeholder]`; the project's title and badge already mark it.
- Leave hooks for ticket 16: each output line, tick and the bar are separate elements with their index.

**Acceptance criteria:**
- [ ] Type tests: an `image` visual without `alt`, a terminal without `command`, and a checklist with 0 items are rejected by the compiler.
- [ ] Seam A (fixture): a project with an image visual renders an `img` with the fixture's `src`, `alt`, `width` and `height`, inside the panel.
- [ ] Seam A: a project with a terminal visual renders one element with role `img` named by its `label`, holding no focusable elements. Its hidden drawing contains the command and every result path.
- [ ] Seam A: a checklist with 5 items, 3 of them done, shows "3 of 5". With 0 done it shows "0 of 5", and with all done "5 of 5".
- [ ] **Review Focus 4:** a project with an image but no links renders the panel and no link row. A project with no visual (the 4th mock) still ends on its tags.
- [ ] Seam A: axe reports no violations on the home view.
- [ ] Manual check, with screenshots at 1440 and 390 in the PR: panels match the screenshots, including the sand mesh (gradient 2 is the only use of `--frame-accent`), the terminal and checklist windows, and the 228/200 px heights. No text or control on sand uses the amber or `--frame-accent`.
- [ ] Lighthouse mobile in the PR: all four ≥ 90, CLS 0 (panels have fixed heights, images have dimensions).
- [ ] Build, lint, type-check and tests pass.
