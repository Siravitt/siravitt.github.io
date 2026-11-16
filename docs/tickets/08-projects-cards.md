# 08: Projects section: cards

**What to build:** Projects sits on the slightly raised `--card` band and gets the most space. The heading "Projects." comes with its muted tagline, then the cards in a two-column grid (one column on phones). Each card shows its badge ("Mock project" for the mocks), its links ("Source code ↗", "Live demo"), the title, a one-line summary, a short description, Role and Outcome side by side, and the stack tags as one mono line joined by " · ". A project with missing optional fields draws nothing for them: the fourth mock card has no links and no picture and ends on its tags. Pictures (the sand panel) come in ticket 09.

**Blocked by:** 03

**Design refs:** DESIGN.md §4 (12-column grid, card spans 6), §6 rows Project card, Project card (bare), Text links; §6a `link` variant (underline `--border-strong` → `currentColor`, ↗/→ nudge); §8 Missing optional field; `prototype/index.html` `#projects`; screenshots home 1440 + 390.

**Decisions (binding):**
- The card is shadcn **Card** with no fill, border or padding (§6). The badge is a shadcn **Badge** `outline` (mono 13 px, muted). Tags are **not** badges.
- Link names: "Source code" gets the accessible name `<labels.sourceCode> for <title>`, and "Live demo" gets `<labels.liveDemo> of <title>`. The visible text stays the label, which satisfies label-in-name. The glyph is ↗ when the URL leaves the site and → when it stays on it. Same tab.
- Role and Outcome are a `<dl>` with the labels from `site.labels`.
- Each card carries its stagger index within its row (0, 1) for ticket 14. The hook only.
- Section shown only per the visible-sections rule (03).

**Acceptance criteria:**
- [ ] Seam A (fixture with 3 projects): three `article` elements in content order, each with an H3 title, its summary, its description, a Role and an Outcome term with their values, and its tags joined by " · ".
- [ ] Seam A: a project with `links.source` and `links.live` has two links with those `href`s, named "Source code for <title>" and "Live demo of <title>". A project with only `source` has exactly one link. A project with no `links` has no link and no empty link container.
- [ ] Seam A: a project without `badge` shows no badge, a project with `tags: []` shows no tag line, and a project with no `visual` shows no panel element.
- [ ] **Review Focus 4:** with 1 project the grid holds one card, and with 6 projects all six render in order. Manual screenshot of the odd count at 1440: the last card sits alone in the left column with no stretched or empty cell.
- [ ] **Review Focus 1:** with a 90-character title, a 60-character role and an unbroken 80-character URL in `links.live`, the page has no horizontal scroll at 320 px or at 200 % zoom. Long words wrap (manual, PR screenshot).
- [ ] Seam A: axe reports no violations on the home view.
- [ ] Manual check, with screenshots at 1440 and 390 in the PR: matches the screenshot's card typography and spacing (title 18/20 px 500, summary 500, description max 58ch, the mono tag line). Links show the hover underline and glyph nudge, and the focus ring is visible on the `--card` band.
- [ ] PR records Lighthouse mobile scores (all four ≥ 90).
- [ ] Build, lint, type-check and tests pass.
