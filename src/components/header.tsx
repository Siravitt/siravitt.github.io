import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import type { SiteContent } from "@/content/site";
import type { SectionKey } from "@/lib/sections";

interface HeaderProps {
  site: SiteContent;
  /** Which of the five nav words to render, in order (ticket 03 decision: one pure function, shared with the sections themselves). */
  visibleSections: SectionKey[];
  /** "" on the home page; "/" on every other page (ticket 04). */
  anchorPrefix?: string;
  /** "#top" on the home page; "/" on every other page (ticket 04). */
  logoHref?: string;
}

const NAV_SHEET_ID = "nav-sheet";

/**
 * The sticky site header: skip link, logo (back to top), the in-page
 * nav and the Email keycap — collapsed on phones behind a no-JS
 * `<details>` disclosure (docs/tickets/03-page-skeleton-header-nav.md,
 * Q1 decision (a)).
 *
 * The `<nav>` and the full-width Email button are rendered once, as a
 * sibling of the `<details>` toggle, not nested inside it. An earlier
 * version nested them inside `<details>` and used an authored CSS rule
 * to force them visible above `lg`; that is spec-legal (an authored
 * rule always wins over the UA stylesheet's `details:not([open]) >
 * *:not(summary) { display: none }`, regardless of specificity,
 * because origin beats specificity in the cascade) but a real Chromium
 * quirk still collapses that content's *intrinsic size* to 0 while
 * `<details>` is closed, even once `display` is overridden — verified
 * by hand, not documented behaviour.
 *
 * Both the menu panel's visibility and the bar's compact Email button
 * react to the toggle's `[open]` state through `group-has-[details
 * [open]]:…` on the header's `group` ancestor — an ancestor `:has()`
 * check, not a forward sibling selector, so it doesn't care where in
 * the DOM the `<details>` sits relative to them (unlike `peer-open:`,
 * which needs the reactive element to be a *later* sibling of the
 * peer — a constraint that would force either the compact button
 * after the toggle in the DOM, breaking keyboard tab order versus the
 * visual layout, or the toggle after the panel, breaking the panel's
 * own reveal). `aria-controls` on the `<summary>` still names the
 * panel for assistive tech, since it's no longer a DOM descendant of
 * the control that reveals it. Below `lg`, that same panel's `<nav>`
 * and full button become direct grid children of the bar via
 * `lg:contents` (DESIGN §6 "Nav bar": logo | centred nav | button, a
 * 3-column grid — `display: contents` on the wrapper lets its
 * children sit in the grid's own columns without an extra box).
 */
export function Header({
  site,
  visibleSections,
  anchorPrefix = "",
  logoHref = "#top",
}: HeaderProps) {
  const emailHref = `mailto:${site.contact.email}`;
  const surname = site.person.name.slice(site.person.shortName.length);

  return (
    <header className="sticky top-0 z-40 h-18 border-b border-border bg-background/90 backdrop-blur-sm max-sm:h-14">
      <a
        href="#top"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:flex focus-visible:h-11 focus-visible:items-center focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {site.labels.skipLink}
      </a>
      <div className="group relative mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-6 max-sm:px-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <a
          href={logoHref}
          aria-label={site.person.name}
          className="flex items-center gap-2 rounded-sm text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring max-sm:min-h-11 lg:justify-self-start"
        >
          <span
            aria-hidden="true"
            className="flex size-6 items-center justify-center rounded-sm bg-primary text-[13px] font-semibold text-primary-foreground"
          >
            S
          </span>
          <span>
            {site.person.shortName}
            <span className="hidden xl:inline">{surname}</span>
          </span>
        </a>

        {/* Compact Email keycap + menu toggle: bar-only, below 1024px,
            grouped so they sit together at the row's end (the compact
            button hides once the menu opens). */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button
            className="h-11 gap-1 px-3 text-sm group-has-[details[open]]:hidden"
            render={
              <a href={emailHref}>
                {site.contact.emailLabel}
                <Kbd aria-hidden="true">&#8629;</Kbd>
              </a>
            }
          />

          <details>
            <summary
              aria-label={site.labels.menu}
              aria-controls={NAV_SHEET_ID}
              className="flex size-11 list-none items-center justify-center rounded-md border border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
              >
                <path
                  d="M2 5h14M2 13h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
          </details>
        </div>

        <div
          id={NAV_SHEET_ID}
          className="hidden flex-col gap-1 border-b border-border bg-popover p-4 max-lg:group-has-[details[open]]:absolute max-lg:group-has-[details[open]]:inset-x-0 max-lg:group-has-[details[open]]:top-full max-lg:group-has-[details[open]]:flex lg:contents"
        >
          <nav
            aria-label={site.labels.navLabel}
            className="lg:col-start-2 lg:row-start-1 lg:justify-self-center"
          >
            <ul className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
              {visibleSections.map((key) => (
                <li key={key}>
                  <a
                    href={`${anchorPrefix}#${key}`}
                    className="flex min-h-12 items-center rounded-sm text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:min-h-0"
                  >
                    {site.sections[key].title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            className="mt-2 flex w-full lg:col-start-3 lg:row-start-1 lg:mt-0 lg:inline-flex lg:w-auto lg:justify-self-end"
            render={
              <a href={emailHref}>
                {site.contact.emailLabel}
                <Kbd aria-hidden="true">&#8629;</Kbd>
              </a>
            }
          />
        </div>
      </div>
    </header>
  );
}
