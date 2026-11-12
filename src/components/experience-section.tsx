import type { CSSProperties } from "react";
import type { ExperienceEntry, SiteContent } from "@/content/site";
import { PlaceholderText } from "@/components/placeholder-text";
import { Badge } from "@/components/ui/badge";

/**
 * The Experience section's body: an intro line, then an `<ol>` timeline
 * — one entry per role, its period (mono, muted) and an optional
 * "Current" badge on the left half, its role/organisation H3, 2–4
 * highlights and an optional tag line on the right half
 * (docs/tickets/11-experience-timeline.md, "Decisions (binding)";
 * DESIGN.md §4 (<1024: period above role — both halves go full width in
 * source order, period first), §6 rows "Experience item"/"Experience
 * timeline"). Rendered inside the `<SectionShell id="experience">`
 * ticket 03 already owns, with the shell's default heading and no
 * `tagline` — the content shape carries only `intro` here (same as
 * Stack's), rendered as the lead paragraph below the H2.
 *
 * The rail (two `<ol>` pseudo-elements: track + lit fill) and each
 * entry's dot (an `aria-hidden` span) are decorative, never announced
 * (ticket decision). The rest-state rail is already fully drawn and
 * every dot lit (DESIGN.md §6 "Experience timeline": "At rest: rail
 * drawn, every dot lit") — ticket 14 owns the scroll-linked draw-in and
 * light-up; `data-exp-rail` (the list) and `data-exp-item` (each entry)
 * are its view-timeline hooks only, nothing reads them yet. `data-rv` +
 * `--i` is the existing per-entry reveal stagger hook (DESIGN §7.1 row
 * 6), the same convention every other section's list uses.
 */
export function ExperienceSection({ site }: { site: SiteContent }) {
  const { experience, labels, sections } = site;
  const { intro } = sections.experience;

  return (
    <>
      {intro ? (
        <p className="mb-8 max-w-[62ch] text-[18px] leading-[1.6] sm:mb-12 lg:text-[20px]">
          <PlaceholderText text={intro} />
        </p>
      ) : null}
      <ol
        data-exp-rail
        className="relative pl-10 before:absolute before:top-1.5 before:bottom-0 before:left-[7px] before:w-0.5 before:rounded-full before:bg-border after:absolute after:top-1.5 after:bottom-0 after:left-[7px] after:w-0.5 after:rounded-full after:bg-foreground/60 max-sm:pl-7"
      >
        {experience.map((entry, index) => (
          <ExperienceItem
            key={`${entry.role}-${entry.organisation}`}
            entry={entry}
            labels={labels}
            index={index}
          />
        ))}
      </ol>
    </>
  );
}

function ExperienceItem({
  entry,
  labels,
  index,
}: {
  entry: ExperienceEntry;
  labels: SiteContent["labels"];
  index: number;
}) {
  const period = `${entry.start} to ${entry.end ?? labels.present}`;
  const tags = entry.tags ?? [];

  return (
    <li
      data-rv
      data-exp-item
      style={{ "--i": index } as CSSProperties}
      className="grid grid-cols-1 gap-y-2 border-b border-border py-5 first:pt-0 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0"
    >
      <div className="relative mb-2 flex min-h-7 min-w-0 items-center gap-3 break-words lg:col-span-6 lg:mb-0">
        {/* The dot: a 12px lit circle (--primary) with a 4px
         * --background cut-out ring (the ring utility), centred on the
         * rail (left-[7px] on the list, 8px dot centre) regardless of
         * the list's own left padding — hence the fixed -38px/-26px
         * offsets below rather than the rail-x arithmetic the
         * prototype's raw CSS uses. Decorative: aria-hidden. */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-[-38px] size-3 -translate-y-1/2 rounded-full bg-primary ring-4 ring-background max-sm:left-[-26px]"
        />
        <span className="font-mono text-[14px] leading-[1.4] text-muted-foreground">
          {period}
        </span>
        {entry.end === undefined ? (
          <Badge
            variant="outline"
            className="h-6 shrink-0 rounded-sm border-primary/55 px-3 font-mono text-[13px] font-medium text-primary"
          >
            {labels.current}
          </Badge>
        ) : null}
      </div>
      <div className="min-w-0 break-words lg:col-span-6 lg:col-start-7">
        <h3 className="text-[18px] leading-[1.4] font-medium [font-stretch:100%] lg:text-[20px]">
          <PlaceholderText text={entry.role} />
          {" \u00b7 "}
          <PlaceholderText text={entry.organisation} />
        </h3>
        <ul className="mt-2 grid gap-0.5">
          {entry.highlights.map((point) => (
            <li key={point} className="min-w-0">
              <PlaceholderText text={point} />
            </li>
          ))}
        </ul>
        {tags.length > 0 ? (
          <p className="mt-3 font-mono text-[13px] text-muted-foreground">
            {tags.join(" \u00b7 ")}
          </p>
        ) : null}
      </div>
    </li>
  );
}
