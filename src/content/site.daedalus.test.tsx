import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { site } from "@/content/site";
import { LegalRow } from "@/components/legal-row";
import { PrivacyView } from "@/components/privacy-view";

/**
 * The only tests that read `site.ts` directly (docs/tickets/02-content-model.md,
 * AC3) — every other test uses `src/test/fixtures/site.ts`. These guard
 * the must-keep literals Google's OAuth consent screen for Daedalus
 * depends on, plus the real name and GitHub URL.
 *
 * Ticket 04's Review Focus 2 extends this file to render through React
 * with this real content (not the fixture, which uses made-up strings):
 * proof that nothing in the toolchain (JSX, Babel/SWC, Prettier) rewrites
 * the straight apostrophes, the em dash or the middle dot into their
 * "smart"/typographic look-alikes.
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

describe("rendering preserves must-keep characters (Review Focus 2)", () => {
  it("keeps the em dash (U+2014) and middle dot (U+00b7) in the rendered Daedalus line", () => {
    render(<LegalRow site={site} />);
    const link = screen.getByRole("link", {
      name: site.daedalus.privacyLabel,
    });
    const paragraph = link.closest("p");
    expect(paragraph?.textContent).toBe(
      `${site.daedalus.line} \u00b7 ${site.daedalus.privacyLabel}`,
    );
    expect(paragraph?.textContent).toContain("\u2014");
    expect(paragraph?.textContent).toContain("\u00b7");
    // not the typographic look-alikes a smart-quotes/typography step would substitute
    expect(paragraph?.textContent).not.toContain("\u2013"); // en dash
    expect(paragraph?.textContent).not.toContain("."); // period instead of the middle dot
  });

  it("keeps straight apostrophes (U+0027) in the rendered policy text", () => {
    render(<PrivacyView site={site} />);
    const policy = screen.getByText(site.daedalus.policyText);
    expect(policy.textContent).toBe(site.daedalus.policyText);
    expect(policy.textContent).toContain("\u0027");
    expect(policy.textContent).not.toContain("\u2019"); // curly apostrophe
  });
});
