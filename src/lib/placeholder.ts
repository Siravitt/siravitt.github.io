/**
 * The placeholder convention (ticket 01 decision, spec DECIDED 1/2):
 * every not-yet-real string in `site.ts` starts with this marker. The
 * renderer shows it as the neutral dashed tag (DESIGN.md §6) followed by
 * the rest of the string. The marker text must stay in the rendered DOM —
 * ticket 05's release guard scans the built site for it and fails a PR
 * into `main` while any remains.
 */
export const PLACEHOLDER_MARKER = "[Placeholder]";

export interface SplitPlaceholder {
  /** The marker text, or `null` if `text` has none. */
  marker: string | null;
  /** `text` with the marker (and any single separating space) removed. */
  rest: string;
}

/** Splits a content string into its placeholder marker (if any) and the rest. */
export function splitPlaceholder(text: string): SplitPlaceholder {
  if (!text.startsWith(PLACEHOLDER_MARKER)) {
    return { marker: null, rest: text };
  }
  return {
    marker: PLACEHOLDER_MARKER,
    rest: text.slice(PLACEHOLDER_MARKER.length),
  };
}
