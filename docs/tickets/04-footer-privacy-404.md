# 04: Footer, privacy page and 404

**What to build:** Every page ends with the legal row: the © line and the must-keep line "Daedalus — personal assistant app used only by its owner · Privacy", where "Privacy" links to exactly `/privacy.html`. `https://siravitt.github.io/privacy.html` becomes a restyled page in the site's shell, with a "Back to the portfolio" link, the H1 "Privacy Policy" and the policy text **verbatim**, nothing added. A mistyped URL gets the styled 404 page with a way home. The legacy root `index.html` and `privacy.html` leave `develop`; their text already lives in `site.daedalus`.

**Blocked by:** 03

**Design refs:** DESIGN.md §6 rows Daedalus line, Privacy page, 404 page; §8 "Current page" (`aria-current="page"` on Privacy on the privacy page); `prototype/privacy.html`, `prototype/404.html`, `.footer__legal` in `prototype/index.html`; screenshots `privacy-*`, `404-*`.

**Decisions (binding):**
- The privacy page is a normal App Router route named `privacy`, which the export writes as top-level `out/privacy.html` (`trailingSlash` stays `false`). No raw `privacy.html` goes into `public/`.
- The 404 is Next's not-found page, which the export writes as `out/404.html`; Pages serves it for unknown paths.
- Privacy and 404 reuse the header from 03 in "other page" mode (nav links `/#about`…, logo `/`), with the visible-sections rule applied, plus a slim footer that holds only the legal row. Home shows the legal row at the bottom of its closing `<footer id="contact">`; ticket 12 fills the content above it.
- Every string comes from `site` (`daedalus`, `footer.legal`, `labels.backToPortfolio`, `notFound`).
- Metadata: privacy gets its own title (`Privacy Policy` + site name), a description, and canonical `/privacy.html` (absolute through `metadataBase`). The 404 gets the title `Page not found` and `robots: noindex`.

**Acceptance criteria:**
- [ ] Seam A (fixture): the home view, the privacy view and the 404 view each contain a paragraph whose text is the fixture's Daedalus line + " · " + the privacy label, with a link named by the privacy label whose `href` is exactly `/privacy.html`.
- [ ] Seam A: the privacy view has exactly one H1 with the policy heading. Its main content holds exactly three things: the back link to `/`, the H1 and the policy text. The policy text equals the fixture's policy text exactly. On the privacy view the Privacy link has `aria-current="page"`, and on home it has no `aria-current`.
- [ ] Seam A: the 404 view has one H1 "Page not found" (from the fixture), its line of text, and a link to `/` named by `notFound.actionLabel`. The decorative "404" is hidden from the accessibility tree.
- [ ] Seam A: on the privacy and 404 views, the nav links point to `/#about` and so on, and the logo points to `/`.
- [ ] Seam A: axe reports no violations on the privacy and 404 views.
- [ ] **Review Focus 2:** the rendered policy text keeps its straight apostrophes (U+0027, not ’), and the Daedalus line keeps U+2014 and U+00B7 (asserted with code-point literals in the test). Nothing in the toolchain rewrites them.
- [ ] `pnpm build` emits `out/privacy.html` as a file (no `out/privacy/` folder) and `out/404.html`. Shown as `ls out` output in the PR; ticket 05 automates it.
- [ ] The legacy root `index.html` and `privacy.html` are deleted. The README notes that the live site keeps serving them from `main` until the release.
- [ ] Manual (PR screenshots, 1440 + 390): privacy and 404 match `screenshots/privacy-*` and `404-*`; the legal row's Daedalus line is 14 px `--muted-foreground` with an underlined `--foreground` Privacy link, visible (not collapsed).
- [ ] PR records Lighthouse mobile scores for `/`, `/privacy.html` and `/404.html` (all four ≥ 90 each).
- [ ] Build, lint, type-check and tests pass.
