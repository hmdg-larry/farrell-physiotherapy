# MEMORY.md

- [Readability, spacing, and responsiveness rules](feedback_readability_responsiveness.md) — Mandatory contrast, spacing, and responsive checks required before any design output is considered finished
- [Primary colour usage rules](feedback_primary_colour_usage.md) — Use primary colour intentionally on active states, labels, section numbers, and brand accents — especially on legal/policy pages and sidebar navs
- [Image format rules (AVIF + WebP)](feedback_image_formats.md) — For Claude prompts use .webp; for website output use .avif as primary + .webp fallback; prompt compatibility must not change production image standards
- [Code quality and DOM rules](feedback_code_quality.md) — No unnecessary wrappers, no deep nesting, no duplicate markup; extract reusable components; every line of markup must have a purpose
- [Security rules](feedback_security.md) — OWASP Top 10 compliance, no exposed secrets, no unsafe innerHTML, CSP-compatible patterns, env vars for all secrets; security is non-negotiable
- [Agent review and build workflow](project_agent_workflow.md) — Mandatory 10-agent pipeline: IA → UX Architect → UI → Build → a11y → Performance → SEO → Marketing → Security → Conversion
- [Cookie Consent Astro Implementation Plan](cookieconsent.md) — Full plan to port hmdg-cookie-consent WordPress plugin to Astro: config file, component, API routes, Consent Mode v2, booking tracker, marketing team quick reference
