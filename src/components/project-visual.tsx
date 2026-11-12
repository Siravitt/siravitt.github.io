import type { ReactNode } from "react";
import type {
  ChecklistItem,
  ProjectVisual as ProjectVisualData,
  TerminalResult,
} from "@/content/site";
import { cn } from "cn";

/**
 * The project panel's picture (docs/tickets/09-project-visuals-terminal-checklist.md,
 * carried into ticket 10): a sand panel under a card's tags, holding
 * either a real image or one of three drawn mini-UIs (`terminal`,
 * `checklist`, `diff`). Each mini-UI is its own self-contained window,
 * drawn as its finished frame — no motion lives here, that's ticket 16
 * — `aria-hidden` inside the panel's `role="img"` (DESIGN.md §2b, §6
 * "Project card"). An `image` visual keeps its own `alt` as the
 * accessible name instead: the `img` element already carries that
 * role, so the panel doesn't duplicate it.
 *
 * The panel stretches to fill its card (ticket 10 carried-over fix 2,
 * `min-height` + `flex: 1 0 auto`, matching the approved prototype's
 * `assets/ui/cards.css` `.panel` rule and `site.css`'s `#projects .panel`
 * override: 228px desktop, 200px phone), so every panel in a row of
 * cards bottoms out together even when one card's text runs longer.
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

  if (visual.kind === "checklist") {
    return (
      <Panel role="img" ariaLabel={visual.label}>
        <ChecklistWindow visual={visual} />
      </Panel>
    );
  }

  return (
    <Panel role="img" ariaLabel={visual.label}>
      {/* The prototype's `.stage--fade-b` (cards.css): only the layer that
          wraps the diff window dissolves into the panel's ground over its
          last 64px (56px on phones) — the sand panel itself (`Panel`,
          below) stays whole (review round 1 finding 2: the mask had sat on
          the whole panel, fading the sand itself). Tailwind arbitrary
          `mask-image` utilities (CODING_STANDARDS §2.2: no inline style);
          `-webkit-mask-image` for Safari, which does not yet unprefix it. */}
      <div className="absolute inset-0 [-webkit-mask-image:linear-gradient(to_bottom,#000_calc(100%-64px),transparent_calc(100%-4px))] [mask-image:linear-gradient(to_bottom,#000_calc(100%-64px),transparent_calc(100%-4px))] max-sm:[-webkit-mask-image:linear-gradient(to_bottom,#000_calc(100%-56px),transparent_calc(100%-4px))] max-sm:[mask-image:linear-gradient(to_bottom,#000_calc(100%-56px),transparent_calc(100%-4px))]">
        <DiffWindow visual={visual} />
      </div>
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
      className="frame-mesh relative mt-6 min-h-[228px] grow shrink-0 overflow-hidden rounded-lg max-sm:min-h-[200px]"
    >
      {children}
    </div>
  );
}

/**
 * Shared window chrome both mini-UIs sit in: their own ground, derived
 * from `--background` (DESIGN §2a "`--primary` on `--card` (… mini-UIs)";
 * the approved design kit's cards.css `.stage` --fx-bg formula reads the
 * page ground inside a project card, ported to the `--window` token in
 * globals.css — review round 2 finding 1). Review round 1 finding 1: the
 * window is dark, not a white card — `text-foreground`/`text-muted-foreground`
 * read fine on it because it is the dark ground, not light. Finding 2e:
 * every mini-UI reads at the design kit's 13px/20px text. Round 3 finding
 * 2: `@container` makes narrow layout follow the window's own rendered
 * width, not the viewport, matching the kit's `@container ui-term` rules.
 */
