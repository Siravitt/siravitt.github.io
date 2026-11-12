import type { MetadataRoute } from "next";

// Static export needs every dynamic metadata route pinned to force-static.
export const dynamic = "force-static";

// Lighthouse's SEO category checks for a valid robots.txt; the spec adds
// no disallow rules (the site has no private app routes).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
  };
}
