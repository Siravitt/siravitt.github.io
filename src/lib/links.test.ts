import { describe, expect, it } from "vitest";
import { isExternalHref } from "@/lib/links";

describe("isExternalHref", () => {
  it("treats an absolute http(s) URL as external", () => {
    expect(isExternalHref("https://github.com/Siravitt")).toBe(true);
    expect(isExternalHref("http://example.com")).toBe(true);
  });

  it("treats an in-page anchor as not external", () => {
    expect(isExternalHref("#projects")).toBe(false);
  });

  it("treats a site-relative path as not external", () => {
    expect(isExternalHref("/privacy.html")).toBe(false);
  });
});
