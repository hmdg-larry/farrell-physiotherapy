---
name: Image format rules (WebP only)
description: Use .webp as the only image format across the project — no AVIF, no dual-format picture switching; keep image handling simple, clean, and performant
type: feedback
---

Use `.webp` as the default and only image format across the project.

**Why:** The user explicitly replaced the previous AVIF + WebP dual-format rule on 2026-04-10. WebP-only is fully acceptable for this project. No dual-format output is needed. This keeps image handling simple, clean, and performant without the complexity of `<picture>` source switching.

**How to apply:**
- Always use `.webp` for all images
- Do not set up AVIF as the primary format
- Do not add `<picture>` fallback logic unless the user explicitly requests it
- Use a simple `<img>` tag with `src`, `alt`, `loading`, `decoding="async"`, `width`, and `height`
- Default to `.webp` when no format is specified
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
- Use `loading="lazy"` for below-fold images, `loading="eager"` for above-fold/hero
- Always set explicit `width` and `height` to prevent CLS
- Always include meaningful `alt` text
- This rule is permanent and carries to all future projects unless explicitly overridden
