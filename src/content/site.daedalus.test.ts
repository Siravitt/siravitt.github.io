import { describe, expect, it } from "vitest";
import { site } from "@/content/site";

/**
 * The only tests that read `site.ts` directly (docs/tickets/02-content-model.md,
 * AC3) — every other test uses `src/test/fixtures/site.ts`. These guard
 * the must-keep literals Google's OAuth consent screen for Daedalus
 * depends on, plus the real name and GitHub URL.
 */
describe("site.daedalus (must-keep — Google OAuth, do not edit)", () => {
  it("keeps the footer line exactly, with an em dash (U+2014)", () => {
    expect(site.daedalus.line).toBe(
      "Daedalus \u2014 personal assistant app used only by its owner",
    );
  });

  it("keeps the privacy path and policy heading exactly", () => {
    expect(site.daedalus.privacyPath).toBe("/privacy.html");
    expect(site.daedalus.policyHeading).toBe("Privacy Policy");
  });

  it("keeps the policy text verbatim, with straight apostrophes (U+0027)", () => {
    expect(site.daedalus.policyText).toBe(
      "This app is used only by its owner to create events in the owner\u0027s own Google Calendar. No data is shared with third parties or stored outside the owner\u0027s machine.",
    );
  });

  it("keeps the real name and GitHub URL", () => {
    expect(site.person.name).toBe("Siravit Tanratanavijit");
    expect(site.contact.github).toBe("https://github.com/Siravitt");
  });
});
