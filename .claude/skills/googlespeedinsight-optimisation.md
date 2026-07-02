# Google PageSpeed Insights — Mobile LCP/FCP Optimisation (Working Solution)

> **Status: PRODUCTION-VERIFIED** on physiolounge.co.uk, 2026-07-02.
> Result: mobile LCP **2.7s → 2.4s**, Speed Index 4.4s → ~1.5s, performance score **97**, with zero design change and all tracking/consent intact.
> This guide is written step-by-step so ANY model (including older ones like Opus) can execute it safely on any HMDG Astro + Sanity + Cloudflare project.
> **Read the "Dangerous changes" section before touching anything.**

---

## 1. The problem we had

Google PageSpeed Insights (mobile) reported: FCP 1.8s, **LCP 2.7s** (target ≤ 2.5s), Speed Index 4.4s. TBT and CLS were already green. Desktop was fine. Several earlier attempts (CSS externalisation, JSON-LD deferral, image srcsets) had helped but did not close the gap.

## 2. The real root cause (this is the part everyone gets wrong)

**The mobile LCP element was NOT the hero image. It was the hero H1 text.**

Lighthouse's `lcp-breakdown-insight` showed the whole FCP→LCP gap was "element render delay". In the *real* browser trace the H1 painted in the same frame as FCP — the delay only existed in PSI's **simulated** throttling model (called "lantern"). Lantern counts these against a text LCP element:

1. **Every webfont request started before LCP.** The heading serif font (42 KB `.woff2`) was preloaded on every page — including mobile, where the H1 deliberately painted with a size-adjusted Georgia fallback and never used the file. 42 KB at slow-4G ≈ 0.2–0.4s of simulated LCP for a file mobile never painted with.
2. **Third-party origins on the above-the-fold critical path.** The header logo had migrated to `cdn.sanity.io` URLs — a DNS+TCP+TLS handshake (2–3 round trips ≈ 300–450ms on 4G) before the header could paint. No resource hint existed for that origin.
3. Secondary: page HTML weight (inline SVGs, inline scripts) inflating parse time and Speed Index.

**Lesson: before optimising anything, find out WHAT the LCP element actually is** (Section 7 shows how). If it's text, image tricks won't help; if it's an image, font tricks won't help.

## 3. The exact solution implemented

Three changes, in this order:

### Fix A — stop mobile from downloading the heading font it never paints with

**File: `src/layouts/BaseLayout.astro`** — gate the serif font preload to desktop:

```html
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/LTSuperiorSerif-Regular.woff2"
      crossorigin="anonymous" fetchpriority="low"
      media="(min-width: 768px)" />
```

**File: `src/styles/global.css`** — at the END of the file, override the heading font token on mobile so NO element references the real webfont below 768px (Chrome then never downloads it at all):

```css
@media (max-width: 767px) {
  :root {
    --font-display: 'LT Superior Serif Fallback', Georgia, 'Times New Roman', serif;
  }
}
```

`'LT Superior Serif Fallback'` is the size-adjusted Georgia `@font-face` (with `size-adjust` / `ascent-override` / `descent-override`) already defined at the top of global.css. **It occupies the same pixel box as the real serif**, so layout/wrapping/spacing are identical.

**Why this is design-safe:** the site uses `font-display: optional`, meaning on slow mobile connections the real serif never arrived within its 100ms block window anyway — mobile first-time visitors ALWAYS saw the Georgia fallback. This change only makes repeat visits match first visits. Desktop is completely untouched.

### Fix B — self-host Sanity brand assets (logo, favicons)

**File: `scripts/sync-sanity-globals.mjs`** — a `selfHostAsset()` helper downloads each Sanity CDN brand asset into `public/logo/<sanity-content-hash>.<ext>` at build time and writes the LOCAL path into the generated globals file. Sanity Studio remains the source of truth (editors swap the logo in the CMS; the next build picks it up); visitors never touch cdn.sanity.io for above-fold assets. Filenames contain Sanity's content hash so they're immutable-cache-safe under the existing `/logo/*` cache rule, and the helper fails soft (keeps the CDN URL) if a download errors so the build never breaks.

### Fix C — dns-prefetch (NOT preconnect) for cdn.sanity.io

**File: `src/layouts/BaseLayout.astro`**, with the other dns-prefetch hints:

```html
<link rel="dns-prefetch" href="https://cdn.sanity.io" />
```

**Measured A/B result (keep this):** a full `preconnect` consistently ADDED ~170ms to simulated mobile LCP (the TLS handshake competes with the critical path in the throttling model) while saving ~400ms of Speed Index. LCP ≤ 2.5s is the contractual target, so DNS-warm only. Only try upgrading to preconnect if PSI later shows LCP ≤ 2.3s headroom.

## 4. Why the solution works

PSI's simulated LCP for a text element = critical chain of {HTML document + render-blocking CSS + fonts + competing high-priority requests}. The fixes shrink that chain: the 42 KB font drops out entirely on mobile, the third-party handshake disappears from above-the-fold, and nothing new competes. Measured on physiolounge: **H1 element render delay 1322ms → 351ms** locally; production LCP 2.7 → 2.4s.

