import { describe, expect, it } from "vitest";
import { splitTitle } from "@/components/project-visual";

/**
 * Direct unit test for `splitTitle` (docs/tickets/README.md carried-over
 * fix 3c, round-4 reviewer notes): literal expected values, including a
 * title with no `/` — `projects-section.test.tsx` only exercises it
 * indirectly through the rendered terminal prompt.
 */
describe("splitTitle", () => {
  it("splits a title with one '/' into its parent dir and leaf", () => {
    expect(splitTitle("booking/api")).toEqual({ dir: "booking/", leaf: "api" });
  });

  it("splits a title with a nested path at the last '/'", () => {
    expect(splitTitle("internal/retry/go")).toEqual({
      dir: "internal/retry/",
      leaf: "go",
    });
  });

  it("a title with no '/' has an empty dir and is the whole leaf", () => {
    expect(splitTitle("fixture")).toEqual({ dir: "", leaf: "fixture" });
  });
});
