---
name: Agent review and build workflow
description: The exact 12-agent sequence for every important page build or major revision — IA → UX → UI → Build → Visual QA → a11y → Performance → Perf-Optimisation → SEO → Marketing → Security → Conversion
type: project
---

For every important page build or major revision, follow this agent sequence exactly. Do not skip steps. Do not rush into code before planning.

**Sequence (canonical — also in `.claude/rules/agent-workflow.md`, which is the source of truth):**
information-architecture-reviewer → ux-architect → ui-designer → frontend-builder → visual-qa-reviewer → a11y-reviewer → performance-reviewer → performance-optimisation → seo-reviewer → marketing-reviewer → security-reviewer → conversion-reviewer

**Why:** User defined this as the mandatory quality pipeline to ensure every page is planned, built, reviewed, and refined across all dimensions before output is considered finished. visual-qa-reviewer runs between frontend-builder and a11y-reviewer to catch visual implementation gaps; performance-optimisation runs after performance-reviewer for the deep audit.

**How to apply:** Use the prompt template in `.claude/rules/agent-workflow.md` when starting any significant build task. The template below is a summary — if it ever disagrees with the rules file, the rules file wins.

---

## Prompt template

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
   - map the user journey (Awareness → Interest → Trust → Intent → Action)
   - define content priority per section and interaction patterns
   - identify friction points and conversion pathway
   - do NOT design visually or write code

3. Then use ui-designer
   - plan the section structure, layout, typography, spacing, interactions, and animation direction
   - apply UX decisions from ux-architect
   - define section backgrounds using the design token system
   - apply mobile-first thinking
   - keep the design at Awwwards + Webflow + Oxygen Builder standard (three-builder synthesis)
   - do NOT write code

3. Then use frontend-builder
   - build the approved design in clean Astro + Tailwind
   - no inline styles
   - use the existing global class system (.btn, .card, .container-main, .flex-layout, etc.)
   - reusable components
   - global header and footer only
   - all images use the required <img> pattern (.webp/.avif, explicit dimensions, decoding="async"; hero LCP gets eager + fetchpriority="high" + preload)

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

6.5. Then use performance-optimisation
   - deep speed audit: LCP sub-part diagnosis, third-party weight, hydration strategy
   - verify 90+ PageSpeed Insights (mobile)

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
