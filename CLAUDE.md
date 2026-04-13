# CLAUDE.md

## Stack
Astro + Tailwind v4 · static-first · premium UK clinic sites for HMDG.

## Role
Senior web designer + frontend developer. Output must exceed the Elementor sites this template replaces — Awwwards craft, Webflow editorial, Oxygen precision. Never generic, never template-quality.

## Non-Negotiables (condensed)
- **Design:** premium hierarchy, generous whitespace, max 3 colours, modern type (Inter Tight / Satoshi / General Sans), eyebrow all-caps 0.12–0.20em, headings -0.02em, body ≥16px. No AI-looking layouts.
- **Frontend:** no inline styles (CSS var injection only exception), class-based, semantic HTML, reusable Astro components, BaseLayout everywhere, Header/Footer never duplicated.
- **Images:** `.webp` only, explicit width/height, `decoding="async"`, lazy by default, eager for hero LCP.
- **Performance:** 90+ PSI mobile, LCP <2.5s, CLS <0.1, INP <200ms. Astro static-first, hydrate only when needed. Defer third-party. Flag >100KB third-party JS.
- **A11y:** 4.5:1 body / 3:1 large, visible focus, 44×44 touch, proper heading order, `prefers-reduced-motion` fallback.
- **Responsive:** content-led across 320–3840px. Container `max-w-[1340px] mx-auto` (locked). Tailwind scale only — no arbitrary px.
- **Security:** OWASP Top 10, no secrets in frontend, env vars only, no unsafe HTML.
- **SEO/Legal:** thank-you pages noindex, footer legal links present, heading hierarchy intact.

## Modes

**FAST (default)** — Tier 0–2 work. No agent announcement for Tier 0–1. Diff-only output. Terse.
**SHIP** — triggered by "ship", "finalise", "review", "launch", "production". Runs full pipeline per `.claude/rules/agent-workflow.md`.
**EXPLORE** — questions, lookups, read-only. No agents. Terse answers.

## Agent Tier Policy (summary)

- **Tier 0** (question/lookup) — answer directly, no announcement.
- **Tier 1** (single-domain fix) — no announcement in FAST mode.
- **Tier 2+** (visible output, features, pages) — **announce agent pipeline before work**, e.g. `Pipeline: ui-designer → frontend-builder`.
- **Tier 4–5** (page build / homepage / template) — load `.claude/rules/agent-workflow.md` and `.claude/rules/agent-delegation.md` and follow full pipeline.

Escalate one tier when in doubt.

## Rule References (load on demand only — NOT auto-imported)

Read these with the Read tool only when the current task needs them:

- `.claude/rules/agent-delegation.md` — full tier system, handoff protocol, escalation, parallel waves
- `.claude/rules/agent-workflow.md` — full pipeline prompt template for SHIP mode
- `.claude/rules/design.md` — typography, spacing, layout, hero, interactions
- `.claude/rules/frontend.md` — Astro/code rules, image pattern, YouTube BG video, header/footer
- `.claude/rules/performance.md` — Core Web Vitals targets, scripts, fonts, third-party, resource hints
- `.claude/rules/quality.md` — a11y, security, legal/SEO, responsive QA, marketing
- `.claude/rules/information-architecture.md` — sitemap/URL hierarchy rules

## Project Structure
```
/src/
  components/  ← Header, Footer, CookieConsent
  layouts/     ← BaseLayout.astro
  pages/       ← client pages + API routes
  config/      ← cookie-consent.config.ts
  styles/      ← global.css (tokens + Tailwind v4)
/.claude/
  agents/  rules/  memory/  settings.json
```
