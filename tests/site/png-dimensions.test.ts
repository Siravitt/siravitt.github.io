import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readPngDimensions, outPathFromUrl } from "./helpers";

/**
 * Unit test for the ticket 13 "must keep": PNG dimensions are read
 * from the file's own bytes (IHDR chunk), no image library. Builds a
 * synthetic minimal PNG buffer by hand so this test is independent of
 * `out/` and of any real brand asset — it only exercises the parser.
 */
function makeMinimalPng(width: number, height: number): Buffer {
  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // colour type: truecolour
  // remaining 3 bytes (compression, filter, interlace) stay 0
  const length = Buffer.alloc(4);
  length.writeUInt32BE(ihdrData.length, 0);
  const type = Buffer.from("IHDR", "ascii");
  const crc = Buffer.alloc(4); // not checked by the reader
  return Buffer.concat([signature, length, type, ihdrData, crc]);
}

describe("readPngDimensions", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "png-dim-test-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("reads width and height from a PNG's IHDR chunk", () => {
    const path = join(dir, "sample.png");
    writeFileSync(path, makeMinimalPng(1200, 630));
    expect(readPngDimensions(path)).toEqual({ width: 1200, height: 630 });
  });

  it("reads a different size correctly (not hard-coded to 1200x630)", () => {
    const path = join(dir, "other.png");
    writeFileSync(path, makeMinimalPng(512, 512));
    expect(readPngDimensions(path)).toEqual({ width: 512, height: 512 });
  });

  it("throws on a file with no PNG signature", () => {
    const path = join(dir, "not-a-png.png");
    writeFileSync(path, Buffer.from("not a png file at all"));
    expect(() => readPngDimensions(path)).toThrow(/not a PNG file/);
  });
});

describe("outPathFromUrl", () => {
  const origin = "https://siravitt.github.io";

  it("strips the origin and leading slash", () => {
    expect(outPathFromUrl(`${origin}/opengraph-image.png`, origin)).toBe(
      "opengraph-image.png",
    );
  });

  it("drops a trailing query string Next adds to file-based icon routes", () => {
    expect(outPathFromUrl(`${origin}/icon.png?abc123`, origin)).toBe(
      "icon.png",
    );
  });

  it("returns null for a URL on a different origin", () => {
    expect(outPathFromUrl("https://evil.example/x.png", origin)).toBeNull();
  });
});
