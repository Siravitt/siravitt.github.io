import type { Metadata, ResolvingMetadata } from "next";
import { PrivacyView } from "@/components/privacy-view";
import { site } from "@/content/site";

// Must-keep — Google OAuth: this route is exported as the top-level
// `out/privacy.html` file (next.config.ts's `trailingSlash: false`),
// never `out/privacy/index.html`. See src/content/site.ts's SiteDaedalus
// doc comment and CODING_STANDARDS.md's project-specific rule 1.
//
// Reviewer round 2 fix 1: a plain `export const metadata` object is
// shallow-merged under the layout's own `openGraph`/`twitter`, so this
// page inherited the *home* title/description in its share card. The
// ticket's binding decision is "Privacy keeps its own title,
// description and canonical, and inherits the image and icons" — so
// this has to be `generateMetadata(_, parent)` (Next's documented
// pattern for extending, rather than replacing, a parent's metadata).
// A plain `openGraph: { title, description, url }` override replaces
// the whole `openGraph` object, which drops `images` entirely (verified
// locally: `og:image` disappears, only `twitter:image` survives) — so
// `images` is carried over explicitly from `(await parent).openGraph`.
// Twitter has the same shallow-merge trap for `card`/`images`, carried
// over from `(await parent).twitter` the same way.
//
// Reviewer round 2 fix 1 (regression in the fix above): the explicit
// `openGraph` object here *replaces* the layout's, so `type: "website"`
// (one of the four required Open Graph properties) was silently
// dropped from out/privacy.html (`grep og:type` found 0 matches).
// Set it explicitly rather than spreading the whole parent object, so
// `title`/`description`/`url` stay privacy's own.
export async function generateMetadata(
  _props: Record<string, never>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `${site.daedalus.policyHeading}: ${site.person.name}`;
  const description = site.daedalus.policyText;
  const parentMetadata = await parent;

  return {
    title,
    description,
    alternates: { canonical: site.daedalus.privacyPath },
    openGraph: {
      type: "website",
      title,
      description,
      url: site.daedalus.privacyPath,
      images: parentMetadata.openGraph?.images,
    },
    twitter: {
      ...parentMetadata.twitter,
      title,
      description,
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyView site={site} />;
}
