import type { SiteContent } from "@/content/site";

/**
 * Shared test fixture content (spec, Testing Decisions: "tests must not
 * depend on Flame's placeholder copy"). Component tests render views with
 * this object, never with `site.ts`, except where they assert a must-keep
 * literal (`src/content/site.daedalus.test.ts`).
 *
 * Ticket 02 decision: every optional field in the shape appears at least
 * once below, and there is both a current and an ended experience entry.
 * Strings are short and made up, not copied from `site.ts`; tests make
 * variants by spreading this object (e.g. `{ ...siteFixture, projects: [] }`).
 * Keep this in sync with `site.ts`'s shape by hand (no schema-generation step).
 */
export const siteFixture: SiteContent = {
  person: {
    name: "Fixture Person",
    shortName: "Fixture",
    role: "[Placeholder] Fixture role line",
    pitch: "Fixture pitch line with no placeholder marker.",
  },
  meta: {
    title: "Fixture Person: fixture title",
    description: "Fixture meta description.",
  },
  hero: {
    facts: [
      { label: "Fixture label one", value: "Fixture value one" },
      {
        label: "Fixture label two",
        value: "Fixture linked value",
        href: "https://example.com/fixture",
      },
    ],
    artLabel: "Fixture hero art accessible name",
    secondaryLabel: "Fixture secondary label",
  },
  sections: {
    about: { title: "Fixture about" },
    stack: {
      title: "Fixture stack",
      tagline: "Fixture stack tagline",
      intro: "Fixture stack intro line",
    },
    projects: {
      title: "Fixture projects",
      tagline: "Fixture projects tagline",
    },
    experience: {
      title: "Fixture experience",
      intro: "Fixture experience intro",
    },
    contact: { title: "Fixture contact" },
  },
  about: {
    statement: "Fixture statement with a fixture highlight inside it.",
    highlight: "fixture highlight",
    paragraphs: ["Fixture paragraph one.", "Fixture paragraph two."],
  },
  stack: {
    groups: [
      {
        name: "Fixture group one",
        items: [
          { name: "Fixture tool with icon", icon: "go" },
          { name: "Fixture tool without icon" },
        ],
      },
      {
        name: "Fixture group two",
        items: [{ name: "Fixture tool two", icon: "typescript" }],
      },
    ],
  },
  projects: [
    {
      title: "Fixture project with everything",
      summary: "Fixture summary",
      description: "Fixture description",
      role: "Fixture role",
      outcome: "Fixture outcome",
      tags: ["Fixture tag one", "Fixture tag two"],
      badge: "Fixture badge",
      links: {
        source: "https://example.com/source",
        live: "https://example.com/live",
      },
      visual: {
        kind: "image",
        src: "/fixtures/project.png",
        alt: "Fixture project screenshot",
        width: 10,
        height: 10,
      },
    },
    {
      title: "Fixture bare project",
      summary: "Fixture bare summary",
      description: "Fixture bare description",
      role: "Fixture bare role",
      outcome: "Fixture bare outcome",
      tags: [],
    },
  ],
  experience: [
    {
      role: "Fixture current role",
      organisation: "Fixture organisation one",
      start: "Fixture start one",
      highlights: ["Fixture highlight one", "Fixture highlight two"],
      tags: ["Fixture tag"],
    },
    {
      role: "Fixture past role",
      organisation: "Fixture organisation two",
      start: "Fixture start two",
      end: "Fixture end two",
      highlights: ["Fixture highlight three", "Fixture highlight four"],
    },
  ],
  contact: {
    intro: "Fixture contact intro",
    email: "fixture@example.com",
    emailLabel: "Fixture email label",
    github: "https://example.com/fixture-github",
    githubLabel: "Fixture GitHub label",
    linkedin: "https://example.com/fixture-linkedin",
    linkedinLabel: "Fixture LinkedIn label",
  },
  footer: {
    lede: "Fixture footer lede",
    legal: "Fixture legal line",
    sectionsHeading: "Fixture sections heading",
    elsewhereHeading: "Fixture elsewhere heading",
    elsewhereGithubLabel: "Fixture elsewhere GitHub",
    elsewhereLinkedinLabel: "Fixture elsewhere LinkedIn",
  },
  labels: {
    role: "Fixture Role",
    outcome: "Fixture Outcome",
    sourceCode: "Fixture Source",
    liveDemo: "Fixture Demo",
    present: "Fixture Present",
    current: "Fixture Current",
    backToPortfolio: "Fixture back link",
    menu: "Fixture menu",
    skipLink: "Fixture skip link",
    navLabel: "Fixture nav label",
  },
  notFound: {
    title: "Fixture not found title",
    text: "Fixture not found text",
    actionLabel: "Fixture action label",
  },
  daedalus: {
    line: "Fixture app line for tests only",
    privacyLabel: "Fixture Privacy",
    privacyPath: "/privacy.html",
    policyHeading: "Fixture Policy Heading",
    policyText: "Fixture policy text for tests only.",
  },
};
