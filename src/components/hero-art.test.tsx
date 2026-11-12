import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { HeroArt } from "@/components/hero-art";
import { siteFixture } from "@/test/fixtures/site";

describe("HeroArt", () => {
  it("is a role=img picture named by the fixture's artLabel", () => {
    render(<HeroArt site={siteFixture} />);
    expect(
      screen.getByRole("img", { name: siteFixture.hero.artLabel }),
    ).toBeInTheDocument();
  });

  it("contains no focusable elements", () => {
    render(<HeroArt site={siteFixture} />);
    const art = screen.getByRole("img", { name: siteFixture.hero.artLabel });
    expect(
      art.querySelectorAll("a, button, input, select, textarea, [tabindex]"),
    ).toHaveLength(0);
  });

  it("marks every direct child of the picture aria-hidden (inner markup is presentational)", () => {
    render(<HeroArt site={siteFixture} />);
    const art = screen.getByRole("img", { name: siteFixture.hero.artLabel });
    expect(art.children.length).toBeGreaterThan(0);
    Array.from(art.children).forEach((child) => {
      expect(child).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("draws the fixture's name, role and pitch values", () => {
    render(<HeroArt site={siteFixture} />);
    const art = screen.getByRole("img", { name: siteFixture.hero.artLabel });
    expect(art.textContent).toContain(siteFixture.person.name);
    expect(art.textContent).toContain(siteFixture.person.role);
    expect(art.textContent).toContain(siteFixture.person.pitch);
  });

  it("shows the GitHub URL without its https:// prefix", () => {
    render(<HeroArt site={siteFixture} />);
    const art = screen.getByRole("img", { name: siteFixture.hero.artLabel });
    expect(art.textContent).toContain("example.com/fixture-github");
    expect(art.textContent).not.toContain("https://example.com");
  });

  it("shows the privacy path from the fixture's daedalus block", () => {
    render(<HeroArt site={siteFixture} />);
    const art = screen.getByRole("img", { name: siteFixture.hero.artLabel });
    expect(art.textContent).toContain(siteFixture.daedalus.privacyPath);
  });

  it("changes the drawing when the content changes (no hard-coded name)", () => {
    const otherSite = {
      ...siteFixture,
      person: { ...siteFixture.person, name: "Someone Else Entirely" },
    };
    render(<HeroArt site={otherSite} />);
    const art = screen.getByRole("img", { name: siteFixture.hero.artLabel });
    expect(art.textContent).toContain("Someone Else Entirely");
    expect(art.textContent).not.toContain(siteFixture.person.name);
  });

  it("has no axe violations", async () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("draws exactly 14 lines, each with a data-ln index, and one separate highlight element", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const lines = container.querySelectorAll("[data-ln]");
    expect(lines).toHaveLength(14);
    lines.forEach((line, i) =>
      expect(line).toHaveAttribute("data-ln", String(i)),
    );
    expect(container.querySelectorAll("[data-ln-highlight]")).toHaveLength(1);
  });

  it("positions the highlight bar on line 4 (name, index 3) with no extra offset from the code column's own padding", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const highlight = container.querySelector(
      "[data-ln-highlight]",
    ) as HTMLElement;
    const firstLine = container.querySelector('[data-ln="0"]') as HTMLElement;
    // 22px line height x index 3 = 66px, measured from line 0's own top.
    expect(highlight.style.top).toBe("66px");
    // The bar and the lines share one padding-free positioning parent
    // (review round 1: a bar positioned against the *padded* code
    // column lands 12px too high, since `top` is relative to the
    // containing block's padding edge, not its content edge).
    const linesParent = firstLine.parentElement;
    expect(highlight.parentElement).toBe(linesParent);
    expect(linesParent?.className).not.toMatch(/\bp[xy]-/);
  });

  it("keeps each line's leading indentation (pre, not nowrap) so the drawing reads as indented code", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const personLine = container.querySelector('[data-ln="2"]') as HTMLElement;
    expect(personLine.className).toContain("whitespace-pre");
    expect(personLine.className).not.toContain("whitespace-nowrap");
  });
});
