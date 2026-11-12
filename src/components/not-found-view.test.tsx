import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { NotFoundView } from "@/components/not-found-view";
import { siteFixture } from "@/test/fixtures/site";

/**
 * Seam A: NotFoundView is the styled 404 page (ticket 04). It shows
 * the fixture's title and text, a link home named by `notFound.actionLabel`,
 * and hides the decorative "404" glyph from the accessibility tree.
 */
describe("NotFoundView", () => {
  it("has exactly one H1, the fixture's not-found title", () => {
    render(<NotFoundView site={siteFixture} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(siteFixture.notFound.title);
  });

  it("shows the fixture's not-found text and a link home named by actionLabel", () => {
    render(<NotFoundView site={siteFixture} />);
    expect(screen.getByText(siteFixture.notFound.text)).toBeInTheDocument();

    const main = screen.getByRole("main");
    const homeLink = within(main).getByRole("link", {
      name: siteFixture.notFound.actionLabel,
    });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("hides the decorative 404 glyph from the accessibility tree", () => {
    render(<NotFoundView site={siteFixture} />);
    const decorative = screen.getByText("404");
    expect(decorative).toHaveAttribute("aria-hidden", "true");
  });

  it("prefixes nav anchors with / and points the logo at /", () => {
    render(<NotFoundView site={siteFixture} />);
    const nav = screen.getByRole("navigation", {
      name: siteFixture.labels.navLabel,
    });
    const firstNavLink = within(nav).getAllByRole("link")[0];
    expect(firstNavLink).toHaveAttribute("href", "/#about");
    expect(
      screen.getByRole("link", { name: siteFixture.person.name }),
    ).toHaveAttribute("href", "/");
  });

  it("has no aria-current on the footer's Privacy link (not the privacy page)", () => {
    render(<NotFoundView site={siteFixture} />);
    const privacyLink = screen.getByRole("link", {
      name: siteFixture.daedalus.privacyLabel,
    });
    expect(privacyLink).not.toHaveAttribute("aria-current");
  });

  it("has no axe violations", async () => {
    const { container } = render(<NotFoundView site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
