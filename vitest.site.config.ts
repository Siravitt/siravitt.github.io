import { defineConfig } from "vitest/config";
import path from "node:path";

// Seam B (docs/tickets/05-built-site-checks-release-guard.md): a
// separate Vitest project from the component tests' `vitest.config.ts`.
// `environment: "node"` (not jsdom) because these tests parse the real
// built HTML in `out/` themselves via the `jsdom` package, rather than
// running inside a simulated browser DOM. Kept out of `src/**` so the
// default `pnpm test` (which has no build step) never picks these up.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/site/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
