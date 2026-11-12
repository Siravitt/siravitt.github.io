import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { StackSection } from "@/components/stack-section";
import { siteFixture } from "@/test/fixtures/site";

describe("StackSection", () => {
  it("renders each group's name with its items in order, comma-separated", () => {
    render(<StackSection site={siteFixture} />);
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
    render(<StackSection site={site} />);
    expect(screen.queryByText("Fixture empty group")).toBeNull();
  });

  it("has one element with role img named exactly 'The marks of the tools in the list'", () => {
    render(<StackSection site={siteFixture} />);
    expect(
      screen.getByRole("img", { name: "The marks of the tools in the list" }),
    ).toBeInTheDocument();
  });

  it("does not expose the tool names a second time in the accessibility tree", () => {
    render(<StackSection site={siteFixture} />);
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    const innerList = panel.querySelector("ul");
    expect(innerList).toHaveAttribute("aria-hidden", "true");
  });

  it("holds no focusable elements inside the marks panel", () => {
    render(<StackSection site={siteFixture} />);
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
    render(<StackSection site={siteFixture} />);
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    expect(
      within(panel).getByText("Fixture tool without icon"),
    ).toBeInTheDocument();
  });

  it("flattens items across groups into the panel, in content order", () => {
    render(<StackSection site={siteFixture} />);
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
    render(<StackSection site={site} />);
    const panel = screen.getByRole("img", {
      name: "The marks of the tools in the list",
    });
    expect(within(panel).queryByText("Fixture empty group")).toBeNull();
  });

  it("renders the stack intro line when set", () => {
    render(<StackSection site={siteFixture} />);
    expect(
      screen.getByText(siteFixture.sections.stack.intro as string),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<StackSection site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
