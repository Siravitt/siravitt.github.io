/**
 * The site's one typed content object (ticket 01 decision: a single
 * content file at `src/content/site.ts`, approved as an exception to the
 * Standards' `src/lib` data rule — the Reviewer and Flame both know to
 * look here first). Ticket 02 fills in the full shape
 * (docs/tickets/02-content-model.md, "Decisions (binding)"): every block
 * below is fixed for every later ticket. Field names may follow TS
 * naming; the meaning and optionality of each field may not change.
 *
 * Every visitor-facing string that isn't real yet starts with the
 * `[Placeholder]` marker (see `src/lib/placeholder.ts`), which the
 * release guard (ticket 05) scans for before anything ships to `main`.
 * Per docs/tickets/README.md decision 1, *every* not-yet-real string is
 * marked this way — including each mock project's text fields and each
 * experience highlight — which puts more tags on the page than the
 * approved prototype shows (it marks one string per block). None of it
 * ships; Flame replaces every marker with real copy before release.
 */

/** The person the site is about. */
export interface SitePerson {
  /** Full name. Rendered as the page's only H1. */
  name: string;
  /** Short form of the name; the nav uses it below 1280px (DESIGN.md §4). */
  shortName: string;
  /** One line above the name (e.g. role and stack). */
  role: string;
  /** One-line pitch below the name. */
  pitch: string;
}

/** Document-level metadata. */
export interface SiteMeta {
  /** `<title>`, DESIGN.md §9. */
  title: string;
  /** Meta description. When unset, the page falls back to `person.pitch`. */
  description?: string;
}

/** One fact in the hero's `<dl>` (DESIGN.md §6, `hero-facts`). */
export interface HeroFact {
  label: string;
  value: string;
  /** Present when the value itself links somewhere (e.g. the GitHub fact). */
  href?: string;
}

/** The hero section's non-text content. */
export interface SiteHero {
  /** 0 to 3 facts shown in the desktop-only `<dl>` row. */
  facts: HeroFact[];
  /** Accessible name of the hero's drawn editor picture (`role="img"`). */
  artLabel: string;
  /** Label of the secondary "See projects" call to action. */
  secondaryLabel: string;
}

/** One of the five sections' heading copy. */
export interface SiteSection {
  /** Default: About / Stack / Projects / Experience / Contact; also the nav word. */
  title: string;
  /** The muted part after "Title." (e.g. "The languages and tools behind his software."). */
  tagline?: string;
  /** The line under the section's H2. */
  intro?: string;
}

export interface SiteSections {
  about: SiteSection;
  stack: SiteSection;
  projects: SiteSection;
  experience: SiteSection;
  contact: SiteSection;
}

export interface SiteAbout {
  /** The statement paragraph. May contain `highlight` as a substring. */
  statement: string;
  /**
   * A phrase inside `statement` shown highlighted (DESIGN.md §7.1 row 10).
   * When it isn't found in `statement`, nothing is highlighted.
   */
  highlight?: string;
  /** 0 to 2 further paragraphs. */
  paragraphs: string[];
}

/** The ten Simple Icons slugs DESIGN.md §6b draws as stack marks. */
export type StackIconSlug =
  | "go"
  | "typescript"
  | "postgresql"
  | "redis"
  | "nextdotjs"
  | "react"
  | "tailwindcss"
  | "docker"
  | "githubactions"
  | "git";

export interface StackItem {
  name: string;
  /** Omitted when the tool has no drawn mark; the row still renders, name only. */
  icon?: StackIconSlug;
}

export interface StackGroup {
  /** e.g. "Languages", "Backend". */
  name: string;
  items: StackItem[];
}

export interface SiteStack {
  groups: StackGroup[];
}

export interface ProjectLinks {
  source?: string;
  live?: string;
}

export interface ProjectVisualImage {
  kind: "image";
  src: string;
  /** Required: an image visual with no alt text fails `pnpm typecheck`. */
  alt: string;
  width: number;
  height: number;
}

/** One row of a terminal visual's test output. */
export interface TerminalResult {
  path: string;
  time: string;
}

/**
 * 1 to 5 result rows (ticket 09 decision). A tuple union, like
 * `ExperienceHighlights`, so the compiler — not a runtime check —
 * rejects an empty or over-long `results` array.
 */
export type TerminalResults =
  | [TerminalResult]
  | [TerminalResult, TerminalResult]
  | [TerminalResult, TerminalResult, TerminalResult]
  | [TerminalResult, TerminalResult, TerminalResult, TerminalResult]
  | [
      TerminalResult,
      TerminalResult,
      TerminalResult,
      TerminalResult,
      TerminalResult,
    ];

