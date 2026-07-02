# Cookie Consent Mode v2 — Astro Implementation (Final Pattern)

> **Status: FINAL, production-verified** on physiolounge.co.uk (2026-07-02, PSI mobile 97 / LCP 2.4s with this exact stack live).
> This document is written so ANY model or developer can audit or re-apply the pattern safely.
> Read the whole "Safe vs Dangerous" section before touching anything.

## What this stack is

Three files work together on every HMDG Astro site:

| File | Role |
|---|---|
| `src/config/cookie-consent.config.ts` | Marketing-editable config: IDs (env-driven), banner copy, categories, booking platforms. No logic. |
| `src/layouts/BaseLayout.astro` | **Head:** synchronous Consent Mode v2 defaults + returning-visitor restore. **End of body:** deferred GTM loader. |
| `src/components/CookieConsent.astro` | Banner + preferences modal UI, consent cookie read/write, `gtag('consent','update')` firing, Universal Booking Tracker, server-side GA4 Measurement Protocol relay. |

Mode selection is env-driven: `PUBLIC_GTM_ID` alone → GTM mode (standard). `PUBLIC_GTAG_ID` alone → gtag-direct mode. Zaraz is NOT part of this pattern (future migration idea only — if you find Zaraz on a project, stop and ask).

## 1. Required consent DEFAULT state (head, synchronous, first script)

Must be an `is:inline` **classic** script in `<head>`, BEFORE any other script. Astro defers module scripts — if this ever becomes a module, GTM can fire before defaults are set and Consent Mode v2 is broken.

```js
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  analytics_storage:       'denied',
  ad_storage:              'denied',
  ad_user_data:            'denied',   // required by Consent Mode v2
  ad_personalization:      'denied',   // required by Consent Mode v2
  functionality_storage:   'denied',
  personalization_storage: 'denied',
  security_storage:        'granted',
  wait_for_update:         500,
});

gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
```

**Rules learned the hard way:**
- **NEVER add `region: ['GB']`** (or any region scoping). Visitors outside the listed regions get NO default at all — Google treats that as consent-undetermined and may fire signals. This was a real GDPR gap found in audit. Denied-by-default must be GLOBAL. UK visitors lose nothing.
- `url_passthrough` preserves gclid/dclid across internal navigation while ad_storage is denied → Ads attribution survives a deny-then-accept journey. `ads_data_redaction` redacts ad identifiers in cookieless pings while denied; ignored when granted. Both are set ONCE, before any update.
- Immediately after the default, the same script restores a returning visitor's stored consent from the `hmdg_cookie_consent` cookie via `gtag('consent','update', …)` and exposes `window.__hmdgConsentRestored` so the GTM loader can eager-load for previously-consented visitors.

## 2. Required consent UPDATE behaviour

All three user actions route through one function (`fireConsentUpdate` in CookieConsent.astro) which must:
1. `gtag('consent', 'update', {…})` mapping categories → Google signals (mapping below)
2. `dataLayer.push({event: 'hmdg_consent_update', …})` for GTM triggers
3. `window.dispatchEvent(new CustomEvent('hmdg:consent-update', {detail}))` — the GTM loader listens for this and loads gtm.js the moment analytics or marketing is granted

