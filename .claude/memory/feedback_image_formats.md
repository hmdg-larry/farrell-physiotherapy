---
name: Image format rules (WebP and AVIF)
description: Use .webp or .avif — both formats are accepted; no dual-format picture switching; simple img tags with proper loading, dimensions, and LCP treatment for heroes
type: feedback
---

Use `.webp` or `.avif` as the image format across the project — **both are accepted**.

**Why:** The user originally set WebP-only (2026-04-10), then explicitly broadened it to accept `.avif` as well (recorded in user-level memory, reaffirmed 2026-06-10 across CLAUDE.md, rules, and agents). Do not warn about, question, or convert `.avif` images. No dual-format `<picture>` switching is needed for either format.

**How to apply:**
- Use `.webp` or `.avif` for all images — whichever the asset already is
- Do not add `<picture>` fallback logic unless the user explicitly requests it
- Use a simple `<img>` tag with `src`, `alt`, `loading`, `decoding="async"`, `width`, and `height`
- Prefer `.avif` (primary per project Rules 2026-06-10) when generating/optimising new assets; `.webp` equally accepted
- Never output `.jpg` or `.png` unless explicitly required

## Required image pattern
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

## Additional rules
- `loading="lazy"` for below-fold images; `loading="eager"` for above-fold/hero
- Hero/LCP image additionally gets `fetchpriority="high"` + `<link rel="preload">` (BaseLayout `preloadImage` prop), is never inside a carousel, never a CSS background, never animated from `opacity: 0`
- Budget: ≤120KB desktop hero, ≤60KB mobile variant via `srcset`
- Always set explicit `width` and `height` to prevent CLS
- Always include meaningful `alt` text
- This rule is permanent and carries to all future projects unless explicitly overridden
