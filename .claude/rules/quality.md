---
description: Accessibility, performance, security, SEO, marketing, and conversion quality rules
---

# Quality Rules

## Accessibility (Non-Negotiable)
- **WCAG 2.2 AA** is the minimum standard (includes the 2.2 criteria: focus not obscured by sticky UI, drag gestures need single-pointer alternatives, 24px minimum targets, consistent help placement, no redundant form entry, accessible authentication)
- All text must be readable — minimum 4.5:1 contrast ratio for body, 3:1 for large text and UI
- Focus states must be visible on every focusable element (`--color-primary`, 2px solid, 2px offset)
- Components must be keyboard accessible where applicable
- Headings must follow proper hierarchy (H1 → H2 → H3 — never skip levels)
- Images must include appropriate alt text
- All animations must respect `prefers-reduced-motion`
- Touch targets minimum 44×44px on mobile

## Performance
- Use optimised images — `.webp` or `.avif` (both accepted)
- Lazy load all images below the fold
- Avoid bloated or unnecessary JavaScript
- Avoid unnecessary DOM depth — keep the tree lean
- Reduce CLS risk — always set explicit image dimensions
- Build for fast loading and stability

## Security (OWASP Top 10)
- Never expose secrets in frontend code
- Never trust user input — validate at system boundaries
- Avoid unsafe dynamic HTML output (`innerHTML`, `dangerouslySetInnerHTML`)
- Avoid risky third-party scripts unless necessary
- Flag insecure patterns in forms, embeds, uploads, redirects, or external links
- Use secure defaults
- Recommend server-side handling for sensitive operations
- Consider spam prevention on all public forms
- No hardcoded credentials, API keys, or secrets in any file
- Keep API keys and secrets in environment variables only

## Legal and SEO
- Thank you pages must be permanent pages and set to `noindex`
- Thank you booking pages must be set to `noindex`
- Footer legal links must point to their own pages (Privacy Policy, Terms & Conditions, Cookie Policy)
- Maintain proper heading hierarchy
- Avoid layout shift
- For legal and policy pages: use the project primary colour for active states, accents, and highlights

## Responsive QA (Mandatory — Non-Optional)

Every section, component, page, and layout change must pass content-led responsive review before completion.

**Container rule:** Main content stays inside `max-w-[1340px]` — do not change this. Backgrounds may be full width.

**Layout ranges:** 320–375px · 390–430px · 768–834px · 1024–1280px · 1366–1440px · 1536–1920px · 1920–2560px · 2560–3840px

**Orientation:** portrait and landscape where relevant

**Content-led checks:**
- Text wrapping, spacing rhythm, content density, container behaviour
- Image scaling, CTA usability, overflow, overlap, layout pressure
- Visual balance and 4K composition
- 320px small mobile usability

**Rules:**
- No section is approved until responsive QA is completed across all layout ranges
- Fix all issues before marking complete
- Report layout range coverage in every final output
- Do not allow default-looking layouts, weak spacing, or fragile breakpoint patches
- Use Tailwind breakpoints as base, fluid techniques where appropriate, custom @media only for advanced tuning

## Marketing and Conversion
- Every important page must have a single, clear conversion goal
- Messaging must be clear, confident, and credible — avoid vague filler copy
- Prioritise clarity over cleverness
- Trust signals must appear early — integrate into hero and service sections, not isolated in one strip
- CTAs must be visible, natural, and well placed
- Automatically improve weak marketing structure where obvious
