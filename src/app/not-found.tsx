import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found-view";
import { site } from "@/content/site";

// Next's special not-found route: the static export writes it as
// `out/404.html` (docs/tickets/04-footer-privacy-404.md, "Decisions"),
// which GitHub Pages serves for any unknown path.
export const metadata: Metadata = {
  title: site.notFound.title,
  description: site.notFound.text,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundView site={site} />;
}
