import { existsSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { site } from "@/content/site";
import {
  OUT_DIR,
  assertOutDirExists,
  outPathFromUrl,
  parseOutFile,
  readPngDimensions,
} from "./helpers";

/**
 * Seam B (docs/tickets/13-seo-favicon-og.md "Acceptance criteria"):
 * the SEO/share-image tags a recruiter's browser tab and a link
 * preview actually get from the static export in `out/`. Title and
 * description are compared against `site.meta` imported from the
 * content module (never a copied literal), so Flame's copy edits
 * can't break this suite (ticket "Must keep"). Literals are used only
 * for the fixed parts the ticket names: the origin, `website`,
 * `summary_large_image`, `#0a0c0f`, and 1200/630.
 */
const SITE_ORIGIN = "https://siravitt.github.io";

beforeAll(() => {
  assertOutDirExists();
});

describe("out/index.html: home document metadata", () => {
  it("has a <title> equal to site.meta.title", () => {
    const doc = parseOutFile("index.html");
    expect(doc.querySelector("title")?.textContent).toBe(site.meta.title);
  });

  it("has a meta description equal to site.meta.description (falling back to person.pitch)", () => {
    const doc = parseOutFile("index.html");
    const description = doc.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toBe(
      site.meta.description ?? site.person.pitch,
    );
  });

  it('has <link rel="canonical" href="https://siravitt.github.io/">', () => {
    const doc = parseOutFile("index.html");
    const canonical = doc.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(`${SITE_ORIGIN}/`);
  });

  it("has og:title and og:description equal to site.meta's values", () => {
    const doc = parseOutFile("index.html");
    const ogTitle = doc.querySelector('meta[property="og:title"]');
    const ogDescription = doc.querySelector('meta[property="og:description"]');
    expect(ogTitle?.getAttribute("content")).toBe(site.meta.title);
    expect(ogDescription?.getAttribute("content")).toBe(
      site.meta.description ?? site.person.pitch,
    );
  });

  it('has og:type "website" and og:url "https://siravitt.github.io/"', () => {
    const doc = parseOutFile("index.html");
    const ogType = doc.querySelector('meta[property="og:type"]');
    const ogUrl = doc.querySelector('meta[property="og:url"]');
    expect(ogType?.getAttribute("content")).toBe("website");
    expect(ogUrl?.getAttribute("content")).toBe(`${SITE_ORIGIN}/`);
  });

  it("has an absolute og:image, 1200x630", () => {
    const doc = parseOutFile("index.html");
    const ogImage = doc.querySelector('meta[property="og:image"]');
    const width = doc.querySelector('meta[property="og:image:width"]');
    const height = doc.querySelector('meta[property="og:image:height"]');
    const url = ogImage?.getAttribute("content") ?? "";
    expect(url.startsWith(`${SITE_ORIGIN}/`)).toBe(true);
    expect(width?.getAttribute("content")).toBe("1200");
    expect(height?.getAttribute("content")).toBe("630");
  });

  it('has twitter:card "summary_large_image" and an absolute twitter:image', () => {
    const doc = parseOutFile("index.html");
    const card = doc.querySelector('meta[name="twitter:card"]');
    const image = doc.querySelector('meta[name="twitter:image"]');
    expect(card?.getAttribute("content")).toBe("summary_large_image");
    const url = image?.getAttribute("content") ?? "";
    expect(url.startsWith(`${SITE_ORIGIN}/`)).toBe(true);
  });

  it('has <meta name="theme-color" content="#0a0c0f">', () => {
    const doc = parseOutFile("index.html");
    const themeColor = doc.querySelector('meta[name="theme-color"]');
    expect(themeColor?.getAttribute("content")).toBe("#0a0c0f");
  });
});

describe("the files og:image, twitter:image and every icon link reference exist in out/", () => {
  it("og:image, twitter:image, every link[rel~=icon] and link[rel=apple-touch-icon] on index.html point at files that exist", () => {
    const doc = parseOutFile("index.html");
    const urls = [
      doc.querySelector('meta[property="og:image"]')?.getAttribute("content"),
      doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content"),
      ...Array.from(doc.querySelectorAll('link[rel~="icon"]')).map((link) =>
        link.getAttribute("href"),
      ),
      ...Array.from(doc.querySelectorAll('link[rel="apple-touch-icon"]')).map(
        (link) => link.getAttribute("href"),
      ),
    ].filter((url): url is string => Boolean(url));

    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      const relativePath = url.startsWith(`${SITE_ORIGIN}/`)
        ? outPathFromUrl(url, SITE_ORIGIN)
        : url.replace(/^\//, "").split(/[?#]/)[0];
      expect(relativePath).not.toBeNull();
      expect(
        existsSync(join(OUT_DIR, relativePath as string)),
        `expected ${url} -> out/${relativePath} to exist`,
      ).toBe(true);
    }
  });

  it("the OG image file is a PNG whose IHDR reads 1200x630", () => {
    const doc = parseOutFile("index.html");
    const ogImageUrl = doc
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content") as string;
    const relativePath = outPathFromUrl(ogImageUrl, SITE_ORIGIN) as string;
    const dimensions = readPngDimensions(join(OUT_DIR, relativePath));
    expect(dimensions).toEqual({ width: 1200, height: 630 });
  });
});

describe("out/privacy.html: its own title, still the absolute OG image", () => {
  it("has its own <title>, different from the home page's", () => {
    const home = parseOutFile("index.html");
    const privacy = parseOutFile("privacy.html");
    const homeTitle = home.querySelector("title")?.textContent;
    const privacyTitle = privacy.querySelector("title")?.textContent;
    expect(privacyTitle).not.toBe(homeTitle);
    expect(privacyTitle).toBe(
      `${site.daedalus.policyHeading}: ${site.person.name}`,
    );
  });

  it("still has an absolute og:image pointing at a file that exists", () => {
    const doc = parseOutFile("privacy.html");
    const ogImage = doc.querySelector('meta[property="og:image"]');
    const url = ogImage?.getAttribute("content") ?? "";
    expect(url.startsWith(`${SITE_ORIGIN}/`)).toBe(true);
    const relativePath = outPathFromUrl(url, SITE_ORIGIN) as string;
    expect(existsSync(join(OUT_DIR, relativePath))).toBe(true);
  });
});
