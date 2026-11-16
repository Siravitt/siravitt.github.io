"use client";

import { useEffect } from "react";

/**
 * The site's one client component (docs/tickets/15-scroll-motion-component.md;
 * DESIGN.md §7.2 layer 3, §7.4 "One client component", §7.5 part 3).
 * Rendered once in the root layout; renders nothing. Its `useEffect` is
 * `design/prototype/scroll.js`'s body, ported to this repo's `data-*`
 * markup hooks, plus the `<details>` menu-close decision below. Every
 * listener and the observer are torn down on unmount.
 *
 * Four jobs, in a fixed exit order:
 * 0. Focus follows an in-page jump (every browser, including reduced
 *    motion — focus is not motion) and a link tap inside the open
 *    header menu closes it (ticket decision, Q1 answer a). Both are
 *    always set up.
 * 1. Project mini-UI motion (ticket 16): each `[data-mini-ui]` panel
 *    plays its CSS-keyframe run once, the first time it's 15% in view.
 *    Its own always-on observer, independent of job 2's native-support
 *    check — a one-shot run has no native mirror to fall back from.
 *    Adds `html.sm-run`, a sibling of `sm-io`.
 * 2-3. The IntersectionObserver/rAF fallback for browsers without CSS
 *    scroll-driven animations (DESIGN.md §7.2 layer 3). It exits, in
 *    order, on `prefers-reduced-motion: reduce`, on native support
 *    (`animation-timeline: view()` **and** `timeline-scope: --a` both
 *    `CSS.supports`), or when `IntersectionObserver` is missing. Hidden
 *    states live only under the `html.sm-io` class this adds, so a
 *    failed script never hides anything (ticket's Review Focus 3).
 */
