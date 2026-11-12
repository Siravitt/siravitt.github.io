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
});
