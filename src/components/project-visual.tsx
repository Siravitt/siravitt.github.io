import type { ReactNode } from "react";
import type {
  ChecklistItem,
  ProjectVisual as ProjectVisualData,
  TerminalResult,
} from "@/content/site";
import { cn } from "cn";

/**
 * The project panel's picture (docs/tickets/09-project-visuals-terminal-checklist.md):
 * a 228px (phone 200px) sand panel under a card's tags, holding either
 * a real image or one of this ticket's two drawn mini-UIs (`terminal`,
 * `checklist`; the third, `diff-review`, is ticket 10). Each mini-UI is
 * its own self-contained window, drawn as its finished frame — no
 * motion lives here, that's ticket 16 — `aria-hidden` inside the
 * panel's `role="img"` (DESIGN.md §2b, §6 "Project card"). An `image`
 * visual keeps its own `alt` as the accessible name instead: the `img`
 * element already carries that role, so the panel doesn't duplicate it.
 */
export function ProjectVisual({ visual }: { visual: ProjectVisualData }) {
  if (visual.kind === "image") {
    return (
      <Panel>
        {/* eslint-disable-next-line @next/next/no-img-element -- static
            export (no Image Optimization server); explicit width/height
            already prevent CLS, ticket 09 decision: a plain <img> is
            simpler here than next/image's `unoptimized` mode. */}
        <img
          src={visual.src}
          alt={visual.alt}
          width={visual.width}
          height={visual.height}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </Panel>
    );
  }

  if (visual.kind === "terminal") {
    return (
      <Panel role="img" ariaLabel={visual.label}>
        <TerminalWindow visual={visual} />
      </Panel>
    );
  }

  return (
    <Panel role="img" ariaLabel={visual.label}>
      <ChecklistWindow visual={visual} />
    </Panel>
  );
}

function Panel({
  role,
  ariaLabel,
  children,
}: {
  role?: "img";
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className="frame-mesh relative mt-6 h-[228px] overflow-hidden rounded-lg max-sm:h-[200px]"
    >
      {children}
    </div>
  );
}

/**
 * Shared window chrome both mini-UIs sit in: their own ground, one step
 * lighter than `--card` (DESIGN §2a "`--primary` on `--card` (… mini-UIs)";
 * the approved design kit's cards.css `.stage` --fx-bg formula, ported to
 * the `--window` token in globals.css). Review round 1 finding 1: the
 * window is dark, not a white card — `text-foreground`/`text-muted-foreground`
 * read fine on it because it is the dark ground, not light. Finding 2e:
 * every mini-UI reads at the design kit's 13px/20px text.
 */
function Window({
  maxWidthClassName,
  children,
}: {
  maxWidthClassName: string;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-x-4 top-4 flex justify-center sm:inset-x-8 sm:top-8">
      <div
        aria-hidden="true"
        className={cn(
          "w-full overflow-hidden rounded-xl border border-window-border bg-window text-[13px] leading-5 text-foreground shadow-[var(--window-shadow)]",
          maxWidthClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** A git-branch glyph for the terminal window's branch chip, decorative. */
function BranchIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
    >
      <circle cx="5" cy="3.5" r="1.5" />
      <circle cx="5" cy="12.5" r="1.5" />
      <circle cx="11" cy="5.5" r="1.5" />
      <path d="M5 5v6M11 7c0 2.6-6 1.8-6 4" />
    </svg>
  );
}

function TerminalWindow({
  visual,
}: {
  visual: Extract<ProjectVisualData, { kind: "terminal" }>;
}) {
  return (
    <Window maxWidthClassName="max-w-[440px]">
      <div className="flex h-10 items-center gap-2.5 border-b border-window-border bg-foreground/[0.03] px-3.5">
        <span className="flex flex-none gap-1.5">
          <i className="size-2.5 rounded-full bg-foreground/15" />
          <i className="size-2.5 rounded-full bg-foreground/15" />
          <i className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="truncate font-medium">{visual.title}</span>
        <span className="text-muted-foreground">zsh</span>
        <span className="ml-auto inline-flex h-[22px] flex-none items-center gap-1.5 rounded-md bg-foreground/5 px-2 font-mono text-muted-foreground ring-1 ring-inset ring-window-border">
          <BranchIcon />
          {visual.branch}
        </span>
      </div>
      <div className="px-4 py-3 font-mono">
        <p className="truncate">
          <span className="text-muted-foreground">~/{visual.title} $ </span>
          <span className="font-medium">{visual.command}</span>
        </p>
        {visual.results.map((result, index) => (
          <TerminalResultLine key={result.path} result={result} index={index} />
        ))}
        <p className="flex items-center gap-2">
          <span className="grid size-4 flex-none place-items-center rounded-full bg-[#3fae66] text-window">
            ✓
          </span>
          <b className="font-medium">PASS</b>
          <span className="text-muted-foreground">{visual.summary}</span>
        </p>
        <p className="truncate">
          <span className="text-muted-foreground">~/{visual.title} $ </span>
          <span
            aria-hidden="true"
            className="ml-px inline-block h-[15px] w-[7px] rounded-[1px] bg-foreground align-text-bottom"
          />
        </p>
      </div>
    </Window>
  );
}

/** `data-line-index` is a ticket-16 motion hook only; nothing reads it yet. */
function TerminalResultLine({
  result,
  index,
}: {
  result: TerminalResult;
  index: number;
}) {
  return (
    <p data-line-index={index} className="flex h-5 items-center gap-2.5">
      <span
        className="grid size-3.5 flex-none place-items-center text-muted-foreground"
        aria-hidden="true"
      >
        ✓
      </span>
      <span className="min-w-0 flex-[0_1_28ch] truncate text-foreground/80">
        {result.path}
      </span>
      <span className="flex-none text-muted-foreground max-sm:hidden">ok</span>
      <span className="flex-none text-muted-foreground">{result.time}</span>
    </p>
  );
}

function ChecklistWindow({
  visual,
}: {
  visual: Extract<ProjectVisualData, { kind: "checklist" }>;
}) {
  const total = visual.items.length;
  const done = visual.items.filter((item) => item.done).length;
  const ratio = done / total;

  return (
    <Window maxWidthClassName="max-w-[340px]">
      <div className="flex h-12 items-center justify-between px-4">
        <span className="font-medium">{visual.title}</span>
        <span className="text-muted-foreground">
          {done} of {total}
        </span>
      </div>
      <div className="mx-4 mb-2 h-1 overflow-hidden rounded-full bg-border">
        {/* data-bar is a ticket-16 motion hook only; nothing reads it yet. */}
        <div
          data-bar
          className="h-full rounded-full bg-primary"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <ul className="pb-2">
        {visual.items.map((item, index) => (
          <ChecklistRow key={item.text} item={item} index={index} />
        ))}
      </ul>
    </Window>
  );
}

/** `data-tick-index` is a ticket-16 motion hook only; nothing reads it yet. */
function ChecklistRow({ item, index }: { item: ChecklistItem; index: number }) {
  return (
    <li data-tick-index={index} className="flex h-10 items-center gap-3 px-4">
      <span
        className={cn(
          "grid size-[18px] flex-none place-items-center rounded-full text-window",
          item.done ? "bg-foreground" : "ring-[1.5px] ring-foreground/15",
        )}
      >
        {item.done ? "✓" : null}
      </span>
      <span
        className={cn(
          "truncate",
          item.done && "text-muted-foreground line-through",
        )}
      >
        {item.text}
      </span>
    </li>
  );
}
