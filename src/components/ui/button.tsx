import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // DESIGN.md §6a "default = keycap": primary fill with a light
        // top inset edge and a dark bottom inset edge (the cap's bevel).
        // Hover lifts 1px and darkens the fill toward the background;
        // press sinks the cap back down, scales it slightly and swaps
        // the bottom edge for a pressed-in top shadow. The key chip
        // (<Kbd>) reads the Button's own hover/press state via
        // `group/button` — see kbd.tsx.
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/.28),inset_0_-2px_0_rgb(10_12_15/.24)] hover:bg-[color-mix(in_oklch,var(--primary)_84%,var(--background)_16%)] active:bg-[color-mix(in_oklch,var(--primary)_74%,var(--background)_26%)] motion-safe:hover:-translate-y-px motion-safe:active:scale-[.985] motion-safe:active:shadow-[inset_0_2px_3px_rgb(10_12_15/.26)]",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        // DESIGN.md §6a "secondary = the active line": a 2px --primary
        // line draws down the left edge on hover/focus — the same mark
        // as the hero's highlighted code line.
        secondary:
          "relative overflow-hidden border-border-strong bg-card text-foreground before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-[180ms] hover:bg-[#1a1e24] hover:border-foreground/34 hover:before:scale-y-100 focus-visible:before:scale-y-100 motion-safe:active:scale-[.985]",
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
        // DESIGN.md §6a "default, size xl" (Contact's big keycap).
        xl: "h-16 justify-between gap-1.5 px-6 pl-8 text-xl xl:h-[72px]",
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
