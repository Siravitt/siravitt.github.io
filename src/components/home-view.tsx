import type { SiteContent } from "@/content/site";
import { PlaceholderText } from "@/components/placeholder-text";

/**
 * The home page view. Presentational: it takes the content as a prop and
 * renders it, nothing else (ticket 01 decision: this prop boundary is
 * Seam A — the agreed test seam for view-rendering tests).
 *
 * Ticket 03 adds the page skeleton (header, nav, section shells) and
 * ticket 06 the full hero (sand frame, editor, facts, CTAs); this ticket
 * only renders the hero's text column, the thin slice that proves
 * content → view → test → build → CI all work end to end. The container
 * below is DESIGN.md §4's, reused as-is by later tickets.
 */
export function HomeView({ site }: { site: SiteContent }) {
  return (
    <main id="top">
      <section
        aria-labelledby="hero-h"
        className="mx-auto max-w-7xl px-6 py-24 max-sm:px-4"
      >
        <p className="mb-6 text-[14px] leading-[1.5] font-medium">
          <PlaceholderText text={site.person.role} />
        </p>
        <h1
          id="hero-h"
          className="text-[length:clamp(38px,3.24vw+25.4px,72px)] leading-[1.02] font-medium tracking-[-0.036em] [font-stretch:96%]"
        >
          {site.person.name}
        </h1>
        <p className="mt-6 max-w-[42ch] text-[18px] leading-[1.6] font-normal lg:text-[20px]">
          <PlaceholderText text={site.person.pitch} />
        </p>
      </section>
    </main>
  );
}
