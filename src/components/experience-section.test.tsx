import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import type { ExperienceEntry, SiteContent } from "@/content/site";
import { ExperienceSection } from "@/components/experience-section";
import { siteFixture } from "@/test/fixtures/site";

/**
 * A current entry and an ended entry with tags, covering the ticket's
 * acceptance criteria independently of `siteFixture.experience` (tuned
 * for other tickets), per the repo's "spread/override the shared
 * fixture, never mutate it" convention.
 */
const twoEntries: ExperienceEntry[] = [
  {
    role: "Fixture current role",
    organisation: "Fixture current org",
    start: "Fixture start one",
    highlights: ["Fixture highlight one", "Fixture highlight two"],
    tags: ["Tag one", "Tag two"],
  },
  {
    role: "Fixture ended role",
    organisation: "Fixture ended org",
    start: "Fixture start two",
    end: "Fixture end two",
    highlights: ["Fixture highlight three", "Fixture highlight four"],
  },
];

function siteWithExperience(experience: ExperienceEntry[]): SiteContent {
  return { ...siteFixture, experience };
}

/**
 * The timeline `<ol>`'s own entries, as direct children — never a
 * `getAllByRole("listitem")` scoped to the list, which would also pick
 * up each entry's nested highlights `<ul>` items (also `role="list"`).
 */
function getTimelineItems(): HTMLElement[] {
  const lists = screen.getAllByRole("list");
  const timeline = lists.find((list) => list.tagName.toLowerCase() === "ol");
  if (!timeline) {
    throw new Error("no <ol> timeline found");
  }
  return Array.from(timeline.children) as HTMLElement[];
}

describe("ExperienceSection", () => {
  it("renders one ordered-list item per entry, in content order, each with its H3, period and highlights", () => {
    render(<ExperienceSection site={siteWithExperience(twoEntries)} />);
    const items = getTimelineItems();
    expect(items).toHaveLength(2);
    items.forEach((item) => expect(item.tagName.toLowerCase()).toBe("li"));

    items.forEach((item, i) => {
      const entry = twoEntries[i];
      const scoped = within(item);
      expect(scoped.getByRole("heading", { level: 3 })).toHaveTextContent(
        `${entry.role} \u00b7 ${entry.organisation}`,
      );
      entry.highlights.forEach((point) => {
        expect(scoped.getByText(point)).toBeInTheDocument();
      });
    });
  });

  it("the current entry's period ends with the present label and shows the current badge; the ended entry shows its end date and no badge", () => {
    render(<ExperienceSection site={siteWithExperience(twoEntries)} />);
    const items = getTimelineItems();

    const current = within(items[0]);
    expect(
      current.getByText(
        `${twoEntries[0].start} to ${siteFixture.labels.present}`,
      ),
    ).toBeInTheDocument();
    expect(current.getByText(siteFixture.labels.current)).toBeInTheDocument();

    const ended = within(items[1]);
    expect(
      ended.getByText(`${twoEntries[1].start} to ${twoEntries[1].end}`),
    ).toBeInTheDocument();
    expect(ended.queryByText(siteFixture.labels.current)).toBeNull();
  });

  it("an entry with tags shows them joined by ' \u00b7 '; an entry without tags has no tag line", () => {
    render(<ExperienceSection site={siteWithExperience(twoEntries)} />);
    const items = getTimelineItems();
    const tags = twoEntries[0].tags;
    if (!tags) {
      throw new Error("fixture entry must have tags for this test");
    }

    expect(
      within(items[0]).getByText(tags.join(" \u00b7 ")),
    ).toBeInTheDocument();
    // The ended entry has no `tags`: no mono tag-line paragraph at all.
    expect(items[1].querySelector("p")).toBeNull();
  });

  it("Review Focus 1: a highlight item has the wrap classes that stop an unbroken long word from overflowing", () => {
    // jsdom lays out nothing, so this can't measure scrollWidth; it
    // pins the fix found by the real-browser measurement pass (an
    // unbroken 140-char highlight overflowed 320px before `min-w-0`
    // was added to each highlight `<li>` — a CSS grid item's default
    // `min-width: auto` sizes to its content's min-content width,
    // which for a single unbreakable "word" ignores `overflow-wrap`).
    render(<ExperienceSection site={siteWithExperience(twoEntries)} />);
    const items = getTimelineItems();
    const highlightItem = items[0].querySelector("ul li") as HTMLElement;
    expect(highlightItem.className).toContain("min-w-0");
    const body = highlightItem.closest("div") as HTMLElement;
    expect(body.className).toContain("break-words");
  });

  it("Review Focus 4: a single entry renders exactly one list item", () => {
    render(<ExperienceSection site={siteWithExperience([twoEntries[0]])} />);
    expect(getTimelineItems()).toHaveLength(1);
  });

  it("the rail and each entry's dot (unlit ring + lit fill) are decorative, never announced", () => {
    const { container } = render(
      <ExperienceSection site={siteWithExperience(twoEntries)} />,
    );
    // Each entry draws two aria-hidden dot layers (an unlit ring under
    // the lit fill, review round 1 fix); the rail itself is CSS
    // (`before`/`after` pseudo-elements carry no generated text), so
    // nothing beyond the dots needs an explicit assertion here.
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots).toHaveLength(twoEntries.length * 2);
  });

  it("marks the lit dot as the light-up animation's target (ticket 14, DESIGN.md §7.1 row 9)", () => {
    const { container } = render(
      <ExperienceSection site={siteWithExperience(twoEntries)} />,
    );
    const dots = container.querySelectorAll("[data-exp-dot]");
    expect(dots).toHaveLength(twoEntries.length);
    dots.forEach((dot) => expect(dot).toHaveAttribute("aria-hidden", "true"));
  });

  it("the period renders a placeholder start/end through the dashed tag, never as raw text", () => {
    const placeholderEntries: ExperienceEntry[] = [
      {
        role: "Fixture role",
        organisation: "Fixture org",
        start: "[Placeholder] Month Year",
        end: "[Placeholder] Month Year two",
        highlights: ["Fixture highlight one", "Fixture highlight two"],
      },
    ];
    render(<ExperienceSection site={siteWithExperience(placeholderEntries)} />);
    const items = getTimelineItems();
    const period = within(items[0]).getByText(
      (_, element) =>
        element?.tagName.toLowerCase() === "span" &&
        element.className.includes("font-mono") &&
        element.textContent ===
          "[Placeholder] Month Year to [Placeholder] Month Year two",
    );
    // Both the start and the end marker render as the dashed `.ph` tag
    // (CODING_STANDARDS rule 4) — not as a flat `[Placeholder]` text
    // node sitting directly in the period, which is what the review
    // round 1 regression looked like even though the two render the
    // same concatenated textContent.
    const markerTags = period.querySelectorAll(".ph");
    expect(markerTags).toHaveLength(2);
    markerTags.forEach((tag) => expect(tag.textContent).toBe("[Placeholder]"));
    const directTextNodes = Array.from(period.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE,
    );
    directTextNodes.forEach((node) =>
      expect(node.textContent).not.toContain("[Placeholder]"),
    );
  });

  it("renders the intro line from site.sections.experience.intro", () => {
    render(<ExperienceSection site={siteWithExperience(twoEntries)} />);
    expect(
      screen.getByText(siteFixture.sections.experience.intro as string),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ExperienceSection site={siteWithExperience(twoEntries)} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
