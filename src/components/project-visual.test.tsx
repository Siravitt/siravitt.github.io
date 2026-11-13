import { describe, expect, it } from "vitest";
import { splitTitle, terminalTiming } from "@/components/project-visual";

describe("terminalTiming", () => {
  const LENGTHS = [1, 13, 20, 47, 120];
  const RESULT_COUNTS = [1, 2, 3, 4, 5];

  it.each(
    LENGTHS.flatMap((len) => RESULT_COUNTS.map((n) => [len, n] as const)),
  )(
    "orders lines before PASS before the prompt within 3.2s (command %i chars, %i result(s))",
    (commandLength, resultCount) => {
      const { lineDelays, passMs, promptMs } = terminalTiming(
        commandLength,
        resultCount,
      );

      lineDelays.forEach((delay) => expect(delay).toBeLessThan(passMs));
      expect(passMs).toBeLessThan(promptMs);
      expect(promptMs + 300).toBeLessThanOrEqual(3200);
    },
  );

  it("matches the site's real command (13 chars, 3 results) at today's pacing", () => {
    const timing = terminalTiming(13, 3);

    expect(timing.typeMs).toBe(800);
    expect(timing.passMs).toBe(2450);
    expect(timing.promptMs).toBe(2800);
  });

  it("derives PASS's delay from the type-in and result count, not a fixed value", () => {
    expect(terminalTiming(1, 1).passMs).toBeLessThan(
      terminalTiming(13, 3).passMs,
    );
  });

  it("clamps a short command's type-in to the 80ms/character ceiling", () => {
    expect(terminalTiming(7, 1).typeMs).toBe(80 * 7);
  });

  it("caps a long command's type-in at the kit's nominal 0.8s", () => {
    expect(terminalTiming(47, 1).typeMs).toBe(800);
    expect(terminalTiming(120, 5).typeMs).toBe(800);
  });
});

describe("splitTitle", () => {
  it.each([
    ["one '/'", "booking/api", { dir: "booking/", leaf: "api" }],
    [
      "a nested path, split at the last '/'",
      "internal/retry/go",
      { dir: "internal/retry/", leaf: "go" },
    ],
    ["no '/'", "fixture", { dir: "", leaf: "fixture" }],
  ])("splits a title with %s", (_label, title, expected) => {
    expect(splitTitle(title)).toEqual(expected);
  });
});
