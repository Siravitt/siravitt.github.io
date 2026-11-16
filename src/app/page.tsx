import { HomeView } from "@/components/home-view";
import { site } from "@/content/site";

// docs/tickets/13-seo-favicon-og.md: the home page's own literal
// canonical/og:url tags, with the trailing slash DESIGN.md §9 and
// Seam B require (see the long comment on `metadata` in layout.tsx —
// Next's URL resolver drops the slash for a root-pathname URL when
// `trailingSlash` is false). React 19 hoists <link>/<meta> rendered
// anywhere in a route's tree into <head>, scoped to this route only
// (unlike layout.tsx, which renders on every page).
const SITE_ORIGIN = "https://siravitt.github.io";

export default function Page() {
  return (
    <>
      <link rel="canonical" href={`${SITE_ORIGIN}/`} />
      <meta property="og:url" content={`${SITE_ORIGIN}/`} />
      <HomeView site={site} />
    </>
  );
}
