import type { CSSProperties } from "react";
import type { Project, SiteContent } from "@/content/site";
import { PlaceholderText } from "@/components/placeholder-text";
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
 * 03 already owns; this component is its children only. Ticket 09
 * adds the optional picture panel under a card — nothing here reads
 * `project.visual` yet, on purpose.
 *
 * A project's missing optional fields draw nothing for them (DESIGN.md
 * §8, "Project card (bare)"): no `badge` and no `links` together drop
 * the whole top row (not an empty one); no `links` on its own drops
 * the link row with no empty container; `tags: []` drops the tag line.
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
  const hasTopRow = Boolean(project.badge) || hasLinks;

  return (
    <Card
      render={<article />}
      data-rv
      style={{ "--i": rowIndex } as CSSProperties}
      className="min-w-0 gap-0 overflow-visible rounded-none bg-transparent p-0 text-base ring-0"
    >
      {hasTopRow ? (
        <div className="mb-4 flex min-h-8 flex-wrap items-center justify-between gap-4">
          {project.badge ? (
            <Badge
              variant="outline"
              className="h-6 rounded-sm border-border px-3 font-mono text-[13px] text-muted-foreground"
            >
              {project.badge}
            </Badge>
          ) : (
            <span />
          )}
          {hasLinks ? (
            <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
      ) : null}

      <h3 className="text-[18px] leading-[1.4] font-medium [font-stretch:100%] lg:text-[20px]">
        <PlaceholderText text={project.title} />
      </h3>
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
      className="group inline-flex items-center gap-2 rounded-sm text-[14px] font-medium underline decoration-border-strong underline-offset-4 max-sm:min-h-11 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {label}
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
