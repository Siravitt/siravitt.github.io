/**
 * The shared page container (docs/tickets/README.md carried-over fix,
 * Flame 2026-11-12): 1280px of content at ≥1328px viewports (content
 * x 80–1360 at 1440), 24px side gutters at every width including
 * phones (DESIGN.md §4 "Container"; matches the approved prototype's
 * `design/prototype/assets/system.css` `--gut`/`--container`, where
 * `max-w-[1328px]` = 1280 content + 24px padding on each side, and
 * `px-6` keeps that same 24px once the box is narrower than 1328px).
 * Every section shell, the header and the other-page shells import
 * this one string instead of each spelling out the container, so it
 * can't drift between them again (it did: the shared wrappers used to
 * read `max-w-7xl px-6 max-sm:px-4`, 1232px content and 16px on phones).
 */
export const CONTAINER_CLASSNAME = "mx-auto max-w-[1328px] px-6";