## 5. Files changed (complete list)

| File | Change |
|---|---|
| `src/layouts/BaseLayout.astro` | `media="(min-width: 768px)"` on the serif preload; `dns-prefetch` for cdn.sanity.io |
| `src/styles/global.css` | mobile `--font-display` override appended |
| `scripts/sync-sanity-globals.mjs` | `selfHostAsset()` — downloads brand assets locally at build |
| `src/data/sanity-globals.generated.ts` | regenerated with local `/logo/...` paths |
| `public/logo/` | downloaded brand asset files (commit them so fallbacks always resolve) |

Nothing else. No page templates, no components, no hero markup, no tracking, no consent files.

## 6. Safe order of execution

1. Read the project's `.project-log.md` first. `git fetch` + pull/merge; verify `npm run build` passes BEFORE touching anything.
2. **Diagnose first** (Section 7) — confirm the LCP element and its breakdown. Do not assume this guide's root cause applies until you see "element render delay" on a text node or an equivalent signal.
3. Apply Fix A (font gating). Rebuild. Measure.
4. Apply Fix B (self-hosted brand assets) if the project loads its logo/favicons from cdn.sanity.io. Rebuild. Verify local paths in the built HTML.
5. Apply Fix C (dns-prefetch). Rebuild.
6. Run the verification (Sections 7–8) and the final checklist (Section 15).
7. Commit locally. **NEVER push without the user's explicit instruction.**

## 7. How to verify locally (exact commands)

Local Lighthouse reproduces PSI's model. Three rules learned the hard way:
- **Pre-compress** dist text assets (gzip/brotli via a small Node script) and serve with `npx http-server dist/client -p 8791 --gzip --brotli -s` — uncompressed serving inflates every metric ~40% and misleads you.
- **Run 3× and compare medians** — single runs vary ±150ms. Never measure while a build or other heavy process is running.
- **Never edit dist files with PowerShell** `Get-Content`/`Set-Content` — PowerShell 5.1 reads UTF-8 as ANSI and silently corrupts multi-byte characters (this once caused a phantom 83 KB latin-ext font fetch that invalidated a whole experiment round). Use Node scripts for any dist inspection/surgery.

```
npm run build
npx lighthouse http://localhost:8791/ --only-categories=performance --output=json --output-path=lh.json --chrome-flags="--headless=new"
```

Then read from the JSON (Lighthouse 13+): `audits['lcp-breakdown-insight']` → gives the LCP node + subpart durations ("Time to first byte", "Element render delay"). Also check `audits['network-requests']` filtered to `resourceType === 'Font'` — on a mobile run, the heading serif must be ABSENT after Fix A (only the body font remains).

Success criteria locally: element render delay collapses (physiolounge: 1322 → ~350ms), FCP/SI stable or better, no new font requests, hero image preloads unchanged.

## 8. How to verify on Google PageSpeed Insights

1. Push/deploy (only with explicit user permission), wait for the Cloudflare build to go live (check a marker string from your change in the served HTML).
2. Run https://pagespeed.web.dev/ → mobile → the homepage. (The free PSI API rate-limits quickly without a key — the web UI is more reliable.)
3. Check: LCP ≤ 2.5s, the LCP element in the diagnostics, no "preconnect to required origins" or font warnings, TBT/CLS still green.
4. If LCP is 2.3s or better and Speed Index is the remaining orange metric, THEN consider upgrading the Sanity dns-prefetch to preconnect and re-measure.

## 9. DANGEROUS changes — never do these (they break design or the fix)

- ❌ Removing or un-gating the size-adjusted fallback `@font-face` (`size-adjust`/`ascent-override` block) — headings would visibly resize/reflow.
- ❌ Applying the mobile font override with a DIFFERENT fallback stack than the size-adjusted one — text would wrap differently and break hero composition.
- ❌ Making the render-blocking CSS `<link>` async/deferred (media="print" tricks) — full-page FOUC.
- ❌ Re-enabling the Beasties/critters critical-CSS integration — incompatible with Tailwind v4 `@layer` output; it strips `:root` variables and breaks colours/fonts sitewide (documented in `astro.config.mjs`).
- ❌ Setting `inlineStylesheets: 'always'` — inlines ~140 KB CSS per page; this was a previous root cause of LCP > 4s.
- ❌ Changing hero markup: the `<picture>` with mobile `<source>`, the dual media-gated preloads in BaseLayout, `loading="eager"` + `fetchpriority="high"` on the hero img, explicit width/height. Any of these regresses LCP or CLS.
- ❌ Lazy-loading anything above the fold, or eager-loading everything below it.
- ❌ Removing the `preload` for the hero image, or letting the preload URL/srcset drift from the `<img>`/`<source>` values (mismatch = double download).
- ❌ Removing tracking scripts, GTM, gtag, cookie consent, forms, booking widgets, or ANY client functionality "for speed". Never acceptable.

