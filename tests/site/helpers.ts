// Shared filesystem/DOM helpers for Seam B (docs/tickets/05-built-site-checks-release-guard.md):
// built-site checks that run against the static export in `out/`, after
// `pnpm build`. Parses HTML with `jsdom` — already a dev dependency for
// the component tests' `environment: "jsdom"` — rather than adding a
// new HTML parser (ticket decision).
import { existsSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { JSDOM } from "jsdom";
import { walkDir } from "@/lib/release-guard";

export const OUT_DIR = join(process.cwd(), "out");

/** Throws with the message the ticket requires when `out/` hasn't been built yet. */
export function assertOutDirExists(): void {
  if (!existsSync(OUT_DIR)) {
    throw new Error(
      "out/ is missing \u2014 run `pnpm build` first, then `pnpm test:site`.",
    );
  }
}

/** Reads a file under `out/` (e.g. `"privacy.html"`) as UTF-8 text. */
export function readOutFile(relativePath: string): string {
  return readFileSync(join(OUT_DIR, relativePath), "utf8");
}

/**
 * Parses a page under `out/` into a DOM `Document` via `jsdom`.
 * `textContent` on the result is already entity-decoded (Review Focus 2:
 * React writes `'` as `&#x27;` in the HTML source; reading through the
 * DOM instead of regex-matching the raw markup is what gets that back
 * to a real `'` for comparison).
 */
export function parseOutFile(relativePath: string): Document {
  return new JSDOM(readOutFile(relativePath)).window.document;
}

/**
 * Lists every file under `out/` (relative paths) whose extension is in
 * `extensions`. Shares its recursive walk with the release guard's
 * `collectScannedFiles` via `walkDir` (reviewer round 2: one walk,
 * tested once, instead of a copy per caller).
 */
export function listOutFiles(extensions: string[]): string[] {
  const allowed = new Set(extensions);
  return walkDir(OUT_DIR, (entry) => allowed.has(extname(entry))).map(
    (fullPath) => relative(OUT_DIR, fullPath),
  );
}
