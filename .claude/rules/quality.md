---
description: Accessibility, performance, security, SEO, marketing, and conversion quality rules
---

# Quality Rules

## Accessibility (Non-Negotiable)
- All text must be readable — minimum 4.5:1 contrast ratio for body, 3:1 for large text and UI
- Focus states must be visible on every focusable element (`--color-primary`, 2px solid, 2px offset)
- Components must be keyboard accessible where applicable
- Headings must follow proper hierarchy (H1 → H2 → H3 — never skip levels)
- Images must include appropriate alt text
- All animations must respect `prefers-reduced-motion`
- Touch targets minimum 44×44px on mobile

## Performance
- Use optimised images — `.avif` with `.webp` fallback
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

## Marketing and Conversion
- Every important page must have a single, clear conversion goal
- Messaging must be clear, confident, and credible — avoid vague filler copy
- Prioritise clarity over cleverness
- Trust signals must appear early — integrate into hero and service sections, not isolated in one strip
- CTAs must be visible, natural, and well placed
- Automatically improve weak marketing structure where obvious
