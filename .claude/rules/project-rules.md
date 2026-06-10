---
description: Fel's master project Rules — triggered by "Hey Claude, read our Rules". Section naming/numbering/padding system, setup procedure, GitHub repo standards, image/video/favicon rules, QA gate.
---

# Project Rules (Master — Strict)

**Trigger:** when Fel says **"Hey Claude, read our Rules"**, read this file in full, confirm understanding, and strictly follow every requirement below before performing any work. These Rules carry to every cloned client project.

---

## Frontend Builder = Enforcement Agent

`frontend-builder` is the enforcement agent for ALL frontend standards: Astro, Tailwind CSS, TypeScript, Cloudflare, Sanity integration, global CSS architecture, accessibility, SEO, performance, security, component architecture, and project workflow. It must never ignore existing project standards or create conflicting implementations. Its agent file (`.claude/agents/frontend-builder.md`) embeds these Rules.

---

## New Project Setup Procedure

When setting up a new client project:

1. Clone https://github.com/felmerald-hmdg/astro-base-template-cloudflare
2. **STOP — ask Fel for the project name. Do not continue until confirmed.**
3. Rename the project using the provided name
4. Configure the `.env` file
5. Verify project configuration (build runs clean)

## Project Review Requirement (before ANY changes)

Thoroughly review everything inside `.claude/` — all `.md` files, skills, agents, rules, workflows — plus `src/styles/global.css` and existing components. Pay particular attention to: agent delegation tiers, global CSS architecture, spacing/padding standards, **section numbering classes (`firstsection`, `secondsection`, `thirdsection`, `fourthsection`, …)**, container standards (`max-width: 1340px` via `--spacing-container-max` unless a documented exception exists), typography tokens, and utility classes. Do not begin development until the review is complete.

---

## Agent Delegation (always)

Follow `.claude/rules/agent-delegation.md` exactly — Tier 0–5 classification, correct pipelines, no skipped delegation, no random assignment. Clearly identify responsible agents for planning, architecture, design, development, accessibility, SEO, performance, security, testing, QA, and visual QA.

---

## Section Naming and CSS Architecture (MANDATORY)

Every section carries **two classes**:

**1. Purpose class** — identifies the section type:
`hero` `about` `services` `conditions` `team` `booking` `faq` `pricing` `contact` `testimonials` `reviews` `blog` `footer`
Never generic: ~~`section`~~ ~~`wrapper`~~ ~~`content`~~ ~~`block`~~

**2. Numbering class** — applies the project spacing standard:
`firstsection` `secondsection` `thirdsection` `fourthsection` `fifthsection` `sixthsection` `seventhsection` `eighthsection` `ninthsection` `tenthsection` — defined in `global.css` (`@layer components`). Hero sections use `herosection`.

```html
<section class="hero herosection">
<section class="about firstsection">
<section class="services secondsection">
<section class="team thirdsection">
<section class="booking fourthsection">
```

**Child classes inherit the section namespace:**
`services-grid` `services-card` `services-item` · `team-grid` `team-member` · `faq-item` `faq-question` `faq-answer` · `hero-content` `hero-buttons` `hero-media` · `about-grid` `about-content` `about-image`
Never generic child classes (`.card` `.grid` `.wrapper` `.content` `.item` `.box`) **unless already part of the documented global CSS system** (`.card`, `.container-main`, `.flex-layout`, `.btn`, `.eyebrow`, `.section-header`, `.input` are documented globals — reuse them).

---

## Section Padding System (MANDATORY)

Implemented via tokens + the numbering classes — never hand-rolled values:

| Section type | Desktop/Tablet | Mobile |
|---|---|---|
| Standard sections (about, services, team, reviews, booking, pricing, FAQ, contact, blog, legal, all content sections) | `90px 30px` | `80px 30px` |
| Hero sections (every hero on the site) | `180px 30px 90px 30px` | `180px 30px 80px 30px` |

Mechanics in this architecture:
- Vertical padding: numbering classes → `--spacing-section-y` (80px mobile) / `--spacing-section-y-lg` (90px ≥1200px); heroes → `--spacing-hero-top` (180px)
- Horizontal 30px: `.container-main` (`--spacing-section-x`) inside the section
- The computed padding box matches the table exactly — never add extra horizontal padding on the section

**Enforcement:** before completing any task verify every section follows this table, no custom spacing values were introduced, and the existing spacing architecture is intact. Non-compliant sections must be corrected before the task is complete. Documented exceptions only.

---

## Code Standards

**Astro:** reusable components, no duplicated markup, Astro routing conventions, image optimisation standards, lightweight pages, clean component architecture.

**Tailwind:** no utility duplication, readable classes, reuse existing patterns, design tokens only, correct responsive utilities.

**TypeScript (strict):** no `any`, proper typing, interfaces where appropriate, full type safety, no unnecessary assertions.

**Global CSS:** always review existing global CSS before creating styles. Reuse existing containers/spacing/utilities/components. No duplication, no conflicts, no inline styles, no one-off solutions unless absolutely necessary.

**Containers:** `max-width: 1340px` default (`--spacing-container-max`). Responsive across mobile, tablet, laptop, desktop.

---

## GitHub Repository Setup (per client project)

Create a **private** repository named after the project with: branch protection enabled, PR reviews enabled, force pushes disabled, branch deletion disabled, proper `.gitignore` (excluding `.env`, secrets, API keys, tokens, credentials).

Invite as **Administrators**: `felmerald-hmdg` `hmdg-larry` `hmdgai` `JoshuaHMDG` `princesshmdg` `dannis-HMDG` `hmdg-antonio` `hmdg-junemark` `mondred-hmdg` `hmdg-renato` `hmdg-dave` `hmdg-enofre` `emmanuel-hmdg`

Before completion report: repo name, URL, visibility, collaborator confirmation, branch protection confirmation, gitignore confirmation, production readiness confirmation.

---

## Colour and Typography Reporting

On request, show: all colour variables (names, values, file locations — `src/styles/global.css @theme`), heading + body font families, typography config files, font loading method (self-hosted `@fontsource-variable`). If Fel uploads a non-`.woff2` font: convert to `.woff2`, host locally, update the typography configuration, use local font loading.

## Favicons

Generate via https://realfavicongenerator.net/ — required: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`. Upload to `public/`, replacing the default Astro favicon files.

## Images

- **Primary format: `.avif`** · **Fallback/equal: `.webp`** — both accepted, no dual-format `<picture>` switching
- `.png`/`.jpg` only when necessary
- Optimise everything for Core Web Vitals, SEO, accessibility, performance (explicit dimensions, `decoding="async"`, lazy by default, hero LCP gets eager + `fetchpriority="high"` + preload)

## Hero Video

Self-hosted only: `.mp4` H.264, stored in `public/videos/`, **max 15 seconds, max 5 MB**, optimised for performance, must not hurt LCP. Read `.claude/skills/hero-video.md` before any implementation (default encode spec there: 10s, CRF 28, 1280px — stays within the ceiling).

---

## Quality Assurance Gate (before any task is complete)

- [ ] Agent delegation completed correctly
- [ ] Project standards + global CSS standards followed
- [ ] Section naming, numbering, and padding rules followed
- [ ] Accessibility + WCAG 2.2 AA reviewed
- [ ] SEO + schema + local SEO + GEO (AI-answer) SEO reviewed
- [ ] Performance + Core Web Vitals reviewed
- [ ] Security reviewed
- [ ] Visual QA completed
- [ ] No regressions, no broken functionality
- [ ] Production ready

**No task is complete until every Rule is satisfied.**
