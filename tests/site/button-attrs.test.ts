import { describe, expect, it } from "vitest";
import { assertOutDirExists, parseOutFile } from "./helpers";

/**
 * Reviewer round 1 fix 4: `src/components/ui/button.tsx`'s jsdom unit
 * test (`button.test.tsx`) proved the `role`/`type`/`tabindex` strip
 * worked, but the real Next.js static export still shipped
 * `role="button" tabindex="0"` on every Button rendered as a link —
 * React Server Components drop `undefined`-valued props crossing the
 * server\u2192client Flight boundary, so an explicit `role={undefined}`
 * passed from a Server Component into the (then not-"use client")
 * Button never reached Base UI's `useButton`, and its own
 * `role: 'button'` default shipped untouched. The fix marks
 * `button.tsx` itself "use client" so the whole `nativeButton`/`role`/
 * `tabIndex`/`type` resolution happens inside client-rendered code.
 * This seam reads the actual built HTML, the only place that bug was
 * ever visible, instead of a jsdom render.
 */
describe("built Button links carry none of role/type/tabindex (reviewer round 1 fix 4)", () => {
  it('out/index.html, out/privacy.html and out/404.html have no <a data-slot="button"> with role, type or tabindex', () => {
    assertOutDirExists();
    const offenders: string[] = [];
    for (const page of ["index.html", "privacy.html", "404.html"]) {
      const doc = parseOutFile(page);
      const buttonLinks = doc.querySelectorAll('a[data-slot="button"]');
      expect(buttonLinks.length).toBeGreaterThan(0);
      buttonLinks.forEach((link, i) => {
        for (const attr of ["role", "type", "tabindex"]) {
          if (link.hasAttribute(attr)) {
            offenders.push(`${page} button link #${i} has ${attr}`);
          }
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});
