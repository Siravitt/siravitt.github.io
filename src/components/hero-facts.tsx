import type { SiteContent } from "@/content/site";
import { PlaceholderText } from "@/components/placeholder-text";
import { isExternalHref } from "@/lib/links";

/**
 * The hero's desktop-only facts row (docs/tickets/06-hero-editor-facts-ctas.md,
 * "Decisions (binding)"; DESIGN.md §6 "Hero facts"). Reads `site.hero.facts`
 * (0 to 3 entries, enforced by the `HeroFact[]` type, not here). A fact with
 * `href` renders as a link with ↗ when the href leaves the site, → when it
 * stays on it (DESIGN.md §6a); an empty list renders no `<dl>` and no
 * separator. Hidden below 1024px (DESIGN.md §4); at ≥1024 it's pinned to
 * the bottom of its stretched text column, on the editor frame's bottom
 * line (`home-view.tsx`'s `lg:flex lg:flex-col` + this row's `mt-auto`).
 */
export function HeroFacts({ site }: { site: SiteContent }) {
  const { facts } = site.hero;
  if (facts.length === 0) {
    return null;
  }

  return (
    <div className="mt-auto hidden border-t border-border pt-5 lg:block">
      {/*
       * Ticket 21 ("Hero fact never wraps at 1440"), round 2.
       * Measured with `Range.getClientRects` / Canvas text metrics
       * (same font, 15px/500 Instrument Sans): "Go and Next.js" is
       * ~100px wide, one line. Develop's equal `grid-cols-3` thirds
       * gave this fact ~168px at 1440 — ~68px of real slack, not the
       * "zero margin" this comment wrongly claimed in round 1 (that
       * number was actually the *other* candidate's own shrunk column
       * width, not the text). So develop was never truly at risk at
       * 1440 with today's copy; round 1's `grid-cols-[repeat(3,auto)]`
       * swap was unnecessary there and, by letting the grid's
       * "Maximize Tracks" step hand each column's *max* track equal
       * leftover space while its *min* track stayed the implicit
       * `auto` (= min-content), it let columns shrink **below** their
       * own text's max-content under negative free space — exactly
       * what happened at 1024 (this fact's column landed at 98.77px,
       * under the text's 100.09px, forcing a 2-line wrap that develop
       * (105.36px, 1 line) didn't have.
       *
       * Fix: `minmax(max-content,auto)` keeps the same flexible `auto`
       * upper bound (so a short value still doesn't get force-wrapped
       * by a fixed equal share) but raises the *lower* bound to each
       * column's own max-content, so no column can ever shrink enough
       * to wrap a fact that fits on one line unwrapped. Verified: 1
       * line at 390/768(hidden)/1024/1280/1440/1920 and
       * `scrollWidth === clientWidth` throughout — when the three
       * facts' combined max-content would exceed the row's own width,
       * the grid (and the `dl`) shrink to fit instead of overflowing
       * the page, so nothing triggers horizontal scroll; a fact value
       * long enough to not fit at all still wraps inside its own
       * column (no `white-space: nowrap`), matching "at narrow widths
       * it may wrap naturally".
       */}
      <dl className="grid grid-cols-[repeat(3,minmax(max-content,auto))] gap-x-6 gap-y-4">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-[13px] font-medium text-muted-foreground">
              {fact.label}
            </dt>
            <dd className="mt-1 text-[15px] font-medium">
              {fact.href ? (
                <a
                  href={fact.href}
                  className="rounded-sm underline decoration-border-strong underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <PlaceholderText text={fact.value} />
                  {/* Carried-over fix (Flame, 2026-11-13): no-underline
                   * + inline-block stop the link's underline from
                   * drawing its own short line under the glyph. */}
                  <span
                    aria-hidden="true"
                    className="inline-block no-underline"
                  >
                    {" "}
                    {isExternalHref(fact.href) ? "\u2197" : "\u2192"}
                  </span>
                </a>
              ) : (
                <PlaceholderText text={fact.value} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
