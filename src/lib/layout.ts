/**
 * The shared page container (docs/tickets/README.md carried-over fix,
 * Flame 2026-11-13, ticket 10: "1. yes"): 1280px of content at
 * ≥1440px viewports (content x 80–1360 at 1440), with the prototype's
 * own `--gut` at every width — 24px below 640, 48px from 640 to 1023,
 * 80px from 1024 up (DESIGN.md §4 "Container"; matches the approved
 * prototype's `design/prototype/assets/system.css` `--gut`: `24px`
 * default/phone, `48px` at `min-width: 640px`, `80px` at
 * `min-width: 1024px`, `--container: 1280px`).
 *
 * Ticket 09 set 24px at every width (Daedalus's wording mistake in
 * that card, corrected here): `max-w-[1328px] px-6` always clamped the
 * side padding to 24px, even on wide screens, instead of growing it to
 * 48px/80px with the prototype's breakpoints.
 *
 * `max-w-[1440px]` + `px-6 sm:px-12 lg:px-20` (24/48/80px, Tailwind's
 * own `sm`/`lg` breakpoints: 640/1024) caps the container at exactly
 * 1440px — content 1280px plus 80px either side — so once the
 * viewport reaches 1440px the content's left/right edges sit at
 * x = 80 / 1360, same as the prototype, and never grow past 1280px
 * wide.
 *
 * Every section shell, the header and the other-page shells import
 * this one string instead of each spelling out the container, so it
 * can't drift between them again.
 */
export const CONTAINER_CLASSNAME =
  "mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20";
