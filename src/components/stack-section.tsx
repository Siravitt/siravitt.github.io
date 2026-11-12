import type { SiteContent } from "@/content/site";
import { PlaceholderText } from "@/components/placeholder-text";

/**
 * The Stack section's body: the grouped tool list on the left, and on
 * the right a dark marks panel showing the same tools flattened across
 * groups, each with a one-colour mark drawn as a CSS mask
 * (docs/tickets/07-about-stack.md, "Decisions (binding)"; DESIGN.md §6b
 * "Stack marks", the whole table). Rendered inside the
 * `<SectionShell id="stack">` ticket 03 already owns.
 *
 * The intro line and the rows list share the left column with the
 * marks panel in one grid (DESIGN.md §6b "top-aligned on the right
 * half"): since SectionShell renders the H2 full-width above this
 * component's children, the panel aligns with the top of this body's
 * own left column, not with the page-wide heading.
 *
 * An empty group is skipped in both the list and the panel (ticket's
 * Review Focus 4); the panel keeps a row, name only, for an item with no
 * `icon` (the mark box stays empty so names stay on one line). The
 * panel is `role="img"` named exactly "The marks of the tools in the
 * list" (ticket decision — no count, so it stays true as the list
 * changes); its `<ul>` is `aria-hidden` since the Stack list already
 * names every tool, and nothing inside is focusable (the rows are not
 * links, DESIGN.md §8).
 */
export function StackSection({ site }: { site: SiteContent }) {
  const groups = site.stack.groups.filter((group) => group.items.length > 0);
  const items = groups.flatMap((group) => group.items);
  const intro = site.sections.stack.intro;

  return (
    <div className="mt-12 grid gap-x-6 gap-y-10 max-sm:mt-8 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-5">
        {intro ? (
          <p className="mb-8 max-w-[62ch] text-[18px] leading-[1.6]">
            <PlaceholderText text={intro} />
          </p>
        ) : null}
        <ul>
          {groups.map((group, i) => (
            <li
              key={group.name}
              data-rv
              style={{ "--i": i } as React.CSSProperties}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 border-b border-border py-4 first:pt-0"
            >
              <span className="font-medium">{group.name}</span>
              <span className="text-right text-muted-foreground">
                {group.items.map((item) => item.name).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        role="img"
        aria-label="The marks of the tools in the list"
        className="rounded-lg border border-border bg-card p-6 max-sm:border-0 max-sm:bg-transparent max-sm:p-0 lg:col-span-6 lg:col-start-7 xl:p-12"
      >
        <ul aria-hidden="true" className="grid grid-cols-2 gap-3 max-sm:gap-2">
          {items.map((item, i) => (
            <li
              key={item.name}
              style={
                {
                  "--i": i,
                  "--dx": i % 2 === 0 ? "-24px" : "24px",
                  "--dy": "16px",
                } as React.CSSProperties
              }
              className="group flex min-h-16 cursor-default items-center gap-3 rounded-md border border-border bg-background px-5 text-muted-foreground transition-colors duration-150 hover:border-border-strong max-sm:min-h-12 max-sm:bg-card max-sm:px-4 xl:min-h-22 xl:gap-4 xl:px-6"
            >
              <span
                className="h-5 w-6 flex-none bg-current text-muted-foreground group-hover:text-primary xl:h-8 xl:w-10"
                style={
                  item.icon
                    ? ({
                        "--mark": `url(/icons/stack/${item.icon}.svg)`,
                        WebkitMask: "var(--mark) center / contain no-repeat",
                        mask: "var(--mark) center / contain no-repeat",
                      } as React.CSSProperties)
                    : undefined
                }
              />
              <span className="font-mono text-[13px] text-muted-foreground group-hover:text-foreground xl:text-sm">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
