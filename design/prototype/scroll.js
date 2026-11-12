/* scroll.js (v2, v3): two jobs.
   0. (v3, every browser) focus follows an in-page link to its section; the glide itself is CSS (scroll.css).
   1-2. (v2) the fallback for browsers without CSS scroll-driven animations.
   In Next.js this is the one client component, <ScrollMotion /> ("use client", a useEffect with this body,
   rendered once in app/layout.tsx; it renders nothing). Where `animation-timeline: view()` works, parts 1-2 do
   nothing: scroll.css runs every animation natively. Under reduced motion they do nothing either (part 0 still runs).
   Without script the page shows its rest state (scroll.css §0): every word visible, and links still glide. */
(() => {
  const html = document.documentElement;

  // 0. (v3) in-page links: CSS glides the scroll (scroll.css, `scroll-behavior: smooth`); this only moves keyboard
  //    focus to the section the link names, so Tab carries on from there and a screen reader reads it. It never
  //    scrolls (preventScroll) and never cancels the browser's own jump: the hash, the history entry and
  //    back/forward stay native. Runs in every browser and under reduced motion too (focus is not motion).
  const focusSection = (hash) => {
    if (!hash || hash.length < 2) return;
    let el = null;
    try { el = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) requestAnimationFrame(() => focusSection(a.getAttribute('href')));   // after the browser has navigated
  });
  addEventListener('hashchange', () => focusSection(location.hash));          // back / forward between sections

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (CSS.supports('animation-timeline: view()') && CSS.supports('timeline-scope: --a')) return;
  if (!('IntersectionObserver' in window)) return;

  html.classList.add('sm-io');

  // 1. reveals: [data-rv] blocks and the logo board get .is-in once, the first time they are 15% in view.
  //    Anything already above the screen (a jump to #experience) is shown at once.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  document.querySelectorAll('[data-rv], .stack__board').forEach((el) => io.observe(el));

  // 2. scroll-linked parts: one passive listener, one read a frame, written to custom properties
  const hero = document.querySelector('.hero');
  const exp = document.querySelector('.exp');
  const items = [...document.querySelectorAll('.exp__item')];
  const links = [...document.querySelectorAll('.nav__link[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const clamp = (v) => Math.min(1, Math.max(0, v));
  let queued = false;

  const update = () => {
    queued = false;
    const vh = innerHeight;
    const max = html.scrollHeight - vh;
    html.style.setProperty('--sm-page', max > 0 ? clamp(scrollY / max).toFixed(4) : 0);

    if (hero) {
      const r = hero.getBoundingClientRect();
      const p = clamp(-r.top / r.height);                       // 0 at rest, 1 when the hero has left
      html.style.setProperty('--sm-hero', p.toFixed(4));
      const lines = innerWidth < 640 ? 4 : 8;                    // phone: lines 4-8, desktop: lines 4-12
      html.style.setProperty('--sm-hl', Math.round(clamp(p / 0.6) * lines));
    }

    const line = vh * 0.6;                                       // the timeline's tip sits on the 60% line
    if (exp) {
      const r = exp.getBoundingClientRect();
      html.style.setProperty('--sm-exp', clamp((line - r.top) / r.height).toFixed(4));
    }
    for (const it of items) it.classList.toggle('is-lit', it.getBoundingClientRect().top + 12 <= line);

    // the current section: the last one whose top has passed the middle of the screen
    let cur = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= vh * 0.5) cur = i; });
    links.forEach((a, i) => a.classList.toggle('is-current', i === cur && sections[i].getBoundingClientRect().bottom > vh * 0.5));
  };

  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
})();
