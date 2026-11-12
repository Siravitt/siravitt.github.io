import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { LegalRow } from "@/components/legal-row";
import type { SiteContent } from "@/content/site";
import { CONTAINER_CLASSNAME } from "@/lib/layout";
import { getVisibleSections } from "@/lib/sections";

interface OtherPageShellProps {
  site: SiteContent;
  /** Set on the privacy page so the footer's Privacy link gets aria-current="page". */
  current?: boolean;
  children: ReactNode;
}

/**
 * The shared shell for every page that isn't home: privacy and 404
 * (docs/tickets/04-footer-privacy-404.md, "Decisions"). Reuses the
 * header from ticket 03 in "other page" mode — nav anchors prefixed
 * `/#…`, logo pointing at `/` — plus a slim footer that holds only the
 * legal row (no Sections/Elsewhere columns; those are home-only,
 * ticket 12).
 */
export function OtherPageShell({
  site,
  current = false,
  children,
}: OtherPageShellProps) {
  const visibleSections = getVisibleSections(site);

  return (
    <div className="flex min-h-svh flex-col">
      <Header
        site={site}
        visibleSections={visibleSections}
        anchorPrefix="/"
        logoHref="/"
      />
      <main
        id="top"
        tabIndex={-1}
        className="scroll-mt-18 flex-1 outline-none max-sm:scroll-mt-14 focus-visible:shadow-[inset_2px_0_0_var(--ring)]"
      >
        {children}
      </main>
      <footer className="border-t border-border bg-[color-mix(in_oklab,var(--background)_72%,#000)]">
        <div className={`${CONTAINER_CLASSNAME} py-8`}>
          <LegalRow site={site} current={current} variant="flush" />
        </div>
      </footer>
    </div>
  );
}
