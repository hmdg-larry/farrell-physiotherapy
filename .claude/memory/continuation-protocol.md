# Continuation Protocol

> This file is overwritten every time. Never append. Always replace with latest state.

---

## To Be Continued

### Completed

* v1.3.0 — Cookie Consent Manager fully implemented
* `src/config/cookie-consent.config.ts` — marketing config file created
* `src/components/CookieConsent.astro` — full banner + modal + JS created
* `src/layouts/BaseLayout.astro` — consent head script + CookieConsent component added
* `src/pages/api/book-now.ts` — Netlify Function created
* `src/pages/api/booking-complete.ts` — Netlify Function created
* `astro.config.mjs` — Netlify adapter added
* `.env.example` — GA4 secrets section added
* `CHANGELOG.md` + `VERSION` updated to v1.3.0
* `CookieConsentReadme.md` — marketing team guide in project root
* All agent files strengthened to HMDG UK agency standard (v1.2.0)
* continuation-protocol.md, cookieconsent.md in .claude/memory/

### In Progress

* Nothing currently in progress

### Remaining Tasks

* [ ] Test the dev server: `npm run dev` — verify banner appears, buttons work, console debug output
* [ ] Set `debug: true` in config temporarily to verify all console groups log correctly
* [ ] Fill in real client GTM ID and GA4 ID in `src/config/cookie-consent.config.ts` when building a client site
* [ ] Add `GA4_API_SECRET`, `GA4_MEASUREMENT_ID`, `SITE_ORIGIN` to Netlify dashboard for each client site
* [ ] Test booking tracker: add a test link to a booking domain and verify `book_now_click` fires

### Important Context to Keep

**Project:** Astro Base Template — HMDG UK web design agency, replacing Elementor premium builds
**Repo:** https://github.com/felmerald-hmdg/astro-base-template
**Current version:** v1.3.0
**Astro version:** 6.1.3
**Stack:** Astro + Tailwind CSS v4 + Netlify + @astrojs/netlify adapter

**Cookie consent key files:**
- `src/config/cookie-consent.config.ts` — ONLY file marketing edits (GTM, GA4, policy version, banner text, categories, booking domains)
- `src/components/CookieConsent.astro` — full component, do not edit unless developer
- `src/pages/api/book-now.ts` — Netlify Function, `export const prerender = false`
- `src/pages/api/booking-complete.ts` — Netlify Function, `export const prerender = false`
- `src/layouts/BaseLayout.astro` — consent head script uses `is:inline define:vars` — CRITICAL, do not remove `is:inline`

**Critical technical notes:**
- `is:inline` on the consent head script is mandatory — without it Astro defers it and GTM fires before consent defaults
- `output: 'hybrid'` does NOT exist in Astro v6 — API routes use `export const prerender = false`
- Netlify adapter (`@astrojs/netlify`) is now installed — API routes become Netlify Functions automatically
- GA4 client_id parsed from `_ga` cookie (not UUID)
- GCLID + UTM params persisted to sessionStorage across page navigation
- Booking deduplication via sessionStorage (survives navigation)
- Cliniko uses URL pattern detection — NOT postMessage
- GA4 API secret stays server-side — never in browser source

**Environment variables for every client deploy (Netlify dashboard):**
```
GA4_API_SECRET=        ← from GA4 → Admin → Data Streams → Measurement Protocol API secrets
GA4_MEASUREMENT_ID=    ← G-XXXXXXXXXX
SITE_ORIGIN=           ← https://clientsite.co.uk
```

**Design standards:**
- No inline styles ever (`style=""` is banned)
- Class-based styling only (Tailwind utilities or stylesheet classes)
- All images: `<picture>` with `.avif` primary + `.webp` fallback + `decoding="async"`
- Header and footer must be global/shared — never duplicated per page

**Agent workflow (mandatory for important builds):**
IA reviewer → UI designer → Frontend builder → Visual QA → a11y → Performance → SEO → Marketing → Security → Conversion

### Handoff Note

Cookie consent is complete and committed at v1.3.0. Next session should start with testing (`npm run dev`) and then proceed to any new client page build. When building a client site, the first step is always to fill in `src/config/cookie-consent.config.ts` with the client's GTM ID, GA4 ID, and set `debug: true` temporarily to verify consent signals in the browser console.
