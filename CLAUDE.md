# CLAUDE.md

## Stack
Astro 6 + Tailwind v4 · static-first · premium UK clinic sites for HMDG.
Hosting: Cloudflare Pages (`@astrojs/cloudflare`).
Contact form: Web3Forms (`PUBLIC_WEB3FORMS_KEY` env var — public key, safe to expose).
API routes: Cloudflare Pages Functions (`export const prerender = false`).

## Project Log Protocol (Mandatory)

A lightweight project log lives at `.project-log.md` (project root). It is committed to GitHub but never deployed — it sits outside `src/` and `public/`, so neither Astro nor Cloudflare Pages can serve it.

### Rules — apply on every session

1. **Read first.** Before starting any work, read `.project-log.md`. The Current Priorities, Unfinished / To Do, and Blocked sections describe the running state of the project. Resume from there.
2. **Update last.** Before declaring a task complete (or before ending the session), append a Change Log entry and reconcile the Unfinished / To Do list. Move newly-finished items out, add anything that's still open in.
3. **Unfinished work is always written down.** If a task isn't fully shipped (e.g. uncommitted changes, missing per-client assets, a follow-up the user said yes to), it MUST live under "Unfinished / To Do" with enough detail for the next session to resume cold.
4. **Every Change Log entry includes:**
   - **Date** (YYYY-MM-DD heading)
   - **Status** — `completed` / `in progress` / `blocked` / `to do`
   - **Task summary** — one or two sentences, factual, no marketing language
   - **Files changed** — bullet list of paths
   - **Next action** — what the next session should do, or `none` if truly done
   - Optional: **Notes** — non-obvious context (gotchas, reasons, links)
5. **Keep it lightweight.** Short entries. No essays. No screenshots. No decorative formatting beyond what the file template uses.
6. **Never reference `.project-log.md` from any frontend route, page, public asset, or build output.** It must remain internal.

## Role
Senior web designer + frontend developer. Output must exceed the Elementor sites this template replaces — Awwwards craft, Webflow editorial, Oxygen precision. Never generic, never template-quality.

## Non-Negotiables (condensed)
- **Design:** premium hierarchy, generous whitespace, max 3 colours, modern type (Inter Tight / Satoshi / General Sans), eyebrow all-caps 0.12–0.20em, headings -0.02em, body ≥16px. No AI-looking layouts.
- **Frontend:** no inline styles (CSS var injection only exception), class-based, semantic HTML, reusable Astro components, BaseLayout everywhere, Header/Footer never duplicated.
- **Images:** `.avif` (primary) or `.webp` (both accepted, never warn), explicit width/height, `decoding="async"`, lazy by default, eager + `fetchpriority="high"` for hero LCP.
- **Sections:** every `<section>` carries a purpose class (`hero`, `about`, `services`…) + a numbering class (`firstsection`…`tenthsection`, `herosection`) from global.css. Child classes inherit the section namespace (`services-card`, not `.card` unless documented global). Padding: standard 90/80px vertical via tokens, heroes 180px top — never hand-rolled. Full spec: `.claude/rules/project-rules.md`.
- **Performance:** 90+ PSI mobile, LCP <2.5s, CLS <0.1, INP <200ms. Astro static-first, hydrate only when needed. Defer third-party. Flag >100KB third-party JS. LCP element gets preload + fetchpriority, is never lazy, never in a carousel, never animated from `opacity: 0`.
- **A11y:** WCAG 2.2 AA. 4.5:1 body / 3:1 large, visible focus, 44×44 touch, proper heading order, `prefers-reduced-motion` fallback, focus never obscured by sticky UI, drag gestures have button alternatives.
- **Responsive:** content-led across 320–3840px. Container `max-w-[1340px] mx-auto` (locked). Tailwind scale only — no arbitrary px.
- **Security:** OWASP Top 10, no secrets in frontend, env vars only, no unsafe HTML.
- **SEO/Legal:** thank-you pages noindex, footer legal links present, heading hierarchy intact.
- **Headings:** all `<h1>`–`<h5>` in Title Case per convertcase.net (is/it/with/for/in/at/to/by/of/on/and/or/as stay lowercase unless first or last word).
- **Contact forms:** Web3Forms only — use `<ContactForm />` from `src/components/`. Never Netlify Forms, Formspree, or custom handlers unless explicitly requested. `PUBLIC_WEB3FORMS_KEY` env var required. CSP already includes `api.web3forms.com`.
- **Video (MANDATORY):** Self-hosted MP4 H.264 only. NEVER YouTube embed, NEVER WebM-only, NEVER Vimeo embed for hero/background video. Hard ceiling: **max 15 seconds, max 5 MB** — must never hurt LCP. Source video lives in `assets/videos/` (outside `public/`). Encoded output goes to `public/videos/hero-loop.mp4`. Default encode spec: `libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart -an -t 10` capped at 1280px wide. Use `npm run optimise-video`. Pattern: JS-injected `<source>` (not `<source media>`); mobile + reduced-motion users get poster only. Full spec in `.claude/skills/hero-video.md` — read before any video work.

