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

  it("gives each line its index as --i, for the load type-in stagger (ticket 14, DESIGN.md §7.1 row 3)", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const lines = container.querySelectorAll("[data-ln]");
    lines.forEach((line, i) => {
      expect((line as HTMLElement).style.getPropertyValue("--i")).toBe(
        String(i),
      );
    });
  });

  it("marks the editor window and the deploy card as the two parallax depths (ticket 14, DESIGN.md §7.1 row 5)", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    expect(container.querySelectorAll("[data-hero-main]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-hero-note]")).toHaveLength(1);
  });

  it("renders the file-tree's two group labels and four entries lowercase, in monospace (ticket 21, DESIGN.md §6 'Hero editor')", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const tree = container.querySelector(
      "[data-hero-main] .font-mono",
    ) as HTMLElement;
    expect(tree).not.toBeNull();

    const groups = Array.from(tree.querySelectorAll("[data-tree-group]")).map(
      (el) => el.textContent,
    );
    expect(groups).toEqual(["src", "public"]);

    const items = Array.from(tree.querySelectorAll("[data-tree-item]")).map(
      (el) => el.textContent?.trim(),
    );
    expect(items).toEqual(["app", "components", "site.ts", "og.png"]);

    // No group or entry label is upper-cased by a text-transform class.
    [...tree.querySelectorAll("[data-tree-group], [data-tree-item]")].forEach(
      (el) => {
        expect(el.className).not.toMatch(/\buppercase\b/);
      },
    );
  });

  it("gives every file-tree entry a decorative, aria-hidden icon (ticket 21)", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const items = container.querySelectorAll("[data-tree-item]");
    expect(items).toHaveLength(4);
    items.forEach((item) => {
      const icons = item.querySelectorAll("[data-tree-icon]");
      expect(icons).toHaveLength(1);
      expect(icons[0]).toHaveAttribute("aria-hidden", "true");
    });
    // The group labels (not individual entries) carry no icon.
    container.querySelectorAll("[data-tree-group]").forEach((group) => {
      expect(group.querySelectorAll("[data-tree-icon]")).toHaveLength(0);
    });
  });

  it("draws every file-tree icon as the design's own 14px rounded-square glyph, not a folder/file svg or an icon library (ticket 21, demo.css:20; keeps Lighthouse mobile performance at develop's floor)", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const icons = container.querySelectorAll("[data-tree-icon]");
    expect(icons).toHaveLength(4);
    icons.forEach((icon) => {
      expect(icon.tagName).toBe("SPAN");
      expect(icon.className).toContain("size-3.5");
      expect(icon.className).toContain("rounded-[4px]");
      expect(icon.className).toContain("bg-current");
      expect(icon.className).toContain("opacity-30");
      // No svg/path markup at all (the design's icon is a plain square).
      expect(icon.querySelectorAll("svg, path")).toHaveLength(0);
    });
  });

  it("insets the editor window from the frame by margin (so the frame's own auto height still grows to contain it) and bleeds its right edge, clipped by the frame's overflow-hidden (ticket 21)", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const art = screen.getByRole("img", { name: siteFixture.hero.artLabel });
    expect(art.className).toMatch(/\boverflow-hidden\b/);
    const main = container.querySelector("[data-hero-main]") as HTMLElement;
    // Literal inset/bleed values from DESIGN.md's prototype tokens
    // (`--s-4` 16px, `--s-6` 32px, `--s-8` 64px, `--ly-cut` 28px).
    expect(main.className).toContain("mt-4");
    expect(main.className).toContain("ml-4");
    expect(main.className).toContain("sm:mt-8");
    expect(main.className).toContain("sm:ml-8");
    expect(main.className).toContain("lg:mt-16");
    expect(main.className).toContain("lg:ml-16");
    expect(main.className).toContain("-mr-7");
    expect(main.className).not.toMatch(/\babsolute\b/);
  });

  it("gives the frame a ≥640px min-height matching the design's ~716px content box, so the window ends with sand below it instead of flush with the frame's bottom (ticket 21)", () => {
    const { container } = render(<HeroArt site={siteFixture} />);
    const art = screen.getByRole("img", { name: siteFixture.hero.artLabel });
    // DESIGN.md item 1 / prototype `layout.css:30`'s `--ly-hero-h`:
    // `100svh - 72 (nav) - 48 (hgap) - 64 (hpadb)` = 716 at 900svh.
    expect(art.className).toContain("sm:min-h-[716px]");
    expect(art.className).toContain("min-h-[360px]");
    expect(container.querySelector("[data-hero-main]")).not.toBeNull();
  });
});
