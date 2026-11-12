# 13: SEO metadata, favicon and share image

**What to build:** A recruiter searching Siravit's name sees an accurate title and description. A link pasted into Slack, LinkedIn or Discord shows a branded preview: title, description, and the 1200×630 image with his name on the sand frame. The browser tab shows the amber "S" favicon, and phones get the apple touch icon. Every URL in these tags is absolute (`https://siravitt.github.io/...`), and the built-site checks guard them.

**Blocked by:** 05

**Design refs:** DESIGN.md §9 (files, `theme-color: #0a0c0f`, title `Siravit Tanratanavijit: software developer portfolio`, canonical `https://siravitt.github.io/`); `prototype/brand/og.png` (1200×630), `icon.png` (512), `apple-icon.png` (180), `favicon.ico` (16+32+48); the `<head>` of `prototype/index.html`.

**Decisions (binding):**
- The designer's files are used as-is (copied binary assets, no build-time image generation) through the App Router's file-based metadata conventions: favicon, icon, apple icon, Open Graph image, and the same image as the Twitter image.
- Home metadata comes from `site.meta`: `title`, `description` (falls back to `person.pitch` when empty), canonical `/`, Open Graph (`title`, `description`, `url` `/`, `type` `website`, image 1200×630 with alt text = the title), Twitter `summary_large_image`. `metadataBase` (from 01) makes them absolute. `themeColor` `#0a0c0f` and `colorScheme` `dark` go through the viewport export.
- Privacy (04) keeps its own title, description and canonical, and inherits the image and icons.
- No sitemap or robots file (out of scope).

**Acceptance criteria:**
- [ ] Seam B: `out/index.html` has: a `<title>` equal to `site.meta.title`; a meta description; `<link rel="canonical" href="https://siravitt.github.io/">`; `og:title`, `og:description`, `og:type` `website`, `og:url` `https://siravitt.github.io/`; `og:image` starting with `https://siravitt.github.io/`, with `og:image:width` 1200 and `og:image:height` 630; `twitter:card` `summary_large_image`; `twitter:image` absolute; `<meta name="theme-color" content="#0a0c0f">`.
- [ ] Seam B: the files that `og:image`, `twitter:image` and every `link[rel~="icon"]` and `link[rel="apple-touch-icon"]` reference exist in `out/`. The OG file is a PNG whose header reads 1200×630 (read from the file's bytes; no image library).
- [ ] Seam B: `out/privacy.html` has its own `<title>` (different from home's) and still the absolute OG image.
- [ ] Seam B: title and description are compared with `site.meta` read from the content module, never with a copy literal. Literals are used only for the fixed parts (`https://siravitt.github.io/`, `website`, `summary_large_image`, `#0a0c0f`, 1200/630), so Flame's copy change can't break the suite.
- [ ] Manual (PR evidence): the favicon shows in the tab over `pnpm preview`, and an OG preview check (for example a local OG debugger or the head dump) shows the image.
- [ ] PR records Lighthouse mobile scores; SEO ≥ 90 (all four ≥ 90).
- [ ] Build, lint, type-check and tests pass.
