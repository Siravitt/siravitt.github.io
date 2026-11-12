# 05: Built-site checks and release guard

**What to build:** After every build, CI checks what Google's crawler and a visitor actually get from `out/`. The checks cover the three pages, the must-keep privacy URL and verbatim policy, the Daedalus footer line on every page, and that no page loads anything from a third-party origin. A PR that breaks any of these goes red. On PRs into `main`, a release-guard job also fails while any placeholder or mock marker is still in the built site. Flame can run both checks locally before a release.

**Blocked by:** 04

**Design refs:** none (spec "Testing Decisions", Seam B; "Must-keep items"; DECIDED 2).

**Decisions (binding):**
- `pnpm test:site` runs Seam B: a Vitest suite (node run, parsing the HTML with the DOM library the unit tests already use; no new parser dependency) against `out/`. It fails with a clear message when `out/` is missing ("run `pnpm build` first").
- `pnpm check:release` runs the guard over every `.html` and `.txt` (RSC payload) file in `out/`. The markers are `[Placeholder]`, `example.com`, `linkedin.com/in/placeholder` and `Mock project` (README decision 2). It prints each hit as file + marker + a short snippet and exits non-zero. The scanning logic is a pure function with its own unit tests.
- CI: the `verify` job runs `pnpm test:site` after `pnpm build` on every PR. A new `release-guard` job runs install → build → `pnpm check:release` only when the PR's base branch is `main`, and doesn't run on PRs into `develop`.
- Text comparisons decode HTML first: React writes `'` as `&#x27;` (**Review Focus 2**).

**Acceptance criteria:**
- [ ] Seam B: `out/index.html`, `out/privacy.html` and `out/404.html` exist, and `out/privacy/` does not.
- [ ] Seam B: `privacy.html` has one H1 whose text is `Privacy Policy`, and a paragraph whose decoded text equals, character for character: `This app is used only by its owner to create events in the owner's own Google Calendar. No data is shared with third parties or stored outside the owner's machine.` (straight apostrophes U+0027, as a literal in the test).
- [ ] Seam B: in each of the three pages, a footer contains the decoded text `Daedalus — personal assistant app used only by its owner · Privacy` (U+2014, U+00B7), and its "Privacy" link has `href` exactly `/privacy.html`.
- [ ] Seam B: every page has `<html lang="en">`. `privacy.html` has canonical `https://siravitt.github.io/privacy.html`, and `404.html` has a `noindex` robots meta.
- [ ] Seam B: no `script[src]`, `link[href]`, `img[src]`, `img[srcset]`, `source[srcset]` or `iframe[src]` in any page points to an origin other than relative or `https://siravitt.github.io`. No file in `out/` contains `fonts.googleapis.com` or `fonts.gstatic.com`.
- [ ] Guard unit tests on literal inputs: a clean set of files passes; a file holding each of the four markers fails and names that file and marker; a marker inside an `.txt` payload is caught too.
- [ ] Running `pnpm check:release` on today's placeholder build fails and lists the hits. Output pasted in the PR: this proves the guard bites. The PR into `develop` stays green because the guard job doesn't run there.
- [ ] `ci.yml` shows the `release-guard` job conditioned on the base branch `main`, and the PR shows `verify` running `test:site`.
- [ ] README documents `pnpm test:site` and `pnpm check:release`: what each checks, and to run them after `pnpm build`.
- [ ] Build, lint, type-check and tests pass.
