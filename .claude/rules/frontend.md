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
