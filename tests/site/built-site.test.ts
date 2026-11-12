import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  OUT_DIR,
  assertOutDirExists,
  listOutFiles,
  parseOutFile,
} from "./helpers";

/**
 * Seam B (docs/tickets/05-built-site-checks-release-guard.md,
 * docs/spec.md "Testing Decisions"): what Google's crawler and a
 * visitor actually get from the static export in `out/`, after
 * `pnpm build`. These are the only tests allowed to assert real-content
 * literals, and only the must-keep ones (spec, "Tests must not depend
 * on Flame's placeholder copy"): the Daedalus footer line, the privacy
 * path and the policy text, verbatim.
 */
beforeAll(() => {
  assertOutDirExists();
});

const PAGES = ["index.html", "privacy.html", "404.html"];

// Must-keep literals (Review Focus 2: written as code-point escapes so the
// straight apostrophe, em dash and middle dot can't be silently swapped
// for their typographic look-alikes by an edit to this file).
const POLICY_TEXT =
  "This app is used only by its owner to create events in the owner\u0027s own Google Calendar. No data is shared with third parties or stored outside the owner\u0027s machine.";
const DAEDALUS_FOOTER_TEXT =
  "Daedalus \u2014 personal assistant app used only by its owner \u00b7 Privacy";
const SITE_ORIGIN = "https://siravitt.github.io";

describe("the three pages exist, and no HTML ships under out/privacy/", () => {
  it("out/index.html, out/privacy.html and out/404.html exist as files", () => {
    for (const page of PAGES) {
      expect(existsSync(join(OUT_DIR, page))).toBe(true);
    }
  });

  // DECIDED by Flame 2026-11-12 (overrides the ticket text): Next's
  // static export always writes out/privacy/ as a folder of RSC
  // prefetch .txt payloads. That is fine — the rule is no HTML there.
  it("has no .html file anywhere under out/privacy/", () => {
    const htmlUnderPrivacy = listOutFiles([".html"]).filter((file) =>
      file.startsWith(`privacy${"/"}`),
    );
    expect(htmlUnderPrivacy).toEqual([]);
  });
});

describe("privacy.html carries the policy verbatim", () => {
  it("has exactly one H1 'Privacy Policy'", () => {
    const doc = parseOutFile("privacy.html");
    const headings = doc.querySelectorAll("h1");
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Privacy Policy");
  });

  it("has a paragraph whose decoded text is the policy text, character for character", () => {
    const doc = parseOutFile("privacy.html");
    const paragraphs = Array.from(doc.querySelectorAll("p")).map(
      (p) => p.textContent,
    );
    expect(paragraphs).toContain(POLICY_TEXT);
  });
});

describe("every page's footer carries the Daedalus line and the Privacy link", () => {
  it.each(PAGES)("%s", (page) => {
    const doc = parseOutFile(page);
    const footer = doc.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain(DAEDALUS_FOOTER_TEXT);

    const privacyLink = Array.from(footer?.querySelectorAll("a") ?? []).find(
      (a) => a.textContent === "Privacy",
    );
    expect(privacyLink).toBeDefined();
    expect(privacyLink?.getAttribute("href")).toBe("/privacy.html");
  });
});

describe("document metadata", () => {
  it.each(PAGES)('%s declares <html lang="en">', (page) => {
    const doc = parseOutFile(page);
    expect(doc.documentElement.getAttribute("lang")).toBe("en");
  });

  it("privacy.html has the absolute canonical URL", () => {
    const doc = parseOutFile("privacy.html");
    const canonical = doc.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(`${SITE_ORIGIN}/privacy.html`);
  });

  it("404.html has a noindex robots meta", () => {
    const doc = parseOutFile("404.html");
    const robots = doc.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute("content")).toContain("noindex");
  });
});

/** True when a resource reference is relative, in-page, or on the site's own origin. */
function isOwnOriginOrRelative(url: string): boolean {
  if (url === "") return true;
  if (url.startsWith(`${SITE_ORIGIN}/`) || url === SITE_ORIGIN) return true;
  // Absolute (scheme://) or scheme-relative (//host/...) URLs are the
  // only shapes that name a different origin; everything else (/path,
  // ./path, path, #hash, ?query) resolves against this site.
  return !/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url);
}

/** Splits a `srcset` attribute into its candidate URLs (ignoring the descriptors). */
function urlsFromSrcset(value: string): string[] {
  return value
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter((url): url is string => Boolean(url));
}

const ORIGIN_CHECKS: Array<{
  selector: string;
  attr: string;
  srcset?: boolean;
}> = [
  { selector: "script[src]", attr: "src" },
  { selector: "link[href]", attr: "href" },
  { selector: "img[src]", attr: "src" },
  { selector: "img[srcset]", attr: "srcset", srcset: true },
  { selector: "source[srcset]", attr: "srcset", srcset: true },
  { selector: "iframe[src]", attr: "src" },
];

describe("no page loads a script, stylesheet, image or frame from a third-party origin", () => {
  it.each(PAGES)("%s", (page) => {
    const doc = parseOutFile(page);
    const offenders: string[] = [];
    for (const { selector, attr, srcset } of ORIGIN_CHECKS) {
      for (const el of doc.querySelectorAll(selector)) {
        const value = el.getAttribute(attr) ?? "";
        const urls = srcset ? urlsFromSrcset(value) : [value];
        for (const url of urls) {
          if (!isOwnOriginOrRelative(url)) {
            offenders.push(`${selector} ${attr}="${url}"`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("no runtime request to Google Fonts", () => {
  it("no .html, .css, .js, .txt or .json file in out/ mentions fonts.googleapis.com or fonts.gstatic.com", () => {
    const files = listOutFiles([".html", ".css", ".js", ".txt", ".json"]);
    const offenders = files.filter((file) => {
      const content = readFileSync(join(OUT_DIR, file), "utf8");
      return (
        content.includes("fonts.googleapis.com") ||
        content.includes("fonts.gstatic.com")
      );
    });
    expect(offenders).toEqual([]);
  });
});
