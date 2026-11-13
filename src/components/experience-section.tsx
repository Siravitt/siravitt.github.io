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
 * entry's dot (two `aria-hidden` spans: an unlit ring under a lit fill,
 * review round 1 fix — the prototype draws both at rest,
 * `scroll.css:56-57`) are decorative, never announced (ticket decision).
 * `after:origin-top` (ticket 15 review, carried-over fix 5) keeps the
 * lit fill's `scaleY` draw-in anchored to the rail's top edge — the
 * default `50% 50%` origin drew it from the centre instead, so its tip
 * never rode the 60% line ticket 14's `--sm-exp`/view-timeline target.
 * The rest-state rail is already fully drawn and every dot lit
 * (DESIGN.md §6 "Experience timeline": "At rest: rail drawn, every dot
 * lit") — ticket 14 owns the scroll-linked draw-in and light-up (it
 * animates only the lit layer; the unlit ring stays under it);
 * `data-exp-rail` (the list) and `data-exp-item` (each entry) are its
 * view-timeline hooks only, nothing reads them yet. `data-rv` + `--i` is
 * the existing per-entry reveal stagger hook (DESIGN §7.1 row 6), the
 * same convention every other section's list uses.
 *
 * The dot sits on the `<li>` itself (not the "when" row), at the
 * prototype's fixed offset — 2px below the li's top edge for the first
 * entry, 26px (its `py-6` padding-top + 2px) for the rest
 * (`scroll.css:53-55`) — so it stays on the period's first line even
 * when the period wraps, and a single entry still draws the rail from
 * its dot (Review Focus 4, review round 1 fix).
 */
export function ExperienceSection({ site }: { site: SiteContent }) {
  const { experience, labels, sections } = site;
  const { intro } = sections.experience;

  return (
    <>
      {intro ? (
        <p className="mt-4 mb-8 max-w-[62ch] text-[18px] leading-[1.5] sm:mb-12 lg:text-[20px]">
          <PlaceholderText text={intro} />
        </p>
      ) : null}
      <ol
        data-exp-rail
        className="relative pl-10 before:absolute before:top-1.5 before:bottom-0 before:left-[7px] before:w-0.5 before:rounded-full before:bg-border after:absolute after:top-1.5 after:bottom-0 after:left-[7px] after:w-0.5 after:origin-top after:rounded-full after:bg-foreground/60 max-sm:pl-7"
      >
        {experience.map((entry, index) => (
          <ExperienceItem
            // The three shipped entries share a role and organisation
            // (all still `[Placeholder]`); the list is static and
            // ordered, so the index is a stable key (review round 1
            // fix — a role+organisation key collided across entries).
            key={index}
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
  const tags = entry.tags ?? [];
  const isFirst = index === 0;
  const dotTopClass = isFirst ? "top-0.5" : "top-[26px]";

  return (
    <li
      data-rv
      data-exp-item
      style={{ "--i": index } as CSSProperties}
      className="relative grid grid-cols-1 gap-y-2 border-b border-border py-6 first:pt-0 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0"
    >
      {/* The dot: an unlit ring (--border-strong ring on a
       * --background fill) under a lit --primary circle with a 4px
       * --background cut-out, both 12px and centred on the rail
       * (left-[7px] on the list, 8px dot centre) regardless of the
       * list's own left padding — hence the fixed -38px/-26px offsets
       * below rather than the rail-x arithmetic the prototype's raw
       * CSS uses. Positioned on the `<li>` itself, 2px below its top
       * edge for the first entry or 26px (py-6 + 2px) for the rest,
       * so it tracks the period's first line, not the row's centre.
       * Decorative: aria-hidden. */}
      <span
        aria-hidden="true"
        className={`absolute left-[-38px] size-3 rounded-full border-2 border-border-strong bg-background max-sm:left-[-26px] ${dotTopClass}`}
      />
      <span
        aria-hidden="true"
        data-exp-dot
        className={`absolute left-[-38px] size-3 rounded-full border-2 border-primary bg-primary shadow-[0_0_0_4px_var(--background)] max-sm:left-[-26px] ${dotTopClass}`}
      />
      <div className="flex min-h-7 min-w-0 items-center gap-3 self-start break-words lg:col-span-6">
        <span className="font-mono text-[14px] leading-[1.4] text-muted-foreground">
          <PlaceholderText text={entry.start} /> to{" "}
          {entry.end ? <PlaceholderText text={entry.end} /> : labels.present}
        </span>
        {entry.end === undefined ? (
          <Badge
            variant="outline"
            className="h-6 shrink-0 rounded-full border-primary/55 px-3 font-mono text-[13px] font-medium text-primary"
          >
            {labels.current}
          </Badge>
        ) : null}
      </div>
      <div className="min-w-0 break-words lg:col-span-6 lg:col-start-7">
        <h3 className="text-[18px] leading-[1.4] font-medium tracking-[-0.028em] lg:text-[20px]">
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
