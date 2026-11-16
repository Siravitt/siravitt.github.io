/**
 * Which trailing glyph a text link gets (DESIGN.md §6a, Buttons/Text
 * links row): ↗ for a link that leaves the site (an absolute
 * `http(s)://` URL to another origin), → for one that stays on it
 * (an in-page anchor or a site-relative path). Ticket 06's hero facts
 * are the first caller; later tickets (About, Projects, Experience,
 * Contact) reuse it for the same rule instead of re-deciding it.
 */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}