export interface ProjectVisualTerminal {
  kind: "terminal";
  /** Required: the picture's accessible name (ticket 09 decision). */
  label: string;
  /** The terminal window's title, e.g. "booking/api". */
  title: string;
  branch: string;
  /** Required: a terminal visual with no command fails `pnpm typecheck`. */
  command: string;
  results: TerminalResults;
  /** The status line after "PASS", e.g. "in 1.61s". */
  summary: string;
}

/** One row of a checklist visual. */
export interface ChecklistItem {
  text: string;
  done: boolean;
}

/**
 * 1 to 6 items (ticket 09 decision), the same tuple-union pattern as
 * `TerminalResults`: the "k of n" count and the progress bar's width
 * are computed from `done`, never stored as extra fields.
 */
export type ChecklistItems =
  | [ChecklistItem]
  | [ChecklistItem, ChecklistItem]
  | [ChecklistItem, ChecklistItem, ChecklistItem]
  | [ChecklistItem, ChecklistItem, ChecklistItem, ChecklistItem]
  | [ChecklistItem, ChecklistItem, ChecklistItem, ChecklistItem, ChecklistItem]
  | [
      ChecklistItem,
      ChecklistItem,
      ChecklistItem,
      ChecklistItem,
      ChecklistItem,
      ChecklistItem,
    ];

export interface ProjectVisualChecklist {
  kind: "checklist";
  /** Required: the picture's accessible name (ticket 09 decision). */
  label: string;
  /** The checklist window's title, e.g. "Due this week". */
  title: string;
  items: ChecklistItems;
}

/**
 * A project's picture. Discriminated by `kind`. Ticket 09 adds
 * `"terminal"` and `"checklist"` to the `"image"` ticket 08 left in
 * place; ticket 10 adds `"diff-review"`.
 */
export type ProjectVisual =
  ProjectVisualImage | ProjectVisualTerminal | ProjectVisualChecklist;

export interface Project {
  title: string;
  /** One line under the title. */
  summary: string;
  /** Problem → what he built. */
  description: string;
  /** His role on the project. */
  role: string;
  outcome: string;
  /** Stack tags, joined with " · " when rendered. May be empty. */
  tags: string[];
  /** e.g. "Mock project" — also a release-guard marker (docs/tickets/README.md decision 2). */
  badge?: string;
  links?: ProjectLinks;
  visual?: ProjectVisual;
}

/** Tuple union: the compiler rejects an array literal of any other length. */
export type ExperienceHighlights =
  | [string, string]
  | [string, string, string]
  | [string, string, string, string];

export interface ExperienceEntry {
  role: string;
  organisation: string;
  start: string;
  /** Absent means the role is current. */
  end?: string;
  /** 2 to 4 highlights, enforced by `ExperienceHighlights`. */
  highlights: ExperienceHighlights;
  tags?: string[];
}

export interface SiteContact {
  /** Optional one-line intro above the links. */
  intro?: string;
  email: string;
  /** Label every "Email Siravit" button uses (header, hero, contact). */
  emailLabel: string;
  github: string;
  githubLabel: string;
  linkedin: string;
  linkedinLabel: string;
}

export interface SiteFooter {
  lede: string;
  legal: string;
  sectionsHeading: string;
  elsewhereHeading: string;
}

/** Short UI words visitors read, not tied to one section. */
export interface SiteLabels {
  role: string;
  outcome: string;
  sourceCode: string;
  liveDemo: string;
  present: string;
  current: string;
  backToPortfolio: string;
  /** Accessible name of the mobile menu's disclosure button (ticket 03). */
  menu: string;
  /** The skip link's visible/accessible text, e.g. "Skip to content" (ticket 03). */
  skipLink: string;
  /** Accessible name of the header's nav landmark, e.g. "Main" (ticket 03). */
  navLabel: string;
}

export interface SiteNotFound {
  title: string;
  text: string;
  actionLabel: string;
}

/**
 * must-keep — Google OAuth, do not edit. Google's consent screen for the
 * Daedalus app links to `/privacy.html` and depends on this exact
 * wording: `policyText`'s apostrophes are straight (U+0027) and `line`'s
 * dash is an em dash (U+2014). No formatter or typography step may
 * change either. Guarded by `src/content/site.daedalus.test.tsx`.
 */
