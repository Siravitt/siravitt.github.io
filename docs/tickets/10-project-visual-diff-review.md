# 10: Project visual: diff review

**What to build:** The third mock project ("Pull request review bot") gets its picture: a drawn code-review window on the sand panel. It shows the file header (Go mark, `reviewbot / internal/retry.go`, the +/− stat), the hunk line, the changed line with the old call marked, the bot's suggested replacement line, and the bot's comment thread ("reviewbot · now", an "Applied" chip, "Pass `ctx` so a cancel stops the retry."), followed by three context lines. It is drawn as the finished picture, with the suggestion applied. Motion is ticket 16.

**Blocked by:** 09

**Design refs:** DESIGN.md §2 (code colours: keyword `#ff9f7a`, function `#e9ecef`, string `#a5e3a0`, comment `#7d8590`, plain `#c9d1d9`), §2b, §6 Icons (the small Go mark is a gilbarbara/logos CC0 file); `prototype/index.html` third `article.proj` panel; `prototype/assets/ui/diff-review/fragment.css` + `base.css` (reference for the look: rebuild with Tailwind); `prototype/assets/icons/go.svg`; screenshot home 1440 (third card) + 390.

**Decisions (binding):**
- The content type extends `visual` with `{ kind: "diff", label, repo, dir, file, hunk, signature, before, after, marked: { before, after }, author, authorInitials, time, comment, context: string[] (0–4) }`. `before`/`after` are the changed line's code. `marked.before`/`marked.after` are the substrings drawn highlighted in each (prototype: `context.Background()` → `ctx`). `comment` may hold one inline-code span, written with backticks in the content and rendered as `<code>`.
- Line numbers and the +/− counts are fixed drawing chrome (prototype: 13/14/15/16, +2/−2), not content.
- Syntax colour: plain code colour throughout, plus the keyword colour for a small fixed set of Go keywords (`if`, `nil`, `return`, `func`) and the function colour for an identifier directly before `(`. If that tokenizer grows past ~20 lines, plain colour + the marked word is acceptable; say so in the PR.
- The Go mark goes to `public/icons/` unchanged and stays decorative (empty alt, inside the hidden drawing).
- The "Apply suggestion" button is **not** built: the static picture shows the "Applied" chip. Nothing focusable inside.
- Mock content: project 3 in `site.ts` gets this visual with the prototype's text.

**Acceptance criteria:**
- [ ] Type tests: a diff visual without `before` or without `label` is rejected by the compiler.
- [ ] Seam A (fixture): a project with a diff visual renders one element with role `img` named by its `label`, with no focusable elements inside. The hidden drawing contains the repo, the file name, both code lines and the comment text, with the backticked span rendered as a `code` element.
- [ ] Seam A: when `marked.before` is not found in `before`, the line renders in full with no highlight (no crash, no missing text).
- [ ] Seam A: axe reports no violations on the home view.
- [ ] **Review Focus 1:** with a 120-character `before` line, the drawing clips inside its window and the page gets no horizontal scroll at 320 px (manual, PR screenshot).
- [ ] Manual check, with screenshots at 1440 and 390 in the PR: matches the third card of the screenshots (window anchored to the panel's corner with the fade at the bottom, as in the prototype).
- [ ] README credits add the gilbarbara/logos Go mark (CC0-1.0).
- [ ] PR records Lighthouse mobile scores (all four ≥ 90).
- [ ] Build, lint, type-check and tests pass.
