import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://siravitt.github.io"),
  title: site.meta.title,
  // Minimal, not content-driven yet: ticket 13 adds the full SEO set
  // (canonical, Open Graph/Twitter, share image) read from `site.ts`.
  // Spec (docs/spec.md §Modules): meta.description falls back to the
  // pitch when empty — both come from site.ts, so ticket 05's release
  // guard still catches it while the pitch stays a `[Placeholder]`.
  description: site.meta.description ?? site.person.pitch,
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
