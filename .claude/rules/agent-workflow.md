---
description: Full agent pipeline prompt template for important page builds and major revisions
---

# Agent Workflow Template

Use this prompt when starting any significant page build or major revision:

```
Review and build this task using the following agent sequence exactly:

information-architecture-reviewer → ui-designer → frontend-builder → visual-qa-reviewer → a11y-reviewer → performance-reviewer → seo-reviewer → marketing-reviewer → security-reviewer → conversion-reviewer

Task:
[describe the page, section, sitemap, or feature here]

Instructions:
1. Start with information-architecture-reviewer
   - review sitemap, URL structure, parent child relationships, and taxonomy if relevant
   - suggest improvements before design begins

2. Then use ui-designer
   - plan the section structure, layout, typography, spacing, interactions, and animation direction
   - define section backgrounds using the design token system
   - apply mobile-first thinking
   - keep the design at Awwwards + Webflow + Oxygen Builder standard
   - do NOT write code

3. Then use frontend-builder
   - build the approved design in clean Astro + Tailwind
   - no inline styles
   - use the existing global class system (.btn, .card, .container-main, .flex-layout, etc.)
   - reusable components
   - global header and footer only
   - all images use the required picture pattern with decoding="async"

4. Then use visual-qa-reviewer
   - check whether the built page matches the design intent
   - verify section variety, visual hierarchy, hero quality, CTA visibility, hover states, and mobile layout
   - fix minor issues directly
   - flag critical issues before proceeding

5. Then use a11y-reviewer
   - check contrast ratios (4.5:1 body, 3:1 large text and UI)
   - check focus states, heading structure, keyboard navigation, form labels, and touch targets
   - check prefers-reduced-motion compliance
   - fix issues

6. Then use performance-reviewer
   - check image formats, DOM weight, lazy loading, JS usage, and CLS risks
   - optimise where needed

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
- Step 2: UI plan
- Step 3: Build
- Step 4: Visual QA findings and fixes
- Step 5: All review findings and fixes
- Step 6: Final improved result

Do not skip any agent.
Do not rush into code before planning.
If something is weak, improve it automatically.
```
