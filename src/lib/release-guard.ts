/**
 * The release guard's pure scanning logic (docs/tickets/05-built-site-checks-release-guard.md,
 * "Decisions"; docs/tickets/README.md decision 2): the markers that must
 * never reach a built site on `main`. `scripts/check-release.mts` is the
 * thin I/O wrapper — it walks `out/`, reads every `.html` and `.txt`
 * file, and calls `scanFilesForMarkers`. Keeping the scan itself pure
 * and framework-free is what lets it be unit-tested on literal inputs
 * without a real build.
 */
export const RELEASE_GUARD_MARKERS = [
  "[Placeholder]",
  "example.com",
  "linkedin.com/in/placeholder",
  "Mock project",
] as const;

export type ReleaseGuardMarker = (typeof RELEASE_GUARD_MARKERS)[number];

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
