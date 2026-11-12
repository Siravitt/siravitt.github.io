import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { OtherPageShell } from "@/components/other-page-shell";
import type { SiteContent } from "@/content/site";

/**
 * The styled 404 page (docs/tickets/04-footer-privacy-404.md): a
 * decorative "404" glyph (hidden from the accessibility tree), the
 * not-found heading and text, and a primary button back to the
 * portfolio. Next's `src/app/not-found.tsx` renders this.
 */
export function NotFoundView({ site }: { site: SiteContent }) {
  return (
    <OtherPageShell site={site}>
      <section
        aria-labelledby="nf-h"
        className="mx-auto max-w-7xl px-6 py-24 max-sm:px-4"
      >
        <div className="grid max-w-[760px] gap-6">
          <p
            aria-hidden="true"
            className="font-mono text-[length:clamp(64px,9vw,128px)] leading-none tracking-[-0.04em] text-primary"
          >
            404
          </p>
          <h1
            id="nf-h"
            className="text-[length:clamp(38px,3.24vw+25.4px,72px)] leading-[1.02] font-medium tracking-[-0.036em] [font-stretch:96%]"
          >
            {site.notFound.title}
          </h1>
          <p className="max-w-[62ch] text-[18px] leading-[1.6]">
            {site.notFound.text}
          </p>
          <div className="mt-3">
            <Button
              render={
                <Link href="/">
                  {site.notFound.actionLabel}
                  <Kbd aria-hidden="true">&#8629;</Kbd>
                </Link>
              }
            />
          </div>
        </div>
      </section>
    </OtherPageShell>
  );
}
