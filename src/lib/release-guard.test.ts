import { describe, expect, it } from "vitest";
import {
  RELEASE_GUARD_MARKERS,
  scanFilesForMarkers,
} from "@/lib/release-guard";

/**
 * Literal-input unit tests for the release guard's pure scanning logic
 * (docs/tickets/05-built-site-checks-release-guard.md, AC "Guard unit
 * tests"). `scripts/check-release.mts` is the thin I/O wrapper that
 * walks `out/` and calls this; it has no logic of its own to unit test.
 */
describe("scanFilesForMarkers", () => {
  it("passes a clean set of files (no hits)", () => {
    const hits = scanFilesForMarkers([
      { file: "out/index.html", content: "<h1>Siravit Tanratanavijit</h1>" },
      { file: "out/privacy.html", content: "<h1>Privacy Policy</h1>" },
    ]);
    expect(hits).toEqual([]);
  });

  it.each(RELEASE_GUARD_MARKERS)(
    "catches the %j marker and names its file",
    (marker) => {
      const hits = scanFilesForMarkers([
        { file: "out/index.html", content: "clean" },
        { file: "out/404.html", content: `before ${marker} after` },
      ]);
      expect(hits).toEqual([
        {
          file: "out/404.html",
          marker,
          snippet: expect.stringContaining(marker),
        },
      ]);
    },
  );

  it("catches a marker inside a .txt RSC payload file", () => {
    const hits = scanFilesForMarkers([
      {
        file: "out/privacy/__next._full.txt",
        content: `1:{"children":"${RELEASE_GUARD_MARKERS[0]} role"}`,
      },
    ]);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      file: "out/privacy/__next._full.txt",
      marker: RELEASE_GUARD_MARKERS[0],
    });
  });

  it("reports every marker found in one file, each as its own hit", () => {
    const hits = scanFilesForMarkers([
      {
        file: "out/index.html",
        content: "[Placeholder] bio, mailto:x@example.com, Mock project",
      },
    ]);
    expect(hits.map((hit) => hit.marker).sort()).toEqual(
      ["Mock project", "[Placeholder]", "example.com"].sort(),
    );
  });
});
