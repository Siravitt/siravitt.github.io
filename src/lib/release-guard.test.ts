import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  RELEASE_GUARD_MARKERS,
  collectScannedFiles,
  isScannedFile,
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

  it("is exactly the four markers the ticket names, as literals", () => {
    expect(RELEASE_GUARD_MARKERS).toEqual([
      "[Placeholder]",
      "example.com",
      "linkedin.com/in/placeholder",
      "Mock project",
    ]);
  });

  it.each([
    "[Placeholder]",
    "example.com",
    "linkedin.com/in/placeholder",
    "Mock project",
  ])("catches the %j marker and names its file", (marker) => {
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
  });

  it("catches a marker inside a .txt RSC payload file", () => {
    const hits = scanFilesForMarkers([
      {
        file: "out/privacy/__next._full.txt",
        content: `1:{"children":"[Placeholder] role"}`,
      },
    ]);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      file: "out/privacy/__next._full.txt",
      marker: "[Placeholder]",
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

/**
 * Literal-path unit tests for which files the guard reads. This is the
 * selection rule `scripts/check-release.mts` uses to decide what to pass
 * to `scanFilesForMarkers` — testing it here means a dropped extension
 * or a skipped nested directory is caught without a real build.
 */
describe("isScannedFile", () => {
  it("scans nested .txt RSC payload files under out/privacy/", () => {
    expect(isScannedFile("out/privacy/__next._full.txt")).toBe(true);
  });

  it("scans top-level and nested .html files", () => {
    expect(isScannedFile("out/404.html")).toBe(true);
    expect(isScannedFile("out/privacy/deep/x.html")).toBe(true);
  });

  it("does not scan .js or .css files", () => {
    expect(isScannedFile("out/_next/static/chunk.js")).toBe(false);
    expect(isScannedFile("out/_next/static/styles.css")).toBe(false);
  });
});

/**
 * `collectScannedFiles` on a real temporary directory (reviewer round
 * 2: the recursive filesystem walk is the one piece of the guard that
 * a literal-input test on `scanFilesForMarkers`/`isScannedFile` cannot
 * reach — dropping the recursive step into subdirectories previously
 * left `pnpm test` green and only showed up by running the real build).
 * `fs.mkdtempSync` under `os.tmpdir()` gives each test an isolated,
 * real directory tree without touching `out/`.
 */
describe("collectScannedFiles", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "release-guard-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("finds a scanned file nested one directory down", () => {
    mkdirSync(join(tempDir, "privacy"));
    writeFileSync(
      join(tempDir, "privacy", "__next._full.txt"),
      '1:{"children":"role"}',
    );

    expect(collectScannedFiles(tempDir)).toEqual([
      {
        file: join("privacy", "__next._full.txt"),
        content: '1:{"children":"role"}',
      },
    ]);
  });

  it("finds a scanned file nested two directories down", () => {
    mkdirSync(join(tempDir, "privacy", "deep"), { recursive: true });
    writeFileSync(join(tempDir, "privacy", "deep", "x.html"), "<p>hi</p>");

    expect(collectScannedFiles(tempDir)).toEqual([
      { file: join("privacy", "deep", "x.html"), content: "<p>hi</p>" },
    ]);
  });

  it("skips a nested file isScannedFile rejects", () => {
    mkdirSync(join(tempDir, "privacy"));
    writeFileSync(join(tempDir, "privacy", "a.js"), "console.log(1)");

    expect(collectScannedFiles(tempDir)).toEqual([]);
  });

  it("reports paths relative to a given baseDir, not the scanned dir", () => {
    mkdirSync(join(tempDir, "out", "privacy"), { recursive: true });
    writeFileSync(join(tempDir, "out", "privacy", "x.html"), "<p>hi</p>");

    expect(collectScannedFiles(join(tempDir, "out"), tempDir)).toEqual([
      { file: join("out", "privacy", "x.html"), content: "<p>hi</p>" },
    ]);
  });
});
