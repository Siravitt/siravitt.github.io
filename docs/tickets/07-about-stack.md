# 07: About and Stack sections

**What to build:** Below the hero, About shows a muted "About" heading over one large statement with a highlighted phrase, then up to two shorter paragraphs side by side. Stack shows "Stack." with its muted tagline and intro. On the left, the tools are listed as rows: group name, then the items. On the right, a dark panel shows the same tools as two columns of rows, each with a one-colour mark and the tool's name in mono, like an editor's side bar. On hover the mark turns amber-yellow. Flame edits groups and items in `site.ts` and both views follow. An item without an icon keeps its row with the name only.

**Blocked by:** 03

**Design refs:** DESIGN.md §3 (About statement = H2 size, 500), §6 rows About statement, Stack list, Stack marks panel; §6b (the whole table: panel, grid, row tile, mark as CSS mask, name, hover, a11y, data; < 1024 the panel stacks under the list; < 640 it loses its frame); §8 (Hover: Stack rows; not links, not focusable); `prototype/index.html` `#about`, `#stack`; `prototype/assets/icons/stack/*.svg` + `icons-credits.json`; screenshots home 1440 + 390.

**Decisions (binding):**
- The About highlight is `about.highlight`, located inside `about.statement`. At rest it shows in `--primary` per the screenshot; the scroll colour change is ticket 14. If the phrase isn't in the statement, the statement renders plain.
- The ten SVGs go to `public/icons/stack/` unchanged (copied assets, not counted in the line budget). The mark is drawn as a CSS mask filled with `currentColor` (or an inline SVG; either renders the same, §6b). No icon library or `simple-icons` dependency.
- The marks panel lists the items flattened across groups, in content order. It is `role="img"` with the accessible name "The marks of the tools in the list" (no count, so it stays true when the list changes), and its inner list is `aria-hidden`.
- Each row and each tile carries its stagger index, and each tile its column direction (`--dx` ±24 px, `--dy` 16 px), for ticket 14. The hooks only; no animation here.
- Stack is rendered only when the visible-sections rule says so (03). Empty groups are skipped.

**Acceptance criteria:**
- [ ] Seam A (fixture): the About section's H2 is "About". The statement text is present, and the fixture's highlight phrase is inside it as its own emphasised element (`<strong>`). With a highlight not found in the statement, the statement text is still complete and has no emphasis. Each extra paragraph renders, and with `paragraphs: []` none do.
- [ ] Seam A: the Stack H2 reads `Stack.` followed by the fixture tagline. The list renders each group's name with its items in order, comma-separated as in the prototype.
- [ ] Seam A: one element with role `img` is named "The marks of the tools in the list". Its tool names are not exposed a second time to the accessibility tree, and it holds no focusable elements.
- [ ] **Review Focus 4:** a fixture item without `icon` still renders its row in the panel with its name. A group with no items is skipped, and a stack where every group is empty hides the section (and its nav link).
- [ ] Seam A: axe reports no violations on the home view.
- [ ] Manual check, with screenshots at 1440 and 390 in the PR: matches the screenshots. The panel sits top-aligned on the right half at ≥ 1024 px, stacks under the list below that, and has no frame below 640 px. Rows are 64/88/48 px tall per §6b. Hover turns the border to `--border-strong`, the mark to `--primary` and the name to `--foreground`, with no lift. The marks render over `pnpm preview` (same origin).
- [ ] README credits list the Simple Icons marks (CC0-1.0; trademarks stay their owners').
- [ ] PR records Lighthouse mobile scores (all four ≥ 90).
- [ ] Build, lint, type-check and tests pass.