**Category → Google signal mapping (must be IDENTICAL in the BaseLayout restore block and CookieConsent's update):**

| Cookie category | Google consent signals |
|---|---|
| analytics | `analytics_storage` |
| marketing | `ad_storage` + `ad_user_data` + `ad_personalization` |
| functional | `functionality_storage` + `personalization_storage` |
| performance | (none — Google has no performance signal; site-internal only) |
| necessary | always granted, maps to `security_storage` |

- **Accept All** → all categories true → all signals granted → GTM loads instantly (via the CustomEvent).
- **Reject All** → all false → all signals denied. GTM may STILL load later (interaction / 12s fallback) — that is **Google advanced consent mode**, deliberate: gtm.js runs storage-less, sends cookieless pings, enables modelled conversions. Do not "fix" this.
- **Custom Save** → only the ticked categories granted; the update fires the exact per-category state.
- Consent persists in a JSON cookie (`hmdg_cookie_consent`, 180 days, SameSite=Lax, Secure on https, carries `policyVersion` — bumping policyVersion in config forces site-wide re-consent).

## 3. Safe GTM loading strategy (the PSI protector)

GTM (~150–220 KB JS) is NEVER loaded during initial paint. The loader (end of `<body>`, `type="module"`) loads gtm.js on the FIRST of:
1. **Restored consent** (returning consented visitor) — same render tick, no waiting
2. **`hmdg:consent-update` event** with analytics or marketing granted — instant on Accept
3. **High-intent click** (booking link, `tel:`, `mailto:`)
4. **First `pointerdown`/`keydown`**
5. **12-second `setTimeout` fallback**

Rules:
- The 12s fallback must NEVER go below ~8s — Lighthouse's observation window ends ~5–7s; going lower puts ~150ms of gtm.js parse into TBT and tanks the PSI score.
- `dataLayer` + the `gtm.start` push run synchronously up-front so any early `dataLayer.push()` queues correctly and GTM consumes the queue when it boots.
- As of 2026-07-02, ALL HMDG projects and both base templates (Cloudflare + Netlify) run the physiolounge loader (consent-triggered + intent + interaction + 12s fallback). No older rIC 10s / 6s variants remain in active codebases.

## 4. Server-side Measurement Protocol relay — MUST be consent-gated

The Universal Booking Tracker posts booking events (GA4 client_id, gclid, UTMs) to `/api/book-now` and `/api/booking-complete`. **The `_ga` cookie outlives a later Reject All**, so "has a client_id" ≠ "has consent". `fireMPEvent()` must start with:

```js
function hasTrackingConsent() {
  var stored = readCookie();
  return !!(stored &&
    stored.policyVersion === CCM.policyVersion &&
    (stored.analytics || stored.marketing));
}
// first line of fireMPEvent():
if (!hasTrackingConsent()) { log('MP skipped — analytics/marketing consent not granted'); return; }
```

Do NOT gate `dataLayer.push` calls — GTM tags are consent-aware on their own. Expect a small, correct drop in server-side event counts after applying this (those were non-consented events).

## 5. Booking postMessage matchers — static functions, never eval

`setupPostMessageListener()` uses a static `BOOKING_MATCHERS` object (calendly, acuity, youcanbook, jane, simplybook, phorest, timely). The old pattern evaluated config strings via `new Function()` — eval-adjacent, becomes code injection the day config moves to a CMS. The config's `bookingCompletionMatchers` strings are **documentation only** now; `scriptConfig` must NOT serialise them. Keep both in sync if a platform changes its postMessage format.

## 6. Performance guarantees (how this stays PSI-safe)

Measured on physiolounge (Lighthouse 13, 4× CPU throttle):
- Consent head script ≈ 3 KB, ~0.5 ms parse — must stay synchronous; it is NOT the bottleneck.
- Banner/modal/FAB are all `position: fixed` → **CLS 0.000 by construction**. Never change to sticky/in-flow.
- Boot task ≈ 22 ms (under the 50 ms long-task threshold). Two protections keep it there:
  - `isBookingUrl()` fast-exits non-absolute hrefs BEFORE `new URL()` (otherwise every relative link throws — 24 throw/catch cycles per page).
  - `processAllBookingLinks()` + the MutationObserver are deferred to `requestIdleCallback` (2s timeout; `setTimeout(…, 200)` fallback). Banner show, button wiring, postMessage listener, and thank-you URL detection stay synchronous.
- gtm.js never appears in the Lighthouse window for a first-time visitor (verified in traces).
- `prefers-reduced-motion` disables all banner/modal transitions.

## 7. Safe changes vs DANGEROUS changes

**Safe (marketing team / any model):** banner copy, category descriptions, policyVersion bump (forces re-consent), tracking IDs via env vars, cookie expiry days, enabling/disabling booking platforms via env.

**Dangerous — never do without explicit approval and re-measurement:**
- Adding `region:` scoping to the consent default
- Making the head consent script `type="module"`, `async`, `defer`, or moving it after other scripts
- Lowering the GTM fallback below 8s, or loading gtm.js eagerly
- Renaming `hmdg_cookie_consent` on a live site (destroys existing consent)
- Removing `wait_for_update`, `url_passthrough`, or `ads_data_redaction`
- Gating `dataLayer.push` calls on consent (breaks GTM's own consent-aware triggers)
- Un-gating `fireMPEvent` (reintroduces the compliance leak)
- Reintroducing `new Function()` / eval for matchers
- Changing banner positioning away from `position: fixed`
- Removing the `<noscript>` GTM iframe fallback

## 8. Per-project implementation checklist

1. `git fetch` + status. Pull `--ff-only` ONLY if the tree is clean; never merge blindly, never push without explicit instruction.
2. Locate `gtag('consent', 'default'` in the layout: remove any `region:` line; confirm all-denied + `security_storage: 'granted'` + `wait_for_update: 500`.
3. Add `gtag('set', 'url_passthrough', true)` + `gtag('set', 'ads_data_redaction', true)` after the default (if absent).
4. In CookieConsent.astro: add `hasTrackingConsent()` + gate at the top of `fireMPEvent()` (if the MP relay exists).
5. Replace `new Function()` matcher eval with static `BOOKING_MATCHERS`; stop serialising `bookingCompletionMatchers` in `scriptConfig`; mark the config field documentation-only.
6. Add the `isBookingUrl` fast-exit guard; defer `processAllBookingLinks()` + `watchForNewBookingLinks()` to `requestIdleCallback`.
7. Check for project-specific tracking (Zaraz, direct gtag, extra pixels) — document, do not remove. Preserve all IDs/env.
8. `npm run build` — must pass. Grep built HTML: no `region:` in the default; `url_passthrough`, `ads_data_redaction`, `hasTrackingConsent`, `BOOKING_MATCHERS` present; `new Function('e', 'data'` absent; GTM loader + noscript intact.
9. Leave changes uncommitted (or commit locally if the project's workflow says so). NEVER push without the user's explicit instruction.

## 9. Testing checklist (manual, per site)

**Accept All:** fresh profile/incognito → banner shows → DevTools Network open → click Accept All → `gtm.js` request fires immediately → Application → Cookies → `hmdg_cookie_consent` all true → `dataLayer` in console shows `consent default` (denied) then `consent update` (granted) then `gtm.js` — in that order.

**Reject All:** fresh profile → Reject All → cookie all false → NO `gtm.js` yet → click any Book Now link → NO request to `/api/book-now` (gate working) → after interaction/12s `gtm.js` may load (advanced mode — correct) → no `_ga` cookies get set.

**Custom:** Customise → tick Analytics only → Save Preferences → cookie shows `analytics:true, marketing:false` → `dataLayer` update shows `analytics_storage:'granted'`, `ad_storage:'denied'` → GA4 tags fire, Ads tags stay storage-less.

**Reopen + persistence:** reload → banner does NOT reappear → floating cookie FAB present → preferences reopen with saved states → bump `policyVersion` in config → banner reappears for everyone.

## 10. Verification tooling

- **DevTools:** `window.dataLayer` (ordering), Application→Cookies (`hmdg_cookie_consent`, `_ga*`), Network filter `gtm.js` / `collect` / `api/book`.
- **Google Tag Assistant (tagassistant.google.com):** connect to the site → Consent tab shows Default (all denied) → Update rows per user action.
- **GTM Preview:** container Preview → verify tags hold on denied signals and fire on granted ones. Any tag misbehaving here is configured in the GTM CONTAINER, not in this codebase.
- **GA4 DebugView:** add `?gtm_debug=x` or enable debug mode → accept → events stream in with consent state attached.
- **PageSpeed Insights:** run pagespeed.web.dev mobile before/after → gtm.js must NOT appear in the trace for first-time loads; expect zero score change from this stack. If TBT jumps, someone shortened the GTM fallback — see Section 3.

## Reference implementation

The canonical files live in the physiolounge project (and this template mirrors them):
`Cloudflare/Physiolounge Project/physiolounge/src/{layouts/BaseLayout.astro, components/CookieConsent.astro, config/cookie-consent.config.ts}` — commits `e60a82a` (consent) and `e84398b` (LCP context). Full audit trail in that project's `.project-log.md`, entries dated 2026-07-02.