## 10. Keeping marketing tracking working (gtag / GTM / Zaraz)

The tracking stack is ALREADY PSI-safe by design — do not "optimise" it further:
- GTM loads via the deferred loader at the end of `<body>`: instantly on consent-Accept, eagerly for returning consented visitors, on intent/interaction otherwise, with a **12-second fallback that must never drop below ~8s** (below that, gtm.js lands inside the Lighthouse window and adds ~150ms TBT).
- The Consent Mode v2 default script in `<head>` must stay synchronous `is:inline` — it is ~3 KB and is NOT a performance problem.
- Zaraz is not used on HMDG projects (comments only). If you find active Zaraz on a project, stop and ask the user before touching it.
- Full tracking/consent spec: `.claude/skills/cookie-consent-mode-v2-astro-implementation.md` (in the base template). Nothing in THIS guide requires touching any tracking file.

## 11. Keeping cookie consent working

The consent banner is `position: fixed` (zero CLS), boots after DOMContentLoaded, and its heavy work is already idle-deferred. LCP work never requires editing `CookieConsent.astro` or `cookie-consent.config.ts`. If a PSI trace ever shows the banner as the LCP element (very large viewports), do NOT delay the banner — that has GDPR timing implications; ask the user.

## 12. Not breaking Sanity image fetching

- Sanity CDN (`cdn.sanity.io`) stays the source for content images (carousels, team, about, desktop hero). Do NOT rewrite `urlFor()` calls or download content images locally — only BRAND assets (logo, favicons) are self-hosted, via the build-time sync script with fail-soft fallback.
- Keep `urlFor(...).width(w).auto('format').quality(q)` srcset patterns intact — they serve correctly-sized AVIF/WebP per device.
- Build-time Sanity note: builds fetch with `prerenderEnvironment: 'node'` and fail-soft catches (see `.project-log.md` 2026-07-01). Don't change `src/lib/sanity.ts` timeouts/retries as part of performance work.
- After changing the sync script, verify the generated `sanity-globals.generated.ts` contains local `/logo/...` paths AND that the files exist in `public/logo/`.

## 13. Not breaking hero layout / responsive / above-the-fold

- The mobile font override MUST use the size-adjusted fallback family (same pixel box). Check hero H1 wrapping at 320px, 375px, 430px after the change — it should be pixel-identical.
- Do not change hero heights (`min(100svh,1000px)` pattern), overlay gradients, or content positioning.
- The mobile hero image (`<source media="(max-width: 767px)">`) and its matching preload must stay in lockstep — same URLs, same srcset, same sizes.
- After edits, do a visual pass at mobile/tablet/desktop/ultrawide (project responsive QA rule) — the whole point is that this optimisation is INVISIBLE.

## 14. Optimising LCP without removing client functionality

The hierarchy of levers, best first — all preserve functionality:
1. Remove non-painting resources from the mobile critical chain (fonts the viewport never uses — Fix A).
2. Move above-fold assets to first-party (Fix B).
3. Right resource hints, measured not assumed (Fix C — measure preconnect vs dns-prefetch per project).
4. Correctly sized, preloaded hero media with exact preload↔markup parity.
5. Shrink HTML weight (deduplicate repeated inline SVGs via `<symbol>`/`<use>`, externalise large inline scripts) — bigger refactors, do only with user approval.
6. NEVER: removing features, tracking, consent, or design elements. If the target can't be met without that, report the trade-off to the user instead of acting.

## 15. Final checklist — complete ALL before saying "done"

- [ ] Read `.project-log.md`; pulled + merged; baseline build passed
- [ ] Confirmed the actual LCP element via `lcp-breakdown-insight` BEFORE changing anything
- [ ] Fix A applied: serif preload media-gated + mobile `--font-display` override (size-adjusted fallback stack)
- [ ] Fix B applied where relevant: brand assets self-hosted, generated globals show `/logo/...` local paths, files committed
- [ ] Fix C applied: `dns-prefetch` for cdn.sanity.io (NOT preconnect unless measured)
- [ ] `npm run build` passes with zero errors
- [ ] Built HTML checked (Node script, not PowerShell string ops): no serif font request on mobile, local logo paths, hero preloads intact, GTM loader + noscript + Consent Mode default all present and unchanged
- [ ] Local Lighthouse ×3 on compressed dist: element render delay collapsed; FCP/SI not regressed
- [ ] Visual check at 320/375/768/1440px: hero, header, headings pixel-identical
- [ ] Cookie banner still appears, Accept/Reject still fire (spot-check dataLayer in DevTools)
- [ ] `.project-log.md` updated with what was done + next action
- [ ] Committed locally; NOT pushed (wait for the user's explicit push command)
- [ ] After user-approved deploy: PSI mobile re-run shows LCP ≤ 2.5s; report the numbers

---

*Reference implementation: physiolounge commits `e84398b` (LCP fixes) and `e60a82a` (consent hardening). Full investigation trail: physiolounge `.project-log.md`, entries dated 2026-07-02.*
