/**
 * The site's one typed content object (ticket 01 decision: a single
 * content file at `src/content/site.ts`, approved as an exception to the
 * Standards' `src/lib` data rule — the Reviewer and Flame both know to
 * look here first). Ticket 02 fills in the full shape
 * (docs/tickets/02-content-model.md, "Decisions (binding)"): every block
 * below is fixed for every later ticket. Field names may follow TS
 * naming; the meaning and optionality of each field may not change.
 *
 * Any visitor-facing string that isn't real yet starts with the
 * placeholder marker (`PLACEHOLDER_MARKER` in `src/lib/placeholder.ts`);
 * the release guard (ticket 05, `src/lib/release-guard.ts`) scans the
 * built site for that marker and a short list of other draft-content
 * tells before anything ships to `main`. Ticket 19 replaced every
 * marker and mock project with Flame's real copy from his 2026-11-16
 * Q&A with Daedalus; the mechanism above stays in place for any future
 * draft content.
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

/**
 * The Simple Icons slugs DESIGN.md §6b draws as stack marks. Ticket 19
 * adds `apachekafka`, `kubernetes` and `swagger` for the real stack;
 * AWS has no slug here (simple-icons removed its glyph for a trademark
 * request), so an AWS `StackItem` omits `icon` and falls back to the
 * existing name-only row instead.
 */
export type StackIconSlug =
  | "go"
  | "typescript"
  | "postgresql"
  | "redis"
  | "apachekafka"
  | "swagger"
  | "nextdotjs"
  | "react"
  | "tailwindcss"
  | "docker"
  | "kubernetes"
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

/** 0 to 4 context lines shown after a diff's comment thread (ticket 10
 * decision), the same tuple-union pattern as `TerminalResults`. */
export type DiffContextLines =
  | []
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string];

/**
 * A finished, applied code-review suggestion (ticket 10 decision): the
 * changed line's old call (`before`/`marked.before`) and the bot's
 * replacement (`after`/`marked.after`), already applied, plus its
 * comment thread. Line numbers and the +/− stat are fixed drawing
 * chrome in the component, not content.
 */
export interface ProjectVisualDiff {
  kind: "diff";
  /** Required: the picture's accessible name. */
  label: string;
  repo: string;
  dir: string;
  file: string;
  /** The hunk header, e.g. "@@ -12,6 +12,6 @@". */
  hunk: string;
  /** The hunk's function signature, shown after the hunk header. */
  signature: string;
  /** Required: a diff visual with no `before` fails `pnpm typecheck`. */
  before: string;
  after: string;
  /** The substring highlighted in each line (prototype: `context.Background()` → `ctx`). */
  marked: { before: string; after: string };
  author: string;
  authorInitials: string;
  time: string;
  /** May hold one inline-code span, written with backticks. */
  comment: string;
  context: DiffContextLines;
}

/**
 * A project's picture. Discriminated by `kind`. Ticket 09 adds
 * `"terminal"` and `"checklist"` to the `"image"` ticket 08 left in
 * place; ticket 10 adds `"diff"`.
 */
