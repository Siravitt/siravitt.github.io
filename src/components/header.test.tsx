import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Header } from "@/components/header";
import { getVisibleSections } from "@/lib/sections";
import { siteFixture } from "@/test/fixtures/site";

const visibleSections = getVisibleSections(siteFixture);

describe("Header", () => {
  it("renders the skip link as the first focusable element, targeting #top", () => {
    render(<Header site={siteFixture} visibleSections={visibleSections} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "#top");
    expect(links[0]).toHaveAccessibleName(siteFixture.labels.skipLink);
  });

  it("names the logo link with the full name, even though the surname is visually hidden below 1280px", () => {
    render(<Header site={siteFixture} visibleSections={visibleSections} />);
    const logo = screen.getByRole("link", { name: siteFixture.person.name });
    expect(logo).toHaveAttribute("href", "#top");
  });

  it("has one nav landmark named 'Main' with five links in order, targeting the section anchors", () => {
    render(<Header site={siteFixture} visibleSections={visibleSections} />);
    const nav = screen.getByRole("navigation", {
      name: siteFixture.labels.navLabel,
    });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Fixture about",
      "Fixture stack",
      "Fixture projects",
      "Fixture experience",
      "Fixture contact",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#about",
      "#stack",
      "#projects",
      "#experience",
      "#contact",
    ]);
  });

  it("drops a section's nav link when that section is hidden", () => {
    render(
      <Header site={siteFixture} visibleSections={["about", "contact"]} />,
    );
    const nav = screen.getByRole("navigation", {
      name: siteFixture.labels.navLabel,
    });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Fixture about",
      "Fixture contact",
    ]);
  });

  it("uses the prefixed anchors when given an anchorPrefix (ticket 04's other pages)", () => {
    render(
      <Header
        site={siteFixture}
        visibleSections={visibleSections}
        anchorPrefix="/"
        logoHref="/"
      />,
    );
    const nav = screen.getByRole("navigation", {
      name: siteFixture.labels.navLabel,
    });
    const firstLink = within(nav).getAllByRole("link")[0];
    expect(firstLink).toHaveAttribute("href", "/#about");
    expect(
      screen.getByRole("link", { name: siteFixture.person.name }),
    ).toHaveAttribute("href", "/");
  });

  it("has two Email links to the fixture's mailto address (a compact bar one and the full one in the menu panel), both hiding the key chip from the accessible tree", () => {
    render(<Header site={siteFixture} visibleSections={visibleSections} />);
    const emails = screen.getAllByRole("link", {
      name: siteFixture.contact.emailLabel,
    });
    expect(emails).toHaveLength(2);
    emails.forEach((email) => {
      expect(email).toHaveAttribute(
        "href",
        `mailto:${siteFixture.contact.email}`,
      );
      expect(email.querySelector("kbd")).toHaveAttribute("aria-hidden", "true");
    });
  });

  // jsdom's accessibility tree (dom-accessibility-api) doesn't implement
  // HTML-AAM's implicit button role / aria-expanded mapping for
  // `<summary>` — it folds the element into its parent `<details>`'s
  // "group" role instead. Real browsers do expose `<summary>` as role
  // "button" with `aria-expanded` reflecting the `open` attribute
  // (verified by hand in Chrome via the accessibility tree, see the PR).
  // This test checks what jsdom *can* see: the native tag, its name and
  // the closed-by-default state; the role/aria-expanded mapping itself
  // is a manual/real-browser check (noted in the PR and the ticket).
  it("has a menu control reachable by keyboard, named from labels.menu, closed by default", () => {
    const { container } = render(
      <Header site={siteFixture} visibleSections={visibleSections} />,
    );
    const toggle = container.querySelector("summary");
    expect(toggle).not.toBeNull();
    expect(toggle).toHaveAttribute("aria-label", siteFixture.labels.menu);
    const details = toggle?.closest("details");
    expect(details).not.toHaveAttribute("open");
  });

  it("the toggle's aria-controls names the panel holding the same five links and the Email button", () => {
    const { container } = render(
      <Header site={siteFixture} visibleSections={visibleSections} />,
    );
    const toggle = container.querySelector("summary");
    const controlsId = toggle?.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    const panel = container.querySelector(`#${controlsId}`);
    expect(panel).not.toBeNull();
    const linksInPanel = within(panel as HTMLElement).getAllByRole("link");
    // five section links + the email link
    expect(linksInPanel).toHaveLength(6);
    expect(
      within(panel as HTMLElement).getByRole("link", {
        name: siteFixture.contact.emailLabel,
      }),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Header site={siteFixture} visibleSections={visibleSections} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has one scroll-progress element, hidden from the accessibility tree (ticket 14, DESIGN.md §7.1 row 1)", () => {
    const { container } = render(
      <Header site={siteFixture} visibleSections={visibleSections} />,
    );
    const progress = container.querySelectorAll("[data-scroll-progress]");
    expect(progress).toHaveLength(1);
    expect(progress[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("has one nav-spy span per nav link, hidden from the accessibility tree, without changing the link's accessible name (ticket 14, DESIGN.md §7.1 row 2)", () => {
    render(<Header site={siteFixture} visibleSections={visibleSections} />);
    const nav = screen.getByRole("navigation", {
      name: siteFixture.labels.navLabel,
    });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(visibleSections.length);
    links.forEach((link, i) => {
      const spy = link.querySelector("[data-nav-spy]");
      expect(spy).not.toBeNull();
      expect(spy).toHaveAttribute("aria-hidden", "true");
      expect(link).toHaveAttribute("data-nav-link", visibleSections[i]);
      expect(link).toHaveAccessibleName(
        siteFixture.sections[visibleSections[i]].title,
      );
    });
  });

  it("drops the nav-spy for a hidden section along with its link", () => {
    render(
      <Header site={siteFixture} visibleSections={["about", "contact"]} />,
    );
    const nav = screen.getByRole("navigation", {
      name: siteFixture.labels.navLabel,
    });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(
      links.some((link) => link.getAttribute("data-nav-link") === "stack"),
    ).toBe(false);
  });
});
