import type { Metadata, Viewport } from "next";
import { Instrument_Sans, DM_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

// DESIGN.md §3: self-hosted at build via `next/font` (no request to Google
// at runtime — the spec's "no third-party origins" check depends on this).
// Instrument Sans is loaded with its `wdth` (width) axis for the h1's
// 96%-width display cut; weights are restricted to CSS (400 and 500 only,
// DESIGN.md §3) by the views, not by the font loader.
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  display: "swap",
});

// DM Mono ships only static weight files; the design uses 400 and 500.
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// DESIGN.md §9 / docs/tickets/13-seo-favicon-og.md: home metadata reads
// from `site.meta` (title, description — falling back to `person.pitch`
// when empty, spec "Modules") so Flame's copy edits flow straight
// through without a code change, and Seam B's content comparisons read
// the same `site` import rather than a copied literal. `metadataBase`
// (ticket 01) makes every relative URL below absolute. The favicon,
// icon, apple icon, Open Graph image and Twitter image are NOT set
// here: they come from the App Router's file-based conventions
// (favicon.ico, icon.png, apple-icon.png, opengraph-image.png,
// twitter-image.png — binary copies of design/prototype/brand/, no
// build-time image generation) and are inherited by every nested
// route, including /privacy.html.
const title = site.meta.title;
const description = site.meta.description ?? site.person.pitch;

export const metadata: Metadata = {
  metadataBase: new URL("https://siravitt.github.io"),
  title,
  description,
  // No `alternates.canonical` or `openGraph.url` here: Next's URL
  // resolver (resolve-url.js) special-cases a resolved pathname of
  // exactly "/" and returns the bare origin, dropping the trailing
  // slash, whenever `trailingSlash` (next.config.ts) is false — which
  // it must stay, for /privacy.html (ticket 04). DESIGN.md §9's
  // canonical is `https://siravitt.github.io/`, with the slash, so
  // `page.tsx` (the home route only) renders its own literal
  // `<link>`/`<meta property="og:url">` instead of going through that
  // resolver. Every nested route (e.g. /privacy.html) has a non-"/"
  // pathname and isn't affected — its own `alternates.canonical`
  // resolves correctly as-is (ticket 04).
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// themeColor/colorScheme live on the dedicated viewport export (Next
// 14+), not on `metadata` (DESIGN.md §9 `theme-color: #0a0c0f`).
export const viewport: Viewport = {
  themeColor: "#0a0c0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
