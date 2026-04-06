---
name: Agent review and build workflow
description: The exact 9-agent sequence to follow for every important page build or major revision — IA → UI → Build → a11y → Performance → SEO → Marketing → Security → Conversion
type: project
---

For every important page build or major revision, follow this agent sequence exactly. Do not skip steps. Do not rush into code before planning.

**Sequence:**
information-architecture-reviewer → ui-designer → frontend-builder → a11y-reviewer → performance-reviewer → seo-reviewer → marketing-reviewer → security-reviewer → conversion-reviewer

**Why:** User defined this as the mandatory quality pipeline to ensure every page is planned, built, reviewed, and refined across all dimensions before output is considered finished.

**How to apply:** Use the prompt template below when starting any significant build task.

---

## Prompt template

```
Review and build this task using the following agent sequence exactly:

information-architecture-reviewer → ui-designer → frontend-builder → a11y-reviewer → performance-reviewer → seo-reviewer → marketing-reviewer → security-reviewer → conversion-reviewer

Task:
[describe the page, section, sitemap, or feature here]

Instructions:
1. Start with information-architecture-reviewer
   - review sitemap, URL structure, parent child relationships, and taxonomy if relevant
   - suggest improvements before design begins

2. Then use ui-designer
   - plan the layout, hierarchy, sections, typography, spacing, interactions, and animation direction
   - keep the design at high-end Webflow quality

3. Then use frontend-builder
   - build the approved design in clean Astro + Tailwind
   - no inline styles
   - class based styling only
   - reusable components
   - global header and footer only

4. Then use a11y-reviewer
   - check readability, contrast, heading structure, focus states, keyboard access, and alt text
   - fix issues

5. Then use performance-reviewer
   - check image formats, DOM weight, lazy loading, JS usage, and CLS risks
   - optimise where needed

6. Then use seo-reviewer
   - check H1, metadata, heading hierarchy, internal linking, noindex rules, and content structure
   - improve SEO without harming UX

7. Then use marketing-reviewer
   - improve value proposition, trust signals, service positioning, and messaging clarity
   - make the page more persuasive

8. Then use security-reviewer
   - review forms, scripts, links, embeds, unsafe HTML patterns, and other frontend security risks
   - fix or flag risky implementation

9. Finally use conversion-reviewer
   - review CTA clarity, CTA placement, booking flow, friction points, and overall user journey
   - refine the page so it supports conversion strongly

Output format:
- Step 1: IA review
- Step 2: UI plan
- Step 3: Build
- Step 4: Review findings and fixes
- Step 5: Final improved result

Do not skip any agent.
Do not rush into code before planning.
If something is weak, improve it automatically.
```
