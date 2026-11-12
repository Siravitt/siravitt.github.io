import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { LegalRow } from "@/components/legal-row";
import { siteFixture } from "@/test/fixtures/site";

/**
 * Seam A: LegalRow is the must-keep legal row shared by the home footer
 * and the privacy/404 slim footer (docs/tickets/04-footer-privacy-404.md,
 * "Decisions"). It renders a single paragraph whose exact text is the
 * Daedalus line + " \u00b7 " + the privacy label, with the label itself
 * as a link to the exact privacy path.
 */
describe("LegalRow", () => {
  it("shows the copyright line and the Daedalus paragraph with a link to the privacy path", () => {
    render(<LegalRow site={siteFixture} />);
    expect(screen.getByText(siteFixture.footer.legal)).toBeInTheDocument();

    const link = screen.getByRole("link", {
      name: siteFixture.daedalus.privacyLabel,
    });
    expect(link).toHaveAttribute("href", "/privacy.html");

    const paragraph = link.closest("p");
    expect(paragraph?.textContent).toBe(
      `${siteFixture.daedalus.line} \u00b7 ${siteFixture.daedalus.privacyLabel}`,
    );
  });

  it("has no aria-current by default (home)", () => {
    render(<LegalRow site={siteFixture} />);
    const link = screen.getByRole("link", {
      name: siteFixture.daedalus.privacyLabel,
    });
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("marks the privacy link aria-current='page' when current is set", () => {
    render(<LegalRow site={siteFixture} current />);
    const link = screen.getByRole("link", {
      name: siteFixture.daedalus.privacyLabel,
    });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("has no axe violations", async () => {
    const { container } = render(<LegalRow site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
