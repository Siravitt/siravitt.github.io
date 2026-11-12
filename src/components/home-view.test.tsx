import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
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
    expect(screen.getAllByText("[Placeholder]").length).toBeGreaterThan(0);
  });

  it("renders the five sections, in order, each with exactly one H2 named after its title", () => {
    const { container } = render(<HomeView site={siteFixture} />);
    const ids = ["about", "stack", "projects", "experience", "contact"];
    const elements = ids.map((id) => container.querySelector(`#${id}`));
    elements.forEach((el) => expect(el).not.toBeNull());

    // DOM order matches the decided section order.
    const positions = elements.map((el) =>
      Array.prototype.indexOf.call(container.querySelectorAll("*"), el),
    );
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    const titles = [
      siteFixture.sections.about.title,
      siteFixture.sections.stack.title,
      siteFixture.sections.projects.title,
      siteFixture.sections.experience.title,
      siteFixture.sections.contact.title,
    ];
    elements.forEach((el, i) => {
      const headings = within(el as HTMLElement).getAllByRole("heading", {
        level: 2,
      });
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent(titles[i]);
    });
  });

  it("the contact section is the page's closing <footer>", () => {
    const { container } = render(<HomeView site={siteFixture} />);
    expect(container.querySelector("#contact")?.tagName.toLowerCase()).toBe(
      "footer",
    );
  });

  it("the nav has five links in order, matching the five section titles and anchors", () => {
    render(<HomeView site={siteFixture} />);
    const nav = screen.getByRole("navigation", {
      name: siteFixture.labels.navLabel,
    });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      siteFixture.sections.about.title,
      siteFixture.sections.stack.title,
      siteFixture.sections.projects.title,
      siteFixture.sections.experience.title,
      siteFixture.sections.contact.title,
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#about",
      "#stack",
      "#projects",
      "#experience",
      "#contact",
    ]);
  });

  it("hides the Projects section and its nav link when projects is empty", () => {
    const site = { ...siteFixture, projects: [] };
    const { container } = render(<HomeView site={site} />);
    expect(container.querySelector("#projects")).toBeNull();
    const nav = screen.getByRole("navigation", { name: site.labels.navLabel });
    expect(
      within(nav).queryByRole("link", { name: site.sections.projects.title }),
    ).toBeNull();
    // About and Contact always stay.
    expect(container.querySelector("#about")).not.toBeNull();
    expect(container.querySelector("#contact")).not.toBeNull();
  });

  it("hides the Experience section and its nav link when experience is empty", () => {
    const site = { ...siteFixture, experience: [] };
    const { container } = render(<HomeView site={site} />);
    expect(container.querySelector("#experience")).toBeNull();
    const nav = screen.getByRole("navigation", { name: site.labels.navLabel });
    expect(
      within(nav).queryByRole("link", {
        name: site.sections.experience.title,
      }),
    ).toBeNull();
  });

  it("hides the Stack section and its nav link when every stack group is empty", () => {
    const site = {
      ...siteFixture,
      stack: { groups: [{ name: "Empty group", items: [] }] },
    };
    const { container } = render(<HomeView site={site} />);
    expect(container.querySelector("#stack")).toBeNull();
    const nav = screen.getByRole("navigation", { name: site.labels.navLabel });
    expect(
      within(nav).queryByRole("link", { name: site.sections.stack.title }),
    ).toBeNull();
  });

  it("the skip link is the first focusable element and targets #top", () => {
    render(<HomeView site={siteFixture} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "#top");
    expect(links[0]).toHaveAccessibleName(siteFixture.labels.skipLink);
  });

  it("has no axe violations", async () => {
    const { container } = render(<HomeView site={siteFixture} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
