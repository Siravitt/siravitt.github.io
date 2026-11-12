import { PlaceholderText } from "@/components/placeholder-text";
import { cn } from "cn";
import type { ReactNode } from "react";

interface SectionShellProps {
  /** The section's anchor id (also used for the nav word and the jump target). */
  id: string;
  /** Default title; also the nav word (ticket 03 decision). */
  title: string;
  /** The muted part after "Title." (e.g. "The languages and tools behind his software."). */
  tagline?: string;
  /** `section` for About/Stack/Projects/Experience; `footer` for Contact (ticket 03 decision). */
  as?: "section" | "footer";
  /**
   * Overrides the heading's default display-size classes. About's H2
   * renders as a muted label instead (DESIGN.md §6 "About statement"),
   * so ticket 07 passes its own classes here rather than forking the
   * shell for one section.
   */
  headingClassName?: string;
  /**
   * False when the body places its own `<h2 id={headingId}>` inside its
   * own layout, instead of the shell rendering it full-width above
   * `children` (ticket 07 review round 1: Stack's H2 lives in the left
   * column, top-aligned with the marks panel, DESIGN.md §6b). The shell
   * still owns the id/`aria-labelledby`/`tabIndex`/scroll-margin
   * contract; `children` becomes a render-prop called with `headingId`
   * so the body's own heading keeps that same id. Defaults to `true`.
   */
  renderHeading?: boolean;
  /**
   * Extra classes on the section/footer element itself, merged after the
   * shell's own (ticket 08: Projects sits on the raised `--card` band,
   * DESIGN.md §2 "also the Projects band" — `className="bg-card"`).
   */
  className?: string;
  children?: ReactNode | ((headingId: string) => ReactNode);
}

export const DEFAULT_HEADING_CLASSNAME =
  "text-[length:clamp(30px,1.72vw+23.3px,48px)] leading-[1.1] font-medium tracking-[-0.028em]";

/**
 * One section's shell: the anchor id, the H2 (`Title.` + muted tagline,
 * or `Title` alone), the sticky-header scroll offset and the keyboard
 * focus style a jump lands on (docs/tickets/03-page-skeleton-header-nav.md,
 * "Decisions"; DESIGN.md §4 jump offset, §7.5 part 2-3). Each section
 * ticket (06/07/08/11/12) renders its own body as `children`; this
 * component owns only the shell and the heading.
 */
export function SectionShell({
  id,
  title,
  tagline,
  as: Tag = "section",
  headingClassName,
  renderHeading = true,
  className,
  children,
}: SectionShellProps) {
  const headingId = `${id}-h`;
  return (
    <Tag
      id={id}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={cn(
        "scroll-mt-18 pt-24 pb-12 outline-none max-sm:scroll-mt-14 sm:pt-30 sm:pb-24 focus-visible:shadow-[inset_2px_0_0_var(--ring)]",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6 max-sm:px-4">
        {renderHeading ? (
          <h2
            id={headingId}
            className={headingClassName ?? DEFAULT_HEADING_CLASSNAME}
          >
            {title}
            {tagline ? (
              <>
                {"."}
                <span className="text-muted-foreground">
                  {" "}
                  <PlaceholderText text={tagline} />
                </span>
              </>
            ) : null}
          </h2>
        ) : null}
        {typeof children === "function" ? children(headingId) : children}
      </div>
    </Tag>
  );
}
