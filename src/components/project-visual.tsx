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
      className="frame-mesh relative mt-8 h-[228px] overflow-hidden rounded-lg max-sm:h-[200px]"
    >
      {children}
    </div>
  );
}

/** Shared window chrome both mini-UIs sit in: their own (light) ground. */
function Window({
  maxWidthClassName,
  children,
}: {
  maxWidthClassName: string;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-x-4 top-8 flex justify-center sm:inset-x-8">
      <div
        aria-hidden="true"
        className={cn(
          "w-full overflow-hidden rounded-md bg-white text-[13px] text-[#111111] shadow-[0_12px_24px_-8px_rgb(0_0_0/0.25)]",
          maxWidthClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function TerminalWindow({
  visual,
}: {
  visual: Extract<ProjectVisualData, { kind: "terminal" }>;
}) {
  return (
    <Window maxWidthClassName="max-w-[440px]">
      <div className="flex h-10 items-center gap-2.5 border-b border-black/10 bg-black/[0.03] px-3.5">
        <span className="flex flex-none gap-1.5">
          <i className="size-2.5 rounded-full bg-black/15" />
          <i className="size-2.5 rounded-full bg-black/15" />
          <i className="size-2.5 rounded-full bg-black/15" />
        </span>
        <span className="truncate font-medium">{visual.title}</span>
        <span className="text-[#6b6b6b]">zsh</span>
        <span className="ml-auto font-mono text-[#6b6b6b]">
          {visual.branch}
        </span>
      </div>
      <div className="px-4 py-3 font-mono leading-5">
        <p className="truncate">
          <span className="text-[#6b6b6b]">~/{visual.title}$ </span>
          <span className="font-medium">{visual.command}</span>
        </p>
        {visual.results.map((result, index) => (
          <TerminalResultLine key={result.path} result={result} index={index} />
        ))}
        <p className="flex items-center gap-2 pt-1">
          <span className="grid size-4 flex-none place-items-center rounded-full bg-[#3fae66] text-white">
            ✓
          </span>
          <b className="font-medium">PASS</b>
          <span className="text-[#6b6b6b]">{visual.summary}</span>
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
    <p data-line-index={index} className="flex items-center gap-2">
      <span className="flex-none text-[#3fae66]">✓</span>
      <span className="min-w-0 truncate">{result.path}</span>
      <span className="text-[#6b6b6b]">ok</span>
      <span className="ml-auto flex-none text-[#6b6b6b]">{result.time}</span>
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
        <span className="text-[#6b6b6b]">
          {done} of {total}
        </span>
      </div>
      <div className="mx-4 mb-2 h-1 overflow-hidden rounded-full bg-black/10">
        {/* data-bar is a ticket-16 motion hook only; nothing reads it yet. */}
        <div
          data-bar
          className="h-full rounded-full bg-primary"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <ul>
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
    <li data-tick-index={index} className="flex items-center gap-3 px-4 py-2">
      <span
        className={cn(
          "grid size-[18px] flex-none place-items-center rounded-full text-white",
          item.done ? "bg-black" : "ring-1 ring-black/15",
        )}
      >
        {item.done ? "✓" : null}
      </span>
      <span
        className={cn("truncate", item.done && "text-[#6b6b6b] line-through")}
      >
        {item.text}
      </span>
    </li>
  );
}
