---
description: Comprehensive automatic agent delegation rules — task tiers, routing, handoffs, escalation, and parallel execution
---

# Strict Agent Delegation (Mandatory)

**Every task — without exception — must begin with clear agent delegation.**

For every user request, first classify the task tier, then select the correct agent pipeline.
State the chosen pipeline before beginning work. No task may proceed without naming the responsible agent or agents. This applies to small tasks, large tasks, and everything in between.

---

## Decision Flowchart

```
Is the request a question, explanation, or code lookup?
  → YES → Tier 0 (no agent, answer directly)
  → NO ↓

Does the task involve any visual output (something the user will see)?
  → YES → does it need IA or UX planning first?
    → YES → Tier 3, 4, or 5 (see below)
    → NO  → Tier 2 (ui-designer → frontend-builder)
  → NO ↓

Is it a single-domain specialist fix (SEO, a11y, security, performance)?
  → YES → Tier 1 (single agent)
  → NO  → Tier 3+ (multi-agent)
```

---

## Task Complexity Tiers

### Tier 0 — Advisory (direct answer)

Use when: the request is a question, explanation, debugging help, or a read-only investigation with no output.

Examples:
- "What does this function do?"
- "Where is the cookie config?"
- "Explain how Consent Mode v2 works"
- "Why is this component not showing up?"

Action: answer directly. **Still announce the tier:** state `Tier 0 — answering directly, no agent needed` before responding.

---

### Tier 1 — Single Specialist (1 agent)

Use when: the task targets exactly one domain and has no visual output changes.

Examples:
- "Fix my H1 hierarchy" → `seo-reviewer`
- "Check if my CSP allows Google Analytics" → `security-reviewer`
- "Add missing alt text to images" → `a11y-reviewer`
- "Optimise image loading on the services page" → `performance-reviewer`
- "Run a full speed audit on the site" → `performance-optimisation`
- "Check if this page would pass PageSpeed Insights" → `performance-optimisation`
- "Is the messaging on this page strong enough?" → `marketing-reviewer`
- "Are the CTAs in the right place?" → `conversion-reviewer`

Action: assign the single matching agent, apply fixes.

---

### Tier 2 — Design + Build (2 agents)

Use when: the task has visual output but does not require IA planning or UX journey mapping.

Pipeline: **ui-designer → frontend-builder**

Examples:
- "Add a new testimonial card to the homepage"
- "Fix the mobile navigation spacing"
- "Update the CTA button colour and style"
- "Add legal links to the cookie banner"
- "Create a new hero variant"
- "Improve the typography on the about section"
- "Restyle the pricing table"

Rules:
- `ui-designer` produces a written design plan first (layout, spacing, colour, hover state, responsive behaviour)
- `frontend-builder` implements exactly what `ui-designer` specified
- Never skip `ui-designer` and go straight to code for anything visible

---

### Tier 3 — Component or Feature (3–5 agents)

Use when: the task is a new feature, new component, interactive element, or business-logic addition that benefits from UX or IA thinking before design.

Core pipeline: **ux-architect → ui-designer → frontend-builder + relevant reviewer(s)**

Common Tier 3 patterns:

| Task | Pipeline |
|---|---|
| New section (no IA change) | ux-architect → ui-designer → frontend-builder → a11y-reviewer |
| Contact form or interactive element | ux-architect → ui-designer → frontend-builder → a11y-reviewer → security-reviewer |
| Cookie consent or legal component | security-reviewer (audit) → ui-designer → frontend-builder → a11y-reviewer |
| New booking CTA or flow | ux-architect → ui-designer → frontend-builder → conversion-reviewer |
| Performance + image optimisation only | performance-reviewer → frontend-builder (fixes) |
| Full speed audit or Lighthouse review | performance-optimisation → frontend-builder (fixes) |
| Security audit with code fixes | security-reviewer → frontend-builder (fixes) |
| Component with complex keyboard behaviour | a11y-reviewer (spec) → ui-designer → frontend-builder → a11y-reviewer (verify) |

---

### Tier 4 — Page Build (6–8 agents)

Use when: the task is a new page, a major page redesign, or an overhaul of multiple sections.

