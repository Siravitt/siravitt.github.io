import { describe, expect, it } from "vitest";
import { CONTAINER_CLASSNAME } from "@/lib/layout";

/**
 * Regression test for the container's gutters (docs/tickets/README.md
 * carried-over fix 1, Flame 2026-11-13): ticket 09 set 24px at every
 * width (a wording mistake); this pins the corrected literal string so
 * it can't silently drift back.
 */
describe("CONTAINER_CLASSNAME", () => {
  it("caps content at 1440px and grows the side padding 24/48/80 at 640/1024", () => {
    expect(CONTAINER_CLASSNAME).toBe(
      "mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20",
    );
  });
});
