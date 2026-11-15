# 19: Real content — replace every placeholder and mock in `site.ts`

**What to build:** Flame gave his real facts in a Q&A with Daedalus
(2026-11-16). Replace every `[Placeholder]` string, every `Mock project`
badge, the placeholder email and the placeholder LinkedIn URL in
`src/content/site.ts` with Flame's approved copy, verbatim, so the
README release checklist's "real content is in place" step passes:
`pnpm check:release` exits 0 for the first time.

**Blocked by:** 02 (content model), 09/10 (terminal/checklist/diff
visuals)

**Design refs:** none — content only, no layout, design or behaviour
change.

**Decisions (binding):**
- Every field Flame approved (person, meta, hero, sections, about,
  stack, the four projects, the three experience entries, contact,
  footer) is copied verbatim. No field is invented.
- `stack.groups` adds Kafka (`apachekafka`), Swagger (`swagger`) and
  Kubernetes (`kubernetes`) icons — copied from the Simple Icons set,
  same convention as the existing `public/icons/stack/*.svg` files, no
  new dependency. AWS has no icon (simple-icons dropped its glyph for a
  trademark request); its `StackItem` omits `icon` and uses the
  existing name-only row.
- None of the four projects carries a `badge` (the ticket's copy has no
  mock projects left). The former review-bot `diff` visual is
  re-pointed at this repo's own `src/content/site.ts`, with a
  `before`/`after` line that does **not** contain the literal
  `[Placeholder]` marker (it would trip the release guard inside the
  drawn text) — it reads `"Software developer (draft)"` instead.
- The Code Camp experience entry renders with `start`/`end` both
  `"2022"` (the component joins them as "`start` to `end`" with no
  other same-year format, so it reads "2022 to 2022" — accurate, since
  the bootcamp ran and ended inside 2022; Flame approved this literal
  pair and the component is unchanged).
- The current employer's name never appears anywhere in `src/`.

**Acceptance criteria:**
- [x] `grep -c "\[Placeholder\]" src/content/site.ts` returns 0; no
  `Mock project`, `example.com` or `linkedin.com/in/placeholder`
  anywhere in `src/content/site.ts`.
- [x] `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:release`
  all pass, `check:release` green for the first time.
- [x] `pnpm test:site` (built-site Seam B checks) passes.
- [x] `git grep -i -e arise -e infinitas -- src/` returns nothing.
- [x] No new dependencies, no secrets.
