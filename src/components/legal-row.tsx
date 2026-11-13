import { cn } from "cn";
import type { SiteContent } from "@/content/site";

interface LegalRowProps {
  site: SiteContent;
  /** Set on the privacy page so its own Privacy link gets aria-current="page" (DESIGN.md §8 "Current page"). */
  current?: boolean;
  /**
   * "bordered" (default): a top rule and gap, for the home footer where
   * it sits below ticket 12's content. "flush": no rule/gap, for the
   * privacy/404 slim footer where the legal row is the footer's only
   * content (docs/tickets/04-footer-privacy-404.md, "Decisions").
   */
  variant?: "bordered" | "flush";
  /**
   * Extra classes merged last (tailwind-merge via `cn`), so a caller can
   * override the "bordered" variant's own spacing (e.g. the contact
   * footer's columns→legal gap, DESIGN.md §6 "footer":
   * 48px ≥640 / 24px below) without touching the legal text, the rule,
   * or 04/05's Review Focus 2 tests.
   */
  className?: string;
}

/**
 * The must-keep legal row: the copyright line and the Daedalus
 * paragraph, on every page (docs/tickets/04-footer-privacy-404.md).
 * Every string comes from `site` (`footer.legal`, `daedalus`); nothing
 * is hard-coded. The middle dot separator is a literal `\u00b7`
 * (U+00B7) character, not a styled pseudo-element, so it survives in
 * plain text and can't be stripped by CSS (Review Focus 2).
 */
export function LegalRow({
  site,
  current = false,
  variant = "bordered",
  className,
}: LegalRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 text-sm text-muted-foreground",
        variant === "bordered" && "mt-8 border-t border-border pt-5",
        className,
      )}
    >
      <span>{site.footer.legal}</span>
      <p>
        {site.daedalus.line}
        {" \u00b7 "}
        <a
          href={site.daedalus.privacyPath}
          aria-current={current ? "page" : undefined}
          // Growing the touch target to 44px tall (inline text link, the
          // "Privacy" word in a running sentence — ticket 03 review's
          // 44px-at-390 lesson) without the paragraph's own line growing:
          // inline-flex gives the <a> a real 44px border box, and the
          // matching negative vertical margin pulls that extra box back
          // out of the line's flow so the visible text and line height
          // stay exactly as drawn (design/screenshots/privacy-*, 404-*).
          className="-my-[13px] inline-flex h-11 items-center rounded-sm text-foreground underline decoration-border-strong underline-offset-[3px] hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {site.daedalus.privacyLabel}
        </a>
      </p>
    </div>
  );
}
