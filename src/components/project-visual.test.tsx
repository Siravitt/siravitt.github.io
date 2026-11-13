import { describe, expect, it } from "vitest";
import {
  splitTitle,
  terminalNextDelayMs,
  terminalPassDelayMs,
  terminalTypeMs,
} from "@/components/project-visual";

const LONG_COMMAND = "go test ./... -run TestVeryLongName -v -count=1";

describe("terminalTypeMs", () => {
  it.each([
    ["clamps a short command to the 80ms/character ceiling", "go test", 80 * 7],
    ["paces the site's real command (13 chars) at ~0.8s", "go test ./...", 800],
    [
      "clamps a long command to the 50ms/character floor",
      LONG_COMMAND,
      50 * LONG_COMMAND.length,
    ],
  ])("%s", (_label, command, expected) => {
    expect(terminalTypeMs(command)).toBe(expected);
  });
});

describe("terminalPassDelayMs / terminalNextDelayMs", () => {
  it.each([
    ["the site's real command, 3 results", 800, 3],
    ["a long command, 5 results", terminalTypeMs(LONG_COMMAND), 5],
  ])(
    "PASS and the fresh prompt always land after the last line (%s)",
    (_label, typeMs, resultCount) => {
      const lastLineEnd = 150 + typeMs + 100 + (resultCount - 1) * 260 + 180;
      const passDelay = terminalPassDelayMs(typeMs, resultCount);
      const nextDelay = terminalNextDelayMs(typeMs, resultCount);

      expect(passDelay).toBeGreaterThan(lastLineEnd);
      expect(nextDelay).toBeGreaterThan(passDelay + 220);
    },
  );

  it("matches the kit's nominal PASS/prompt delays for the default command", () => {
    expect(terminalPassDelayMs(800, 3)).toBe(2450);
    expect(terminalNextDelayMs(800, 3)).toBe(2800);
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