function Window({
  maxWidthClassName,
  topClassName = "top-4 sm:top-8",
  children,
}: {
  maxWidthClassName: string;
  /** The prototype's `.at-corner`'s `--ay`/`--ay-sm` (cards.css): the
   * terminal/checklist fragments override `--ay-sm` to 16px, the diff
   * fragment keeps the kit's default 24px — ticket 10. */
  topClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-4 flex justify-center sm:inset-x-8",
        topClassName,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "@container w-full overflow-hidden rounded-xl border border-window-border bg-window text-[13px] leading-5 text-foreground shadow-[var(--window-shadow)]",
          maxWidthClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Splits a repo title ("booking/api") into its parent folder and leaf
 * segment at the last `/`, so the terminal prompt can hide the parent
 * on a narrow window (ticket 09 review round 3 finding 2, the kit's
 * `.ui-term__up`) without a new content field.
 */
export function splitTitle(title: string): { dir: string; leaf: string } {
  const lastSlash = title.lastIndexOf("/");
  return lastSlash === -1
    ? { dir: "", leaf: title }
    : { dir: title.slice(0, lastSlash + 1), leaf: title.slice(lastSlash + 1) };
}

/** The terminal's `~/<dir><leaf> $ ` prompt, shared by the typed command
 * line and the empty next-prompt line. Hides `dir` below a 299px window
 * (the kit's `@container ui-term (max-width: 299px) .ui-term__up`). */
function TerminalPrompt({ title }: { title: string }) {
  const { dir, leaf } = splitTitle(title);
  return (
    <span className="text-muted-foreground">
      ~/<span className="@max-[300px]:hidden">{dir}</span>
      {leaf} ${" "}
    </span>
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
        <span className="ml-auto inline-flex h-[22px] flex-none items-center gap-1.5 rounded-md bg-foreground/5 px-2 font-mono text-muted-foreground ring-1 ring-inset ring-window-border @max-[300px]:hidden">
          <BranchIcon />
          {visual.branch}
        </span>
      </div>
      <div className="px-4 py-3 font-mono @max-[300px]:px-3">
        <p className="truncate">
          <TerminalPrompt title={visual.title} />
          <span className="font-medium">{visual.command}</span>
        </p>
        {visual.results.map((result, index) => (
          <TerminalResultLine key={result.path} result={result} index={index} />
        ))}
        <p className="flex items-center gap-2">
          <span className="grid size-4 flex-none place-items-center rounded-full bg-diff-add text-window">
            ✓
          </span>
          <b className="font-medium">PASS</b>
          <span className="text-muted-foreground">{visual.summary}</span>
        </p>
        <p className="truncate">
          <TerminalPrompt title={visual.title} />
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
      <span className="min-w-0 flex-[0_1_28ch] truncate text-foreground/80 @max-[300px]:flex-1">
        {result.path}
      </span>
      <span className="flex-none text-muted-foreground @max-[380px]:hidden">
        ok
      </span>
      <span className="w-12 flex-none text-right text-muted-foreground @max-[300px]:w-11">
        {result.time}
      </span>
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

/** The small fixed Go keyword set the diff's tokenizer colours
 * (ticket 10 decision: `if`, `nil`, `return`, `func`). */
const GO_KEYWORDS = new Set(["if", "nil", "return", "func"]);

/**
 * The small Go tokenizer (ticket 10 decision, ≤ ~20 lines): colours
 * the fixed keyword set (DESIGN.md §2, `#ff9f7a`), the identifier
 * directly before `(` as a function call (`#e9ecef`), a quoted string
 * (`#a5e3a0`), and everything else in the plain code colour
 * (`#c9d1d9`) — the same raw-hex convention `hero-art.tsx` already
 * uses for this decorative, `aria-hidden` syntax colouring.
 */
function tokenizeGo(code: string, keyPrefix: string): ReactNode[] {
  const tokens = code.split(/(\s+|[(){}.,]|"[^"]*")/).filter((t) => t !== "");
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (GO_KEYWORDS.has(token)) {
      return (
        <span key={key} className="text-[#ff9f7a]">
          {token}
        </span>
      );
    }
    if (tokens[index + 1] === "(" && /^[A-Za-z_]\w*$/.test(token)) {
      return (
        <span key={key} className="text-[#e9ecef]">
          {token}
        </span>
      );
    }
    if (/^".*"$/.test(token)) {
      return (
        <span key={key} className="text-[#a5e3a0]">
          {token}
        </span>
      );
    }
    return (
      <span key={key} className="text-[#c9d1d9]">
        {token}
      </span>
    );
  });
}

/**
 * Tokenizes `code`, wrapping the `marked` substring (if found) in a
 * `<mark>` for its own highlight. When `marked` is missing or absent
 * from `code` (ticket 10 Seam A: must not crash), the line still
 * renders in full, tokenized, with no highlight.
 */
function renderDiffCode(
  code: string,
  marked: string | undefined,
  keyPrefix: string,
  kind?: "add" | "del",
): ReactNode {
  const index = marked ? code.indexOf(marked) : -1;
  if (!marked || index === -1) {
    return tokenizeGo(code, keyPrefix);
  }
  const before = code.slice(0, index);
  const after = code.slice(index + marked.length);
  /* review round 1 finding 5: a flat `bg-current/15` reads neutral grey
   * on every row. The kit tints the mark with the row's own hue — del
   * 26%, add 30%, both mixed over the window ground (`fragment.css`
   * `.ui-diff mark.ui-diff__w`, `--d-del-w`/`--d-add-w`) — so removed
   * marks read red and added marks read green, as in the approved
   * screenshot. */
  return (
    <>
      {tokenizeGo(before, `${keyPrefix}-pre`)}
      <mark
        className={cn(
          "rounded-[3px] py-px text-inherit",
          kind === "del"
            ? "bg-[color-mix(in_oklab,var(--diff-del)_26%,var(--window))]"
            : "bg-[color-mix(in_oklab,var(--diff-add)_30%,var(--window))]",
        )}
      >
        {tokenizeGo(marked, `${keyPrefix}-mark`)}
      </mark>
      {tokenizeGo(after, `${keyPrefix}-post`)}
    </>
  );
}

/** Splits `comment` on backtick pairs, rendering each span as `<code>`
 * (ticket 10 decision: the comment "may hold one inline-code span"). */
function renderDiffComment(comment: string): ReactNode[] {
  return comment.split(/`([^`]+)`/).map((part, index) =>
    index % 2 === 1 ? (
      <code
        key={index}
        className="rounded-[4px] bg-foreground/10 px-1 py-px font-mono text-[12px] text-foreground"
      >
        {part}
      </code>
    ) : (
      part
    ),
  );
}

/** One numbered row of the diff's unified view: a changed (`add`/`del`)
 * line carries its own sign and tint, a context line carries neither. */
function DiffLine({
  oldNumber,
  newNumber,
  kind,
  code,
  marked,
  keyPrefix,
}: {
  oldNumber: number | null;
  newNumber: number | null;
  kind?: "add" | "del";
  code: string;
  marked?: string;
  keyPrefix: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[36px_36px_minmax(0,1fr)] font-mono text-xs leading-5 @max-[439px]:grid-cols-[26px_minmax(0,1fr)] @max-[439px]:text-[11px] @max-[439px]:leading-4",
        kind === "del" && "bg-diff-del/10",
        kind === "add" && "bg-diff-add/10",
      )}
    >
      <i
        className={cn(
          "pr-2.5 text-right text-[11px] text-muted-foreground not-italic @max-[439px]:col-start-1 @max-[439px]:row-start-1 @max-[439px]:pr-2",
          kind === "del" && "bg-diff-del/15 text-diff-del-ink",
          kind === "add" && "bg-diff-add/15 text-diff-add-ink",
          kind !== "del" && "@max-[439px]:invisible",
        )}
      >
        {oldNumber ?? ""}
      </i>
      <i
        className={cn(
          "pr-2.5 text-right text-[11px] text-muted-foreground not-italic @max-[439px]:col-start-1 @max-[439px]:row-start-1 @max-[439px]:pr-2",
          kind === "del" && "bg-diff-del/15 text-diff-del-ink",
          kind === "add" && "bg-diff-add/15 text-diff-add-ink",
          kind === "del" && "@max-[439px]:invisible",
        )}
      >
        {newNumber ?? ""}
      </i>
      <span className="relative overflow-hidden whitespace-pre pr-3.5 pl-5 @max-[439px]:col-start-2">
        {kind ? (
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1.5",
              kind === "del" ? "text-diff-del-ink" : "text-diff-add-ink",
            )}
          >
            {kind === "del" ? "\u2212" : "+"}
          </span>
        ) : null}
        {renderDiffCode(code, marked, keyPrefix, kind)}
      </span>
    </div>
  );
}

/** The bot's comment thread under the applied suggestion: avatar,
 * name, time, the static "Applied" chip (ticket 10 decision: no
 * "Apply suggestion" button, nothing focusable) and the message. */
function DiffThread({
  visual,
}: {
  visual: Extract<ProjectVisualData, { kind: "diff" }>;
}) {
  return (
    <div className="relative border-y border-window-border bg-foreground/[0.03] py-2.5 pr-3.5 pl-[92px] @max-[439px]:pr-3 @max-[439px]:pl-[18px]">
      {/* the fragment's one accent touch inside the dark window (DESIGN §2,
       * "the ... comment marker inside the project mini-UIs" is listed
       * under --primary): a 2px bar set in from the comment's edge, never
       * a third diff colour beside the red/green rows. */}
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-[82px] w-0.5 rounded-full bg-primary @max-[439px]:left-2"
      />
      <div className="flex h-6 items-center gap-2">
        <span className="grid size-6 flex-none place-items-center rounded-full bg-[color-mix(in_oklab,oklch(0.74_0.08_220)_34%,var(--window))] text-[13px] font-semibold tracking-[-0.02em] text-[color-mix(in_oklab,oklch(0.74_0.08_220)_70%,var(--foreground))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,oklch(0.6_0.08_220)_22%,transparent)]">
          {visual.authorInitials}
        </span>
        <span className="truncate text-[13px] leading-5 font-medium">
          {visual.author}
        </span>
        <span className="flex-none text-xs leading-4 text-muted-foreground @max-[339px]:hidden">
          {visual.time}
        </span>
        <span className="ring-inset ml-auto inline-flex h-[22px] flex-none items-center gap-1 rounded-md bg-[color-mix(in_oklab,var(--diff-add)_12%,var(--window))] px-2 text-[13px] font-medium text-diff-add-ink ring-1 ring-[color-mix(in_oklab,var(--diff-add)_30%,transparent)]">
          <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
            <path
              d="m4 8.4 2.6 2.6L12 5.4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Applied
        </span>
      </div>
      <p className="mt-1 pl-8 text-[13px] leading-5 text-[color-mix(in_oklab,var(--foreground)_80%,var(--window))] @max-[339px]:pl-0">
        {renderDiffComment(visual.comment)}
      </p>
    </div>
  );
}

/**
 * The diff-review mini-UI (docs/tickets/10-project-visual-diff-review.md,
 * "Decisions (binding)"): a finished code-review picture, the
 * suggestion already applied — the file header (Go mark, repo/path,
 * fixed +2/−2 stat), the hunk line, the changed line (old call marked,
 * removed) and its replacement (new call marked, added), the bot's
 * comment thread, then up to 4 context lines. Line numbers 13–16 and
 * the +2/−2 stat are fixed drawing chrome (the ticket's decision), not
 * content. Reuses the shared `Window` chrome (ticket 09): same dark
 * ground, border, radius and five-layer shadow.
 */
function DiffWindow({
  visual,
}: {
  visual: Extract<ProjectVisualData, { kind: "diff" }>;
}) {
  return (
    <Window maxWidthClassName="max-w-[480px]" topClassName="top-6 sm:top-8">
      <div className="flex h-10 items-center gap-2 border-b border-window-border bg-foreground/[0.03] pr-3.5 pl-2.5 @max-[439px]:h-9 @max-[439px]:pl-3">
        <svg
          className="size-3.5 flex-none text-muted-foreground @max-[439px]:hidden"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="m4.5 6.25 3.5 3.5 3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* review round 1 finding 3a: a brand tile is light on every
         * surface (the kit's `--u-tile`), not the window's dark ground,
         * so a logo keeps its own colours. */}
        <span className="grid size-5 flex-none place-items-center rounded-md bg-white shadow-[inset_0_0_0_1px_rgb(0_0_0/0.09),0_1px_2px_rgb(0_0_0/0.12)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static
              export; a decorative mark inside an aria-hidden drawing,
              scaled to its own aspect ratio inside the kit's 13px box
              (ticket 10 decision: empty alt, same-origin file). */}
          <img src="/icons/go.svg" alt="" width={13} height={5} />
        </span>
        <span className="flex-none text-[12px] leading-4 text-muted-foreground @max-[469px]:hidden">
          {visual.repo}
        </span>
        <i className="flex-none text-[12px] leading-4 text-muted-foreground not-italic @max-[469px]:hidden">
          /
        </i>
        <span className="min-w-0 flex-1 truncate font-mono text-[12px] leading-4 text-muted-foreground">
          <span className="@max-[339px]:hidden">{visual.dir}</span>
          <span className="font-medium text-foreground">{visual.file}</span>
        </span>
        <span className="ml-auto flex flex-none items-center gap-1.5">
          {/* review round 1 finding 3c: `<b>` computes weight 700,
           * overriding the parent's `font-medium`; a `<span>` keeps 500. */}
          <span className="flex items-center gap-1.5 font-mono text-[12px] leading-4 font-medium">
            <span className="text-diff-add-ink">+2</span>
            <span className="text-diff-del-ink">&minus;2</span>
          </span>
          {/* review round 1 finding 3b: the four-block stat bar, missing
           * from the build; 80% of each diff hue mixed over the window
           * ground, matching the kit's `.ui-diff__bar`. */}
          <span
            aria-hidden="true"
            className="ml-0.5 flex flex-none gap-0.5 @max-[439px]:hidden"
          >
            <i className="size-2 rounded-[2px] bg-[color-mix(in_oklab,var(--diff-add)_80%,var(--window))]" />
            <i className="size-2 rounded-[2px] bg-[color-mix(in_oklab,var(--diff-add)_80%,var(--window))]" />
            <i className="size-2 rounded-[2px] bg-[color-mix(in_oklab,var(--diff-del)_80%,var(--window))]" />
            <i className="size-2 rounded-[2px] bg-[color-mix(in_oklab,var(--diff-del)_80%,var(--window))]" />
          </span>
        </span>
      </div>
      <div className="truncate border-b border-window-border bg-foreground/[0.02] h-7 pr-3.5 pl-[92px] font-mono text-[12px] leading-7 text-muted-foreground @min-[440px]:@max-[499px]:pl-12 @max-[439px]:h-6 @max-[439px]:pl-3 @max-[439px]:text-[11px] @max-[439px]:leading-6">
        <span className="text-[color-mix(in_oklab,var(--muted-foreground)_80%,var(--window))]">
          {visual.hunk}
        </span>{" "}
        <em className="font-normal not-italic text-foreground/70 @max-[439px]:hidden">
          {visual.signature}
        </em>
      </div>
      <div className="pb-2">
        <DiffLine
          oldNumber={13}
          newNumber={null}
          kind="del"
          code={visual.before}
          marked={visual.marked.before}
          keyPrefix="before"
        />
        <DiffLine
          oldNumber={null}
          newNumber={13}
          kind="add"
          code={visual.after}
          marked={visual.marked.after}
          keyPrefix="after"
        />
        <DiffThread visual={visual} />
        {visual.context.map((line, index) => (
          <DiffLine
            key={index}
            oldNumber={14 + index}
            newNumber={14 + index}
            code={line}
            keyPrefix={`context-${index}`}
          />
        ))}
      </div>
    </Window>
  );
}
