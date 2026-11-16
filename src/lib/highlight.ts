export interface SplitHighlight {
  /** The text before the highlight (or the whole text, when there's no match). */
  before: string;
  /** The matched highlight phrase, or `null` when it isn't found. */
  match: string | null;
  /** The text after the highlight; empty when there's no match. */
  after: string;
}

/**
 * Locates `highlight` as a substring of `text` (docs/tickets/07-about-stack.md,
 * "Decisions (binding)": the About statement's highlighted phrase; plain
 * when `highlight` is unset or isn't found in `text`). Used on the text
 * remaining after `splitPlaceholder` has removed any leading `[Placeholder]`
 * marker, so a real statement and a still-placeholder one both search the
 * same way.
 */
export function splitHighlight(
  text: string,
  highlight: string | undefined,
): SplitHighlight {
  const index = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || index === -1) {
    return { before: text, match: null, after: "" };
  }
  return {
    before: text.slice(0, index),
    match: highlight,
    after: text.slice(index + highlight.length),
  };
}
