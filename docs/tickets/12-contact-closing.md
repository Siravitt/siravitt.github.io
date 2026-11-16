# 12: Contact closing footer

**What to build:** The home page closes on Contact, which is also the page's footer. It shows the H2 "Contact", an optional lead line, and the GitHub and LinkedIn profile links, each with its one-colour logo. Then comes the big keycap "Email Siravit ↵" button: half the container wide on desktop, full width on phones. Below it, a short lede and two link columns: **Sections** (the visible sections) and **Elsewhere** (GitHub, LinkedIn). The legal row from 04 sits at the very bottom. A recruiter can reach Siravit in one click from here.

**Blocked by:** 04

**Design refs:** DESIGN.md §6 rows Contact / footer, Text links, Primary CTA; §6a `size xl` (`h-16 xl:h-[72px]`, display face 20–26 px, `justify-between`, key chip 30 px); §6 Icons (GitHub from gilbarbara/logos CC0, LinkedIn from Simple Icons 10.4.0 CC0, both one-colour, `fill="currentColor"`, 20 px); `prototype/index.html` `<footer class="footer closing">`; `prototype/assets/icons/github.svg`, `linkedin.svg`; screenshots home 1440 + 390 (bottom).

**Decisions (binding):**
- This fills the `<footer id="contact">` shell from 03, above 04's legal row. The H2 is the section title from content.
- The two logos are inline SVGs with `fill="currentColor"` (they follow the link colour), decorative (`aria-hidden`). Link names are `contact.githubLabel` / `contact.linkedinLabel`, with ↗ (they leave the site). Same tab.
- The Sections column lists the visible sections except Contact (visible-sections rule from 03), as `#id` links named by the section titles. Elsewhere lists GitHub and LinkedIn. Column headings come from `footer.sectionsHeading` / `footer.elsewhereHeading`.
- No email address is shown as text: the button is the `mailto:` link (as designed).

**Acceptance criteria:**
- [ ] Seam A (fixture): the page's last landmark is a footer containing an H2 with the contact title, plus links named by the fixture's `githubLabel` and `linkedinLabel` with the fixture URLs as `href`s.
- [ ] Seam A: the footer has a link named exactly the fixture's `contact.emailLabel` with `href` `mailto:` + the fixture email; its key chip is hidden from the accessibility tree.
- [ ] Seam A: with `contact.intro` absent, no lead paragraph is rendered.
- [ ] Seam A: the Sections column links the fixture's About, Stack, Projects and Experience titles with `href`s `#about`, `#stack`, `#projects` and `#experience`. With `projects: []` it lists no Projects link.
- [ ] Seam A: the Daedalus legal row still renders after the columns (04's test stays green).
- [ ] Seam A: axe reports no violations on the home view.
- [ ] **Review Focus 1:** with a 60-character email address and a 30-character `emailLabel`, the xl button and the page have no horizontal scroll at 320 px or 200 % zoom (manual, PR screenshot).
- [ ] Manual check, with screenshots at 1440 and 390 in the PR: matches the bottom of the screenshots. The xl keycap is half width at ≥ 640 px and full width below, with its label left and the key right. Logos are white on the dark footer, and links show their hover underline and ↗ nudge.
- [ ] README credits add the GitHub (gilbarbara/logos, CC0-1.0) and LinkedIn (Simple Icons 10.4.0, CC0-1.0) marks.
- [ ] PR records Lighthouse mobile scores (all four ≥ 90).
- [ ] Build, lint, type-check and tests pass.
