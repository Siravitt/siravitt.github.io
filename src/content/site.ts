/**
 * The site's one typed content object (ticket 01 decision: a single
 * content file at `src/content/site.ts`, approved as an exception to the
 * Standards' `src/lib` data rule — the Reviewer and Flame both know to look
 * here first). Ticket 02 fills in the rest of the shape (stack, projects,
 * experience, contact); this ticket only needs enough to render the hero.
 *
 * Every visitor-facing string that isn't real yet starts with the
 * `[Placeholder]` marker (see `src/lib/placeholder.ts`), which the release
 * guard (ticket 05) scans for before anything ships to `main`.
 */

/** The person the site is about. */
export interface SitePerson {
  /** Full name. Rendered as the page's only H1. */
  name: string;
  /** One line above the name (e.g. role and stack). */
  role: string;
  /** One-line pitch below the name. */
  pitch: string;
}

/** Document-level metadata. */
export interface SiteMeta {
  /** `<title>`, DESIGN.md §9. */
  title: string;
  /**
   * Meta description (spec: placeholder for now). When unset, the page
   * falls back to `person.pitch` (ticket 02 fills this in for real).
   */
  description?: string;
}

export interface SiteContent {
  person: SitePerson;
  meta: SiteMeta;
}

export const site: SiteContent = {
  person: {
    // Real: Flame's name and GitHub handle are the only non-placeholder
    // content allowed in v1 (spec, Solution section).
    name: "Siravit Tanratanavijit",
    role: "[Placeholder] Software developer, Go and Next.js",
    pitch:
      "[Placeholder] One-line pitch in about 20 words: what he builds, who it is for and the result it brings.",
  },
  meta: {
    title: "Siravit Tanratanavijit: software developer portfolio",
  },
};
