import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

/**
 * The release guard's scanning logic (docs/tickets/05-built-site-checks-release-guard.md,
 * "Decisions"; docs/tickets/README.md decision 2): the markers that must
 * never reach a built site on `main`, which files under `out/` get
 * scanned for them, and the recursive walk that finds them —
 * including `collectScannedFiles`/`walkDir` (reviewer round 2: the walk
 * must be unit-tested, not left only in `scripts/check-release.mts`,
 * since a dropped recursive step is invisible to literal-input tests on
 * `scanFilesForMarkers` alone). `scripts/check-release.mts` is now a
 * thin wrapper that points this walk at `out/` and prints the report.
 */
export const RELEASE_GUARD_MARKERS = [
  "[Placeholder]",
  "example.com",
  "linkedin.com/in/placeholder",
  "Mock project",
] as const;

export type ReleaseGuardMarker = (typeof RELEASE_GUARD_MARKERS)[number];

/** File extensions the guard reads: rendered HTML and RSC `.txt` prefetch payloads. */
export const SCANNED_EXTENSIONS = new Set([".html", ".txt"]);

/**
 * Whether the guard should read this file's contents. `path` can be
 * relative or absolute, nested at any depth — only the extension matters.
 */
export function isScannedFile(path: string): boolean {
  return SCANNED_EXTENSIONS.has(extname(path));
}

export interface ReleaseGuardFile {
  /** Path as it should be reported, e.g. `out/privacy.html`. */
  file: string;
  content: string;
}

export interface ReleaseGuardHit {
  file: string;
  marker: ReleaseGuardMarker;
  /** A short slice of `content` around the first occurrence, for the printed report. */
  snippet: string;
}

const SNIPPET_RADIUS = 30;

/** Builds the short "...context..." slice printed next to a hit. */
function snippetAround(
  content: string,
  index: number,
  markerLength: number,
): string {
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(content.length, index + markerLength + SNIPPET_RADIUS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return `${prefix}${content.slice(start, end)}${suffix}`;
}

/**
 * Scans one file's content for every release-guard marker. Returns one
 * hit per marker found (not per occurrence) — enough to name the file
 * and marker and show a snippet, which is all the report needs.
 */
export function scanFileForMarkers(file: ReleaseGuardFile): ReleaseGuardHit[] {
  const hits: ReleaseGuardHit[] = [];
  for (const marker of RELEASE_GUARD_MARKERS) {
    const index = file.content.indexOf(marker);
    if (index === -1) continue;
    hits.push({
      file: file.file,
      marker,
      snippet: snippetAround(file.content, index, marker.length),
    });
  }
  return hits;
}

/** Scans every file, in order, flattening their hits into one list. */
export function scanFilesForMarkers(
  files: ReleaseGuardFile[],
): ReleaseGuardHit[] {
  return files.flatMap(scanFileForMarkers);
}

/**
 * Recursively lists absolute paths of every file under `dir` for which
 * `predicate(entryName)` is true. The shared walk behind
 * `collectScannedFiles` below and `listOutFiles` in
 * `tests/site/helpers.ts` — previously duplicated in three places.
 */
export function walkDir(
  dir: string,
  predicate: (entryName: string) => boolean,
): string[] {
  const paths: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const info = statSync(fullPath);
    if (info.isDirectory()) {
      paths.push(...walkDir(fullPath, predicate));
      continue;
    }
    if (predicate(entry)) paths.push(fullPath);
  }
  return paths;
}

/**
 * Recursively finds every file under `dir` that `isScannedFile`
 * accepts and reads its content. `file` is reported relative to
 * `baseDir` (defaults to `dir` itself) so a caller walking
 * `<cwd>/out` can report paths as `out/...` by passing `baseDir =
 * process.cwd()` — this is what `scripts/check-release.mts` does.
 */
export function collectScannedFiles(
  dir: string,
  baseDir: string = dir,
): ReleaseGuardFile[] {
  return walkDir(dir, isScannedFile).map((fullPath) => ({
    file: relative(baseDir, fullPath),
    content: readFileSync(fullPath, "utf8"),
  }));
}
