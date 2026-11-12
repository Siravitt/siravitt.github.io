import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import type { Project, SiteContent } from "@/content/site";
import { ProjectsSection } from "@/components/projects-section";
import { siteFixture } from "@/test/fixtures/site";

/**
 * Three projects covering the link-count matrix the ticket's acceptance
 * criteria ask for (docs/tickets/08-projects-cards.md): two links, one
 * link, no links. Independent of `siteFixture.projects` (which is tuned
 * for other tickets) so this file owns its own fixture, per the repo's
 * "spread/override, never mutate the shared fixture" convention.
 */
const threeProjects: Project[] = [
  {
    title: "Fixture project one",
    summary: "Fixture summary one",
    description: "Fixture description one",
    role: "Fixture role one",
    outcome: "Fixture outcome one",
    tags: ["Tag one", "Tag two"],
    badge: "Mock project",
    links: {
      source: "https://example.com/source-one",
      live: "https://example.com/live-one",
    },
  },
  {
    title: "Fixture project two",
    summary: "Fixture summary two",
    description: "Fixture description two",
    role: "Fixture role two",
    outcome: "Fixture outcome two",
    tags: ["Tag three"],
    links: { source: "https://example.com/source-two" },
  },
  {
    title: "Fixture project three",
    summary: "Fixture summary three",
    description: "Fixture description three",
    role: "Fixture role three",
    outcome: "Fixture outcome three",
    tags: ["Tag four"],
    badge: "Mock project",
  },
];

function siteWithProjects(projects: Project[]): SiteContent {
  return { ...siteFixture, projects };
}

describe("ProjectsSection", () => {
  it("renders one article per project, in content order, each with its title/summary/description/role/outcome/tags", () => {
    render(<ProjectsSection site={siteWithProjects(threeProjects)} />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(3);

    articles.forEach((article, i) => {
      const project = threeProjects[i];
      const scoped = within(article);
      expect(scoped.getByRole("heading", { level: 3 })).toHaveTextContent(
        project.title,
      );
      expect(scoped.getByText(project.summary)).toBeInTheDocument();
      expect(scoped.getByText(project.description)).toBeInTheDocument();
      expect(
        scoped.getByText(siteFixture.labels.role).closest("dt"),
      ).toHaveTextContent(siteFixture.labels.role);
      expect(scoped.getByText(project.role)).toBeInTheDocument();
      expect(scoped.getByText(project.outcome)).toBeInTheDocument();
      expect(
        scoped.getByText(project.tags.join(" \u00b7 ")),
      ).toBeInTheDocument();
    });
  });

  it("a project with both links has two links named 'Source code for <title>' and 'Live demo of <title>'", () => {
    render(<ProjectsSection site={siteWithProjects(threeProjects)} />);
    const article = screen.getAllByRole("article")[0];
    const source = within(article).getByRole("link", {
      name: "Fixture Source for Fixture project one",
    });
    const live = within(article).getByRole("link", {
      name: "Fixture Demo of Fixture project one",
    });
    expect(source).toHaveAttribute("href", "https://example.com/source-one");
    expect(source).toHaveTextContent("Fixture Source");
    expect(live).toHaveAttribute("href", "https://example.com/live-one");
    expect(live).toHaveTextContent("Fixture Demo");
    expect(within(article).getAllByRole("link")).toHaveLength(2);
  });

  it("shows ↗ on a link that leaves the site and → on one that stays on it", () => {
    const mixed: Project = {
      ...threeProjects[0],
      links: {
        source: "https://example.com/external",
        live: "/internal-page",
      },
    };
    render(<ProjectsSection site={siteWithProjects([mixed])} />);
    const article = screen.getByRole("article");
    expect(
      within(article).getByRole("link", {
        name: "Fixture Source for Fixture project one",
      }),
    ).toHaveTextContent("Fixture Source\u2197");
    expect(
      within(article).getByRole("link", {
        name: "Fixture Demo of Fixture project one",
      }),
    ).toHaveTextContent("Fixture Demo\u2192");
  });

  it("a project with only a source link renders exactly that one link", () => {
    render(<ProjectsSection site={siteWithProjects(threeProjects)} />);
    const article = screen.getAllByRole("article")[1];
    expect(within(article).getAllByRole("link")).toHaveLength(1);
    expect(
      within(article).getByRole("link", {
        name: "Fixture Source for Fixture project two",
      }),
    ).toBeInTheDocument();
  });

  it("a project with no links renders no link and no empty link container", () => {
    render(<ProjectsSection site={siteWithProjects(threeProjects)} />);
    const article = screen.getAllByRole("article")[2];
    expect(within(article).queryAllByRole("link")).toHaveLength(0);
  });

  it("a project with neither a badge nor links renders no empty top row before its title", () => {
    const bare: Project = {
      ...threeProjects[2],
      badge: undefined,
    };
    render(<ProjectsSection site={siteWithProjects([bare])} />);
    const article = screen.getByRole("article");
    const h3 = within(article).getByRole("heading", { level: 3 });
    expect(h3.previousElementSibling).toBeNull();
  });

  it("a project without a badge shows no badge", () => {
    render(<ProjectsSection site={siteWithProjects(threeProjects)} />);
    const withBadge = screen.getAllByRole("article")[0];
    const withoutBadge = screen.getAllByRole("article")[1];
    expect(within(withBadge).getByText("Mock project")).toBeInTheDocument();
    expect(within(withoutBadge).queryByText("Mock project")).toBeNull();
  });

  it("a project with tags: [] shows no tag line", () => {
    const noTags: Project = { ...threeProjects[0], tags: [] };
    render(<ProjectsSection site={siteWithProjects([noTags])} />);
    const article = screen.getByRole("article");
    const dl = article.querySelector("dl");
    expect(dl).not.toBeNull();
    expect(article.lastElementChild).toBe(dl);
  });

  it("a project with no visual shows no img/picture panel, even when one is set", () => {
    const withVisual: Project = {
      ...threeProjects[0],
      visual: {
        kind: "image",
        src: "/fixtures/project.png",
        alt: "Fixture alt",
        width: 10,
        height: 10,
      },
    };
    render(<ProjectsSection site={siteWithProjects([withVisual])} />);
    const article = screen.getByRole("article");
    expect(within(article).queryByRole("img")).toBeNull();
  });

  it("renders one card for a single project, and all six in order for six projects", () => {
    const one = [threeProjects[0]];
    const { rerender } = render(
      <ProjectsSection site={siteWithProjects(one)} />,
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);

    const six: Project[] = [
      ...threeProjects,
      { ...threeProjects[0], title: "Fixture project four" },
      { ...threeProjects[1], title: "Fixture project five" },
      { ...threeProjects[2], title: "Fixture project six" },
    ];
    rerender(<ProjectsSection site={siteWithProjects(six)} />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(6);
    expect(articles.map((a) => a.querySelector("h3")?.textContent)).toEqual([
      "Fixture project one",
      "Fixture project two",
      "Fixture project three",
      "Fixture project four",
      "Fixture project five",
      "Fixture project six",
    ]);
  });

  it("carries a 0/1 row-stagger index hook per card, for ticket 14", () => {
    render(<ProjectsSection site={siteWithProjects(threeProjects)} />);
    const articles = screen.getAllByRole("article");
    expect(articles[0].style.getPropertyValue("--i")).toBe("0");
    expect(articles[1].style.getPropertyValue("--i")).toBe("1");
    expect(articles[2].style.getPropertyValue("--i")).toBe("0");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ProjectsSection site={siteWithProjects(threeProjects)} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
