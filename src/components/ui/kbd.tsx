import { cn } from "cn";

/**
 * The small "key chip" after a keycap Button's label (DESIGN.md §6a,
 * e.g. the `↵` after "Email Siravit"). Always decorative: callers pass
 * `aria-hidden="true"` so the Button's accessible name stays the label
 * alone (ticket 03 acceptance: the chip is hidden from the a11y tree).
 * Visually it rides inside the Button's `group/button`, so its hover/
 * press/focus-visible look is driven by the Button being hovered/
 * pressed/focused, not by the chip itself (it isn't interactive);
 * §8 asks that focus-visible shows the same look as hover.
 */
export function Kbd({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"kbd"> & { size?: "default" | "xl" }) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex items-center justify-center rounded-sm bg-[rgb(10_12_15/.10)] font-mono font-medium text-primary-foreground shadow-[inset_0_0_0_1px_rgb(10_12_15/.30),inset_0_-2px_0_rgb(10_12_15/.26)] transition-[translate,box-shadow] motion-safe:group-hover/button:translate-y-px motion-safe:group-focus-visible/button:translate-y-px group-hover/button:shadow-[inset_0_0_0_1px_rgb(10_12_15/.34)] group-focus-visible/button:shadow-[inset_0_0_0_1px_rgb(10_12_15/.34)]",
        size === "default"
          ? "h-[22px] min-w-6 px-1.5 text-[13px]"
          : "h-[30px] min-w-8 px-2 text-base",
        className,
      )}
      {...props}
    />
  );
}
