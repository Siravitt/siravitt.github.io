import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: GitHub Pages serves the `out/` folder, no Node server.
  output: "export",
  // GitHub Pages has no image optimisation endpoint; pre-sized assets instead.
  images: { unoptimized: true },
  // Must stay `false` (its default): Google's OAuth consent screen links to
  // `/privacy.html` as a literal file path. `trailingSlash: true` would turn
  // it into `privacy/index.html`, breaking that URL. Do not change.
  trailingSlash: false,
};

export default nextConfig;
