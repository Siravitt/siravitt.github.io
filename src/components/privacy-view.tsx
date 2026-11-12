import Link from "next/link";
import { OtherPageShell } from "@/components/other-page-shell";
import type { SiteContent } from "@/content/site";

/**
 * The restyled `/privacy.html` page (docs/tickets/04-footer-privacy-404.md):
 * a "Back to the portfolio" link, the policy H1 and the policy text,
 * verbatim, nothing added. Must-keep — Google's OAuth consent screen
 * for the Daedalus app links to this page.
 */
export function PrivacyView({ site }: { site: SiteContent }) {
  return (
    <OtherPageShell site={site} current>
      <section
        aria-labelledby="doc-h"
        className="mx-auto max-w-7xl px-6 py-24 max-sm:px-4"
      >
        <div className="grid max-w-[760px] gap-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center self-start text-[15px] font-medium text-muted-foreground underline decoration-border-strong underline-offset-4 hover:text-foreground hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {site.labels.backToPortfolio}
          </Link>
          <h1
            id="doc-h"
            className="text-[length:clamp(38px,3.24vw+25.4px,72px)] leading-[1.02] font-medium tracking-[-0.036em] [font-stretch:96%]"
          >
            {site.daedalus.policyHeading}
          </h1>
          <p className="max-w-[62ch] text-[18px] leading-[1.6]">
            {site.daedalus.policyText}
          </p>
        </div>
      </section>
    </OtherPageShell>
  );
}