Core pipeline: **information-architecture-reviewer → ux-architect → ui-designer → frontend-builder → a11y-reviewer → seo-reviewer + optional reviewers**

Common Tier 4 patterns:

| Task | Pipeline |
|---|---|
| New service or location page | IA → ux-architect → ui-designer → frontend-builder → a11y → seo → conversion |
| Landing page (non-homepage) | ux-architect → ui-designer → frontend-builder → a11y → performance → performance-optimisation → marketing → conversion |
| Policy or legal page | IA → ui-designer → frontend-builder → a11y → seo |
| Multi-page template (e.g. all service pages) | IA → ux-architect → ui-designer → frontend-builder → a11y → performance → performance-optimisation → seo → conversion |
| Existing page redesign | ux-architect → ui-designer → frontend-builder → a11y → performance → performance-optimisation → seo → marketing → conversion |

---

### Tier 5 — Full Pipeline (all 11 agents)

Use when: the task is a homepage, structural template, major release, or anything that must meet the highest standard across every dimension.

Pipeline: **information-architecture-reviewer → ux-architect → ui-designer → frontend-builder → a11y-reviewer → performance-reviewer → performance-optimisation → seo-reviewer → marketing-reviewer → security-reviewer → conversion-reviewer**

Use for:
- Homepage builds or rebuilds
- Full site template creation
- Major structural redesign
- Any task that affects the global layout (Header, Footer, BaseLayout)
- New client site setup from the base template

Full prompt template: @.claude/rules/agent-workflow.md

---

## Tier Selection Quick Reference

| Trigger words | Tier |
|---|---|
| "explain", "what is", "where is", "why is", "show me", "check" | 0 |
| "fix", "add", "update" + single domain (SEO, a11y, security, performance) | 1 |
| "add a link", "update the style", "restyle", "new card", "fix the layout" | 2 |
| "new component", "new feature", "add a section", "build a form" | 3 |
| "new page", "build the X page", "redesign the X page" | 4 |
| "homepage", "full site", "template", "structural redesign" | 5 |

When in doubt, go one tier higher.

---

## Handoff Protocol

Each agent produces a specific deliverable for the next agent in the pipeline.

### information-architecture-reviewer → ux-architect
Delivers:
- Confirmed URL structure and page hierarchy
- Recommended sitemap changes
- Parent/child relationships
- Taxonomy structure if applicable

### ux-architect → ui-designer
Delivers:
- User journey map (Awareness → Interest → Trust → Intent → Action)
- Section order and content priority per section
- Interaction specs (sticky behaviour, carousel logic, form flow, CTA triggers)
- Friction points identified
- Explicit handoff notes for ui-designer and frontend-builder

### ui-designer → frontend-builder
Delivers:
- Section-by-section written design plan
- Layout structure (grid, columns, full-width vs contained)
- Typography spec (font size, weight, line height per element)
- Spacing spec (padding, margin, gap values using Tailwind scale)
- Colour usage (background, text, accent, border — max 3 active colours)
- Animation and hover state spec
- Responsive behaviour (mobile-first breakpoint changes)
- Component names and reuse decisions

### frontend-builder → reviewers
Delivers:
- Complete, buildable Astro + Tailwind code
- All components extracted and named
- Implementation notes (any constraints, deviations from design plan, browser quirks)

### performance-reviewer → performance-optimisation
Delivers:
- Quick-check findings (image, font, JS, CLS issues)
- Flags for deeper investigation

### performance-optimisation → next stage
Delivers:
- Full Core Web Vitals risk assessment
- Third-party script audit with weight impact
- Estimated PageSpeed Insights mobile score range
- Prioritised fix recommendations with file paths
- Architectural recommendations (hydration strategy, library choices)

### a11y/performance/seo/marketing/security → next stage
Delivers:
- Pass/fail assessment per criterion
- Issues list with severity (critical / warning / advisory)
- Fixes applied directly where possible
- Flags for anything requiring a design or code change

---

## Escalation Rules

When a reviewer discovers an issue that requires changes beyond their scope:

### Styling or visual issue found by a reviewer
Route: **reviewer flags it → ui-designer (design decision) → frontend-builder (implement)**

