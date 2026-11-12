/**
 * Compile-time guards for the content shape
 * (docs/tickets/02-content-model.md, acceptance criterion 2). This file
 * has no `describe`/`it`, so Vitest never runs it (its name doesn't match
 * `src/**\/*.test.{ts,tsx}`); only `pnpm typecheck` does. Each
 * `@ts-expect-error` fails the build the moment the compiler stops
 * rejecting the case it names, which is the point: these are the shape's
 * guarantees, not a one-off check.
 */
import type {
  ExperienceEntry,
  Project,
  ProjectVisual,
  StackItem,
} from "./site";

// The compiler rejects an image visual with no alt text.
// @ts-expect-error an image visual requires alt text
export const rejectsImageVisualWithoutAlt: ProjectVisual = {
  kind: "image",
  src: "/fixtures/example.png",
  width: 10,
  height: 10,
};

// The compiler rejects an experience entry with only 1 highlight.
export const rejectsOneHighlight: ExperienceEntry = {
  role: "Role",
  organisation: "Organisation",
  start: "2024",
  // @ts-expect-error highlights must have 2 to 4 items, not 1
  highlights: ["Only one highlight"],
};

// The compiler rejects an experience entry with 5 highlights.
export const rejectsFiveHighlights: ExperienceEntry = {
  role: "Role",
  organisation: "Organisation",
  start: "2024",
  // @ts-expect-error highlights must have 2 to 4 items, not 5
  highlights: ["One", "Two", "Three", "Four", "Five"],
};

// The compiler rejects a stack icon slug outside the ten approved ones.
export const rejectsUnknownStackIcon: StackItem = {
  name: "Rust",
  // @ts-expect-error icon must be one of the ten approved Simple Icons slugs
  icon: "rust",
};

// The compiler rejects a project with no title.
// @ts-expect-error title is required on a project
export const rejectsProjectWithoutTitle: Project = {
  summary: "Summary",
  description: "Description",
  role: "Role",
  outcome: "Outcome",
  tags: [],
};

// The compiler accepts a project with no links, visual, badge or tags
// content: every optional field left out cleanly (DESIGN.md §8).
export const acceptsMinimalProject: Project = {
  title: "Title",
  summary: "Summary",
  description: "Description",
  role: "Role",
  outcome: "Outcome",
  tags: [],
};