export type ProjectVisual =
  | ProjectVisualImage
  | ProjectVisualTerminal
  | ProjectVisualChecklist
  | ProjectVisualDiff;

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
  /** A short status tag shown above the title, e.g. for a mock or
   * in-progress project (also a release-guard marker,
   * docs/tickets/README.md decision 2); unused once content is real. */
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
  /**
   * The Elsewhere column's own link text (DESIGN.md §6 footer row;
   * carried-over polish, Flame 2026-11-13: the prototype's Elsewhere
   * column reads the bare "GitHub"/"LinkedIn", not the Contact row's
   * "GitHub profile"/"LinkedIn profile" — two different strings for
   * two different rows, both from `site.ts`, never hard-coded copy).
   */
  elsewhereGithubLabel: string;
  elsewhereLinkedinLabel: string;
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
    // Real: Flame's facts from the 2026-11-16 Q&A with Daedalus.
    name: "Siravit Tanratanavijit",
    shortName: "Siravit",
    role: "Software Engineer",
    pitch:
      "He builds APIs and internal tools in Go and Next.js that stay fast under real daily traffic.",
  },
  meta: {
    title: "Siravit Tanratanavijit: software developer portfolio",
    description:
      "Projects, stack and experience of Siravit Tanratanavijit, a Bangkok software engineer who builds Go APIs and Next.js tools.",
  },
  hero: {
    facts: [
      { label: "Works in", value: "Go and Next.js" },
      {
        label: "Code",
        value: "Siravitt on GitHub",
        href: "https://github.com/Siravitt",
      },
      { label: "Based in", value: "Bangkok, Thailand" },
    ],
    artLabel:
      "This site's content file open in an editor, beside a finished deploy to GitHub Pages",
    secondaryLabel: "See projects",
  },
  sections: {
    about: { title: "About" },
    stack: {
      title: "Stack",
      tagline: "The languages and tools he ships with.",
      intro: "Go and TypeScript in production, running on AWS and Kubernetes.",
    },
    projects: {
      title: "Projects",
      tagline:
        "Fintech APIs, an open-source Mac app and his own AI agent team.",
    },
    experience: {
      title: "Experience",
      intro: "From a full-stack bootcamp to fintech APIs.",
    },
    contact: { title: "Contact" },
  },
  about: {
    statement:
      "Siravit came to software through Software Park Thailand's Code Camp in 2022 and now builds API workflows for a loan product at a fintech company in Bangkok. He likes to own APIs and internal tools from start to finish.",
    highlight: "own APIs and internal tools from start to finish",
    paragraphs: [
      "He starts by grooming the business need with the team, then splits the work into small tasks that ship one at a time.",
      "Outside work he runs his own team of AI agents that research, plan, schedule and even make short videos, coordinated on a kanban board.",
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
          { name: "Kafka", icon: "apachekafka" },
          { name: "Swagger", icon: "swagger" },
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
          // AWS has no icon here: simple-icons removed its glyph in a
          // recent version (trademark request), and the ticket's
          // direction is to use the existing no-icon text fallback
          // rather than add a new dependency.
          { name: "AWS" },
          { name: "Kubernetes", icon: "kubernetes" },
          { name: "Docker", icon: "docker" },
          { name: "GitHub Actions", icon: "githubactions" },
          { name: "Git", icon: "git" },
        ],
      },
    ],
  },
  projects: [
    {
      title: "Loan workflow APIs",
      summary: "API workflows for a fintech loan product",
      description:
        "A loan product used by 4,000–5,000 people a day needed its workflow APIs to stay fast under load. He load-tested the service, then added an in-memory Go cache and Redis.",
      role: "Software Engineer",
      outcome: "Load-tested and cached for 4,000–5,000 daily users",
      tags: ["Go", "Redis", "Kafka", "Kubernetes"],
      // No links: this is the current employer's code (company not named).
      visual: {
        kind: "terminal",
        label:
          "A terminal running the loan workflow API's test suite, finishing with a pass",
        title: "loan/workflow-api",
        branch: "main",
        command: "go test ./...",
        results: [
          { path: "internal/workflow", time: "0.38s" },
          { path: "internal/cache", time: "0.22s" },
          { path: "internal/store", time: "0.86s" },
        ],
        summary: "in 1.46s",
      },
    },
    {
      title: "Volume Customizer",
      summary: "Per-app volume control in the macOS menu bar",
      description:
        "macOS has one volume slider for everything. He built a free, open-source menu bar app that sets and remembers each app's volume, even when you switch to headphones.",
      role: "Author and maintainer",
      outcome: "Open source, installs with Homebrew",
      tags: ["Swift", "macOS"],
      links: { source: "https://github.com/Siravitt/Volume-Customizer" },
      visual: {
        kind: "checklist",
        label:
          "A checklist of per-app volume settings: Discord, Spotify and Zoom set, following AirPods, Chrome muted",
        title: "Per-app volume",
        items: [
          { text: "Discord at 30%", done: true },
          { text: "Spotify at 60%", done: true },
          { text: "Zoom at 100%", done: true },
          { text: "Follows AirPods", done: true },
          { text: "Mute Chrome", done: false },
        ],
      },
    },
    {
      title: "Personal AI agent team",
      summary: "AI agents that share one kanban board",
      description:
        "Research, reminders, plans and content work kept piling up. He set up AI agents with clear roles that pick up cards, hand work to each other and report back.",
      role: "Designer and operator",
      outcome: "Research, reminders and short videos handled by agents",
      tags: ["Python", "AI agents"],
      // No links: Flame wants this project described in text only.
      visual: {
        kind: "checklist",
        label:
          "A checklist of today's kanban board: research, a script and a voice quote done, a video render and a reminder still open",
        title: "Today on the board",
        items: [
          { text: "Research: laptop stand specs", done: true },
          { text: "Script: Reel #5", done: true },
          { text: "Voice: price quote", done: true },
          { text: "Render video", done: false },
          { text: "Reminder at 19:15", done: false },
        ],
      },
    },
    {
      title: "This portfolio",
      summary: "A static Next.js site deployed by GitHub Actions",
      description:
        "He wanted one fast page for his work. All the text lives in one typed file, and every push is linted, tested and deployed to GitHub Pages.",
      role: "Author",
      outcome: "Live at siravitt.github.io",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "GitHub Actions"],
      links: { source: "https://github.com/Siravitt/siravitt.github.io" },
      // Re-points the former review-bot mini-UI at this repo's own
      // content change (ticket 19 decision): a literal placeholder
      // marker would trip the release guard if it sat inside this
      // drawing's `before` text, so the drawn "before" line reads
      // "(draft)" instead of the real marker.
      visual: {
        kind: "diff",
        label:
          "A pull request review comment on siravitt.github.io's src/content/site.ts: the real role replaces a draft placeholder",
        repo: "siravitt.github.io",
        dir: "src/content/",
        file: "site.ts",
        hunk: "@@ -374,7 +374,7 @@",
        signature: "person: {",
        before: '  role: "Software developer (draft)",',
        after: '  role: "Software Engineer",',
        marked: {
          before: '"Software developer (draft)"',
          after: '"Software Engineer"',
        },
        author: "Siravit",
        authorInitials: "ST",
        time: "now",
        comment: "Real content in, placeholders out.",
        context: ["  pitch:", '    "He builds APIs and internal tools...",'],
      },
    },
  ],
  experience: [
    {
      role: "Software Engineer",
      organisation: "Fintech company, Bangkok",
      start: "Dec 2023",
      highlights: [
        "Builds API workflows for a loan product used by 4,000–5,000 people a day.",
        "Load-tested the service and added a Go in-memory cache and Redis to keep it fast.",
      ],
      tags: ["Go", "Kafka", "AWS", "Kubernetes"],
    },
    {
      role: "Frontend Developer",
      organisation: "Geotalent Co., Ltd.",
      start: "May 2023",
      end: "Nov 2023",
      highlights: [
        "Built map features for GIS web apps with Angular and ArcGIS.",
        "His first job in software, shipping features to client projects.",
      ],
    },
    {
      role: "Student",
      organisation: "Software Park Thailand Code Camp",
      // Same-year start/end (ticket 19 decision): the component joins
      // start/end as "<start> to <end>" with no other same-year
      // format, so this renders "2022 to 2022" — read literally, not
      // as a typo, since the full-stack bootcamp ran and ended inside
      // 2022. Flame approved this literal pair; the component is
      // unchanged.
      start: "2022",
      end: "2022",
      highlights: [
        "Full-stack JavaScript bootcamp: front end, back end and databases.",
        "Built an Instagram clone on his own and a Shopee clone with a team.",
      ],
      tags: ["JavaScript", "React", "Node.js"],
    },
  ],
  contact: {
    intro:
      "Open to full-time, freelance and remote roles in API and internal-tool work.",
    email: "siravitt.tan@gmail.com",
    emailLabel: "Email Siravit",
    github: "https://github.com/Siravitt",
    githubLabel: "GitHub profile",
    linkedin: "https://www.linkedin.com/in/siravit-tanratanavijit-137b15244/",
    linkedinLabel: "LinkedIn profile",
  },
  footer: {
    lede: "Siravit Tanratanavijit, software engineer in Bangkok. Projects, stack and experience on one page.",
    legal: "© 2026 Siravit Tanratanavijit",
    sectionsHeading: "Sections",
    elsewhereHeading: "Elsewhere",
    elsewhereGithubLabel: "GitHub",
    elsewhereLinkedinLabel: "LinkedIn",
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
