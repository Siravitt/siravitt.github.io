import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { PrivacyView } from "@/components/privacy-view";
import { siteFixture } from "@/test/fixtures/site";

/**
 * Seam A: PrivacyView is the restyled `/privacy.html` page
 * (docs/tickets/04-footer-privacy-404.md). Its main content holds
 * exactly the back link, the H1 and the verbatim policy text; the
 * header/footer below are exercised through Header's own tests, this
 * view only checks the "other page" wiring (anchor prefix, logo, the
 * current legal link) it is responsible for passing down.
 */
describe("PrivacyView", () => {
  it("has exactly one H1, the fixture's policy heading", () => {
    render(<PrivacyView site={siteFixture} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(siteFixture.daedalus.policyHeading);
  });

  it("the main landmark holds exactly the back link, the H1 and the verbatim policy text", () => {
    render(<PrivacyView site={siteFixture} />);
    const main = screen.getByRole("main");

    const links = within(main).getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[0]).toHaveAccessibleName(siteFixture.labels.backToPortfolio);

    const headings = within(main).getAllByRole("heading");
    expect(headings).toHaveLength(1);

    expect(
      within(main).getByText(siteFixture.daedalus.policyText),
    ).toBeInTheDocument();
  });

  it("has the current page's Privacy link marked aria-current='page' in the footer", () => {
    render(<PrivacyView site={siteFixture} />);
    const privacyLink = screen.getByRole("link", {
      name: siteFixture.daedalus.privacyLabel,
    });
    expect(privacyLink).toHaveAttribute("aria-current", "page");
  });

  it("prefixes nav anchors with / and points the logo at /", () => {
    render(<PrivacyView site={siteFixture} />);
    const nav = screen.getByRole("navigation", {
      name: siteFixture.labels.navLabel,
    });
    const firstNavLink = within(nav).getAllByRole("link")[0];
    expect(firstNavLink).toHaveAttribute("href", "/#about");
    expect(
      screen.getByRole("link", { name: siteFixture.person.name }),
    ).toHaveAttribute("href", "/");
  });

  it("has no axe violations", async () => {
    const { container } = render(<PrivacyView site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
