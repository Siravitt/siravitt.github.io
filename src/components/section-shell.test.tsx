import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SectionShell } from "@/components/section-shell";

describe("SectionShell", () => {
  it("renders the section with its id and a heading named after the title", () => {
    render(<SectionShell id="about" title="Fixture about" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Fixture about");
    expect(heading.closest("section")).toHaveAttribute("id", "about");
  });

  it("renders 'Title.' followed by the muted tagline when one is set", () => {
    render(
      <SectionShell
        id="stack"
        title="Fixture stack"
        tagline="Fixture tagline"
      />,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Fixture stack. Fixture tagline");
  });

  it("renders the title alone, with no trailing dot, when there is no tagline", () => {
    render(<SectionShell id="about" title="Fixture about" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Fixture about");
    expect(heading.textContent).not.toMatch(/\.$/);
  });

  it("shows the [Placeholder] marker in the tagline when the tagline carries one", () => {
    render(
      <SectionShell
        id="stack"
        title="Stack"
        tagline="[Placeholder] languages and tools"
      />,
    );
    expect(screen.getByText("[Placeholder]")).toBeInTheDocument();
  });

  it("is keyboard-focusable (tabIndex -1) so in-page jumps can focus it", () => {
    render(<SectionShell id="about" title="Fixture about" />);
    const section = screen
      .getByRole("heading", { level: 2 })
      .closest("section");
    expect(section).toHaveAttribute("tabindex", "-1");
  });

  it("renders the heading with a custom class when headingClassName is set, replacing the default", () => {
    render(
      <SectionShell
        id="about"
        title="Fixture about"
        headingClassName="fixture-label-class"
      />,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("fixture-label-class");
    expect(heading.className).not.toContain("tracking-[-0.02em]");
  });

  it("renders as a <footer> when asked to (the contact section)", () => {
    render(<SectionShell id="contact" title="Fixture contact" as="footer" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.closest("footer")).toHaveAttribute("id", "contact");
  });

  it("renders its children inside the shell", () => {
    render(
      <SectionShell id="about" title="Fixture about">
        <p>Fixture body</p>
      </SectionShell>,
    );
    expect(screen.getByText("Fixture body")).toBeInTheDocument();
  });

  it("does not render its own heading when renderHeading is false, handing headingId to a function child instead", () => {
    render(
      <SectionShell id="stack" title="Fixture stack" renderHeading={false}>
        {(headingId) => <h2 id={headingId}>Fixture stack heading</h2>}
      </SectionShell>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "stack-h");
    expect(heading).toHaveTextContent("Fixture stack heading");
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
    expect(heading.closest("section")).toHaveAttribute(
      "aria-labelledby",
      "stack-h",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SectionShell
        id="about"
        title="Fixture about"
        tagline="Fixture tagline"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
