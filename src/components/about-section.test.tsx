import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AboutSection } from "@/components/about-section";
import { siteFixture } from "@/test/fixtures/site";

describe("AboutSection", () => {
  it("renders the full statement text with the fixture highlight as its own <strong>", () => {
    render(<AboutSection site={siteFixture} />);
    const strong = screen.getByText("fixture highlight");
    expect(strong.tagName).toBe("STRONG");
    expect(strong.closest("p")).toHaveTextContent(siteFixture.about.statement);
  });

  it("marks the highlighted phrase as the colour-animation's target (ticket 14, DESIGN.md §7.1 row 10)", () => {
    render(<AboutSection site={siteFixture} />);
    const strong = screen.getByText("fixture highlight");
    expect(strong).toHaveAttribute("data-about-highlight");
  });

  it("renders the statement plain, with no <strong>, when the highlight isn't found in it", () => {
    const site = {
      ...siteFixture,
      about: { ...siteFixture.about, highlight: "not in the statement" },
    };
    render(<AboutSection site={site} />);
    const paragraph = screen.getByText(site.about.statement, { exact: true });
    expect(paragraph.tagName).toBe("P");
    expect(paragraph.querySelector("strong")).toBeNull();
  });

  it("renders each extra paragraph", () => {
    render(<AboutSection site={siteFixture} />);
    siteFixture.about.paragraphs.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  it("renders no extra paragraphs when the list is empty", () => {
    const site = {
      ...siteFixture,
      about: { ...siteFixture.about, paragraphs: [] },
    };
    const { container } = render(<AboutSection site={site} />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("shows the [Placeholder] marker as a tag ahead of the rest of the statement", () => {
    const site = {
      ...siteFixture,
      about: {
        ...siteFixture.about,
        statement: "[Placeholder] Fixture statement.",
        highlight: undefined,
      },
    };
    render(<AboutSection site={site} />);
    expect(screen.getByText("[Placeholder]")).toBeInTheDocument();
    expect(screen.getByText(/Fixture statement\./)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<AboutSection site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
