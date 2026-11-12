import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { HomeView } from "@/components/home-view";
import { siteFixture } from "@/test/fixtures/site";

describe("HomeView", () => {
  it("renders exactly one H1, whose text is the fixture's name", () => {
    render(<HomeView site={siteFixture} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(siteFixture.person.name);
  });

  it("shows the fixture's role and pitch text", () => {
    render(<HomeView site={siteFixture} />);
    expect(screen.getByText(/Fixture role line/)).toBeInTheDocument();
    expect(screen.getByText(siteFixture.person.pitch)).toBeInTheDocument();
  });

  it("keeps the [Placeholder] marker text in the DOM for a marked fixture string", () => {
    render(<HomeView site={siteFixture} />);
    expect(screen.getByText("[Placeholder]")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<HomeView site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
