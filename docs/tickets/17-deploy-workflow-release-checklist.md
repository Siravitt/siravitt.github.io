# 17: Deploy workflow and release checklist

**What to build:** Releasing means merging the release PR into `main`. A `Deploy` workflow then builds the static export, re-checks it (built-site checks + release guard), and publishes it to GitHub Pages. It runs on every push to `main` and on manual dispatch, and never deploys from any other branch. Its first real run is the release. Until then it sits on `develop`, ready. The README gets Flame's release checklist and the rollback steps, so the first release can't take down the OAuth pages.

**Blocked by:** 05

**Design refs:** none (spec "CI/CD", "Further Notes: Release checklist", user stories 36 and 38).

**Decisions (binding):**
- Workflow `Deploy`, triggered on `push` to `main` + `workflow_dispatch`. Both jobs carry `if: github.ref == 'refs/heads/main'`, so a dispatch from `develop` does nothing.
- Permissions: `contents: read`, `pages: write`, `id-token: write`. One concurrency group `pages` with `cancel-in-progress: false`.
- Build job: checkout → pnpm + Node from the pins → `pnpm install --frozen-lockfile` → `pnpm build` → `pnpm test:site` → `pnpm check:release` (a second line of defence after the PR guard) → the official configure-pages and upload-pages-artifact actions (path `out/`).
- Deploy job: needs build, environment `github-pages` with the deployed URL, then the official deploy-pages action. Actions pinned to their current major versions.
- No `.nojekyll`, no custom domain, no `CNAME`. Agents change no repo settings; the Pages source, environment rules and required checks are Flame's steps.

**Acceptance criteria:**
- [ ] The workflow file passes `actionlint`, with the command and output in the PR. Run it from the SSD toolchain or a container; nothing is installed in the home folder.
- [ ] The workflow, as read in the PR: triggers only on `push` to `main` and `workflow_dispatch`, the `main`-only condition on both jobs, the permissions and the concurrency settings above, `pnpm check:release` and `pnpm test:site` before the upload, and the upload path `out/`.
- [ ] README "Deploy" explains how the site deploys, and that `develop` is never deployed (preview locally with `pnpm build && pnpm preview`).
- [ ] README "Release checklist" carries the spec's seven steps in order:
  1. Real content is in place and `release-guard` is green on the `develop` → `main` PR.
  2. Settings → Pages → Source → **GitHub Actions**, right before merging. Never merge while Pages still deploys `main` from a branch.
  3. Check that the `github-pages` environment allows `main`: the default branch is `develop`, so its branch rule may only allow `develop`.
  4. Merge with a merge commit and watch `Deploy`.
  5. Live checks: `/` loads; `/privacy.html` shows the exact policy; the footer Privacy link works; the OG preview renders (for example by pasting the URL in Discord).
  6. Rollback: revert the release merge on `main` and switch Pages back to "Deploy from a branch: `main` / root".
  7. After the first CI run, add `verify` and `release-guard` as required checks in the `main`/`develop` rulesets.
- [ ] CI on this PR is green. The deploy workflow does not run on the PR (it isn't triggered by `pull_request`).
- [ ] Build, lint, type-check and tests pass.
