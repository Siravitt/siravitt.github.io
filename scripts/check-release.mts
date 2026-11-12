#!/usr/bin/env node
// The release guard (docs/tickets/05-built-site-checks-release-guard.md,
// "Decisions"): walks the static export in `out/`, scans every `.html`
// and `.txt` (RSC payload) file for a release-guard marker, and exits
// non-zero while any remains. CI's `release-guard` job runs this only on
// PRs whose base is `main`; Flame can also run it locally before a
// release. All the matching logic lives in `src/lib/release-guard.ts`
// (unit-tested on its own) — this file is just the filesystem walk and
// the printed report, run directly by Node's native TypeScript support
// (no bundler, no new dependency).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import {
  scanFilesForMarkers,
  type ReleaseGuardFile,
} from "../src/lib/release-guard.ts";

const OUT_DIR = join(process.cwd(), "out");
const SCANNED_EXTENSIONS = new Set([".html", ".txt"]);

function collectScannedFiles(dir: string): ReleaseGuardFile[] {
  const files: ReleaseGuardFile[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const info = statSync(fullPath);
    if (info.isDirectory()) {
      files.push(...collectScannedFiles(fullPath));
      continue;
    }
    if (!SCANNED_EXTENSIONS.has(extname(entry))) continue;
    files.push({
      file: relative(process.cwd(), fullPath),
      content: readFileSync(fullPath, "utf8"),
    });
  }
  return files;
}

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

  const files = collectScannedFiles(OUT_DIR);
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
