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
       * Ticket 21 ("Hero fact never wraps at 1440"). Measured with
       * `Range.getClientRects` (same font, 15px/500 Instrument Sans):
       * "Go and Next.js" is ~100px wide, one line. This grid's equal
       * thirds already match DESIGN.md's `dl.hero-facts` spec
       * (`assets/system.css`: `grid-template-columns: repeat(3,
       * minmax(0, 1fr))`, i.e. Tailwind's `grid-cols-3`), which gives
       * this fact a ~168px column at 1440 (~68px of slack) and a
       * ~105px column at 1024 (~5px of slack) — one line at both
       * widths with today's copy, confirmed by measurement rather
       * than changed in code. Keeping the design's own equal-thirds
       * grid (instead of swapping to `minmax(max-content, auto)`
       * tracks) also keeps the `dl` itself from ever overflowing: an
       * `auto`/`max-content` lower bound can't shrink below a long
       * fact's own text width, so if the three facts' combined
       * max-content ever exceeds the row's width, that lower bound
       * forces the grid past its container. `minmax(0, 1fr)` has no
       * such floor, so a fact that doesn't fit wraps inside its own
       * column (no `white-space: nowrap`) instead of pushing the row
       * wider than the hero frame — matching "at narrow widths it may
       * wrap naturally" and "nothing may overflow".
       */}
      <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
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
