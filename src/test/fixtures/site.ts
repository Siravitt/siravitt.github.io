import type { SiteContent } from "@/content/site";

/**
 * Shared test fixture content (spec, Testing Decisions: "tests must not
 * depend on Flame's placeholder copy"). Component tests render views with
 * this object, never with `site.ts`, except where they assert a must-keep
 * literal (none of those exist yet in ticket 01).
 *
 * Ticket 02 expands this fixture as `site.ts`'s shape grows; keep both in
 * sync by hand (no schema-generation step).
 */
export const siteFixture: SiteContent = {
  person: {
    name: "Fixture Person",
    role: "[Placeholder] Fixture role line",
    pitch: "Fixture pitch line with no placeholder marker.",
  },
  meta: {
    title: "Fixture Person: fixture title",
  },
};
