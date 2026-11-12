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
                  <span aria-hidden="true">
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
