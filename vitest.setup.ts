import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import * as axeMatchers from "vitest-axe/matchers";
import "@testing-library/jest-dom/vitest";

// vitest-axe@0.1.0's "vitest-axe/extend-expect" entry point ships an empty
// file (upstream packaging bug), so the matcher is wired up by hand here
// instead of relying on that import.
expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
});