export interface SiteDaedalus {
  line: string;
  privacyLabel: string;
  privacyPath: string;
  policyHeading: string;
  policyText: string;
}

export interface SiteContent {
  person: SitePerson;
  meta: SiteMeta;
  hero: SiteHero;
  sections: SiteSections;
  about: SiteAbout;
  stack: SiteStack;
  projects: Project[];
  experience: ExperienceEntry[];
  contact: SiteContact;
  footer: SiteFooter;
  labels: SiteLabels;
  notFound: SiteNotFound;
  daedalus: SiteDaedalus;
}

export const site = {
  person: {
    // Real: Flame's name and GitHub handle are the only non-placeholder
    // content allowed in v1 (spec, Solution section).
    name: "Siravit Tanratanavijit",
    shortName: "Siravit",
    role: "[Placeholder] Software developer, Go and Next.js",
    pitch:
      "[Placeholder] One-line pitch in about 20 words: what he builds, who it is for and the result it brings.",
  },
  meta: {
    title: "Siravit Tanratanavijit: software developer portfolio",
    description:
      "[Placeholder] Projects, stack and experience of Siravit Tanratanavijit, a software developer who builds Go backends and Next.js frontends.",
  },
  hero: {
    facts: [
      { label: "Works in", value: "[Placeholder] Go and Next.js" },
      {
        label: "Code",
        value: "Siravitt on GitHub",
        href: "https://github.com/Siravitt",
      },
      { label: "Based in", value: "[Placeholder] City" },
    ],
    artLabel:
      "This site's content file open in an editor, beside a finished deploy to GitHub Pages",
    secondaryLabel: "See projects",
  },
  sections: {
    about: { title: "About" },
    stack: {
      title: "Stack",
      tagline: "[Placeholder] The languages and tools behind his software.",
      intro:
        "[Placeholder] Go and Next.js are his; the other tools stand in until he lists his own.",
    },
    projects: {
      title: "Projects",
      tagline: "[Placeholder] Four mock cards stand in for his software work.",
    },
    experience: {
      title: "Experience",
      intro:
        "[Placeholder] Three entries to replace; no employer or date on this page is real.",
    },
    contact: { title: "Contact" },
  },
  about: {
    statement:
      "[Placeholder] A short paragraph about Siravit: how he came to build software, the kind of problems he likes to own from start to finish, and the team he wants to join next.",
    highlight: "own from start to finish",
    paragraphs: [
      "[Placeholder] A second, shorter paragraph: how he works with a team, from the first spec to the release.",
      "[Placeholder] An optional third paragraph: what he does outside work that shapes how he builds.",
    ],
  },
  stack: {
    groups: [
      {
        name: "Languages",
        items: [
          { name: "Go", icon: "go" },
          { name: "TypeScript", icon: "typescript" },
        ],
      },
      {
        name: "Backend",
        items: [
          { name: "PostgreSQL", icon: "postgresql" },
          { name: "Redis", icon: "redis" },
        ],
      },
      {
        name: "Frontend",
        items: [
          { name: "Next.js", icon: "nextdotjs" },
          { name: "React", icon: "react" },
          { name: "Tailwind CSS", icon: "tailwindcss" },
        ],
      },
      {
        name: "Infra and tools",
        items: [
          { name: "Docker", icon: "docker" },
          { name: "GitHub Actions", icon: "githubactions" },
          { name: "Git", icon: "git" },
        ],
      },
    ],
  },
  projects: [
    {
      title: "[Placeholder] Booking API in Go",
      summary: "[Placeholder] A REST service for booking shared rooms",
      description:
        "[Placeholder] Teams double-booked rooms over chat. He built an API that checks for clashes and emails both sides.",
      role: "[Placeholder] Sole backend developer",
      outcome: "[Placeholder] No double bookings",
      tags: ["Go", "PostgreSQL", "Docker"],
      badge: "Mock project",
      links: {
        source: "https://github.com/Siravitt",
        live: "#projects",
      },
      // Mini-UI text is real demo content, not placeholder copy (ticket
      // 09 decision: it carries no [Placeholder] tag, the title and
      // badge already mark the project as a mock).
      visual: {
        kind: "terminal",
        label:
          "A terminal running the booking API's test suite, finishing with a pass",
        title: "booking/api",
        branch: "main",
        command: "go test ./...",
        results: [
          { path: "internal/booking", time: "0.41s" },
          { path: "internal/notify", time: "0.27s" },
          { path: "internal/store", time: "0.93s" },
        ],
        summary: "in 1.61s",
      },
    },
    {
      title: "[Placeholder] Team dashboard in Next.js",
      summary: "[Placeholder] One page for a small team's open work",
      description:
        "[Placeholder] Tasks lived in three tools. He built a server-rendered page that pulls them together and flags what is due.",
      role: "[Placeholder] Frontend lead",
      outcome: "[Placeholder] One page instead of three tools",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      badge: "Mock project",
      links: { source: "https://github.com/Siravitt" },
      visual: {
        kind: "checklist",
        label: "A checklist of 5 tasks due this week, 3 of them done",
        title: "Due this week",
        items: [
          { text: "Ship the task filters", done: true },
          { text: "Review the sign-in flow", done: true },
          { text: "Fix the date picker", done: true },
          { text: "Write the release notes", done: false },
          { text: "Demo to the team", done: false },
        ],
      },
    },
    {
      title: "[Placeholder] Pull request review bot",
      summary: "[Placeholder] Review comments before a person looks",
      description:
        "[Placeholder] Reviews kept catching the same slips. He wrote a bot that reads each pull request and suggests the fix inline.",
      role: "[Placeholder] Author and maintainer",
      outcome: "[Placeholder] Fewer review rounds",
      tags: ["Go", "GitHub Actions"],
      badge: "Mock project",
      links: { source: "https://github.com/Siravitt" },
    },
    {
      title: "[Placeholder] Command-line deploy tool",
      summary: "[Placeholder] Build, check and ship a service in one command",
      description:
        "[Placeholder] Deploys were a page of manual steps. He wrote a small CLI that runs them in order and stops at the first failure.",
      role: "[Placeholder] Personal project",
      outcome: "[Placeholder] Deploys in one command",
      tags: ["Go", "Docker"],
      badge: "Mock project",
    },
  ],
  experience: [
    {
      role: "[Placeholder] Role title",
      organisation: "[Placeholder] Organisation",
      start: "[Placeholder] Month Year",
      highlights: [
        "[Placeholder] One line on what he owns in this role.",
        "[Placeholder] One line on a result he delivered, with a number.",
      ],
      tags: ["Go", "Next.js"],
    },
    {
      role: "[Placeholder] Role title",
      organisation: "[Placeholder] Organisation",
      start: "[Placeholder] Month Year",
      end: "[Placeholder] Month Year",
      highlights: [
        "[Placeholder] One line on the team and the product.",
        "[Placeholder] One line on what changed because of his work.",
      ],
    },
    {
      role: "[Placeholder] Role title",
      organisation: "[Placeholder] Organisation",
      start: "[Placeholder] Month Year",
      end: "[Placeholder] Month Year",
      highlights: [
        "[Placeholder] One line on his first job in software.",
        "[Placeholder] One line on what he learned there.",
      ],
    },
  ],
  contact: {
    intro:
      "[Placeholder] One line on the roles and projects he wants to hear about.",
    email: "placeholder@example.com",
    emailLabel: "Email Siravit",
    github: "https://github.com/Siravitt",
    githubLabel: "GitHub profile",
    linkedin: "https://www.linkedin.com/in/placeholder-profile",
    linkedinLabel: "LinkedIn profile",
  },
  footer: {
    lede: "[Placeholder] Siravit Tanratanavijit. Projects, stack and experience on one page.",
    legal: "© 2026 Siravit Tanratanavijit",
    sectionsHeading: "Sections",
    elsewhereHeading: "Elsewhere",
  },
  labels: {
    role: "Role",
    outcome: "Outcome",
    sourceCode: "Source code",
    liveDemo: "Live demo",
    present: "Present",
    current: "Current",
    backToPortfolio: "Back to the portfolio",
    menu: "Menu",
    skipLink: "Skip to content",
    navLabel: "Main",
  },
  notFound: {
    title: "Page not found",
    text: "This address has no page. It may be mistyped, or the page has moved.",
    actionLabel: "Go to the portfolio",
  },
  // must-keep — Google OAuth, do not edit. See SiteDaedalus above: the
  // em dash in `line` (U+2014) and the apostrophes in `policyText`
  // (U+0027) must stay exactly as written.
  daedalus: {
    line: "Daedalus — personal assistant app used only by its owner",
    privacyLabel: "Privacy",
    privacyPath: "/privacy.html",
    policyHeading: "Privacy Policy",
    policyText:
      "This app is used only by its owner to create events in the owner's own Google Calendar. No data is shared with third parties or stored outside the owner's machine.",
  },
} satisfies SiteContent;
