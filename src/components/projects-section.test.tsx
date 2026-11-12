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

  it("a project with an image visual renders an img with the fixture's src, alt, width and height, inside the panel", () => {
    const withImage: Project = {
      ...threeProjects[0],
      visual: {
        kind: "image",
        src: "/fixtures/project.png",
        alt: "Fixture alt",
        width: 10,
        height: 10,
      },
    };
    render(<ProjectsSection site={siteWithProjects([withImage])} />);
    const article = screen.getByRole("article");
    const img = within(article).getByRole("img", { name: "Fixture alt" });
    expect(img).toHaveAttribute("src", "/fixtures/project.png");
    expect(img).toHaveAttribute("width", "10");
    expect(img).toHaveAttribute("height", "10");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("a project with an image but no links renders the panel and no link row", () => {
    const imageNoLinks: Project = {
      ...threeProjects[2],
      visual: {
        kind: "image",
        src: "/fixtures/project.png",
        alt: "Fixture alt",
        width: 10,
        height: 10,
      },
    };
    render(<ProjectsSection site={siteWithProjects([imageNoLinks])} />);
    const article = screen.getByRole("article");
    expect(
      within(article).getByRole("img", { name: "Fixture alt" }),
    ).toBeInTheDocument();
    expect(within(article).queryAllByRole("link")).toHaveLength(0);
  });

  it("a project with no visual still ends on its tags (Review Focus 4)", () => {
    render(<ProjectsSection site={siteWithProjects(threeProjects)} />);
    const article = screen.getAllByRole("article")[2];
    const tags = within(article).getByText("Tag four");
    expect(article.lastElementChild).toBe(tags.closest("p"));
  });

  it("a project with a terminal visual renders one role=img element named by its label, holding no focusable elements, whose hidden drawing has the command and every result path", () => {
    const withTerminal: Project = {
      ...threeProjects[0],
      visual: {
        kind: "terminal",
        label: "Fixture terminal label",
        title: "fixture/repo",
        branch: "main",
        command: "go test ./...",
        results: [
          { path: "internal/one", time: "0.10s" },
          { path: "internal/two", time: "0.20s" },
        ],
        summary: "in 0.30s",
      },
    };
    render(<ProjectsSection site={siteWithProjects([withTerminal])} />);
    const article = screen.getByRole("article");
    const panels = within(article).getAllByRole("img", {
      name: "Fixture terminal label",
    });
    expect(panels).toHaveLength(1);
    const panel = panels[0];
    expect(panel).toHaveTextContent("go test ./...");
    expect(panel).toHaveTextContent("internal/one");
    expect(panel).toHaveTextContent("internal/two");
    expect(within(panel).queryAllByRole("link", { hidden: true })).toHaveLength(
      0,
    );
    expect(
      within(panel).queryAllByRole("button", { hidden: true }),
    ).toHaveLength(0);
    expect(panel.querySelector("[tabindex]")).toBeNull();
  });

  it(
    "a terminal visual's drawing sits inside the panel's aria-hidden " +
      "wrapper (ticket decision: aria-hidden inside role=img; review round 1 " +
      "finding 6 — this regresses silently without the assertion)",
    () => {
      const withTerminal: Project = {
        ...threeProjects[0],
        visual: {
          kind: "terminal",
          label: "Fixture terminal label",
          title: "fixture/repo",
          branch: "main",
          command: "go test ./...",
          results: [{ path: "internal/one", time: "0.10s" }],
          summary: "in 0.10s",
        },
      };
      render(<ProjectsSection site={siteWithProjects([withTerminal])} />);
      const panel = screen.getByRole("img", { name: "Fixture terminal label" });
      const hidden = panel.querySelector('[aria-hidden="true"]');
      expect(hidden).not.toBeNull();
      expect(hidden).toHaveTextContent("go test ./...");
    },
  );

  it.each([
    { done: 0, expected: "0 of 5" },
    { done: 3, expected: "3 of 5" },
    { done: 5, expected: "5 of 5" },
  ])(
    "a checklist with 5 items, $done done, shows '$expected'",
    ({ done, expected }) => {
      const items = [
        "Item one",
        "Item two",
        "Item three",
        "Item four",
        "Item five",
      ].map((text, index) => ({ text, done: index < done })) as [
        { text: string; done: boolean },
        { text: string; done: boolean },
        { text: string; done: boolean },
        { text: string; done: boolean },
        { text: string; done: boolean },
      ];
      const withChecklist: Project = {
        ...threeProjects[1],
        visual: {
          kind: "checklist",
          label: "Fixture checklist label",
          title: "Due this week",
          items,
        },
      };
      render(<ProjectsSection site={siteWithProjects([withChecklist])} />);
      const article = screen.getByRole("article");
      const panel = within(article).getByRole("img", {
        name: "Fixture checklist label",
      });
      expect(panel).toHaveTextContent(expected);
    },
  );

  it(
    "a checklist visual's drawing sits inside the panel's aria-hidden " +
      "wrapper and holds no focusable elements (review round 1 finding 6)",
    () => {
      const withChecklist: Project = {
        ...threeProjects[1],
        visual: {
          kind: "checklist",
          label: "Fixture checklist label",
          title: "Due this week",
          items: [{ text: "Item one", done: true }],
        },
      };
      render(<ProjectsSection site={siteWithProjects([withChecklist])} />);
      const panel = screen.getByRole("img", {
        name: "Fixture checklist label",
      });
      const hidden = panel.querySelector('[aria-hidden="true"]');
      expect(hidden).not.toBeNull();
      expect(hidden).toHaveTextContent("Item one");
      expect(
        within(panel).queryAllByRole("link", { hidden: true }),
      ).toHaveLength(0);
      expect(
        within(panel).queryAllByRole("button", { hidden: true }),
      ).toHaveLength(0);
      expect(panel.querySelector("[tabindex]")).toBeNull();
    },
  );

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

  it("has no axe violations with image, terminal and checklist visuals", async () => {
    const withVisuals: Project[] = [
      {
        ...threeProjects[0],
        visual: {
          kind: "image",
          src: "/fixtures/project.png",
          alt: "Fixture alt",
          width: 10,
          height: 10,
        },
      },
      {
        ...threeProjects[1],
        visual: {
          kind: "terminal",
          label: "Fixture terminal label",
          title: "fixture/repo",
          branch: "main",
          command: "go test ./...",
          results: [{ path: "internal/one", time: "0.10s" }],
          summary: "in 0.10s",
        },
      },
      {
        ...threeProjects[2],
        visual: {
          kind: "checklist",
          label: "Fixture checklist label",
          title: "Due this week",
          items: [{ text: "Item one", done: true }],
        },
      },
    ];
    const { container } = render(
      <ProjectsSection site={siteWithProjects(withVisuals)} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
