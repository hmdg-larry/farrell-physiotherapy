---
description: Frontend code rules — Astro, Tailwind, images, header, footer, and code quality
---

# Frontend Rules

## Code Rules (Mandatory)
- No inline styles — no `style=""` and no `style={...}` expressions
- Exception: CSS custom property injection only (`style="--reveal-delay: 80ms"`)
- Class-based styling only — Tailwind utilities or global CSS classes
- Keep DOM clean and minimal — no unnecessary wrappers, no redundant nesting
- Semantic HTML — use `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>`, `<aside>` correctly
- Build reusable components — extract repeated patterns into Astro components
- Code must be maintainable and production ready

## Astro Rules
- Use `BaseLayout.astro` for all client-facing pages
- Header and footer are inside `BaseLayout` — never duplicate them in pages
- Never repeat the same layout structure across pages
- Prefer modular Astro components for all repeated sections (hero, services, team, reviews, booking CTA)
- Use `<slot />` and named slots correctly

## Production HTML Hygiene (Permanent)
- HTML comments (`<!-- ... -->`) are automatically stripped from production output by the `stripHtmlComments` integration in `astro.config.mjs`.
- Source files may freely use `<!-- -->` for readability — they will never leak to view-source.
- **Never remove the `stripHtmlComments` integration** — it is a permanent template feature that every client clone inherits.
- Internal-only routes go under `src/pages/_dev/` (Astro excludes underscore-prefixed paths from routing).
- Use `{/* ... */}` JSX-style comments in template blocks if you want the comment stripped at compile time rather than at build time.
- Never hardcode secrets or internal API paths into page markup — keep them in `.env` (non-`PUBLIC_` prefix) and access only from server-side code.

## Section Padding Convention

Vertical padding goes on `<section>`, not on the container.

Standard pattern:

```html
<section class="py-section-y lg:py-section-y-lg bg-white">
  <div class="container-main">
    ...content...
  </div>
</section>
```

- `<section>` owns: background colour, vertical padding
- `.container-main` owns: max-width (1340px), auto margin, 30px horizontal padding
- `.container-main` has **NO** vertical padding
- Same applies to `.section` (alias for `.container-main`)

## Image Rules

### Default format
- `.webp` as the default image format across the project
- No AVIF fallback setup needed
- No dual-format `<picture>` source switching needed
- `.jpg` or `.png` only when explicitly required

If a developer uploads or tries to use `.jpg` or `.png` where a better format should be used, show this warning:

"Fel recommends uploading .webp images. Use this converter link: https://hmdg-elementor.flywheelsites.com/"

### Required image pattern
```html
<img
  src="/images/example.webp"
  alt="Descriptive alt text"
  loading="lazy"
  decoding="async"
  width="1600"
  height="900"
/>
```

- Use `loading="eager"` for above-the-fold hero images only
- Always include `decoding="async"` on every image
- Always set explicit `width` and `height` to prevent CLS
- Never mix aspect ratios within a card grid

## YouTube Background Video Rules

When using a YouTube video as a section background:
- Limit playback to the first **10 seconds** — use the YouTube embed `end=10` parameter
- Autoplay, mute, loop within the 10-second window, no controls
- Use `youtube-nocookie.com` for privacy compliance
- Defer iframe loading — inject after page load using a facade pattern (poster image first)
- Always provide a static poster/fallback image
- Add `prefers-reduced-motion` fallback that hides the video and shows the poster
- Reserve container dimensions to prevent CLS
- Keep performance in mind — never let a background video degrade page speed
- This rule applies automatically to every YouTube background video in the project

---

## Header and Footer Rules

### Header
- Must be consistent across all pages
- Menus and mega menus must be shared globally — never recreated per page

### Footer
Footer must be consistent across all pages and include:
- Embedded map
- Dynamic copyright year
- "Designed & Developed by HMDG" linked to `https://hmdg.co.uk/` in a new tab
- Privacy Policy
- Terms & Conditions
- Cookie Policy

These legal pages must exist even if initially empty.