## Modes

**FAST (default)** — Tier 0–2 work. No agent announcement for Tier 0–1. Diff-only output. Terse.
**SHIP** — triggered by "ship", "finalise", "review", "launch", "production". Runs full pipeline per `.claude/rules/agent-workflow.md`.
**EXPLORE** — questions, lookups, read-only. No agents. Terse answers.

**Agent operating discipline (all agents):** decisive context-gathering, batched reads and fixes, mechanical details copied from source never memory, terse output with no preamble or narration. Fast means decisive, never careless.

## Agent Tier Policy (summary)

- **Tier 0** (question/lookup) — answer directly, no announcement.
- **Tier 1** (single-domain fix) — no announcement in FAST mode.
- **Tier 2+** (visible output, features, pages) — **announce agent pipeline before work**, e.g. `Pipeline: ui-designer → frontend-builder`.
- **Tier 4–5** (page build / homepage / template) — load `.claude/rules/agent-workflow.md` and `.claude/rules/agent-delegation.md` and follow full pipeline.

Escalate one tier when in doubt.

## Rule References (load on demand only — NOT auto-imported)

Read these with the Read tool only when the current task needs them:

- `.claude/rules/project-rules.md` — **Fel's master Rules. MANDATORY read when Fel says "Hey Claude, read our Rules"** — section naming/numbering/padding system, setup procedure, GitHub repo standards, QA gate
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
  components/  ← Header, Footer, CookieConsent, Hero, PageHero, ContactForm
  layouts/     ← BaseLayout.astro
  pages/       ← client pages + API routes
  config/      ← cookie-consent.config.ts
  data/        ← Sanity-ready content layer: site.ts (clinic identity — single source of truth), navigation.ts, services.ts, reviews.ts
  lib/         ← sitemap.ts + content/ (types.ts contracts, normalize.ts transforms)
  styles/      ← global.css (tokens + Tailwind v4)
/public/
  _headers _redirects robots.txt
  images/  videos/  fonts/  icons/
/scripts/      ← patch-cloudflare-adapter, resize-images, optimise-video
/.claude/
  agents/  rules/  skills/  memory/  settings.json
.project-log.md  ← INTERNAL working log, read first / update last
CHANGELOG.md     ← PUBLIC semver changelog of the base template itself
```

**Documentation files — what's what:**
- `.project-log.md` — internal session continuity. Lives at the project root, committed to GitHub, never deployed. Tracks current priorities, unfinished work, change log entries, and notes for the next session. Read this FIRST.
- `CHANGELOG.md` — public-facing semver changelog of the template itself (release history, breaking changes). Update only when the template's version bumps.
- `.claude/skills/*.md` — reusable build patterns (contact form, hero video, performance, carousel, header menu). Read on demand.
- `.claude/rules/*.md` — full delegation / workflow / quality rules. Loaded on demand from CLAUDE.md references above.
- `SANITY_READY.md` — Sanity preparation guide: content lives in `src/data/*` (typed, render-only components); future integration replaces the data source layer only. Read before any Sanity or content-structure work.
