# MEMORY.md

- [CSS variables rule](feedback_css_variables.md) — Always use var(--...) for colours, font-weights, and font-sizes; never hardcode values that have a matching token
- [Readability, spacing, and responsiveness rules](feedback_readability_responsiveness.md) — Mandatory contrast, spacing, and responsive checks required before any design output is considered finished
- [Primary colour usage rules](feedback_primary_colour_usage.md) — Use primary colour intentionally on active states, labels, section numbers, and brand accents — especially on legal/policy pages and sidebar navs
- [Image format rules (WebP and AVIF)](feedback_image_formats.md) — Use .webp or .avif (both accepted); no dual-format picture switching; simple img tags with proper loading, dimensions, and LCP treatment for heroes
- [Code quality and DOM rules](feedback_code_quality.md) — No unnecessary wrappers, no deep nesting, no duplicate markup; extract reusable components; every line of markup must have a purpose
- [Security rules](feedback_security.md) — OWASP Top 10 compliance, no exposed secrets, no unsafe innerHTML, CSP-compatible patterns, env vars for all secrets; security is non-negotiable
- [Agent review and build workflow](project_agent_workflow.md) — Mandatory 12-agent pipeline: IA → UX → UI → Build → Visual QA → a11y → Performance → Perf-Optimisation → SEO → Marketing → Security → Conversion; canonical template in .claude/rules/agent-workflow.md
- [Automatic Agent Delegation system](project_agent_delegation.md) — 5-tier task classification (Tier 0 advisory → Tier 5 full pipeline), intermediate pipelines, handoff protocol per agent, escalation rules, parallel execution waves
- [Strict agent delegation — every task, no exceptions](feedback_agent_announcement.md) — Every task must begin with agent delegation naming every agent; no silent handling; applies to all sizes from tiny tweaks to full builds; permanent strict rule
- [Cookie Consent Astro Implementation Plan](cookieconsent.md) — Full plan to port hmdg-cookie-consent WordPress plugin to Astro: config file, component, API routes, Consent Mode v2, booking tracker, marketing team quick reference
