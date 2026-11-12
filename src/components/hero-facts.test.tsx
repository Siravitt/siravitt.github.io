import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { HeroFacts } from "@/components/hero-facts";
import { siteFixture } from "@/test/fixtures/site";

describe("HeroFacts", () => {
  it("renders each fixture fact as a term and definition", () => {
    render(<HeroFacts site={siteFixture} />);
    siteFixture.hero.facts.forEach((fact) => {
      expect(screen.getByText(fact.label)).toBeInTheDocument();
      expect(screen.getByText(fact.value)).toBeInTheDocument();
    });
  });

  it("renders a fact with an href as a link to that URL", () => {
    render(<HeroFacts site={siteFixture} />);
    const linkedFact = siteFixture.hero.facts.find((fact) => fact.href);
    expect(linkedFact).toBeDefined();
    const link = screen.getByRole("link", {
      name: new RegExp(linkedFact!.value),
    });
    expect(link).toHaveAttribute("href", linkedFact!.href);
  });

  it("renders no description list when facts is empty", () => {
    const site = { ...siteFixture, hero: { ...siteFixture.hero, facts: [] } };
    const { container } = render(<HeroFacts site={site} />);
    expect(container.querySelector("dl")).toBeNull();
  });

  it("shows a marked fact's value as the dashed placeholder tag, not raw bracket text", () => {
    const site = {
      ...siteFixture,
      hero: {
        ...siteFixture.hero,
        facts: [
          { label: "Fixture label", value: "[Placeholder] Fixture city" },
        ],
      },
    };
    const { container } = render(<HeroFacts site={site} />);
    expect(container.querySelector(".ph")).toHaveTextContent("[Placeholder]");
    expect(screen.queryByText("[Placeholder] Fixture city")).toBeNull();
    expect(screen.getByText(/Fixture city/)).toBeInTheDocument();
  });

  it("renders ↗ for a fact link that leaves the site", () => {
    const site = {
      ...siteFixture,
      hero: {
        ...siteFixture.hero,
        facts: [
          {
            label: "Fixture label",
            value: "Fixture external",
            href: "https://example.com/elsewhere",
          },
        ],
      },
    };
    render(<HeroFacts site={site} />);
    const link = screen.getByRole("link", { name: /Fixture external/ });
    expect(link).toHaveTextContent("Fixture external ↗");
  });

  it("renders → for a fact link that stays on the site", () => {
    const site = {
      ...siteFixture,
      hero: {
        ...siteFixture.hero,
        facts: [
          {
            label: "Fixture label",
            value: "Fixture internal",
            href: "/privacy.html",
          },
        ],
      },
    };
    render(<HeroFacts site={site} />);
    const link = screen.getByRole("link", { name: /Fixture internal/ });
    expect(link).toHaveTextContent("Fixture internal →");
  });

  it("has no axe violations", async () => {
    const { container } = render(<HeroFacts site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
