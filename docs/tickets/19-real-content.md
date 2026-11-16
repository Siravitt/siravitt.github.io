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
change. One comment-only edit touches component code:
`src/components/experience-section.tsx`'s stale key-choice comment
(it quoted `[Placeholder]`, which this ticket removes) — no JSX or
logic changed.

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
  mock projects left).
- **Visual mapping (diff/terminal swap):** the diff window's
  file-header chrome always draws a hard-coded Go mark
  (`project-visual.tsx`), so the diff visual sits on **Loan
  workflow APIs** (a real Go file, `internal/loan/service.go`, no
  company or product named) instead of on this repo's own `site.ts`.
  **This portfolio** gets the terminal visual instead (`pnpm test`
  against this repo). The diff's hunk header (`@@ -12,6 +12,6 @@`)
  matches the component's fixed drawn line numbers 13–16, the same
  pairing the pre-ticket-19 content used.
- **`meta.title`:** changes to
  `"Siravit Tanratanavijit: software engineer portfolio"` to match
  the approved `person.role` ("Software Engineer"). The two
  `*.alt.txt` files (`src/app/opengraph-image.alt.txt`,
  `twitter-image.alt.txt`) are updated with it — `tests/site/meta.test.ts`
  guards that the built OG/Twitter alt text equals `site.meta.title`.
- The Code Camp experience entry renders with `start`/`end` both
  `"2022"` (the component joins them as "`start` to `end`" with no
  other same-year format, so it reads "2022 to 2022" — accurate, since
  the bootcamp ran and ended inside 2022; Flame approved this literal
  pair and the component is unchanged). Daedalus is separately checking
  with Flame whether he wants exact months instead; no change here
  until that lands.
- The current employer's name (the short list Daedalus holds) appears
  nowhere in the repo — not in `site.ts`, not in this ticket file, and
  not in any commit message or PR body on this branch.
- The release guard's markers (`[Placeholder]`, `example.com`,
  `linkedin.com/in/placeholder`, `Mock project`) are checked only
  against `src/content/site.ts` in the acceptance criteria below,
  because `src/lib/release-guard.ts` itself legitimately holds those
  four literal strings as its scan patterns — a repo-wide search for
  them would always "find" the guard's own source.

**Acceptance criteria:**
- [x] `grep -c "\[Placeholder\]" src/content/site.ts` returns 0; no
  `Mock project`, `example.com` or `linkedin.com/in/placeholder`
  anywhere in `src/content/site.ts`.
- [x] `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:release`
  all pass, `check:release` green for the first time.
- [x] `pnpm test:site` (built-site Seam B checks) passes.
- [x] A repo-wide, case-insensitive search for the current employer's
  name returns nothing.
- [x] No new dependencies, no secrets.
