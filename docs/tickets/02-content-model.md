# 02: Content model and test fixture

**What to build:** Flame can open `src/content/site.ts` and find every visitor-facing string of the site in one typed object. The real values are filled in, and every other string is a marked placeholder that mirrors the approved prototype's copy, including the four mock projects. A typo, a missing required field, or an image without alt text fails `pnpm typecheck`. Tests get one shared fixture content object, independent of Flame's copy. This is a prefactor: it settles the content shape once, so the parallel section tickets (06–12) only read it and never collide in this file.

**Blocked by:** 01

**Design refs:** All copy in `prototype/index.html`, `privacy.html` and `404.html`; DESIGN.md §6 (fields each component shows), §6b "Data" (stack icon slugs), §8 "Missing optional field", §9 (title).

**Decisions (binding):** the shape below is fixed for all later tickets. Field names may follow TS naming, but the meaning and optionality may not change.
- `person`: `name` (real: `Siravit Tanratanavijit`), `shortName` (real: `Siravit`, the nav below 1280 px), `role`, `pitch`.
- `meta`: `title` (DESIGN §9: `Siravit Tanratanavijit: software developer portfolio`), `description` (placeholder; when empty, the pitch is used).
- `hero`: `facts` (0–3 items of `label`, `value` and an optional `href`; prototype: Works in / Code / Based in), `artLabel` (the accessible name of the hero picture), `secondaryLabel` (`See projects`). Every "Email Siravit" button (header, hero, contact) uses `contact.emailLabel`.
- `sections`: one entry per section (`about`, `stack`, `projects`, `experience`, `contact`), each with a `title` (default: About, Stack, Projects, Experience, Contact; also the nav word) and an optional `tagline` (the muted part after "Title.") and `intro` (the line under the H2).
- `about`: `statement` (text) + optional `highlight` (a phrase inside the statement that is shown highlighted; when it isn't found in the text, nothing is highlighted) + `paragraphs` (0–2 more).
- `stack`: ordered `groups` of `name` + ordered `items` of `name` + optional `icon`, typed as the union of the ten slugs in DESIGN §6b. No levels or percentages.
- `projects`: ordered list. Each has `title`, `summary`, `description`, `role`, `outcome`, `tags` (string list, may be empty), optional `badge` (mock projects: `Mock project`), optional `links` (`source?`, `live?`, URLs) and optional `visual`. `visual` is a discriminated union: `{ kind: "image", src, alt, width, height }` here, with **`alt` required**. Tickets 09 and 10 add the `demo` kinds.
- `experience`: ordered list of `role`, `organisation`, `start`, optional `end` (absent = current), `highlights` (**2 to 4** strings, enforced by the type), optional `tags`.
- `contact`: optional `intro`, `email`, `emailLabel` (`Email Siravit`), `github` (real: `https://github.com/Siravitt`), `githubLabel` (`GitHub profile`), `linkedin` (placeholder `https://www.linkedin.com/in/placeholder-profile`), `linkedinLabel` (`LinkedIn profile`).
- `footer`: `lede`, `legal` (`© 2026 Siravit Tanratanavijit`), `sectionsHeading` (`Sections`), `elsewhereHeading` (`Elsewhere`).
- `labels` (short UI words visitors read): `role`, `outcome`, `sourceCode`, `liveDemo`, `present`, `current`, `backToPortfolio`, `menu`.
- `notFound`: `title` (`Page not found`), `text`, `actionLabel` (`Go to the portfolio`).
- `daedalus`: `line` (`Daedalus — personal assistant app used only by its owner`), `privacyLabel` (`Privacy`), `privacyPath` (`/privacy.html`), `policyHeading` (`Privacy Policy`), `policyText` (the spec's policy sentence, verbatim). A comment above this block reads **"must-keep — Google OAuth, do not edit"**.
- Placeholder rule (README decision 1): every placeholder string starts with `[Placeholder]`. That includes taglines and intros such as Projects' "Four mock cards stand in…", each project's text fields and each experience highlight. The placeholder email is `placeholder@example.com`. Real or neutral strings carry no marker: the name, short name, GitHub URL, the Daedalus block, section titles, `labels`, `notFound`, button labels, footer headings and the © line.
- Mock content mirrors the prototype. Four projects: the first with `source` + `live` links, the second and third with `source` only, the fourth bare (no links, no visual). All four have `badge: "Mock project"` and no `visual` yet (09/10 add them). Three experience entries, the first current (no `end`). Four stack groups with the ten items and their icon slugs in the prototype's order.
- The **test fixture** is a separate content object with short, made-up strings, not copied from `site.ts`. It has the same shape, every optional field present at least once, and both a current and an ended experience entry. Tests make variants by spreading it (for example `projects: []`).

**Acceptance criteria:**
- [ ] `site` is declared with `satisfies` against the exported content type, and every block above is present with the prototype's copy, marked as above.
- [ ] Type tests (run by `pnpm typecheck` or Vitest's type-check mode) show the compiler **rejects**: an image visual without `alt`; an experience entry with 1 or 5 highlights; a stack icon slug outside the ten; a project without `title`. The compiler **accepts** a project with no `links`, `visual`, `badge` or `tags` content.
- [ ] A test asserts the must-keep literals in `site.daedalus` exactly: the line with U+2014 em dash, `privacyPath` `/privacy.html`, `policyHeading` `Privacy Policy`, and the policy text with straight apostrophes (U+0027). It also asserts `person.name` `Siravit Tanratanavijit` and `contact.github` `https://github.com/Siravitt`. These are the only tests that read `site.ts`.
- [ ] The fixture is exported for tests only (not imported by any page), and 01's hero test now uses it.
- [ ] The page still builds and shows the hero text from the new shape (no visual change from 01).
- [ ] README "Editing content" explains: the file and its blocks; the `[Placeholder]` convention and the guard markers (`[Placeholder]`, `example.com`, the `placeholder` LinkedIn slug, `Mock project`); that emptying `projects`, `experience` or `stack` hides that section and its nav link; that optional fields (links, visual, end date, tags, intro) can be left out; and that the `daedalus` block must not be edited.
- [ ] Build, lint, type-check and tests pass.
