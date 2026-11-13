import { describe, expect, it } from "vitest";
import { splitTitle, terminalTypeMs } from "@/components/project-visual";

/**
 * Direct unit test for `terminalTypeMs` (ticket 16 review round 2
 * finding 4): a fixed step count on a variable-length command clipped
 * glyphs mid-character, so the duration must scale one step per
 * character at the kit's 50-80ms/character pace, clamped at both ends.
 */
describe("terminalTypeMs", () => {
  it("paces a short command at the kit's 80ms/character ceiling", () => {
    // "go test" is 7 characters; 800/7 ≈ 114ms, clamped down to 80ms.
    expect(terminalTypeMs("go test")).toBe(80 * 7);
  });

  it("paces the site's real command (go test ./..., 13 characters) within the kit's ~0.8s pacing", () => {
    expect(terminalTypeMs("go test ./...")).toBe(800);
  });

  it("paces a long command at the kit's 50ms/character floor", () => {
    const command = "go test ./... -run TestVeryLongName -v -count=1";
    // 49 characters; 800/49 ≈ 16ms, clamped up to the 50ms floor.
    expect(terminalTypeMs(command)).toBe(50 * command.length);
  });
});

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
