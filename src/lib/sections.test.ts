import { describe, expect, it } from "vitest";
import { getTimelineScope, getVisibleSections } from "@/lib/sections";
import { siteFixture } from "@/test/fixtures/site";

describe("getVisibleSections", () => {
  it("includes all five sections, in order, when every list has items", () => {
    expect(getVisibleSections(siteFixture)).toEqual([
      "about",
      "stack",
      "projects",
      "experience",
      "contact",
    ]);
  });

  it("hides projects when the list is empty", () => {
    const site = { ...siteFixture, projects: [] };
    expect(getVisibleSections(site)).toEqual([
      "about",
      "stack",
      "experience",
      "contact",
    ]);
  });

  it("hides experience when the list is empty", () => {
    const site = { ...siteFixture, experience: [] };
    expect(getVisibleSections(site)).toEqual([
      "about",
      "stack",
      "projects",
      "contact",
    ]);
  });

  it("hides stack when every group has no items", () => {
    const site = {
      ...siteFixture,
      stack: {
        groups: [
          { name: "Empty group", items: [] },
          { name: "Also empty", items: [] },
        ],
      },
    };
    expect(getVisibleSections(site)).toEqual([
      "about",
      "projects",
      "experience",
      "contact",
    ]);
  });

  it("keeps stack when at least one group has an item", () => {
    const site = {
      ...siteFixture,
      stack: {
        groups: [
          { name: "Empty group", items: [] },
          { name: "Has one", items: [{ name: "Fixture tool" }] },
        ],
      },
    };
    expect(getVisibleSections(site)).toEqual([
      "about",
      "stack",
      "projects",
      "experience",
      "contact",
    ]);
  });

  it("always keeps about and contact, even when every other list is empty", () => {
    const site = {
      ...siteFixture,
      projects: [],
      experience: [],
      stack: { groups: [] },
    };
    expect(getVisibleSections(site)).toEqual(["about", "contact"]);
  });
});

describe("getTimelineScope", () => {
  it("names a view timeline for every visible section, in order (ticket 14)", () => {
    expect(getTimelineScope(siteFixture)).toBe(
      "--sec-about, --sec-stack, --sec-projects, --sec-experience, --sec-contact",
    );
  });

  it("doesn't name the projects timeline when projects is empty", () => {
    const site = { ...siteFixture, projects: [] };
    const scope = getTimelineScope(site);
    expect(scope).not.toContain("--sec-projects");
    expect(scope).toBe(
      "--sec-about, --sec-stack, --sec-experience, --sec-contact",
    );
  });

  it("drops both the experience and stack timelines when both lists are empty", () => {
    const site = {
      ...siteFixture,
      experience: [],
      stack: { groups: [] },
    };
    expect(getTimelineScope(site)).toBe(
      "--sec-about, --sec-projects, --sec-contact",
    );
  });
});
