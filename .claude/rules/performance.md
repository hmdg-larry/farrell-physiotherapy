---
description: Permanent performance rules — Core Web Vitals, PageSpeed Insights, Lighthouse thinking, and speed-first build standards
---

# Performance Rules (Permanent)

Website speed is a core project priority — equal to design quality and accessibility. Premium design must always be balanced with strong performance. Every major build choice must consider speed, stability, and real user experience.

This standard is permanent, reusable, and must carry over to all cloned future projects.

---

## Core Web Vitals Targets

Every page must meet Google's Good thresholds. These are ranking signals and conversion factors.

| Metric | Target (Good) | Must not exceed |
|---|---|---|
| **LCP** — Largest Contentful Paint | under 2.5s | 4.0s |
| **CLS** — Cumulative Layout Shift | under 0.1 | 0.25 |
| **INP** — Interaction to Next Paint | under 200ms | 500ms |

Every page must score **90+ on Google PageSpeed Insights (mobile)**.

---

## Astro-First Build Thinking

- Prefer Astro's native strengths — static rendering by default
- Keep pages mostly static where possible
- Hydrate only where genuinely needed — never use `client:load` on components that do not require interactivity
- Avoid turning simple sections into interactive components without good reason
- Prefer `client:visible` or `client:idle` over `client:load` when hydration is needed
- Keep the output HTML lean — Astro's zero-JS default is the competitive advantage over Elementor
- Avoid framework overhead — if vanilla JS solves the problem, use it

---

## Image Performance

- Use correctly sized images — never serve 2000px images at 400px display size
- All images must use `.webp` format — no dual-format `<picture>` switching needed
- Hero and above-fold images: `loading="eager"` — all others `loading="lazy"`
- Every `<img>` must have explicit `width` and `height` to prevent CLS
- Every `<img>` must have `decoding="async"`
- Preload only essential above-the-fold hero images: `<link rel="preload">`
- Never allow heavy uncompressed images into production
- Optimise hero media carefully — it is the LCP element on most pages

---

## Script and Bundle Control

- Minimise JavaScript — the less JS, the faster the site
- Avoid unnecessary client hydration
- Avoid bloated libraries — no jQuery, no legacy polyfills, no heavy animation libraries when CSS can do the job
- Reduce unused CSS and JS — Tailwind v4 purges unused classes at build
- Avoid duplicate packages
- Only load third-party scripts when needed
- Defer or delay non-critical scripts — use `async` or `defer` on all script tags
- Script tags must never block rendering
- Swiper.js: import only the CSS modules actually used, not the full bundle
- Flag if total third-party JS exceeds 100KB

---

## Layout and Rendering Quality

- Avoid layout shift — define media dimensions on every image, iframe, and embed
- Protect above-the-fold rendering — no render-blocking resources without strong justification
- Reduce blocking resources — fonts, stylesheets, scripts
- Carousels must not cause height shift during initialisation — reserve space
- Sticky sections, sliders, and animation patterns must be lightweight
- No content injected above static content without reserved height
- Google Maps `<iframe>` must have explicit dimensions
- Booking widget containers must have reserved space defined

---

## Font Performance

- Google Fonts URL must include `display=swap` to prevent invisible text (FOIT)
- `<link rel="preconnect">` must be present for `fonts.googleapis.com` and `fonts.gstatic.com`
- Fonts must not be render-blocking
- For production UK clinic sites: consider self-hosting via `@fontsource` to avoid Google tracking, improve GDPR posture, and improve font load time

---

## Third-Party Control

Before adding any third-party feature, review its performance impact carefully. Always use the lightest method possible.

| Feature | Performance rule |
|---|---|
| **Google Maps** | **MANDATORY DEFER.** `loading="lazy"` on iframe is the minimum. For above-the-fold or globally-rendered maps (footer, location pages), use a facade pattern — static poster image + JS-injected iframe on click or on `IntersectionObserver` entry. Explicit dimensions required to prevent CLS. Cloudflare Pages routinely takes 800ms–2s to cold-load the Maps embed; never let it sit on the LCP path. |
| **Google reCAPTCHA v3** | **MANDATORY DEFER-ON-INTENT.** Never use a static `<script src="…recaptcha/api.js">` tag — always use the JS-injected loader pattern from `.claude/skills/recaptcha-defer-on-intent.md`, triggered by `focusin` + `pointerdown` + `submit` against the form element. Saves ~150 KB JS + TLS handshake + main-thread scoring loop off first paint. Applies to every form page on every clone. |
| **Booking embeds** (Cliniko etc.) | Load asynchronously. Reserve container height. |
| **Review widgets** | Lazy load. Prefer static rendering of review data over JS widgets. |
| **Chat tools** | Defer loading until after page is interactive. Never load on initial paint. |
| **Analytics** (GA4, GTM) | Load asynchronously. Never render-blocking. |
| **Marketing scripts** | Defer or delay. Never critical-path. |
| **Video embeds** | Use facade pattern — show thumbnail, load iframe on click. |
| **Cookie consent** | Must not block rendering or cause layout shift. |
| **YouTube background videos** | Limit to 10 seconds. Defer iframe load. Use facade pattern with poster image. `prefers-reduced-motion` fallback required. |

---

## Resource Hints

- `<link rel="preload">` for the LCP hero image on key pages
- `<link rel="preconnect">` for all third-party origins used on the page
- `<link rel="dns-prefetch">` for secondary origins not immediately needed
- Do not over-preload — only preload resources critical to above-the-fold rendering

---

## DOM and CSS

- Keep DOM depth reasonable — no excessive wrapper nesting
- Global CSS must be lean — no large unused style blocks
- Tailwind v4 purges unused classes at build — confirm no regressions
- No render-blocking stylesheets beyond Google Fonts
- Avoid deep nesting that increases selector complexity and rendering cost

---

## Performance Review Requirements

- New sections and features must be reviewed for weight and speed impact before being added
- Performance regressions must be prevented during all future work
- Every Tier 3+ task must include a performance check
- The `performance-optimisation` agent must run on all Tier 4 and Tier 5 tasks
- The `performance-reviewer` agent covers quick checks; `performance-optimisation` covers deep audits and enforcement

### Mandatory Deferrals — Required on Every Clone (No Exceptions)

The performance agents (`performance-reviewer` and `performance-optimisation`) MUST verify these two deferrals on every clone and on every page that introduces either feature. If either is missing, fix it before the review passes — do not flag it as advisory.

1. **Google reCAPTCHA v3** → defer-on-intent loader (`.claude/skills/recaptcha-defer-on-intent.md`). Static `<script src="…recaptcha/api.js">` tags are a fail condition.
2. **Google Maps iframe** → `loading="lazy"` minimum; facade pattern for above-fold or footer-global placement. Unmanaged eager iframes are a fail condition.

These two rules are non-negotiable because Cloudflare Pages serves HTML uncached at the edge, so the first visit pays the full third-party cost on every cold load — and reCAPTCHA + Maps are the two biggest offenders in the HMDG template lineage.

---

## Non-Negotiable Rules

- Astro + Tailwind must be measurably faster than the Elementor sites this template replaces
- CLS failures are always avoidable — explicit image dimensions are mandatory
- Third-party scripts are the most common source of performance regressions — treat every one as a risk
- Fonts must never flash or cause layout shift
- Never accept render-blocking resources without a strong technical reason
- Do not allow avoidable bloat into the system
- Design quality must remain premium, but performance must never be sacrificed for avoidable visual bloat