Examples:
- a11y-reviewer finds contrast too low → ui-designer proposes a new colour → frontend-builder updates
- conversion-reviewer wants a CTA repositioned → ui-designer re-plans placement → frontend-builder moves it
- marketing-reviewer wants a section restructured → ui-designer re-layouts → frontend-builder rebuilds

### Code-only issue found by a reviewer
Route: **reviewer flags it → frontend-builder (fix)**

Examples:
- a11y-reviewer finds a missing aria-label → frontend-builder adds it
- security-reviewer finds a missing rel="noopener" → frontend-builder adds it
- performance-reviewer finds an image not using lazy loading → frontend-builder adds it

### Copy or messaging issue found by a reviewer
Route: **marketing-reviewer applies fix directly** (no routing needed)

### Systemic design decision required
Route: **security/performance/a11y flags it → ux-architect (re-evaluate strategy) → ui-designer → frontend-builder**

Examples:
- security-reviewer finds the entire form needs restructuring → ux-architect re-plans form flow → ui-designer redesigns → frontend-builder rebuilds

### Escalation rule: minimum 2-pass for critical issues
If a reviewer finds a critical issue (broken accessibility, security vulnerability, non-compliant GDPR pattern), always verify the fix with a second pass by the same reviewer after frontend-builder implements.

---

## Parallel vs Sequential Execution

### Must be sequential (each depends on the previous)
```
information-architecture-reviewer
  ↓
ux-architect (needs IA decisions)
  ↓
ui-designer (needs UX plan)
  ↓
frontend-builder (needs UI design plan)
  ↓
[build complete — reviewers can start]
```

### Can run in parallel (after build is complete)
These reviewers assess the same built output independently:

**Wave 1 (parallel):** a11y-reviewer + performance-reviewer + seo-reviewer

**Wave 1.5 (sequential after Wave 1):** performance-optimisation (needs performance-reviewer findings first — runs deep audit)

**Wave 2 (parallel):** marketing-reviewer + security-reviewer

**Wave 3 (sequential):** conversion-reviewer (needs all other reviews complete — assesses the final state)

In practice, Claude runs agents sequentially in one conversation. Apply the parallel grouping mentally: do not let Wave 1 reviewer issues block Wave 2 from starting unless there is a direct dependency.

---

## Agent Output Format

State this at the start of each agent handoff:

```
--- [agent-name] ---
[output content]
--- handoff to [next-agent-name] ---
```

For complex builds with 5+ agents, use numbered steps:

```
Step 1 — information-architecture-reviewer: [IA output]
Step 2 — ux-architect: [UX plan]
Step 3 — ui-designer: [design plan]
Step 4 — frontend-builder: [code]
Step 5 — reviewers: [findings and fixes]
Step 6 — final result
```

---

## Agent Announcement Format (Strict — Never Skip)

**Every task must begin with a clear agent delegation announcement. No exceptions.**

This applies to all task sizes — from a single spacing tweak to a full homepage build. No work may begin before the announcement is made. No silent handling. No assumed delegation. No vague wording.

**Tier 0 (questions, lookups, explanations):**
> Tier 0 — answering directly, no agent needed.

**Single agent (small task):**
> Assigning to `frontend-builder` (Tier 1 — spacing fix on the hero section).

**Two agents (visual task):**
> This is a Tier 2 task. Pipeline: `ui-designer` → `frontend-builder`.

**Multi-agent (feature or component):**
> This is a Tier 3 task (new interactive component). Pipeline: `ux-architect` → `ui-designer` → `frontend-builder` → `a11y-reviewer` → `security-reviewer`.

**Full pipeline:**
> This is a Tier 5 task (homepage build). Full pipeline: `information-architecture-reviewer` → `ux-architect` → `ui-designer` → `frontend-builder` → `a11y-reviewer` → `performance-reviewer` → `performance-optimisation` → `seo-reviewer` → `marketing-reviewer` → `security-reviewer` → `conversion-reviewer`.

### Rules

- **Never skip the announcement** — it is the first thing in every response
- **Always name every agent by name** — never say "the relevant agents" or "best agent"
- **Even tiny tasks must be delegated** — icon swaps, text changes, padding tweaks, responsive fixes, image updates
- **The only override is the user explicitly saying to skip delegation**
- This rule is permanent, strict, and must carry to all cloned projects
