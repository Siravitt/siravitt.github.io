import { File, Folder } from "lucide-react";
import type { SiteContent } from "@/content/site";

/**
 * The hero editor's 14 drawn lines of `site.ts` (ticket 06, "Decisions
 * (binding)"). Each entry is the line's rendered content; the value
 * lines read live from `site` so the drawing updates with Flame's copy.
 * Keywords, punctuation, file names and the window title are drawing
 * chrome, fixed in this component (binding decision: not content).
 */
function buildLines(site: SiteContent): React.ReactNode[] {
  const githubWithoutProtocol = site.contact.github.replace(/^https?:\/\//, "");
  return [
    <span key={0} className="text-[#7d8590]">
      {"// src/content/site.ts"}
    </span>,
    <span key={1}>
      <span className="text-[#ff9f7a]">export const</span>{" "}
      <span className="text-[#e9ecef]">site</span> = {"{"}
    </span>,
    <span key={2}>{"  person: {"}</span>,
    <span key={3}>
      {"    name: "}
      <span className="text-[#a5e3a0]">&quot;{site.person.name}&quot;</span>
      {","}
    </span>,
    <span key={4}>
      {"    role: "}
      <span className="text-[#a5e3a0]">&quot;{site.person.role}&quot;</span>
      {","}
    </span>,
    <span key={5}>
      {"    pitch: "}
      <span className="text-[#a5e3a0]">&quot;{site.person.pitch}&quot;</span>
      {","}
    </span>,
    <span key={6}>{"  },"}</span>,
    <span key={7}>{"  contact: {"}</span>,
    <span key={8}>
      {"    github: "}
      <span className="text-[#a5e3a0]">
        &quot;{githubWithoutProtocol}&quot;
      </span>
      {","}
    </span>,
    <span key={9}>{"  },"}</span>,
    <span key={10}>{"  daedalus: {"}</span>,
    <span key={11}>
      {"    privacy: "}
      <span className="text-[#a5e3a0]">
        &quot;{site.daedalus.privacyPath}&quot;
      </span>
      {","}
    </span>,
    <span key={12}>{"  },"}</span>,
    <span key={13}>
      {"} "}
      <span className="text-[#ff9f7a]">satisfies</span>{" "}
      <span className="text-[#e9ecef]">Site</span>;
    </span>,
  ];
}

/** 1-indexed in the ticket's prose ("line 4"); 0-indexed here, matching `data-ln`. */
const HIGHLIGHT_LINE_INDEX = 3;
const LINE_HEIGHT_PX = 22;

/**
 * File-tree entry icons (ticket 21, "File-tree labels"): a small folder
 * or file glyph before each entry's lowercase monospace label. Reuses
 * `lucide-react` (already a dependency, unused elsewhere) rather than
 * adding a new icon source. Always `aria-hidden` and `data-tree-icon`
 * for the tests; the whole tree already sits inside the picture's
 * `aria-hidden` subtree, so nothing here changes what a screen reader
 * hears — the labels stay the file/folder names a sighted visitor sees.
 */
const TREE_ICON_CLASSNAME = "size-3.5 shrink-0 opacity-40";

/**
 * The hero's drawn code editor + "Deploy to GitHub Pages" card
 * (docs/tickets/06-hero-editor-facts-ctas.md, "Decisions (binding)";
 * DESIGN.md §6 "Hero editor", §2b "Hero frame"). One `role="img"`
 * picture named by `site.hero.artLabel`; everything inside is
 * `aria-hidden` and nothing inside is focusable. Below 640px the file
 * tree and the deploy card drop, and only the first 8 lines show
 * (DESIGN.md §4).
 *
 * Each line carries `data-ln` (its index) and the highlight bar is its
 * own `data-ln-highlight` element, separate from the lines, so ticket
 * 14 can stagger the type-in and move the highlight without touching
 * this markup.
 */
export function HeroArt({ site }: { site: SiteContent }) {
  const lines = buildLines(site);

  return (
    <div
      role="img"
      aria-label={site.hero.artLabel}
      className="relative h-full min-h-[360px] overflow-hidden rounded-lg bg-frame max-sm:min-h-[280px]"
    >
      {/*
       * DESIGN.md §2b/§6 "Hero editor", matching the prototype's
       * `.hero__art > .ly-piece--main` (ticket 21): inset 64px from the
       * frame's top/left at ≥1024 (`--s-8`), 32px from 640–1023
       * (`--s-6`), 16px below 640 (`--s-4`), as margin (not absolute
       * positioning) so this window still drives the frame's own
       * height the way it did before this ticket — the frame
       * (`overflow-hidden`, no padding of its own) is a new block
       * formatting context, so the margin doesn't collapse through it
       * and the frame's auto height grows to contain it. The right
       * edge bleeds 28px past the frame's own right edge (`--ly-cut`,
       * negative margin); a plain block's `width: auto` already fills
       * what's left after both margins, so no explicit width is
       * needed. The frame above clips the bleed (`overflow-hidden`),
       * so it never causes horizontal scroll.
       */}
      <div
        aria-hidden="true"
        data-hero-main
        className="mt-4 -mr-7 ml-4 overflow-hidden rounded-md bg-[#17191c] shadow-[0_1px_0_rgb(255_255_255/.06)] sm:mt-8 sm:ml-8 lg:mt-16 lg:ml-16"
      >
        <div className="flex h-9 items-center gap-2 border-b border-white/10 px-3 text-[13px] text-[#9ba3ad]">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.5 rounded-full bg-white/20" />
            <i className="size-2.5 rounded-full bg-white/20" />
            <i className="size-2.5 rounded-full bg-white/20" />
          </span>
          <span>siravitt.github.io</span>
        </div>
        <div className="flex min-h-[470px] max-sm:min-h-0">
          <div className="hidden w-32 shrink-0 flex-col gap-1.5 border-r border-white/10 px-3 py-3 font-mono text-[13px] text-[#9ba3ad] sm:flex">
            <span
              data-tree-group
              className="text-[11px] tracking-wide text-[#7d8590]"
            >
              src
            </span>
            <span data-tree-item className="flex items-center gap-1.5">
              <Folder
                aria-hidden="true"
                data-tree-icon
                className={TREE_ICON_CLASSNAME}
              />
              app
            </span>
            <span data-tree-item className="flex items-center gap-1.5">
              <Folder
                aria-hidden="true"
                data-tree-icon
                className={TREE_ICON_CLASSNAME}
              />
              components
            </span>
            <span
              data-tree-item
              className="flex items-center gap-1.5 rounded-sm bg-white/10 px-1 text-[#e9ecef]"
            >
              <File
                aria-hidden="true"
                data-tree-icon
                className={TREE_ICON_CLASSNAME}
              />
              site.ts
            </span>
            <span
              data-tree-group
              className="mt-1 text-[11px] tracking-wide text-[#7d8590]"
            >
              public
            </span>
            <span data-tree-item className="flex items-center gap-1.5">
              <File
                aria-hidden="true"
                data-tree-icon
                className={TREE_ICON_CLASSNAME}
              />
              og.png
            </span>
          </div>
          <div className="min-w-0 flex-1 px-4 py-3 font-mono text-[13px] leading-[22px] text-[#c9d1d9]">
            {/*
             * No padding here: a sibling positioned `absolute` against a
             * padded containing block lands `top` against the *padding*
             * edge, not the content edge, so a padded ancestor would push
             * the highlight bar above line 0 by that padding (review
             * round 1's "bar sits 12px above `name`" bug). This wrapper
             * carries no padding so `top: index * LINE_HEIGHT_PX` lines
             * up exactly with the rendered line.
             */}
            <div className="relative isolate">
              <div
                data-ln-highlight="true"
                aria-hidden="true"
                className="absolute inset-x-0 border-l-2 border-primary bg-primary-tint"
                style={{
                  top: HIGHLIGHT_LINE_INDEX * LINE_HEIGHT_PX,
                  height: LINE_HEIGHT_PX,
                }}
              />
              {lines.map((line, i) => (
                <div
                  key={i}
                  data-ln={i}
                  style={{ "--i": i } as React.CSSProperties}
                  className={
                    i >= 8
                      ? "relative overflow-hidden text-ellipsis whitespace-pre max-sm:hidden"
                      : "relative overflow-hidden text-ellipsis whitespace-pre"
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        data-hero-note
        className="absolute bottom-6 left-6 w-[300px] rounded-lg bg-white p-4 text-[#1c1917] shadow-lg max-sm:hidden"
      >
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-[14px] font-medium">Deploy to GitHub Pages</h5>
          <span className="rounded-full bg-[#dcf5e3] px-2 py-0.5 text-[12px] font-medium text-[#1e7a3c]">
            Done
          </span>
        </div>
        <ul className="mt-3 flex flex-col gap-1.5 text-[13px]">
          <li className="flex items-start gap-1.5">
            <span aria-hidden="true">✓</span>
            <span>
              <b>Lint, types and tests</b> passed
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span aria-hidden="true">✓</span>
            <span>
              Static export, <b>3 pages</b>
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span aria-hidden="true">✓</span>
            <span>
              <b>/privacy.html</b> kept
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
