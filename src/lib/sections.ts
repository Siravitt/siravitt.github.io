import type { SiteContent } from "@/content/site";

/**
 * The five below-the-fold sections, in the order they appear on the page
 * (docs/tickets/03-page-skeleton-header-nav.md, "Decisions"). The hero
 * (`#top`) isn't one of these: it always shows and has no nav word.
 */
export const SECTION_ORDER = [
  "about",
  "stack",
  "projects",
  "experience",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

/**
 * The one pure function that decides which sections (and their nav
 * words) show: `projects`, `experience` and `stack` hide when their
 * list is empty (a stack group with no items doesn't count as an item,
 * ticket 03 decision). About and Contact always show. Reused by the
 * nav, the footer's Sections column (ticket 12) and the motion
 * timelines (ticket 14), so every one of them agrees on what's visible.
 */
export function getVisibleSections(site: SiteContent): SectionKey[] {
  return SECTION_ORDER.filter((key) => {
    switch (key) {
      case "projects":
        return site.projects.length > 0;
      case "experience":
        return site.experience.length > 0;
      case "stack":
        return site.stack.groups.some((group) => group.items.length > 0);
      case "about":
      case "contact":
        return true;
    }
  });
}
