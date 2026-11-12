# 11: Experience timeline

**What to build:** Experience shows Siravit's roles as a timeline. A thin rail runs down the left with one dot per entry. Each entry gives its period in mono ("Month Year to Present" or "Month Year to Month Year"), a "Current" badge on a role with no end date, the role and organisation as an H3, 2–4 highlights, and an optional line of stack tags. At rest the rail is fully drawn and every dot lit; ticket 14 makes them follow the scroll. Below 1024 px the period moves above the role.

**Blocked by:** 03

**Design refs:** DESIGN.md §4 (< 1024: period above the role), §6 rows Experience item, Experience timeline (rail 2 px at `left-[7px]`, track `--border`, fill 60 % ink; dot 12 px, unlit ring vs lit `--primary` with 4 px `--background` cut-out; "Current" Badge `outline`, `--primary` text, 55 % `--primary` border), §2a (badge border 3.85:1), §8 Missing optional field; `prototype/index.html` `#experience` + `.exp` rules in `scroll.css` "0. rest"; screenshots home 1440 + 390, `home-motion-1440-3-timeline-draws.png` (for 14).

**Decisions (binding):**
- Markup: an `<ol>` of entries. The rail and dots are pseudo-elements or `aria-hidden` spans; decoration is never announced.
- Period text: `start` + " to " + (`end` or `labels.present`). The "Current" badge (`labels.current`) shows only when `end` is absent.
- H3 text: `role · organisation` (U+00B7 with spaces, as in the prototype).
- Each entry carries its stagger index for ticket 14, and the list exposes a hook for the rail's view timeline. Hooks only; no animation here.
- Section shown only per the visible-sections rule (03).

**Acceptance criteria:**
- [ ] Seam A (fixture with a current and an ended entry): an ordered list with one item per entry in content order. Each item has an H3 `role · organisation`, its period text, and a list of its highlights in order.
- [ ] Seam A: the current entry's period ends with the fixture's `present` label and shows the `current` badge text. The ended entry shows its end date and no badge.
- [ ] Seam A: an entry with tags shows them joined by " · ", and an entry without tags has no tag line.
- [ ] **Review Focus 4:** with a single entry the list renders one item, and the rail still draws from its dot downward without overflowing the section (manual screenshot). With `experience: []` the section and its nav link are absent (already covered by 03's rule; assert once here with this section's markup).
- [ ] **Review Focus 1:** with a 70-character organisation name and a 140-character highlight, there is no horizontal scroll at 320 px or 200 % zoom (manual, PR screenshot).
- [ ] Seam A: axe reports no violations on the home view.
- [ ] Manual check, with screenshots at 1440 and 390 in the PR: matches the screenshots. The rail is fully drawn, all dots are lit, each dot sits on its period's line, and the badge outline is visible.
- [ ] PR records Lighthouse mobile scores (all four ≥ 90).
- [ ] Build, lint, type-check and tests pass.
