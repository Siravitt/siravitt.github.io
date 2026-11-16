import "vitest";
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  // Module augmentation per vitest-axe's docs: these interfaces only exist
  // to merge in `AxeMatchers`, so they have no members of their own.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Assertion extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
