import { PlaceholderText } from "@/components/placeholder-text";
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
  children?: ReactNode;
}

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
  children,
}: SectionShellProps) {
  const headingId = `${id}-h`;
  return (
    <Tag
      id={id}
      aria-labelledby={headingId}
      tabIndex={-1}
      className="scroll-mt-18 pt-24 pb-12 outline-none max-sm:scroll-mt-14 sm:pt-30 sm:pb-24 focus-visible:shadow-[inset_2px_0_0_var(--ring)]"
    >
      <div className="mx-auto max-w-7xl px-6 max-sm:px-4">
        <h2
          id={headingId}
          className="text-[length:clamp(28px,1.5vw+20px,40px)] leading-[1.1] font-medium tracking-[-0.02em]"
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
        {children}
      </div>
    </Tag>
  );
}