export function ScrollMotion(): null {
  useEffect(() => {
    const html = document.documentElement;

    // 0. (DESIGN.md §7.5 part 3) In-page links: CSS glides the scroll
    // (`motion-safe:scroll-smooth`); this only moves keyboard focus to
    // the section the link names, so Tab carries on from there and a
    // screen reader reads it. It never scrolls (`preventScroll`) and
    // never cancels the browser's own jump: the hash, the history
    // entry and back/forward stay native.
    const focusSection = (hash: string | null) => {
      if (!hash || hash.length < 2) return;
      let el: HTMLElement | null;
      try {
        el = document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        return;
      }
      if (!el) return;
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target;
      const link =
        target instanceof Element ? target.closest('a[href^="#"]') : null;
      if (!link) return;
      // after the browser has navigated
      requestAnimationFrame(() => focusSection(link.getAttribute("href")));
    };
    document.addEventListener("click", handleClick);

    // back / forward between sections
    const handleHashChange = () => focusSection(location.hash);
    addEventListener("hashchange", handleHashChange);

    // Menu close (ticket decision, Q1 answer a): a tap on an in-page
    // link closes the header's open `<details>` disclosure. The nav
    // panel is a CSS sibling of `<details>` inside the shared
    // `<header>` (`group-has-[details[open]]`, header.tsx), not a DOM
    // descendant of it — so this closes the nearest open `<details>`
    // within the same `<header>` ancestor, not `link.closest("details[open]")`.
    // Independent of the fallback below; runs in every browser.
    const handleMenuLinkClick = (event: MouseEvent) => {
      const target = event.target;
      const link =
        target instanceof Element ? target.closest('a[href^="#"]') : null;
      if (!link) return;
      link
        .closest("header")
        ?.querySelector("details[open]")
        ?.removeAttribute("open");
    };
    document.addEventListener("click", handleMenuLinkClick);

    // 1. Project mini-UI motion (ticket 16): its own observer, independent
    // of job 2's native-support check below — a one-shot run has no
    // native mirror to fall back from. Skipped when the page has no
    // [data-mini-ui] panel.
    let disconnectVisuals: (() => void) | undefined;
    const miniUiTargets = [...document.querySelectorAll("[data-mini-ui]")];
    if (
      miniUiTargets.length > 0 &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      "IntersectionObserver" in window
    ) {
      html.classList.add("sm-run");

      const visualPending = new Set<Element>(miniUiTargets);
      const visualIo = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const rect = entry.boundingClientRect;
            if (entry.isIntersecting) {
              revealVisual(entry.target, false);
            } else if (rect.top < 0) {
              revealVisual(entry.target, rect.bottom <= 0);
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
      );
      // `skip` plays the finished frame at once (`.is-skip`,
      // scroll-motion.css) instead of the run: only once the panel's
      // *bottom* has fully left the viewport, not merely its top — a
      // tall panel scrolling past still reads its top as negative
      // while most of it is still on screen.
      const revealVisual = (el: Element, skip: boolean) => {
        el.classList.add("is-in");
        if (skip) el.classList.add("is-skip");
        visualIo.unobserve(el);
        visualPending.delete(el);
      };
      miniUiTargets.forEach((el) => visualIo.observe(el));

      // A target the IO never reports (a fast scroll or #hash jump
      // landing past it between frames) still gets revealed on the
      // next scroll/resize frame; a target already playing gets
      // skipped only once it has fully scrolled past.
      let visualQueued = false;
      const sweepVisuals = () => {
        visualQueued = false;
        for (const el of visualPending) {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) revealVisual(el, rect.bottom <= 0);
        }
        for (const el of miniUiTargets) {
          if (
            el.classList.contains("is-in") &&
            !el.classList.contains("is-skip") &&
            el.getBoundingClientRect().bottom <= 0
          ) {
            el.classList.add("is-skip");
          }
        }
      };
      const queueVisualSweep = () => {
        if (!visualQueued) {
          visualQueued = true;
          requestAnimationFrame(sweepVisuals);
        }
      };
      addEventListener("scroll", queueVisualSweep, { passive: true });
      addEventListener("resize", queueVisualSweep);
      // one explicit pass shortly after mount: an on-load #hash jump
      // may already have settled with no further scroll event to fire.
      const settleTimer = setTimeout(sweepVisuals, 200);

      disconnectVisuals = () => {
        visualIo.disconnect();
        removeEventListener("scroll", queueVisualSweep);
        removeEventListener("resize", queueVisualSweep);
        clearTimeout(settleTimer);
        html.classList.remove("sm-run");
      };
    }

    // 2-3. The fallback (DESIGN.md §7.2 layer 3). Exit order is fixed:
    // reduced motion, then native support, then no IntersectionObserver.
    const shouldRunFallback = (): boolean => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }
      if (
        CSS.supports("animation-timeline: view()") &&
        CSS.supports("timeline-scope: --a")
      ) {
        return false;
      }
      return "IntersectionObserver" in window;
    };

    let disconnectFallback: (() => void) | undefined;

    if (shouldRunFallback()) {
      html.classList.add("sm-io");

      // reveals: [data-rv] blocks and the logo board get .is-in once,
      // the first time they are 15% in view. Anything already above
      // the screen (a jump to #experience) is shown at once — but the
      // IO only calls back on an intersection-state *change*, so a
      // fragment jump or a fast glide that lands past a target between
      // frames can leave it unreported (reviewer round 1 fix 1). `update`
      // below re-checks every still-pending target's rect each frame as
      // a second path to the same `revealTarget`.
      const pending = new Set<Element>();
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
              revealTarget(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
      );
      const revealTarget = (el: Element) => {
        el.classList.add("is-in");
        io.unobserve(el);
        pending.delete(el);
      };
      document
        .querySelectorAll("[data-rv], [data-stack-board]")
        .forEach((el) => {
          pending.add(el);
          io.observe(el);
        });

      // scroll-linked parts: one passive listener, one read a frame,
      // written to custom properties.
      const hero = document.querySelector("[data-hero]");
      const expRail = document.querySelector("[data-exp-rail]");
      const items = [...document.querySelectorAll("[data-exp-item]")];
      const navLinks = [
        ...document.querySelectorAll('[data-nav-link][href^="#"]'),
      ];
      const sections = navLinks.map((link) =>
        document.getElementById(link.getAttribute("data-nav-link") ?? ""),
      );
      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      let queued = false;

      const update = () => {
        queued = false;
        const vh = innerHeight;
        const max = html.scrollHeight - vh;
        html.style.setProperty(
          "--sm-page",
          max > 0 ? clamp(scrollY / max).toFixed(4) : "0",
        );

        // reviewer round 1 fix 1: a pending target the IO never reported
        // (its own callback only fires on a state *change*) still gets
        // revealed once a scroll/resize frame finds it already above
        // the viewport — covers a fragment jump or a glide that skips
        // past it between frames.
        for (const el of pending) {
          if (el.getBoundingClientRect().top < 0) {
            revealTarget(el);
          }
        }

        if (hero) {
          const rect = hero.getBoundingClientRect();
          // 0 at rest, 1 when the hero has left
          const progress = clamp(-rect.top / rect.height);
          html.style.setProperty("--sm-hero", progress.toFixed(4));
          // phone: lines 4-8, desktop: lines 4-12
          const lines = innerWidth < 640 ? 4 : 8;
          html.style.setProperty(
            "--sm-hl",
            String(Math.round(clamp(progress / 0.6) * lines)),
          );
        }

        // the timeline's tip sits on the 60% line
        const line = vh * 0.6;
        if (expRail) {
          const rect = expRail.getBoundingClientRect();
          html.style.setProperty(
            "--sm-exp",
            clamp((line - rect.top) / rect.height).toFixed(4),
          );
        }
        for (const item of items) {
          item.classList.toggle(
            "is-lit",
            item.getBoundingClientRect().top + 12 <= line,
          );
        }

        // the current section: the last one whose top has passed the
        // middle of the screen
        let current = -1;
        sections.forEach((section, index) => {
          if (section && section.getBoundingClientRect().top <= vh * 0.5) {
            current = index;
          }
        });
        navLinks.forEach((link, index) => {
          const section = sections[index];
          link.classList.toggle(
            "is-current",
            index === current &&
              section != null &&
              section.getBoundingClientRect().bottom > vh * 0.5,
          );
        });
      };

      const queue = () => {
        if (!queued) {
          queued = true;
          requestAnimationFrame(update);
        }
      };
      addEventListener("scroll", queue, { passive: true });
      addEventListener("resize", queue);
      update();

      disconnectFallback = () => {
        io.disconnect();
        removeEventListener("scroll", queue);
        removeEventListener("resize", queue);
        html.classList.remove("sm-io");
      };
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("click", handleMenuLinkClick);
      removeEventListener("hashchange", handleHashChange);
      disconnectFallback?.();
      disconnectVisuals?.();
    };
  }, []);

  return null;
}
