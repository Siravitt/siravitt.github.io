#!/usr/bin/env node
// The release guard (docs/tickets/05-built-site-checks-release-guard.md,
// "Decisions"): walks the static export in `out/`, scans every `.html`
// and `.txt` (RSC payload) file for a release-guard marker, and exits
// non-zero while any remains. CI's `release-guard` job runs this only on
// PRs whose base is `main`; Flame can also run it locally before a
// release. All the matching logic, file selection and the recursive
// walk itself live in `src/lib/release-guard.ts` (unit-tested on their
// own, including the walk — reviewer round 2) — this file is just the
// `out/` existence check and the printed report, run directly by
// Node's native TypeScript support (no bundler, no new dependency).
import { statSync } from "node:fs";
import { join } from "node:path";
import {
  collectScannedFiles,
  scanFilesForMarkers,
} from "../src/lib/release-guard.ts";

const OUT_DIR = join(process.cwd(), "out");

function main(): number {
  let outInfo;
  try {
    outInfo = statSync(OUT_DIR);
  } catch {
    console.error("out/ is missing — run `pnpm build` first.");
    return 1;
  }
  if (!outInfo.isDirectory()) {
    console.error("out/ is missing — run `pnpm build` first.");
    return 1;
  }

  const files = collectScannedFiles(OUT_DIR, process.cwd());
  const hits = scanFilesForMarkers(files);

  if (hits.length === 0) {
    console.log(
      `check:release: scanned ${files.length} file(s) under out/, found no release-guard markers.`,
    );
    return 0;
  }

  console.error(
    `check:release: found ${hits.length} release-guard marker hit(s):`,
  );
  for (const hit of hits) {
    console.error(`  ${hit.file} — ${hit.marker} — ${hit.snippet}`);
  }
  return 1;
}

process.exitCode = main();
