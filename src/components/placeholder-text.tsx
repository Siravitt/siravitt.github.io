import { splitPlaceholder } from "@/lib/placeholder";

/**
 * Renders a content string, showing a leading `[Placeholder]` marker (if
 * present) as the neutral dashed tag (DESIGN.md §6) followed by the rest
 * of the text. Strings without the marker render as plain text.
 */
export function PlaceholderText({ text }: { text: string }) {
  const { marker, rest } = splitPlaceholder(text);
  if (!marker) {
    return <>{text}</>;
  }
  return (
    <>
      <span className="ph">{marker}</span>
      {rest}
    </>
  );
}
