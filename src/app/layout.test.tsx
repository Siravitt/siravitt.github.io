import { describe, expect, it, vi } from "vitest";
import { ScrollMotion } from "@/components/scroll-motion";

// next/font/google's exports are a build-time Next.js macro (SWC
// transform): calling them outside `next build`/`next dev` throws, so
// importing the layout module under plain Vitest needs this stubbed —
// only `variable` (a CSS custom property name) is read by RootLayout.
vi.mock("next/font/google", () => ({
  Instrument_Sans: () => ({ variable: "--font-sans" }),
  DM_Mono: () => ({ variable: "--font-mono" }),
}));

const { default: RootLayout } = await import("@/app/layout");

/**
 * RootLayout returns `<html><body>{children}</body></html>` directly
 * (Next's App Router root layout); RTL can't render that over jsdom's
 * own document, so this calls the component as the plain function it
 * is and reads the returned React element's props — the highest seam
 * available (ticket 14, Seam A: "the root element's timeline-scope
 * value").
 */
describe("RootLayout", () => {
  it("publishes a view timeline name for every visible section on the root element (ticket 14, DESIGN.md §7.4)", () => {
    const html = RootLayout({ children: <div>fixture children</div> });
    expect(html.type).toBe("html");
    const style = html.props.style as Record<string, string>;
    expect(style.timelineScope).toBe(
      "--sec-about, --sec-stack, --sec-projects, --sec-experience, --sec-contact",
    );
  });

  it("glides in-page jumps only when the visitor hasn't asked for reduced motion (DESIGN.md §7.5 part 1)", () => {
    const html = RootLayout({ children: <div>fixture children</div> });
    expect(html.props.className).toContain("motion-safe:scroll-smooth");
  });

  it("renders children inside <body>, after the one <ScrollMotion /> client component (ticket 15, DESIGN.md §7.4)", () => {
    const html = RootLayout({ children: <div>fixture children</div> });
    const body = html.props.children;
    expect(body.type).toBe("body");
    const [scrollMotion, children] = body.props.children as [
      { type: unknown },
      { props: { children: string } },
    ];
    expect(scrollMotion.type).toBe(ScrollMotion);
    expect(children.props.children).toBe("fixture children");
  });
});
