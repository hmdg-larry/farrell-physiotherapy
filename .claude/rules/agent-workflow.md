---
description: Full agent pipeline prompt template for important page builds and major revisions
---

# Agent Workflow Template

Use this prompt when starting any significant page build or major revision:

```
Review and build this task using the following agent sequence exactly:

information-architecture-reviewer → ux-architect → ui-designer → frontend-builder → visual-qa-reviewer → a11y-reviewer → performance-reviewer → performance-optimisation → seo-reviewer → marketing-reviewer → security-reviewer → conversion-reviewer

Task:
[describe the page, section, sitemap, or feature here]

Instructions:
1. Start with information-architecture-reviewer
   - review sitemap, URL structure, parent child relationships, and taxonomy if relevant
   - suggest improvements before design begins

2. Then use ux-architect
   - map the user journey for this page (Awareness → Interest → Trust → Intent → Action)
   - define content priority for each section (primary message, supporting evidence, action trigger)
   - specify interaction patterns (navigation behaviour, CTA behaviour, carousel, forms)
   - identify friction points and conversion pathway
   - produce handoff notes for ui-designer and frontend-builder
   - do NOT design visually or write code

3. Then use ui-designer
   - plan the section structure, layout, typography, spacing, interactions, and animation direction
   - apply the UX architecture decisions from ux-architect
   - define section backgrounds using the design token system
   - apply mobile-first thinking
   - keep the design at Awwwards + Webflow + Oxygen Builder standard
   - do NOT write code

4. Then use frontend-builder
   - build the approved design in clean Astro + Tailwind
   - no inline styles (exception: GTM noscript style is a technical requirement)
   - use the existing global class system (.btn, .card, .container-main, .flex-layout, etc.)
   - Header and Footer are components — never duplicate them per page
   - all images use the required <img> pattern (.webp/.avif, explicit width/height, decoding="async"; hero LCP gets eager + fetchpriority="high" + preload)
   - implement all component behaviours specified by ux-architect

4.5. Then use visual-qa-reviewer
   - compare the built output against the ui-designer plan section by section
   - check composition, typography craft, depth/texture, animation choreography, CTA quality
   - fix minor visual gaps directly; route major gaps back to frontend-builder

5. Then use a11y-reviewer
   - check contrast ratios (4.5:1 body, 3:1 large text and UI)
   - check focus states, heading structure, keyboard navigation, form labels, and touch targets
   - check prefers-reduced-motion compliance
   - fix issues

6. Then use performance-reviewer
   - check image formats, DOM weight, lazy loading, JS usage, and CLS risks
   - optimise where needed

6.5. Then use performance-optimisation
   - run deep speed audit across all page components
   - assess Core Web Vitals risk (LCP, CLS, INP)
   - audit every third-party script for weight and necessity
   - check hydration strategy and Astro-first patterns
   - verify the page would score 90+ on PageSpeed Insights (mobile)
   - provide prioritised fix recommendations with specific file paths
   - do NOT accept general advice — review actual code

7. Then use seo-reviewer
   - check H1, metadata, heading hierarchy, internal linking, noindex rules, and content structure
   - improve SEO without harming UX

8. Then use marketing-reviewer
   - improve value proposition, trust signals, service positioning, and messaging clarity
   - make the page more persuasive

9. Then use security-reviewer
   - review forms, scripts, links, embeds, unsafe HTML patterns, and other frontend security risks
   - fix or flag risky implementation

10. Finally use conversion-reviewer
    - review CTA clarity, CTA placement, booking flow, friction points, and overall user journey
    - refine the page so it supports conversion strongly

Output format:
- Step 1: IA review
- Step 2: UX architecture plan
- Step 3: UI design plan
- Step 4: Build
- Step 5: All review findings and fixes
- Step 6: Final improved result

Do not skip any agent.
Do not rush into code before planning.
If something is weak, improve it automatically.
```
