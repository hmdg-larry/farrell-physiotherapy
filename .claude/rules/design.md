---
description: Design standards — typography, spacing, visual style, layout, hero, UI/UX, and responsive rules
---

# Design Standards

Design must align with the quality and polish of the three-builder standard: Awwwards craft, Webflow editorial ambition, Oxygen structural precision.

## Typography
- Use modern, premium font families: Inter Tight, Satoshi, General Sans, Plus Jakarta Sans
- Strong and intentional font sizing with clear hierarchy between H1, H2, H3, eyebrow, body, and caption
- Eyebrow labels: all-caps, letter-spacing 0.12–0.20em — mandatory
- Headings: weight 600–700, letter-spacing -0.02em to -0.03em
- Body: minimum 16px, line-height 1.6–1.75
- Avoid default-looking typography or weak scaling

## Spacing and Layout
- Use generous whitespace from the Tailwind spacing scale only (4px base)
- No arbitrary spacing values (no "37px" or "22px")
- Consistent spacing rhythm across all sections
- Clean section separation — never more than two consecutive sections sharing the same background

## Visual Style
- Minimal, modern, and premium
- Maximum 3 active colours per site: primary, neutral near-black, white
- Strong hierarchy over decoration
- Grain/noise texture (3–5% opacity) on all section backgrounds
- Avoid clutter and unnecessary visual noise

## Interactions and Animations
- Subtle, smooth, professional — staggered entrance delays (0/80/160/240ms)
- Parallax on hero image only
- Magnetic CTA button on hero and booking CTA (desktop only)
- Prefers-reduced-motion: every animation must have a static fallback
- Never animate width, height, top, left, or margin — only transform and opacity
- Animation must feel refined, never distracting

## Layout Rules

Default page structure unless the page clearly requires otherwise:
- Hero with background image
- Trust bar (accreditations, Google rating, stats)
- About Us
- Services — interactive carousel
- Conditions or content section — sticky-scroll layout when appropriate
- Team — carousel
- Google Reviews — carousel
- Booking CTA — clean, single-message, high contrast
- Footer

### Hero Rules
- Always use a full-width background image
- **The hero image IS the LCP element** — budget ≤120KB desktop / ≤60KB mobile variant, text-protection overlays are CSS gradients only (never image layers), and the hero never sits inside a carousel or starts at `opacity: 0`
- Protect text with overlay, gradient, panel, or proper contrast treatment
- H1 communicates core value proposition (what the clinic does and for whom)
- Primary CTA visible above the fold on all devices
- At least one trust signal in the hero composition
- Text must be fully readable on mobile without pinching

### Hero Height Rules (Permanent)
- **Never use blind `h-screen`** — do not stretch a hero to fill the entire viewport without control
- Use controlled adaptive height: `min-height` with responsive values
- **Homepage hero:** full viewport height on mobile (`min-h-svh`), capped on large screens with `max-h-[900px]` or similar to prevent empty space on 4K and ultrawide displays
- **Secondary page heroes:** content-driven height with min-height floor, no full viewport stretch
- Add a `max-height` cap on very large screens (2xl+) to prevent over-stretching
- Position hero content with intention — content should feel visually connected and balanced, not sitting too low
- Constrain headline width so typography feels designed, not auto-stretched across the full width
- Ensure CTA and supporting content remain visually grouped with the heading
- Check all hero sections on mobile, tablet, desktop, ultrawide, and 4K screens
- Maintain strong spacing and intentional composition at every breakpoint
- Avoid awkward empty space above or below the main content on any screen size

## UI and UX Rules
- Text must always be readable — maintain strong contrast
- No text on busy images without protection
- Clear and obvious CTAs — action-oriented copy ("Book Now", "Get Started", "Call Today")
- Buttons visually consistent across the site
- Navigation clear and usable on all breakpoints
- Layouts polished at every breakpoint

Buttons on light or white backgrounds must still feel visually strong and not get lost.

## Responsive Rules
- Mobile-first: single column, full-width, 44×44px minimum touch targets, 16px minimum body text
- Tablet: 2-column grids, wider padding
- Desktop: multi-column, asymmetric compositions (60/40, 65/35), sticky sidebars where appropriate
- No horizontal overflow under any circumstances on any breakpoint
