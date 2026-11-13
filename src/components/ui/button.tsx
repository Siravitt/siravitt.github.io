import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  // Radius (carried-over polish, Flame 2026-11-13: "match the prototype",
  // measured 4px via CDP at 1440/390 — DESIGN.md §5 corrected from 6px/
  // rounded-md to 4px/rounded-sm): every Button size shares this radius.
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // DESIGN.md §6a "default = keycap": primary fill with a light
        // top inset edge and a dark bottom inset edge (the cap's bevel).
        // Hover lifts 1px and darkens the fill toward the background;
        // press sinks the cap back down, scales it slightly and swaps
        // the bottom edge for a pressed-in top shadow. Focus-visible
        // shows the same hover look (§8). The key chip (<Kbd>) reads
        // the Button's own hover/press/focus-visible state via
        // `group/button` — see kbd.tsx.
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/.28),inset_0_-2px_0_rgb(10_12_15/.24)] hover:bg-[color-mix(in_oklch,var(--primary)_84%,var(--background)_16%)] focus-visible:bg-[color-mix(in_oklch,var(--primary)_84%,var(--background)_16%)] active:bg-[color-mix(in_oklch,var(--primary)_74%,var(--background)_26%)] motion-safe:hover:-translate-y-px motion-safe:focus-visible:-translate-y-px motion-safe:active:scale-[.985] active:shadow-[inset_0_2px_3px_rgb(10_12_15/.26)]",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        // DESIGN.md §6a "secondary = the active line": a 2px --primary
        // line draws down the left edge on hover/focus — the same mark
        // as the hero's highlighted code line. Under reduced motion the
        // line still appears, just without the draw animation.
        secondary:
          "relative overflow-hidden border-border-strong bg-card text-foreground before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-[180ms] motion-reduce:before:transition-none hover:bg-accent hover:border-foreground/34 hover:before:scale-y-100 focus-visible:bg-accent focus-visible:border-foreground/34 focus-visible:before:scale-y-100 motion-safe:active:scale-[.985]",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // DESIGN.md §6a: every non-xl keycap/secondary button in this
        // design (nav, hero, 404) is 44px tall (`h-11`), not shadcn's
        // 32px default.
        default:
          "h-11 gap-1.5 px-6 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        // DESIGN.md §6a "default, size xl" (Contact's big keycap):
        // `min-h-[clamp(64px,1.4vw+48px,72px)]` reproduces the
        // prototype's own continuous rule verbatim (`system.css:1061`
        // `.btn--xl { height: clamp(64px, 1.4vw + 48px, 72px); }` —
        // carried-over polish item 4, Flame 2026-11-13: was the fixed
        // `min-h-16 xl:min-h-[72px]` two-step jump from ticket 12,
        // which measured 72px at 1440 against the prototype's 68.16px).
        // min-h + h-auto (not a fixed h-) plus py-3, rather than a fixed
        // height, so the box only grows for a label long enough to wrap
        // (reviewer round 1 fix 8, Review Focus 1: a 30-char label at
        // 320px must not force the button — or the page — to scroll
        // sideways); every caller's own label span carries
        // `whitespace-normal` to allow that wrap, since this cva's own
        // base `whitespace-nowrap` stays for every other size. The
        // display face keeps the prototype's own continuous clamp
        // (20–26px, `site.css` `.btn--xl`) since nothing pins it to a
        // step; below 640 (full width) it drops to the prototype's flat
        // 18px (`site.css` max-width:639px override).
        // Carried-over polish (Flame 2026-11-13): the prototype's own
        // phone rule (`site.css` `@media (max-width:639px) { .btn--xl
        // { height: 48px; font: 500 18px/1 ... } }`) is a FIXED 48px
        // box with NO vertical padding (the kit's `.btn` is always
        // `padding: 0 var(--s-5)`, horizontal only) — was `min-h-16`
        // (64px) plus `py-3` (24px) here, measuring 56px. `max-sm:
        // min-h-12 max-sm:py-0` reproduces 48px exactly when the label
        // fits on one line, while still letting the box grow for a
        // label long enough to wrap (reviewer round 1 fix 8, Review
        // Focus 1: a 30-char label at 320px must not force the button
        // — or the page — to scroll sideways; re-verified after this
        // change). `leading-none` (was the default ~1.5, prototype
        // measures 1.0) only changes anything once wrapped.
        xl: "min-h-[clamp(64px,1.4vw+48px,72px)] h-auto justify-between gap-1.5 px-6 py-3 pl-8 text-[18px] leading-none max-sm:min-h-12 max-sm:py-0 sm:text-[length:clamp(20px,0.6vw+16px,26px)]",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
