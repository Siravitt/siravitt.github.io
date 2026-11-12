import type { Metadata } from "next";
import { PrivacyView } from "@/components/privacy-view";
import { site } from "@/content/site";

// Must-keep — Google OAuth: this route is exported as the top-level
// `out/privacy.html` file (next.config.ts's `trailingSlash: false`),
// never `out/privacy/index.html`. See src/content/site.ts's SiteDaedalus
// doc comment and CODING_STANDARDS.md's project-specific rule 1.
export const metadata: Metadata = {
  title: `${site.daedalus.policyHeading}: ${site.person.name}`,
  description: site.daedalus.policyText,
  alternates: { canonical: site.daedalus.privacyPath },
};

export default function PrivacyPage() {
  return <PrivacyView site={site} />;
}
