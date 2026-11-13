import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ContactSection } from "@/components/contact-section";
import { siteFixture } from "@/test/fixtures/site";

/**
 * Seam A: ContactSection is the Contact footer's body — everything
 * ticket 03's `<footer id="contact">` shell holds above 04's legal row
 * (docs/tickets/12-contact-closing.md, "Decisions (binding)"). Rendered
 * standalone here (not inside the shell's own `<footer>`/H2), the same
 * convention as the other section-body tests (about/stack/projects/
 * experience-section.test.tsx).
 */
describe("ContactSection", () => {
  it("shows the lead line from contact.intro when present", () => {
    render(<ContactSection site={siteFixture} />);
    expect(
      screen.getByText(siteFixture.contact.intro as string),
    ).toBeInTheDocument();
  });

  it("renders no lead paragraph when contact.intro is absent", () => {
    const site = {
      ...siteFixture,
      contact: { ...siteFixture.contact, intro: undefined },
    };
    const { container } = render(<ContactSection site={site} />);
    expect(container.querySelector("p")?.textContent).not.toBe(
      siteFixture.contact.intro,
    );
    // No stray empty lead paragraph either.
    const leadCandidates = Array.from(container.querySelectorAll("p")).filter(
      (p) => p.textContent === "",
    );
    expect(leadCandidates).toHaveLength(0);
  });

  it("has a GitHub profile link named by the fixture's githubLabel, to the fixture URL, with a decorative logo", () => {
    render(<ContactSection site={siteFixture} />);
    const githubLink = screen.getByRole("link", {
      name: siteFixture.contact.githubLabel,
    });
    expect(githubLink).toHaveAttribute("href", siteFixture.contact.github);
    expect(githubLink.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps the underline off the logo and the trailing glyph, only on the label (carried-over fix, Flame 2026-11-13)", () => {
    render(<ContactSection site={siteFixture} />);
    const githubLink = screen.getByRole("link", {
      name: siteFixture.contact.githubLabel,
    });
    const svg = githubLink.querySelector("svg") as SVGSVGElement;
    const glyph = githubLink.querySelector(
      'span[aria-hidden="true"]',
    ) as HTMLElement;
    expect(svg.closest("span")?.className).toContain("no-underline");
    expect(glyph.className).toContain("no-underline");
  });

  it("has a LinkedIn profile link named by the fixture's linkedinLabel, to the fixture URL, with a decorative logo", () => {
    render(<ContactSection site={siteFixture} />);
    const linkedinLink = screen.getByRole("link", {
      name: siteFixture.contact.linkedinLabel,
    });
    expect(linkedinLink).toHaveAttribute("href", siteFixture.contact.linkedin);
    expect(linkedinLink.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("has an Email link named exactly the fixture's emailLabel, to the fixture mailto, whose key chip is hidden from the accessibility tree", () => {
    render(<ContactSection site={siteFixture} />);
    const emailLink = screen.getByRole("link", {
      name: siteFixture.contact.emailLabel,
    });
    expect(emailLink).toHaveAttribute(
      "href",
      `mailto:${siteFixture.contact.email}`,
    );
    const keyChip = emailLink.querySelector("kbd");
    expect(keyChip).toHaveAttribute("aria-hidden", "true");
  });

  it("shows the footer lede from site.footer.lede", () => {
    render(<ContactSection site={siteFixture} />);
    expect(screen.getByText(siteFixture.footer.lede)).toBeInTheDocument();
  });

  it("the Sections column links About, Stack, Projects and Experience by title, to their anchors, headed by footer.sectionsHeading", () => {
    render(<ContactSection site={siteFixture} />);
    const heading = screen.getByText(siteFixture.footer.sectionsHeading);
    const nav = heading.closest("div") as HTMLElement;
    const links = within(nav).getAllByRole("link");
    const titles = [
      siteFixture.sections.about.title,
      siteFixture.sections.stack.title,
      siteFixture.sections.projects.title,
      siteFixture.sections.experience.title,
    ];
    expect(links).toHaveLength(titles.length);
    links.forEach((link, i) => expect(link).toHaveAccessibleName(titles[i]));
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#about",
      "#stack",
      "#projects",
      "#experience",
    ]);
  });

  it("omits the Projects link from the Sections column when projects is empty", () => {
    const site = { ...siteFixture, projects: [] };
    render(<ContactSection site={site} />);
    const heading = screen.getByText(siteFixture.footer.sectionsHeading);
    const nav = heading.closest("div") as HTMLElement;
    expect(
      within(nav).queryByRole("link", {
        name: siteFixture.sections.projects.title,
      }),
    ).toBeNull();
  });

  it("the Elsewhere column links GitHub and LinkedIn by footer.elsewhereGithubLabel/elsewhereLinkedinLabel, to the fixture URLs, headed by footer.elsewhereHeading", () => {
    render(<ContactSection site={siteFixture} />);
    const heading = screen.getByText(siteFixture.footer.elsewhereHeading);
    const nav = heading.closest("div") as HTMLElement;
    const links = within(nav).getAllByRole("link");
    const labels = [
      siteFixture.footer.elsewhereGithubLabel,
      siteFixture.footer.elsewhereLinkedinLabel,
    ];
    expect(links).toHaveLength(labels.length);
    links.forEach((link, i) => expect(link).toHaveAccessibleName(labels[i]));
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      siteFixture.contact.github,
      siteFixture.contact.linkedin,
    ]);
  });

  // Reviewer round 2 fix 2: the prototype's shared text-link style
  // draws the underline on `:hover` *and* `:focus-visible`
  // (`motion.css:97`); `hover:underline` alone left keyboard focus
  // with no visible line. Covers both the Sections and Elsewhere
  // columns, which share `FooterColumnLink`.
  it("Sections and Elsewhere column links show the underline on focus-visible, not only hover (polish item 1)", () => {
    render(<ContactSection site={siteFixture} />);
    const sectionsHeading = screen.getByText(
      siteFixture.footer.sectionsHeading,
    );
    const elsewhereHeading = screen.getByText(
      siteFixture.footer.elsewhereHeading,
    );
    const sectionsLink = within(
      sectionsHeading.closest("div") as HTMLElement,
    ).getAllByRole("link")[0];
    const elsewhereLink = within(
      elsewhereHeading.closest("div") as HTMLElement,
    ).getAllByRole("link")[0];
    for (const link of [sectionsLink, elsewhereLink]) {
      expect(link.className).toMatch(/\bfocus-visible:underline\b/);
      expect(link.className).toMatch(/\bfocus-visible:decoration-current\b/);
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<ContactSection site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
