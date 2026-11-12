# DESIGN.md — siravitt.github.io, v4.1 — APPROVED by Flame 2026-11-12

> **Status: approved.** Flame, 2026-11-12: "all look good approve". This is the design the Engineer builds; any
> change from here goes back through Flame.

v4.1 changes (approved with v4): the lit frames behind the pictures are **warm sand** (`--frame` #d9ccb7) instead of
the pale blue-grey "sky" of v1–v4 (§2, contrast in §2a, the frame's decorative accent in §2b). The OG image was
re-rendered with the sand frame (§9). Nothing else changed.

v4 changes (Flame's review of v3): the one accent is now a warm **amber-yellow `#e8b84a`** instead of cyan,
everywhere it was used (§2, contrast in §2a), with the favicon, app icons and OG image regenerated in it (§9). The
`[Placeholder]` tag went neutral so it no longer looks like the accent (§6). The LinkedIn logo is one-colour like
GitHub (§6a, Icons). Everything else is v3 (Stack panel and every scroll animation kept, Flame: "stay as it was",
"keep it").

v3 changes (Flame's review of v2): in-page links glide (smooth scroll, §7.5), and the Stack logos are now one-colour
marks in a dark panel (§6b).

The design system for the portfolio of **Siravit Tanratanavijit**. The Engineer rebuilds `design/prototype/` in
Next.js (static export) with **shadcn/ui + Tailwind only**. The prototype is the reference; this file holds the
numbers. Where the two disagree, the prototype screenshot wins and this file gets fixed.

Pages: `index.html` (one page), `privacy.html` (must stay at `/privacy.html`), `404.html`.
Screenshots: `design/screenshots/` (1440 and 390 for each page, at rest; `home-motion-1440-*` are frames caught
mid-scroll). Brand files: `design/prototype/brand/`. Scroll motion: `design/prototype/scroll.css` + `scroll.js` (§7).

---

## 1. Direction (in one paragraph)

Dark, quiet, technical: what a tech lead sees in their own editor. One near-black ground, one warm amber-yellow accent
(v4; cyan in v1–v3: the colour of an editor's cursor line and of a key under a lamp, muted, not neon) used sparingly (the primary button, the mark, the active code line, the scroll-progress line, lit timeline dots), and **warm sand "lit" frames** (v4.1; pale blue-grey "sky" in v1–v4) that hold
the real visuals: a drawn code editor in the hero and a small live UI inside each project card (a test run, a
checklist, a review comment). v3: Stack has **no** lit frame; its tools sit in a dark panel as one-colour marks
with their names, like the editor's side bar (§6b). Projects and Stack get the most space because the
readers are recruiters and tech leads. Type is a narrow grotesk at weight 500 for headings, with a mono for code,
periods and tags. No gradients (one exception: the soft sand mesh inside the project panels, §2b), no glows, no glass.

---

## 2. Colour: shadcn theme variables (dark only)

The site has no light theme and no toggle. Put these values in `:root` in `globals.css` (do **not** add a
`.dark` block), and map them with Tailwind v4 `@theme inline` the shadcn way.

```css
:root {
  --radius: 0.375rem;              /* 6px: cards' inner parts, panels, icon tiles (see §5) */

  --background: #0a0c0f;           /* page */
  --foreground: #e9ecef;           /* body and headings      16.5:1 on background */
  --card: #13161b;                 /* raised surface; also the Projects band */
  --card-foreground: #e9ecef;      /*                        15.3:1 on card */
  --popover: #13161b;              /* mobile nav sheet */
  --popover-foreground: #e9ecef;

  --primary: #e8b84a;              /* v4 amber-yellow, the one accent: primary Button, mark tile, focus ring */
  --primary-foreground: #0a0c0f;   /*                        10.6:1 on primary */
  --secondary: #13161b;            /* secondary Button fill (plus a 1px --border-strong inset ring) */
  --secondary-foreground: #e9ecef;
  --muted: #13161b;
  --muted-foreground: #9ba3ad;     /* labels, periods, tags   7.7:1 on background, 7.1:1 on card */
  --accent: #1a1e24;               /* shadcn's "accent" = hover fill for ghost items (nav links on the sheet); NOT the
                                      yellow. The brand accent is --primary (shadcn naming, kept on purpose) */
  --accent-foreground: #e9ecef;
  --destructive: #f87171;          /* not used in v1; defined so shadcn components build */

  --border: color-mix(in oklab, #e9ecef 11%, transparent);   /* hairlines between rows and sections */
  --input: color-mix(in oklab, #e9ecef 20%, transparent);    /* = --border-strong; no inputs in v1 */
  --ring: #e8b84a;                 /* focus ring: 2px solid, offset 2px (see §8)   10.6:1 on background */

  /* project-specific, not in shadcn's set */
  --border-strong: color-mix(in oklab, #e9ecef 20%, transparent); /* secondary Button ring, link underlines */
  /* v4.1: the lit frames are the kit's sand ground (html[data-ground="sand"]; were sky #c6d3df/#d6e0e9/#25303a) */
  --frame: #d9ccb7;                /* the warm sand "lit" frame behind each visual */
  --frame-surface: #e9e0d2;        /* the frame's light: the mesh's top-left stop (§2b) */
  --frame-foreground: #2a2622;     /* text drawn on a frame     9.49:1 on --frame, 11.48:1 on --frame-surface */
  --frame-muted: #5a534a;          /* muted text on a frame     4.79:1 on --frame, 5.80:1 on --frame-surface */
  --frame-accent: #a8794a;         /* DECORATIVE ONLY (2.41:1 on --frame): the mesh's warm corner, never text or UI (§2b) */
  /* v4: the tag is neutral (it was amber, which now reads as the accent) */
  --placeholder: #e9ecef;                                         /* tag text = --foreground   14.4:1 on its tint */
  --placeholder-fill: color-mix(in oklab, #e9ecef 7%, transparent);
  --placeholder-border: color-mix(in oklab, #e9ecef 48%, transparent); /* 1px dashed            4.4:1 on background */
  --primary-tint: rgb(232 184 74 / .08);                          /* the highlighted code line's fill (decorative) */
}
```

**Use rules**
- `--primary` is for the primary Button and one accent mark per screen (the mark tile, the highlighted code line,
  the "404", the lit timeline dots), plus two thin state lines (v2): the 2px scroll-progress line and the
  secondary Button's hover marker. The nav's active-section line and the timeline rail are ink, not yellow.
  Links are **not** yellow: they are `--foreground` with an underline (hover: underline to `currentColor`).
  Also in `--primary` (same as v3, only the hue changed): the About statement's highlighted phrase, the Stack
  marks on hover, the "Current" Badge, the progress bar and comment marker inside the project mini-UIs, and the
  keyboard focus bar on a section reached by an in-page link.
- **Yellow is never a fill behind light text** and never a glow, gradient or tinted shadow: on the yellow, text is
  always `--primary-foreground` (#0a0c0f).
- Every text pair is AA (body text ≥ 4.5:1, all pairs above are ≥ 7:1). The only colours under 3:1 are hairlines.
- Code colours inside the drawn editor (decorative, `aria-hidden`): keyword `#ff9f7a`, function `#e9ecef`
  (v4: was a light cyan, now plain bright ink so no cyan is left), string `#a5e3a0`, comment `#7d8590`, plain
  `#c9d1d9`, editor ground `#17191c`; the highlighted line: 2px `--primary` left edge on `--primary-tint`.
- The "lit" frames (`--frame`, v4.1 warm sand #d9ccb7; pale blue-grey #c6d3df in v1–v4) are the ground behind the
  pictures, not the accent. The amber-yellow never sits on sand as text or UI (it would be 1.17:1); everything on a
  frame is a self-contained window (editor, terminal, checklist, diff, deploy card) with its own ground.

### 2a. Contrast checks (v4 + v4.1 sand rows, WCAG 2.2 AA, computed with the WCAG relative-luminance formula)

| Pair | Ratio | Needs |
|---|---|---|
| Button label `#0a0c0f` on `--primary` `#e8b84a` | **10.62:1** | 4.5:1 text |
| Button label on the hover fill (primary 16% toward the ground, ≈ `#c49c41`) | 7.63:1 | 4.5:1 |
| Button label on the pressed fill (primary at 74%, ≈ `#ae8b3b`) | 6.11:1 | 4.5:1 |
| ↵ key-chip glyph on its chip (10% dark over primary, ≈ `#d2a744`) | 8.72:1 | 4.5:1 |
| `--primary` as text / line on `--background` `#0a0c0f` ("404", "Current", About phrase, rail dots, progress line) | **10.62:1** | 4.5:1 text, 3:1 UI |
| `--primary` on `--card` `#13161b` (Projects band, footer, mini-UIs) | 9.83:1 | 4.5:1 / 3:1 |
| `--primary` on `#1a1e24` (raised surfaces) | 9.07:1 | 4.5:1 / 3:1 |
| Focus ring `--ring` vs `--background` / `--card` | **10.62:1 / 9.83:1** | 3:1 (1.4.11 non-text contrast) |
| "Current" Badge border (primary 55%, ≈ `#846b2f`) on background | 3.85:1 | 3:1 (was 45% in v3; raised so the outline also passes) |
| Placeholder tag text on its 7% tint | 14.40:1 | 4.5:1 |
| Placeholder tag dashed border (ink 48%) on background | 4.41:1 | 3:1 |
| v4.1 `--frame-foreground` `#2a2622` on `--frame` `#d9ccb7` / on `--frame-surface` `#e9e0d2` | 9.49:1 / 11.48:1 | 4.5:1 |
| v4.1 `--frame-muted` `#5a534a` on `--frame` / `--frame-surface` | 4.79:1 / 5.80:1 | 4.5:1 |
| v4.1 `--frame` `#d9ccb7` against `--background` / `--card` (the frame's edge on the page) | 12.38:1 / 11.46:1 | — (well clear) |
| v4.1 `--frame-accent` `#a8794a` on `--frame` / `--frame-surface` | 2.41:1 / 2.92:1 | **decorative only**, see §2b |

### 2b. The sand frame's fill and its accent (v4.1)

- **Hero frame** (`.hero__art`): flat `--frame` (#d9ccb7), no gradient.
- **Project panels** (`.panel` behind each project's mini-UI): `--frame` with a soft mesh of the sand's own tones,
  the only gradient on the site, kept from v1 (it was the same mesh in sky). Three radial gradients over
  `--frame`, top to bottom:
  1. `radial-gradient(70% 90% at 12% 0%, color-mix(in oklab, var(--frame-surface) 92%, white), transparent 70%)` (≈ #ebe2d6)
  2. `radial-gradient(60% 80% at 100% 100%, color-mix(in oklab, var(--frame-accent) 34%, var(--frame)), transparent 72%)` (≈ #c9af92)
  3. `radial-gradient(50% 60% at 85% 10%, color-mix(in oklab, var(--frame-surface) 60%, transparent), transparent 70%)`

  Tailwind: one arbitrary `bg-[…]` on the panel `<div>` (or a `.frame-mesh` class in `globals.css`); no library.
- **`--frame-accent` #a8794a is decorative only.** Checked in headless Chrome on index, privacy and 404 (computed
  styles of every element inside every sand ground, after scrolling the whole page): it appears **only** as the 34%
  stop of gradient 2 above, a warm shade in the panel's bottom-right corner. No text, icon, border, focus ring or
  control on a frame uses it (the kit's `--fx-accent` on the hero frame is set but unused: no effect is mounted
  there; the kit's lit-ground `--accent` override belongs to `.footer--statement`, which this site does not use).
  So 2.41:1 is fine (WCAG 1.4.11 does not apply to decoration) and it was **not** darkened. If a later change ever
  puts text or a control in the accent on sand, darken it to ≥ 3:1 (UI) / 4.5:1 (text) first.
- Privacy and 404 carry `data-ground="sand"` for consistency but show no lit frame.

---

## 3. Type

| Role | Font | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Display / h1 | Instrument Sans (width 96%) | `clamp(38px, 3.24vw + 25.4px, 72px)` | 500 | 1.02 | −0.036em |
| h2 | Instrument Sans | `clamp(30px, 1.72vw + 23.3px, 48px)` | 500 | 1.1 | −0.028em |
| About statement | Instrument Sans | = h2 | 500 | 1.16 | −0.028em |
| Card title (h3) | Instrument Sans | 18px (20px ≥ 1280) | 500 | 1.4 | 0 |
| Lead | Instrument Sans | 18px (20px ≥ 1024, corrected 2026-11-12, matches prototype) | 400 | 1.6 | 0 |
| Body | Instrument Sans | 16px | 400 | 1.6 | 0 |
| Small / role line / links | Instrument Sans | 14px | 500 | 1.5 | 0 |
| Label (dt, column heads) | Instrument Sans | 13px | 500 | 1.4 | 0 |
| Mono: tags, periods, badges, URL | DM Mono | 13–14px | 400 / 500 | 1.6 | 0 |
| 404 number | DM Mono | `clamp(64px, 9vw, 128px)` | 400 | 1 | −0.04em |

- Two weights only: 400 and 500. No uppercase labels, no italics, no negative tracking under 24px.
- The h1 is his **full name only**. The role line sits above it in 14px/500 `--foreground`.
- Build: load both with `next/font/google` (**self-hosted at build**, so the live site makes no request to Google;
  this matters for the spec's "no third-party origins" check). Instrument Sans with `axes: ['wdth']`.
- Licences: Instrument Sans (Rodrigo Fuenzalida / Instrument) and DM Mono (Colophon Foundry): both SIL OFL 1.1.

---

## 4. Spacing and layout

- 4px scale: `4 8 12 16 24 32 48 64 96 128` → Tailwind `1 2 3 4 6 8 12 16 24 32`. No in-between values.
- Container: max 1280px content + side padding 24px (phone 16px) → `mx-auto max-w-7xl px-6 max-sm:px-4`.
- 12-column grid with a 24px gutter (12px on phones). Copy blocks span 5–6 columns, max 62ch.
- Section padding: 120px top / 96px bottom on desktop (`pt-30 pb-24`), 96/48 on phones.
- Nav height 72px desktop, 56px phone; sticky, `--background` at 90% with `backdrop-blur-sm` and a bottom `--border`.
- Breakpoints (Tailwind defaults): `sm 640`, `lg 1024`, `xl 1280`. Layout changes:
  - `< 1280`: the nav shows the mark + **"Siravit"** only (surname hidden; the link's accessible name stays the full name).
  - `< 1024`: hero stacks (words over the editor); hero facts hidden; Experience period moves above the role; nav collapses to the menu button.
  - `< 640`: editor drops its file tree and shows the first 8 lines; project cards stack; the Stack panel drops its
    frame and the tool rows sit straight on the page (48px rows, 20px marks), §6b.
- **Jump offset (v3):** every section id (`top, about, stack, projects, experience, contact`) has
  `scroll-margin-top` = the sticky header height (72px, phone 56px), so an anchor jump stops right under the bar (§7.5).

---

## 5. Radius

`data-radius="sharp"`: small and technical.

| Element | Radius | Tailwind (with `--radius: 6px`) |
|---|---|---|
| Badge, placeholder tag, mark tile in nav | 4px | `rounded-sm` (`calc(var(--radius) - 2px)`) |
| Stack tool rows (v3), editor window, code panels | 6px | `rounded-md` (`var(--radius)`) |
| Lit frames, project panels, Card, Stack panel (v3) | 8px | `rounded-lg` (`calc(var(--radius) + 2px)`) |
| Buttons (v2) | 6px, a keycap, not a pill | `rounded-md` |
| Key chip inside the primary Button | 4px | `rounded-sm` |

---

## 6. Components → shadcn

| Element (prototype class) | shadcn / Tailwind | Notes |
|---|---|---|
| Nav bar (`.nav`) | plain `<header>` + `<nav>` | v2: a 2px scroll-progress line on its bottom hairline and a 2px active-section line under the current word (§7). Logo link: mark tile (24px, `--primary` bg, "S" in `--primary-foreground`, 600) + name, 15px/500. Five anchor links (About, Stack, Projects, Experience, Contact) centred; primary Button right. A hidden list's link is removed too (spec: empty lists hide their section **and** nav link). |
| Mobile menu (`.nav__toggle`) | **Sheet** (`side="top"`) + Button `variant="ghost" size="icon"` (44×44) | Same five links, 48px rows, then the primary Button full width. |
| Skip link | plain `<a>` `sr-only focus:not-sr-only` | "Skip to content" → `#top`. |
| Primary CTA "Email Siravit" (v2) | **Button** `default` (the keycap, §6a) | `mailto:` link via `asChild`, label + `<kbd>↵</kbd>` key chip. Nav: `h-11`; hero/404: `h-11 px-6`; Contact close: `size="xl"` (§6a). |
| Secondary "See projects" (v2) | **Button** `variant="secondary"` (the active line, §6a) | Label + ↓ glyph (it scrolls down to Projects). Only one secondary per screen. Phone: becomes an underlined text link (no marker). |
| Text links (project links, contact, back link) | `<a>` styled as Tailwind `underline underline-offset-4 decoration-[--border-strong] hover:decoration-current` | 14px/500 `--foreground`; trailing **↗** for links that leave the site (GitHub, LinkedIn, Source code) and **→** for in-site links (Live demo, back link); the glyph moves 2px up-right (↗) or 3px right (→) on hover; min tap height 44px. |
| Hero facts (`dl.hero-facts`) | plain `<dl>` 3-column grid + **Separator** above it | Desktop only; sits on the editor frame's bottom line. |
| Hero editor (`.ed`) | plain markup, `aria-hidden` inside a `role="img"` frame | Decorative drawing of `site.ts`; no real editor component. |
| About statement | `<h2>` label "About" (muted, 14px) + statement paragraph | The word-highlight: bolded phrase goes from `--muted-foreground` to `--foreground` as it scrolls in (CSS `animation-timeline: view()`, fallback: static foreground). |
| Stack list (`.rows`) | `<ul>` rows divided by **Separator** | Group label left (muted), tools right. |
| Stack marks panel (`.stack__art`, v3) | plain `<div role="img">` + `<ul aria-hidden>` (no shadcn component; Card would add padding/shadow it does not want) | Ten tool rows in two columns inside a dark panel. Spec in §6b. |
| Project card (`.card--open.proj`) | **Card** with no fill, no border, no padding (`bg-transparent border-0 shadow-none p-0 gap-0`) | Top row: **Badge** `variant="outline"` "Mock project" (mono 13px, muted) + links. Title h3, summary (500), description (max 58ch), `<dl>` Role / Outcome in 2 columns, stack tags as one mono line joined with " · " (**not** Badges). Optional **panel** (`rounded-lg`, `--frame` bg, 228px tall, phone 200px) holds the project picture. |
| Project card, bare (4th card) | same Card | No links, no picture: the top row shows only the Badge and the card **ends on its tags**. Nothing empty is drawn. This is the template for any project with missing optional fields. |
| Experience item (`.exp__item`) | `<ol>` rows with **Separator** between | Period (mono, muted) left on the 12-col grid; role h3, two bullet points, optional tag line on the right half. "Current" = **Badge** `variant="outline"` with `--primary` text and a 55%-`--primary` border (v4: 45% → 55% so the outline reaches 3:1). |
| Experience timeline (v2) | `<ol class="relative pl-10 max-sm:pl-7">` + two pseudo-elements, no component | Rail: 2px at `left-[7px]`, track `--border`, fill `color-mix(--foreground 60%)`; dot per entry: 12px circle, 2px `--border-strong` ring on `--background` (unlit) / `--primary` fill with a 4px `--background` cut-out ring (lit). The dot sits on the period's line. At rest: rail drawn, every dot lit. |
| Contact / footer (`footer.closing`) (v2) | plain `<footer>` | h2 "Contact", one lead line, GitHub + LinkedIn links with 20px logos (stacked), then the **big keycap Button** (`size="xl"`, half the container on ≥ 640, full width on phones; label left, ↵ key right); two link columns (Sections, Elsewhere); legal row: © line + **Daedalus line**. The huge "Siravit" close word is **gone** (Flame: "drop"). |
| Daedalus line (must keep) | `<p>` 14px `--muted-foreground` | Exact text: `Daedalus — personal assistant app used only by its owner · Privacy`, where "Privacy" links to `/privacy.html` (underlined, `--foreground`). On **every** page. |
| Placeholder tag (`.ph`) | `<span>` (no shadcn component) | `[Placeholder]` in DM Mono 13px/500, `--placeholder` text (= `--foreground`), 1px **dashed** `--placeholder-border`, `--placeholder-fill`, 4px radius → `font-mono text-[13px] font-medium text-foreground border border-dashed border-foreground/48 bg-foreground/7 rounded-sm px-1.5`. Comes from `site.ts` strings; removed by Flame's real copy. v4: **neutral**, no longer amber: with an amber-yellow accent an amber tag would read as part of the design. The dashed box and the mono bracket text carry "to fill". |
| Privacy page | same nav + `section` + slim footer | "Back to the portfolio" link, h1 "Privacy Policy", the policy paragraph **verbatim**, footer legal row only. Fills one screen. |
| 404 page | same nav + `section` + slim footer | "404" in DM Mono `--primary` (`aria-hidden`), h1 "Page not found", one line, primary Button "Go to the portfolio" → `/`. `noindex`. |

### 6a. Buttons (v2: Flame, "the button look too simple")

Three ideas from the editor, one amber-yellow accent (v4), no gradients, no glows. In shadcn, edit `components/ui/button.tsx`
(`cva`) so `default` is the keycap and `secondary` the active line; add `size: { xl }`. A tiny `<Kbd>` span (or
shadcn's `Kbd` if the installed version has it) draws the key chip.

| Variant | Rest | Hover / focus-visible | Press (`:active`) | Tailwind (approx.) |
|---|---|---|---|---|
| **default** = keycap | `--primary` fill, `--primary-foreground` text 15–16px/500, `rounded-md` (6px), `h-11 px-6`; inner edges: `inset 0 1px 0 rgb(255 255 255/.28)` (light top) + `inset 0 -2px 0 rgb(10 12 15/.24)` (dark bottom). After the label a **key chip** `↵`: DM Mono 13px/500, `h-[22px] min-w-6 px-1.5 rounded-sm`, `bg-[rgb(10_12_15/.10)]`, ring `inset 0 0 0 1px rgb(10 12 15/.30)` + bottom edge `inset 0 -2px 0 rgb(10 12 15/.26)` | fill mixes 16% toward the ground; the button steps up 1px; **the key chip sinks 1px and loses its bottom edge** (it is pressed first) | the cap sinks: `translate-y-px scale-[.985]`, bottom edge gone, `inset 0 2px 3px rgb(10 12 15/.26)` at the top; fill 74% | `shadow-[inset_0_1px_0_rgb(255_255_255/.28),inset_0_-2px_0_rgb(10_12_15/.24)] hover:-translate-y-px active:translate-y-px active:scale-[.985] active:shadow-[inset_0_2px_3px_rgb(10_12_15/.26)]`; chip: `group-hover:translate-y-px group-hover:shadow-[inset_0_0_0_1px_rgb(10_12_15/.34)]` |
| **default, size xl** (Contact) | as above, `h-16 xl:h-[72px]`, display face 20–26px, `justify-between pl-8 pr-6`, key chip 30px tall / 16px | same | same | `w-full sm:w-1/2` |
| **secondary** = the active line | `--card` fill (#13161b), 1px `--border-strong` border, `--foreground` text, `rounded-md`, `h-11 px-6`, a ↓ glyph 14px `--muted-foreground` after the label | fill `#1a1e24`, border `--foreground` 34%; **a 2px `--primary` line draws down the left edge** (`scale-y-0 → 1`, origin top, 180ms) — the same mark as the hero's highlighted code line; the glyph turns `--foreground` and moves 2px down | `translate-y-px scale-[.985]`, fill one step darker | `relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary before:scale-y-0 hover:before:scale-y-100 focus-visible:before:scale-y-100 before:transition-transform` |
| **link** (text CTA) | underline `--border-strong`, `underline-offset-4`, 14px/500; ↗ (leaves the site) or → (in site) | underline draws to `currentColor`; ↗ moves `translate(2px,-2px)`, → moves 3px right | — | `group-hover:translate-x-0.5 group-hover:-translate-y-0.5` on the ↗ |

- **Focus:** every variant keeps the 2px `--ring` outline, 2px offset (§8). Focus-visible shows the hover state too
  (key chip pressed, line marker drawn), so keyboard users see the same character.
- **Contrast (v4):** `--primary-foreground` on `--primary` 10.6:1 (hover fill 7.6:1, pressed 6.1:1); key chip glyph
  on its tinted chip 8.7:1; secondary
  text 15.3:1 on `--card`; the ↓ glyph is decorative (`aria-hidden`), as are the ↵ key and ↗/→.
- **Accessible name** = the label only (the key chip is `aria-hidden`). The ↵ is a hint (links open on Enter), not a
  custom shortcut: no key handler.
- **Reduced motion:** colours and inner shadows still change; no lift, sink, chip travel or glyph nudge; the
  secondary's line marker appears without drawing.
- **Phones (< 640):** primary full width in the hero; the secondary turns into an underlined text link (system
  rule, no marker); the nav's compact primary keeps its key chip.

Icons: GitHub and the small Go mark in the review-bot picture are logos from **gilbarbara/logos** (CC0-1.0); GitHub
is a one-tone black mark shown white on the dark footer (`ic-ink`, inverted by the kit). **LinkedIn (v4, Flame: make
it one-colour like GitHub)** is now the one-colour mark from **Simple Icons 10.4.0** (CC0-1.0,
https://github.com/simple-icons/simple-icons; current Simple Icons releases no longer ship LinkedIn, 10.4.0 does),
drawn the same way as GitHub: a black SVG shown white (`ic-ink`), 20px, beside its label. In the build use
`fill="currentColor"` on both inline SVGs with `text-foreground`, so they follow the link colour. All trademarks stay
their owners' and are used only to name the profiles and tools. The **Stack marks (v3)** are
one-colour SVGs from **Simple Icons 15.22.0** (`simple-icons`, CC0-1.0, https://github.com/simple-icons/simple-icons;
the brands stay trademarks of their owners and are used only to name the tools Siravit uses). All listed in
`prototype/assets/icons/icons-credits.json`. UI arrows are drawn inline SVG. In the build, keep the SVG files in
`public/icons/` (Stack marks in `public/icons/stack/`); no icon library and no `simple-icons` npm dependency is needed.

### 6b. Stack marks (v3: Flame, "i dont like this icons")

The v2 board (a lit frame, then still pale blue-grey, with white tiles and full-colour logos) is gone. The tools now look like a
file list in the editor's side bar: one-colour marks, the name beside each, on the page's own darks.

| Part | Spec | Tailwind (approx.) |
|---|---|---|
| Panel (`.stack__art`, ≥ 640) | `--card` fill (#13161b), 1px `--border`, `rounded-lg` (8px), padding 24px (≥ 1280: 48px). Right half of the split (cols 7–12), **top-aligned** with the heading. < 1024 it stacks under the list, full width. < 640: **no panel** (no fill, border or padding), the rows sit on the page | `rounded-lg border bg-card p-6 xl:p-12 max-sm:border-0 max-sm:bg-transparent max-sm:p-0` |
| Grid (`.stack__board`) | `<ul>`, 2 equal columns, gap 12px (phone 8px), reading order left→right, top→bottom (Go, TypeScript, PostgreSQL, Redis, Next.js, React, Tailwind CSS, Docker, GitHub Actions, Git) — the same order as the list | `grid grid-cols-2 gap-3 max-sm:gap-2` |
| Row tile (`.tool`) | flex row, items centred; `--background` fill (#0a0c0f) inside the panel (phone: `--card`), 1px `--border`, `rounded-md` (6px); min-height 64px (≥ 1280: 88px, phone: 48px); padding-inline 20px (≥ 1280: 24px, phone: 16px); gap mark→name 12px (≥ 1280: 16px). **Not a link**: no cursor change, not focusable | `flex items-center gap-3 xl:gap-4 min-h-16 xl:min-h-22 max-sm:min-h-12 rounded-md border bg-background px-5 xl:px-6` |
| Mark (`.tool__mark`) | the Simple Icons SVG drawn as a **CSS mask** filled with `currentColor` = `--muted-foreground` (#9ba3ad, 7.7:1). Box 24×20 (≥ 1280: 40×32), `contain`, centred, so wide marks (Go) and square ones share one box | `size-…` + `bg-current [mask:var(--mark)_center/contain_no-repeat]` with `style={{'--mark': 'url(/icons/stack/go.svg)'}}`; or an inline `<svg fill="currentColor">` with the same path — either renders identically |
| Name (`.tool__name`) | DM Mono 13px (≥ 1280: 14px) / 1.3, `--muted-foreground` | `font-mono text-[13px] xl:text-sm text-muted-foreground` |
| Hover | border → `--border-strong`, mark → `--primary` (amber-yellow, the only colour), name → `--foreground`; 150ms `--ease`. No lift, no glow, no scale | `transition-colors hover:border-[--border-strong] hover:text-primary group-hover:text-foreground` |
| A11y | the panel is `role="img"` with `aria-label="The marks of the ten tools in the list"`; the `<ul>` inside is `aria-hidden` (the Stack list already names every tool) | — |
| Data | each stack item in `site.ts` gets an optional `icon` slug (`go`, `typescript`, `postgresql`, `redis`, `nextdotjs`, `react`, `tailwindcss`, `docker`, `githubactions`, `git`). An item with no icon still gets its row, name only (the mark box stays empty so names stay on one line) | — |
| Motion | the v2 "assemble", re-aimed for two columns: left-column rows slide in from 24px left, right-column rows from 24px right, both from 16px below, fading in, in reading order (§7.1 row 7) | — |

- Masks are fetched in CORS mode: serve the SVGs from the same origin (GitHub Pages does); opening the HTML with
  `file://` shows empty boxes, so preview the prototype over http (`python3 -m http.server` in `prototype/`).
- Why rows, not a 5×2 logo grid: I tried the square grid first (dark tiles, mark over name). It read closer to a
  logo wall beside the text list, and its short panel left a 444px hole before Projects (failed the gate's
  rhythm check). Rows read as part of the editor (a side bar / file list) and end near the list's last row.

---

## 7. Motion (v2: Flame, "Can u do more animate with the scroll")

**Rules.** Only `transform` and `opacity` animate (the About moment also animates text colour, as in v1). No
scroll-jacking, no smooth-scroll library, no pinning, no snap: the page scrolls natively under the wheel and touch.
The one exception (v3) is the browser's own anchor jump, which glides via CSS `scroll-behavior: smooth` (§7.5).
Every reveal moves an element
that already has its final box, so nothing shifts layout (perf check: CLS 0.000). No animation library: CSS
scroll-driven animations do the work, plus one ~60-line client component as the fallback.

One curve for UI: `cubic-bezier(.2,.8,.2,1)` (`--ease`); one for entrances and reveals:
`cubic-bezier(.22,1,.36,1)` (`--ease-enter`). Scroll-linked tracks (progress, rail, parallax) run `linear`.

### 7.1 Every animation

| # | Where | Trigger | What moves | Timing / range | Stagger |
|---|---|---|---|---|---|
| 1 | **Scroll-progress line** — 2px `--primary` line on the header's bottom hairline | page scroll | `scaleX(0 → 1)`, origin left | `animation-timeline: scroll(root block)`, linear, 0 → 100% of the page | — |
| 2 | **Active-section line** in the nav — 2px `--foreground` line under the current word (desktop nav) | each section crossing a band from 40% to 60% of the viewport | grows in from the left (`translateX(-50%) scaleX(0) → none`), leaves to the right | named view timelines `--sec-about … --sec-contact` with `view-timeline-inset: 40% 40%`, published with `timeline-scope` on `<html>`; keyframes on `entry 0–100%` and `exit 0–100%` (so the hand-over between two words takes 20% of a screen of scroll) | — |
| 3 | **Hero code types in** — the 14 lines of the drawn `site.ts` | page load (once) | `opacity 0 → 1`, `translateX(-6px → 0)` per line | 360ms `--ease-enter`, delay `300ms + i × 55ms` (done by 1.4s) | 55ms per line |
| 4 | **Hero highlighted line steps down the file** | hero scrolling away | the highlight bar `translateY` from line 4 (`name`) to line 12 (`privacy`) — phone: line 4 → 8 | `animation-timeline: --hero` (view timeline on the hero), range `exit 0% → exit 60%`, `steps(9, jump-none)` (phone `steps(5)`) so it jumps line by line like an editor cursor | — |
| 5 | **Hero eases away (slight parallax)** | hero scrolling away | words column: `translateY(0 → -24px)`, `opacity 1 → .5`; editor window `translateY(0 → -48px)`; deploy card `translateY(0 → -88px)` (two depths) | `--hero` timeline, `exit 0% → exit 100%`, linear | — |
| 6 | **Section reveals** — section heads, About's label and paragraphs, Stack rows, Project cards, Experience entries, Contact head (`[data-rv]`) | element entering the viewport | `opacity 0 → 1`, `translateY(32px → 0)` | `animation-timeline: view()`, range `cover (i × 48px) → cover (180px + i × 48px)`: the reveal finishes within the element's first 180px of travel into view, `--ease-enter`; runs back on the way up | `--i` = 0,1,2,3 in a group (Stack rows 0–3, cards 0–1 per row, entries 0–2): +48px of scroll each |
| 7 | **Stack rows assemble** (v3: rows in two columns) | the Stack panel entering | each row `translate(dx, dy) scale(.86) opacity 0 → none`; left column `dx -24px`, right column `dx +24px`, both `dy 16px` (they close in on the panel's centre line) | view timeline `--board` on the panel, range `entry (5% + i×5%) → entry (55% + i×4%)`, `--ease-enter` | reading order, `--i` 0–9 |
| 8 | **Experience rail draws** | list scrolling past the 60% line | rail fill `scaleY(0 → 1)`, origin top: its tip sits exactly on the 60% line of the viewport | view timeline `--exp` with `view-timeline-inset: 60% 40%` (the viewport collapses to that line), range `cover 0% → cover 100%`, linear | — |
| 9 | **Entries light up** | the rail's tip reaching an entry's dot | lit dot `opacity 0 → 1`, `scale(.4 → 1)` (unlit ring stays under it) | each entry's own view timeline (same 60% line), range `cover 0px → cover 40px`, `--ease-enter` | follows the rail |
| 10 | About statement (v1, kept) | statement scrolling in | the bolded phrase goes `--muted-foreground → --foreground` | `view()` | — |
| 11 | Project mini-UIs (v1, kept) | card entering the screen | the test run types and passes, the checklist ticks, the review applies its suggestion; loops have a pause button | CSS keyframes started by an IntersectionObserver class (kit), 3.2s cycle | — |
| 12 | Buttons, text links, nav words | hover / focus / press | buttons and links: §6a; nav words: a 2px ink underline sweeps in from the left and leaves to the right (`scale-x`) | 150ms in, 120ms out, 90ms press | — |
| 13 | **In-page jump glides** (v3) | a click / Enter on any `#anchor` link (nav words, logo, "See projects", footer Sections, skip link) | the page scrolls smoothly to the section, stopping under the header | browser-native `scroll-behavior: smooth` (duration and curve are the browser's, ≈ 300–600ms) | — |
| 14 | Stack rows (v3) | hover | border → `--border-strong`, mark → `--primary`, name → ink | 150ms `--ease` (colours only) | — |

Not animated on purpose: the footer columns and legal row, the hero's lit frame itself, card hover (no lift: the
cards are not links).

### 7.2 How it is built (three layers)

1. **Rest state = the final picture.** Plain CSS draws everything finished: words visible, rail drawn, dots lit,
   highlight on line 4, nav lines hidden, progress line hidden. This is what you get with JS off,
   `prefers-reduced-motion: reduce`, print, or a browser with neither feature nor script.
2. **Native (no JS):** all scroll-linked rules sit inside
   `@media (prefers-reduced-motion: no-preference) and (scripting: enabled) { @supports (animation-timeline: view()) and (timeline-scope: --a) { … } }`.
   `scripting: enabled` keeps a JS-off visitor on the rest state (nothing waits for a scroll they may not do);
   `animation-fill-mode: both` holds the start state until an element is reached.
   Support today: Chrome / Edge 115+, Safari 26+. The code type-in (#3) is a plain load animation, outside the
   `@supports`.
3. **Fallback (`scroll.js` → `<ScrollMotion />`):** runs only when `CSS.supports('animation-timeline: view()')`
   or `timeline-scope` is false (Firefox today, older Safari) and motion is allowed. It adds `html.sm-io`, then:
   - one `IntersectionObserver` (`threshold .15`, `rootMargin 0 0 -10% 0`) adds `.is-in` to `[data-rv]` and the
     logo board **once**; CSS turns that into a 600ms `--ease-enter` transition, `transition-delay: i × 80ms`
     (tiles `i × 60ms`). Anything already above the screen (anchor jump) is shown at once.
   - one passive `scroll` listener, throttled to one `requestAnimationFrame`, writes `--sm-page`, `--sm-hero`,
     `--sm-hl` (line index), `--sm-exp` on `<html>` and toggles `.is-lit` on entries and `.is-current` on nav
     links; CSS maps those to the same transforms (nav line: 240ms transition).
   Hidden states exist only under `html.sm-io`, which only the script adds, so a failed script hides nothing.

### 7.3 Reduced motion

`prefers-reduced-motion: reduce`: nothing moves, the rest state shows (§7.2-1). The fallback script exits on its
first line. The nav's active-section line still marks the section but **jumps** (a `steps(1)` animation with
`fill: none` on a 1%-tall band at mid-screen) instead of travelling. Buttons change colour and inner shadow only.
The progress line is not shown. The kit's loops show their final frame and their pause buttons are hidden (v1).
v3: anchor jumps are **instant** (no glide: `scroll-behavior: smooth` lives only inside
`@media (prefers-reduced-motion: no-preference)`), but focus still moves to the section (§7.5): focus is not motion.

### 7.4 Building it in Next.js (Tailwind + CSS only)

- **CSS:** copy `scroll.css` into `app/globals.css` as one `@layer components` block (or `app/scroll.css` imported
  by the layout). Tailwind v4 has no utilities for `animation-timeline`, `animation-range`, `view-timeline` or
  `timeline-scope`, so keep them in CSS (or arbitrary properties like
  `[animation-timeline:view()] [animation-range:cover_0px_cover_180px]`); `@keyframes` live in the same file.
  Stagger is a CSS variable set inline: `style={{ '--i': index } as React.CSSProperties}` from the `.map()` index.
- **Markup hooks** (server components, no JS): `data-rv` on revealed blocks; `--i` on items; `--dx/--dy` on logo
  tiles; `<span className="nav__spy" aria-hidden />` in each nav link; `<span className="ed__hl" aria-hidden />` as
  the first child of the editor `<pre>`; `<div className="scroll-progress" aria-hidden><i/></div>` in the header;
  section ids `about, stack, projects, experience, contact` (the nav timelines are named after them).
- **One client component:** `components/scroll-motion.tsx` (`"use client"`), rendered once in `app/layout.tsx`,
  returns `null`; its `useEffect` is the body of `scroll.js` and returns a cleanup (disconnect the observer, remove
  the listeners, remove `sm-io`). Everything else stays a server component. No other client JS is added for motion
  (the spec asks to flag client JS: this is the one piece. Its v2 part runs only in browsers without scroll
  timelines; its v3 part, focus after an in-page jump (§7.5), is ~15 lines and runs everywhere).
- **Hidden sections:** if a list is empty and its section is hidden (§8), drop its name from `timeline-scope` and its
  nav link, or the nav line reads a timeline that does not exist (harmless, but tidy).
- **Check:** with DevTools → Rendering → "Emulate CSS prefers-reduced-motion" the page must look like the
  `home-*-1440/390.png` screenshots; with JS disabled too.

### 7.5 Smooth in-page navigation (v3: Flame, "when click on topbar navigate with scroll smooth")

Clicking (or pressing Enter on) any in-page link glides to its section: the five nav words, the logo (`#top`),
the hero's "See projects", the footer's Sections column and the skip link. Three small parts, no library, no
scroll-jacking (the wheel, touch and keyboard scrolling stay native; only the browser's own anchor jump is animated).

1. **The glide — CSS only** (`app/globals.css`):
   ```css
   @media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
   ```
   Tailwind: `motion-safe:scroll-smooth` on `<html>` in `app/layout.tsx`. Because it is the browser's native anchor
   jump, the **URL hash updates**, each click adds a **history entry**, and **back/forward** return to the previous
   section (the browser restores that position); nothing calls `preventDefault()` or `scrollTo()`.
2. **The offset — CSS only:** every jump target stops just under the sticky header, so no heading hides under it:
   ```css
   :is(#top, #about, #stack, #projects, #experience, #contact) { scroll-margin-top: var(--nav); } /* 72px, phone 56px */
   ```
   Tailwind: `scroll-mt-18 max-sm:scroll-mt-14` on each section shell (`<section id>` and the `<footer id="contact">`),
   or one `scroll-mt-[var(--nav)]` if the header height lives in a CSS variable. Measured in the prototype: after
   every jump the section's top sits at exactly 72px (phone 56px) = the header's bottom, its h2 120px (phone 96px) under it.
3. **Focus follows the jump — 15 lines of JS** (the first block of `scroll.js` → the same `<ScrollMotion />`
   client component, its own `useEffect`). A native anchor jump scrolls but leaves focus on the link, so a keyboard
   or screen-reader user would Tab from the nav again. On a left click (no modifier keys) of `a[href^="#"]`, and on
   `hashchange` (back/forward), it waits one frame (so the browser has navigated), gives the target
   `tabindex="-1"` if it has none, and calls `target.focus({ preventScroll: true })`: focus lands on the section,
   the next Tab goes to the section's first link, the glide is not interrupted and nothing scrolls twice. It runs
   in every browser and under reduced motion. Without JS everything else still works (the glide, the hash,
   back/forward, the offset; the browser also moves its Tab starting point to the target).
   - **Focus style on a section:** no ring round a 900px block; a keyboard-focused section (`:focus-visible`) draws
     the editor's active-line mark instead: `outline: none; box-shadow: inset 2px 0 0 var(--ring)` (a 2px `--ring` amber-yellow bar
     down the section's left edge) → Tailwind `focus-visible:outline-none focus-visible:shadow-[inset_2px_0_0_var(--ring)]`.
     A mouse click focuses the section without showing it (not `:focus-visible`).
   - Or add `tabIndex={-1}` to the section shell in JSX and drop that line of the effect.
4. **With the v2 active-section line:** nothing extra. The nav line reads the sections' view timelines (or, in
   the fallback, the scroll position), so during a glide it hands over word by word through the sections passed
   and settles on the target: the 72px stop puts every target across the 40–60% band (Contact included: the page
   can scroll far enough). Checked in headless Chrome at 1440 and 390: all five nav words, the logo and "See
   projects" glide, land at 72/56px, focus the section, update the hash; back/forward return to the previous
   section with focus; the mobile sheet closes on tap, then the page glides; reduced motion jumps instantly.

## 8. States

| State | Rule |
|---|---|
| **Focus** (all interactive) | `outline: 2px solid var(--ring); outline-offset: 2px` → Tailwind `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`. On a lit frame the ring is `--background` (dark): 12.38:1 on the sand `--frame` (the yellow ring would be 1.17:1 there). Never removed. |
| Hover: links | underline from `--border-strong` to `currentColor`; arrow nudges 3px |
| Hover: buttons | per variant, §6a (keycap: key chip sinks + 1px lift; secondary: `--primary` line marker draws; press sinks the cap) |
| Hover: nav links | underline sweep (see §7, row 12) |
| Current section (v2) | the 2px ink line under the nav word follows the scroll (§7, row 2); decorative, `aria-hidden` |
| Section reached by an in-page link (v3) | the section takes focus (`tabindex="-1"`, no scroll); keyboard: a 2px `--ring` bar down its left edge (`inset 2px 0 0`), no outline; mouse: nothing shows (§7.5) |
| Hover: Stack rows (v3) | border `--border-strong`, mark `--primary`, name `--foreground`; not links, so no focus state and no pointer cursor (§6b) |
| Scroll states (v2) | every scroll-driven element has a finished rest state (§7.2) that JS-off and reduced-motion visitors see |
| Current page | the footer's "Privacy" link on `/privacy.html` has `aria-current="page"` |
| Empty list (projects / experience / stack) | **hide the section and its nav link** (spec, recommended option). No empty-state design. |
| Missing optional field | renders nothing: no links → no link row; no picture → no panel (see the bare 4th project card); no tags → no tag line; no "current" → no Badge |
| Placeholder copy | the neutral dashed `[Placeholder]` tag (above; amber until v3). The spec's release guard fails a PR into `main` while any remains. |
| Error | `404.html` |
| Loading | none: a static page with no data fetching |
| Tap targets | every link and button ≥ 44px tall on touch |

---

## 9. Meta, favicon and share image

| File | Use | Notes |
|---|---|---|
| `brand/og.png` (1200×630) | `og:image`, `twitter:image` (`summary_large_image`) | v4.1: re-rendered with the sand frame (#d9ccb7, was #c6d3df). v4: regenerated in amber-yellow (mark tile, `~/` and the highlighted line). His name in Instrument Sans 108/500, the "S" mark, `~/siravitt.github.io` in DM Mono, the lit frame with the `site.ts` editor cut by the edge. Source: `brand/og.html` (re-render with headless Chrome at 1200×630). Shows only his name, so it survives the copy change. |
| `brand/icon.png` (512) | `<link rel="icon" type="image/png">` → Next `app/icon.png` | "S" in `--primary-foreground` on a `--primary` tile, 104px radius. Source `brand/icon.html`. |
| `brand/apple-icon.png` (180) | `apple-touch-icon` → Next `app/apple-icon.png` | Square corners (iOS rounds them). |
| `brand/favicon.ico` (16+32+48) | `/favicon.ico` → Next `app/favicon.ico` | v4: all three icon files regenerated from `icon.html` in `#e8b84a` (headless Chrome, transparent ground; the ICO holds 16/32/48 PNGs). |

`theme-color: #0a0c0f`. Title: `Siravit Tanratanavijit: software developer portfolio`. Canonical
`https://siravitt.github.io/`.

---

## 10. Out of the design (per spec)

No light theme or toggle, no contact form, no CV download, no analytics, no cookie banner, no blog, English only.
