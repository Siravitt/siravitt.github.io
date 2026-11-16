import type { CSSProperties } from "react";
import type { Project, SiteContent } from "@/content/site";
import { PlaceholderText } from "@/components/placeholder-text";
import { ProjectVisual } from "@/components/project-visual";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { isExternalHref } from "@/lib/links";
import { cn } from "cn";

/**
 * The Projects section's body: one `<article>` Card per `site.projects`
 * entry, two per row on a 12-column grid (card spans 6), one per row
 * on phones (docs/tickets/08-projects-cards.md, "Decisions (binding)";
 * DESIGN.md §4, §6 "Project card" / "Project card (bare)", §6a `link`
 * variant). Rendered inside the `<SectionShell id="projects">` ticket
 * 03 already owns; this component is its children only.
 *
 * A project's missing optional fields draw nothing for them (DESIGN.md
 * §8, "Project card (bare)"): no `badge` drops its own line above the
 * title; no `links` drops the link span from the title row with no
 * empty container; `tags: []` drops the tag line.
 *
 * Ticket 20: the link(s) sit on the title row itself (title left,
 * links right-aligned, baseline-aligned, wrapping under the title when
 * there's no room) instead of a row above it, so a card's title sits at
 * the same height whether or not it has links. The grid already
 * stretches both cards of a row to equal height; the visual panel is
 * pinned to the card's bottom by a flex-grow spacer above it so panels
 * also line up top and bottom across a row, even when one card's text
 * runs longer.
 *
 * Each card carries its position within its row of two (`--i`, 0 or 1)
 * as a ticket-14 scroll-stagger hook only — nothing reads it yet.
 */
export function ProjectsSection({ site }: { site: SiteContent }) {
  const { projects, labels } = site;
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 max-sm:gap-y-8 lg:gap-y-6">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.title}
          project={project}
          labels={labels}
          rowIndex={index % 2}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  labels,
  rowIndex,
}: {
  project: Project;
  labels: SiteContent["labels"];
  rowIndex: number;
}) {
  const hasLinks = Boolean(project.links?.source || project.links?.live);

  return (
    <Card
      render={<article />}
      data-rv
      style={{ "--i": rowIndex } as CSSProperties}
      className="min-w-0 gap-0 overflow-visible rounded-none bg-transparent p-0 text-base ring-0"
    >
      {project.badge ? (
        <div className="mb-4">
          <Badge
            variant="outline"
            className="h-6 rounded-sm border-border px-3 font-mono text-[13px] text-muted-foreground"
          >
            {project.badge}
          </Badge>
        </div>
      ) : null}

      {/* Ticket 20: the link(s) live on the title row (title left,
          links right-aligned, `items-baseline` so the link text's
          baseline meets the title's), not a row above it — the title
          sits at the same height whether or not a card has links.
          `flex-wrap` moves the link span under the title when the
          title is long or the viewport is narrow, instead of
          overflowing or truncating either one. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        {/* A flex item's default `min-width` is its min-content width,
            not 0 — a single unbroken word in the title would otherwise
            refuse to shrink below that width and push the row (and the
            page) wider than the viewport, even with `break-words`
            elsewhere. `min-w-0` lets the title shrink and wrap/break
            normally inside the flex row. */}
        <h3 className="min-w-0 text-[18px] leading-[1.4] font-medium [font-stretch:100%] lg:text-[20px]">
          <PlaceholderText text={project.title} />
        </h3>
        {hasLinks ? (
          <span className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2">
            {project.links?.source ? (
              <ProjectLink
                href={project.links.source}
                label={labels.sourceCode}
                relation="for"
                title={project.title}
              />
            ) : null}
            {project.links?.live ? (
              <ProjectLink
                href={project.links.live}
                label={labels.liveDemo}
                relation="of"
                title={project.title}
              />
            ) : null}
          </span>
        ) : null}
      </div>

      <p className="mt-2 font-medium">
        <PlaceholderText text={project.summary} />
      </p>
      <p className="mt-1 max-w-[58ch]">
        <PlaceholderText text={project.description} />
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-x-6">
        <div className="min-w-0">
          <dt className="text-[13px] font-medium text-muted-foreground">
            {labels.role}
          </dt>
          <dd className="mt-0.5 break-words">
            <PlaceholderText text={project.role} />
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[13px] font-medium text-muted-foreground">
            {labels.outcome}
          </dt>
          <dd className="mt-0.5 break-words">
            <PlaceholderText text={project.outcome} />
          </dd>
        </div>
      </dl>
      {project.tags.length > 0 ? (
        <p className="mt-3 font-mono text-[13px] text-muted-foreground">
          {project.tags.join(" \u00b7 ")}
        </p>
      ) : null}
      {project.visual ? (
        <>
          {/* Equal cards (ticket 20): the grid already stretches both
              cards of a row to the same height; this spacer absorbs
              whatever is left over above the fixed-height panel so
              the panel is flush with the card's bottom in every card
              — which, since every panel in a row now shares the same
              bottom and the same fixed height, also makes their tops
              line up. A plain `mt-auto` on the panel itself would do
              the same but without a guaranteed minimum gap above it;
              `min-h-6` keeps the ticket 09 24px breathing room even
              for the row's tallest card. */}
          <div aria-hidden="true" className="min-h-6 grow" />
          <ProjectVisual visual={project.visual} />
        </>
      ) : null}
    </Card>
  );
}

function ProjectLink({
  href,
  label,
  relation,
  title,
}: {
  href: string;
  label: string;
  relation: "for" | "of";
  title: string;
}) {
  const external = isExternalHref(href);
  return (
    <a
      href={href}
      aria-label={`${label} ${relation} ${title}`}
      className="group inline-flex items-center gap-2 rounded-sm text-[14px] font-medium max-sm:min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Reviewer round 2 (round 1 fix 5 wasn't effective): see the
       * matching comment on `ProfileLink` above — decoration moves off
       * this `inline-flex` `<a>`, which was propagating it into the
       * glyph as its own short line, onto the label `<span>` only. The
       * rest-state underline (DESIGN.md §6a, always on for these
       * links, not hover-only) lives on that span too.
       * Carried-over fix (ticket 14 review, DESIGN.md §8 "Hover:
       * links" — underline from `--border-strong` to `currentColor`):
       * `group-focus-visible:decoration-current` matches the existing
       * `group-hover:decoration-current`, so the faint line also
       * sweeps to `currentColor` on keyboard focus, not just hover.
       * The ↗/→ glyph span above stays its own sibling and is never
       * underlined. */}
      <span className="underline decoration-border-strong underline-offset-4 group-hover:decoration-current group-focus-visible:decoration-current">
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "inline-block transition-transform duration-150",
          external
            ? "group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
            : "group-hover:translate-x-[3px]",
        )}
      >
        {external ? "\u2197" : "\u2192"}
      </span>
    </a>
  );
}
