import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { StackSection } from "@/components/stack-section";
import { siteFixture } from "@/test/fixtures/site";

describe("StackSection", () => {
  it("renders an h2 with the given headingId, named after the section's title and tagline", () => {
    render(<StackSection site={siteFixture} headingId="stack-h" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "stack-h");
    expect(heading).toHaveTextContent(
      `${siteFixture.sections.stack.title}. ${siteFixture.sections.stack.tagline}`,
    );
  });

  it("puts the heading, intro and rows list inside the same left column as the marks panel's sibling", () => {
    const { container } = render(
      <StackSection site={siteFixture} headingId="stack-h" />,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    const groupedList = container.querySelector(
      "ul:not([aria-hidden])",
    ) as HTMLElement;
    // Heading, intro and the grouped rows list share one parent (the left
    // column); the marks panel is that parent's next sibling.
    expect(heading.parentElement?.parentElement).toBe(
      groupedList.parentElement,
    );
    expect(panel.previousElementSibling).toBe(groupedList.parentElement);
  });

  it("renders each group's name with its items in order, comma-separated", () => {
    render(<StackSection site={siteFixture} headingId="stack-h" />);
    expect(screen.getByText("Fixture group one")).toBeInTheDocument();
    expect(
      screen.getByText("Fixture tool with icon, Fixture tool without icon"),
    ).toBeInTheDocument();
    expect(screen.getByText("Fixture group two")).toBeInTheDocument();
    expect(screen.getAllByText("Fixture tool two").length).toBeGreaterThan(0);
  });

  it("skips a group with no items in the rows list", () => {
    const site = {
      ...siteFixture,
      stack: {
        groups: [
          ...siteFixture.stack.groups,
          { name: "Fixture empty group", items: [] },
        ],
      },
    };
    render(<StackSection site={site} headingId="stack-h" />);
    expect(screen.queryByText("Fixture empty group")).toBeNull();
  });

  it("has one element with role img named exactly 'The marks of the tools in the list'", () => {
    render(<StackSection site={siteFixture} headingId="stack-h" />);
    expect(
      screen.getByRole("img", { name: "The marks of the tools in the list" }),
    ).toBeInTheDocument();
  });

  it("does not expose the tool names a second time in the accessibility tree", () => {
    render(<StackSection site={siteFixture} headingId="stack-h" />);
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    const innerList = panel.querySelector("ul");
    expect(innerList).toHaveAttribute("aria-hidden", "true");
  });

  it("holds no focusable elements inside the marks panel", () => {
    render(<StackSection site={siteFixture} headingId="stack-h" />);
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    expect(
      within(panel).queryAllByRole("link").length +
        within(panel).queryAllByRole("button").length,
    ).toBe(0);
    panel.querySelectorAll("*").forEach((el) => {
      expect(el).not.toHaveAttribute("tabindex");
    });
  });

  it("renders a fixture item without an icon as a row with just its name in the panel", () => {
    render(<StackSection site={siteFixture} headingId="stack-h" />);
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    expect(
      within(panel).getByText("Fixture tool without icon"),
    ).toBeInTheDocument();
  });

  it("flattens items across groups into the panel, in content order", () => {
    render(<StackSection site={siteFixture} headingId="stack-h" />);
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    const names = within(panel)
      .getAllByText(/Fixture tool/)
      .map((el) => el.textContent);
    expect(names).toEqual([
      "Fixture tool with icon",
      "Fixture tool without icon",
      "Fixture tool two",
    ]);
  });

  it("skips an empty group in the panel too", () => {
    const site = {
      ...siteFixture,
      stack: {
        groups: [
          ...siteFixture.stack.groups,
          { name: "Fixture empty group", items: [] },
        ],
      },
    };
    render(<StackSection site={site} headingId="stack-h" />);
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    expect(within(panel).queryByText("Fixture empty group")).toBeNull();
  });

  it("renders the stack intro line when set", () => {
    render(<StackSection site={siteFixture} headingId="stack-h" />);
    expect(
      screen.getByText(siteFixture.sections.stack.intro as string),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <StackSection site={siteFixture} headingId="stack-h" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
