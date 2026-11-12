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
 * The `<nav>` and the Email button are rendered once, as a **sibling**
 * of the `<details>`, not nested inside it. An earlier version nested
 * them inside `<details>` and used an authored CSS rule to force them
 * visible above `lg`; that is spec-legal (an authored rule always wins
 * over the UA stylesheet's `details:not([open]) > *:not(summary) {
 * display: none }`, regardless of specificity, because origin beats
 * specificity in the cascade) but a real Chromium quirk still collapses
 * that content's *intrinsic size* to 0 while `<details>` is closed, even
 * once `display` is overridden — verified by hand, not documented
 * behaviour. Keeping `<details>` to just `<summary>` and reaching the
 * panel instead through Tailwind's `peer-open:` (`.peer:is([open]) ~
 * &`, a plain CSS sibling selector) sidesteps that engine quirk
 * entirely, needs no JavaScript, and still gives one `<nav>` serving
 * both the desktop row and the mobile sheet. `aria-controls` on the
 * `<summary>` names the panel for assistive tech, since it's no longer
 * a DOM descendant of the control that reveals it.
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
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/90 backdrop-blur-sm lg:h-18">
      <a
        href="#top"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
      >
        {site.labels.skipLink}
      </a>
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-6 max-sm:px-4">
        <a
          href={logoHref}
          aria-label={site.person.name}
          className="flex items-center gap-2 text-[15px] font-medium"
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

        <details className="peer lg:hidden">
          <summary
            aria-label={site.labels.menu}
            aria-controls={NAV_SHEET_ID}
            className="flex size-11 list-none items-center justify-center rounded-md [&::-webkit-details-marker]:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M2 5h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </summary>
        </details>

        <div
          id={NAV_SHEET_ID}
          className="hidden flex-col gap-1 border-b border-border bg-popover p-4 peer-open:absolute peer-open:inset-x-0 peer-open:top-full peer-open:flex lg:static lg:flex lg:flex-row lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0"
        >
          <nav aria-label={site.labels.navLabel}>
            <ul className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
              {visibleSections.map((key) => (
                <li key={key}>
                  <a
                    href={`${anchorPrefix}#${key}`}
                    className="flex min-h-12 items-center text-[15px] font-medium lg:min-h-0"
                  >
                    {site.sections[key].title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            className="mt-2 flex w-full lg:mt-0 lg:inline-flex lg:w-auto"
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
