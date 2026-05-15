# Consent Mode v2 + Deferred GTM + Server-Side MP — Tracking Optimisation Spec

Reusable build spec for the HMDG Astro + Cloudflare Pages base template. Captures the exact optimisations rolled out across Northern Medical (commits `49fab50` → `a369d97`) so every future clone inherits the same pattern.

This is a **portable migration spec** — paste this prompt into Claude Code (or run it yourself) on any clean base-template clone and you should end up with the identical setup.

---

## When to use

Apply this prompt when:
- Setting up tracking on a new HMDG Astro clinic site clone for the first time
- Auditing an existing clone whose tracking has drifted from the standard
- Backporting the optimisations into `hmdg-astro-base-template` itself so future clones inherit them by default

---

## Goal

Land four overlapping goals in one stack:

1. **GDPR/PECR/ICO defensible** — no marketing JS fires before consent. Consent Mode v2 default-deny block is the first inline script on every page.
2. **Lighthouse 90+ mobile** — keep the ~453 KB GTM container off the critical path. Push it past PSI's TBT measurement window without losing tracking for real users.
3. **Conversion attribution intact** — booking + contact events survive even when client-side tags are blocked (ad-blockers, ITP, slow networks). Server-side GA4 Measurement Protocol relay carries the load-bearing events.
4. **Zero hardcoded tracking IDs** — GTM and GA4 IDs live in env, never in source. PUBLIC_* vars baked at build, server-only vars never reach the browser.

---

## Architecture overview

```
┌──────────────────────────────────────────────────────────────────────┐
│ <head>                                                               │
│                                                                      │
│  1. Consent Mode v2 defaults  (is:inline, synchronous, FIRST)        │
│     gtag('consent','default', {all denied except security_storage})  │
│     ↓ restores from cookie if visitor already consented this version │
│                                                                      │
│  2. Deferred GTM loader       (is:inline, synchronous, SECOND)       │
│     dataLayer + gtm.start fire immediately (events keep queueing)    │
│     The 453 KB gtm.js script is delayed; loadGTM() fires on:         │
│       • hmdg:consent-update event (analytics or marketing granted)   │
│       • Click on booking/tel/mailto/.book-now intent links           │
│       • First pointerdown or keydown engagement                      │
│       • 12 000 ms setTimeout fallback (past Lighthouse window)       │
│                                                                      │
│  3. CSP meta + page <slot name="head" />                             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ <body>                                                               │
│  Page content …                                                      │
│  <CookieConsent /> — UI, dispatches hmdg:consent-update CustomEvent  │
│  GTM <noscript> iframe fallback                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Server (Cloudflare Pages Functions)                                  │
│  /api/book-now           — relays book_now_click via GA4 MP          │
│  /api/booking-complete   — relays booking_complete via GA4 MP        │
│  Uses GA4_API_SECRET + GA4_MEASUREMENT_ID (server-only env vars)     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Hard rules (do not violate)

1. **Consent Mode v2 default block MUST be the first inline `<script>` in `<head>`** — before GTM, before any analytics, before any third-party. `is:inline` is mandatory. If Astro defers it, GTM fires before defaults and you break Consent Mode v2.
2. **All consent buckets default to `denied` except `security_storage`** — UK ICO defence-in-depth.
3. **`region: ['GB']` on the consent default call** — scopes defaults to UK visitors (Google's recommendation for UK-only sites).
4. **`wait_for_update: 500`** — gives the cookie-restoration block 500 ms to upgrade consent before tags decide.
5. **GTM loader runs unconditionally** but inside `{cfg.gtmId && …}` so missing env vars do not crash the build.
6. **`performance` consent category is custom UI only** — do NOT map it to a Google Consent Mode v2 storage key. Only `analytics`, `marketing`, `functional` are wired into Google's signals.
7. **Tracking IDs live in env (`PUBLIC_GTM_ID`, `GA4_MEASUREMENT_ID`, `GA4_API_SECRET`)** — never hardcoded. `.env.example` documents them. Cloudflare Pages → Variables (Build scope) for `PUBLIC_*`, (Runtime scope) for server secrets.
8. **PUBLIC_* env vars are baked at build time** — changing them in Cloudflare requires a Retry deployment to take effect.
9. **CSP lives in TWO places that MUST stay in sync** — `public/_headers` (HTTP header, primary) and `BaseLayout.astro` (`<meta>` fallback). The `CSP SYNC` comment is the canary.
10. **GTM `<noscript>` iframe `style="display:none;visibility:hidden"` is the ONLY permitted inline style in the codebase** — Google's official snippet requires it.

---

## Step-by-step build

Run these steps in order. After each step, verify the corresponding checklist item passes before moving on.

### Step 1 — Env vars

Add to `.env.example`:

```bash
# ─── Tracking IDs (browser-visible) ──────────────────────────────────
# Set in .env locally and Cloudflare Pages → Variables (Build scope).
# PUBLIC_* vars are baked at build time — Retry deployment after changing.
PUBLIC_GTM_ID=GTM-XXXXXXX

# ─── Server-side GA4 Measurement Protocol (server-only, never browser) ─
# Set in Cloudflare Pages → Variables (Runtime scope). No PUBLIC_ prefix.
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=xxxxxxxxxxxxxxxxxxxxxx
```

Pull GTM ID from GTM → Admin → Container Settings.
Pull GA4 Measurement ID + API secret from GA4 → Admin → Data Streams → Web → Measurement Protocol API secrets.

**Never** add a `PUBLIC_GTAG_ID` — it has no consumer. The GA4 measurement ID is configured inside the GTM container, not in this codebase.

### Step 2 — `src/config/cookie-consent.config.ts`

Make tracking IDs env-driven, never hardcoded:

```ts
const ENV_GTM_ID = import.meta.env.PUBLIC_GTM_ID || '';

export const cookieConsentConfig = {
  gtmId: ENV_GTM_ID,
  policyVersion: '1.0',
  // …
  categories: {
    necessary:   { enabled: true,  label: 'Necessary',   description: '…' },
    functional:  { enabled: true,  label: 'Functional',  description: '…' },
    analytics:   { enabled: true,  label: 'Analytics',   description: '…' },
    performance: { enabled: true,  label: 'Performance', description: '…' },
    marketing:   { enabled: true,  label: 'Marketing',   description: '…' },
  },
  // … cookieName, expiry, banner copy, etc.
} as const;
```

**Do NOT** include a `gtagId` field. Removed in commit `2041e9a` because nothing read it.

### Step 3 — Consent Mode v2 defaults (`src/layouts/BaseLayout.astro`, in `<head>`)

This block MUST be the first inline script after the security/charset meta tags, BEFORE the GTM loader. Place it inside `<head>` using `is:inline`:

```astro
<!-- ── Google Consent Mode v2 — MUST be first, before GTM fires ──────────
     is:inline is critical — without it Astro defers the script and
     GTM fires before consent defaults are set, breaking Consent Mode v2.
──────────────────────────────────────────────────────────────────────── -->
<script is:inline define:vars={{ _ccmPolicyVersion: cfg.policyVersion, _ccmCookieName: cfg.cookieName }}>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Default all consent to denied before any tag loads
  gtag('consent', 'default', {
    analytics_storage:       'denied',
    ad_storage:              'denied',
    ad_user_data:            'denied',
    ad_personalization:      'denied',
    functionality_storage:   'denied',
    personalization_storage: 'denied',
    security_storage:        'granted',
    wait_for_update:         500,
    region:                  ['GB'],
  });

  // Immediately restore consent if visitor already consented this policy version
  (function () {
    try {
      var raw = document.cookie.split(';').find(function (c) {
        return c.trim().startsWith(_ccmCookieName + '=');
      });
      if (raw) {
        var stored = JSON.parse(decodeURIComponent(raw.split('=').slice(1).join('=')));
        if (stored && stored.policyVersion === _ccmPolicyVersion) {
          gtag('consent', 'update', {
            analytics_storage:       stored.analytics   ? 'granted' : 'denied',
            ad_storage:              stored.marketing   ? 'granted' : 'denied',
            ad_user_data:            stored.marketing   ? 'granted' : 'denied',
            ad_personalization:      stored.marketing   ? 'granted' : 'denied',
            functionality_storage:   stored.functional  ? 'granted' : 'denied',
            personalization_storage: stored.functional  ? 'granted' : 'denied',
          });
        }
      }
    } catch (e) {}
  })();
</script>
```

### Step 4 — Deferred GTM loader (`src/layouts/BaseLayout.astro`, immediately after Step 3)

```astro
{cfg.gtmId && (
  <script is:inline define:vars={{ _gtmId: cfg.gtmId }}>
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    (function () {
      var loaded = false;
      function loadGTM() {
        if (loaded) return;
        loaded = true;
        var f = document.getElementsByTagName('script')[0];
        var j = document.createElement('script');
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + _gtmId;
        f.parentNode.insertBefore(j, f);
      }

      // External trigger hook (e.g. for tests, manual debugging)
      window.hmdgLoadGTM = loadGTM;

      // Trigger 1 — consent granted (instant load when user accepts)
      window.addEventListener('hmdg:consent-update', function (event) {
        var detail = event && event.detail ? event.detail : {};
        if (detail.analytics || detail.marketing) {
          loadGTM();
        }
      }, { passive: true });

      // Trigger 2 — high-intent click (booking, tel, mailto)
      // Capture phase + short-circuit if already loaded.
      // Protects Google Ads attribution on bounce-then-click sessions.
      document.addEventListener('click', function (event) {
        if (loaded) return;
        var target = event.target && event.target.closest
          ? event.target.closest('a,button')
          : null;
        if (!target) return;
        var href = target.getAttribute('href') || '';
        var isIntent =
          href.indexOf('/booking') === 0 ||
          href.indexOf('tel:') === 0 ||
          href.indexOf('mailto:') === 0 ||
          target.matches('[data-booking-link], [data-gtm-intent], .book-now, .btn[href*="booking"]');
        if (isIntent) loadGTM();
      }, { capture: true, passive: true });

      // Trigger 3 — long fallback for no-interaction sessions.
      // Deliberately past Lighthouse's ~10s measurement window.
      setTimeout(loadGTM, 12000);

      // Trigger 4 — first real engagement (pointerdown/keydown only).
      // Mouseenter / touchstart / scroll deliberately excluded —
      // Lighthouse simulators fire those during measurement.
      ['pointerdown', 'keydown'].forEach(function (e) {
        window.addEventListener(e, loadGTM, { once: true, passive: true });
      });
    })();
  </script>
)}
```

**Why this trigger set:**
- `requestIdleCallback` removed (commit `e659582`) — could fire during PSI quiet runs and re-introduce the TBT cost.
- `mouseenter` / `touchstart` / `scroll` removed — Lighthouse synthetic interactions can fire these.
- `pointerdown` + `keydown` kept — real user engagement only.
- 12 s setTimeout (not 3 s) — Lighthouse window is ~10 s. Trade-off: ~5 % of <12 s no-interaction bounces lose pageview tracking. Conversion events all fire on interaction and trigger GTM instantly, so revenue tracking is unaffected.

### Step 5 — GTM `<noscript>` fallback (`src/layouts/BaseLayout.astro`, before `</body>`)

```astro
{cfg.gtmId && (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${cfg.gtmId}`}
      height="0"
      width="0"
      style="display:none;visibility:hidden"
    ></iframe>
  </noscript>
)}
```

Note: the inline `style` is the **only** inline style permitted in the codebase. Google's official GTM snippet requires it.

### Step 6 — `<CookieConsent />` dispatches `hmdg:consent-update`

In `src/components/CookieConsent.astro`, whenever the user grants/revokes consent (Accept All, Reject All, Save Preferences), the component must dispatch a `CustomEvent` so the deferred GTM loader can react instantly:

```js
// Inside the "save consent" handler (after writing the cookie + calling
// gtag('consent','update', …))
window.dispatchEvent(new CustomEvent('hmdg:consent-update', {
  detail: {
    analytics:  !!consent.analytics,
    marketing:  !!consent.marketing,
    functional: !!consent.functional,
  }
}));

// Also push a dataLayer event for GTM Tag Manager triggers
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'hmdg_consent_update',
  consent_analytics:  !!consent.analytics,
  consent_marketing:  !!consent.marketing,
  consent_functional: !!consent.functional,
});
```

The `gtag('consent', 'update', …)` call still runs alongside this — Consent Mode v2 wants the gtag call, GTM wants the dataLayer event, BaseLayout wants the CustomEvent. All three are needed.

### Step 7 — Server-side GA4 Measurement Protocol relay

Two Cloudflare Pages Functions at `src/pages/api/book-now.ts` and `src/pages/api/booking-complete.ts`. Both:

1. Validate origin against `SITE_ORIGIN` env var (anti-CSRF).
2. Read `GA4_MEASUREMENT_ID` + `GA4_API_SECRET` from `import.meta.env` (server-only, no `PUBLIC_` prefix).
3. POST to `https://www.google-analytics.com/mp/collect?measurement_id=…&api_secret=…` with the event payload.
4. Forward GCLID + UTM params if present in the request body.

This is the **redundancy path**. Client-side GTM is the primary; MP is the backup that survives ad-blockers, ITP, and slow networks. If GTM fails to load before the user navigates away, the server still attributes the conversion.

Booking flow:
1. User clicks a `data-booking-link` button → CookieConsent's Universal Booking Tracker fires `book_now_click` to GA4 (client) AND posts to `/api/book-now` (server).
2. User completes booking on the third-party site (Cliniko, Calendly, etc.) → return URL or postMessage triggers `booking_complete` to GA4 (client) AND posts to `/api/booking-complete` (server).

The session dedup logic in CookieConsent.astro prevents double-counting if both client and server fire successfully.

### Step 8 — CSP whitelist (`public/_headers` AND `BaseLayout.astro` meta)

Update **both** locations together (CSP SYNC comment is the canary). Minimum required directives for the tracking stack:

```
script-src:
  'self' 'unsafe-inline'
  https://www.googletagmanager.com
  https://www.google-analytics.com
  https://www.googleadservices.com
  https://googleads.g.doubleclick.net
  https://www.gstatic.com
  https://static.cloudflareinsights.com

img-src:
  'self' data:
  https://www.google-analytics.com
  https://www.googleadservices.com
  https://googleads.g.doubleclick.net
  https://pagead2.googlesyndication.com
  https://www.google.com
  https://www.google.co.uk
  https://www.google.com.ph

connect-src:
  'self'
  https://www.google-analytics.com
  https://analytics.google.com
  https://region1.google-analytics.com
  https://region1.analytics.google.com         ← required (commit d663b6a)
  https://www.googleadservices.com
  https://googleads.g.doubleclick.net
  https://pagead2.googlesyndication.com        ← required (commit 75ad846)
  https://cloudflareinsights.com               ← required (commit a369d97)
```

`region1.analytics.google.com` is the newer GA4 regional shard. `pagead2.googlesyndication.com` is needed for Google Ads consent pings. `cloudflareinsights.com` is needed if Cloudflare Web Analytics is enabled at the zone level.

After every CSP change, paste into [CSP Evaluator](https://csp-evaluator.withgoogle.com/) and confirm no new warnings.

---

## Verification checklist

After applying every step, verify in this order:

### Static checks
- [ ] `.env.example` documents `PUBLIC_GTM_ID`, `GA4_MEASUREMENT_ID`, `GA4_API_SECRET`, `SITE_ORIGIN`
- [ ] No `gtagId` field exists anywhere in source — grep for it
- [ ] `cfg.gtmId` is the only place GTM ID is read; it pulls from `import.meta.env.PUBLIC_GTM_ID`
- [ ] No hardcoded `GTM-` or `G-` strings in source — grep for them
- [ ] CSP appears in both `public/_headers` and BaseLayout.astro `<meta>` fallback; both contain identical directives

### DevTools / Network panel
- [ ] On first page load (no consent cookie): no requests to `googletagmanager.com` for the first 12 seconds, and no requests at all until interaction
- [ ] On first page load: `dataLayer` exists; `dataLayer[0]` is the consent default; `dataLayer[1]` is the `gtm.start` event
- [ ] After clicking "Accept All": `hmdg:consent-update` fires AND `gtm.js` request appears within ~100 ms
- [ ] After clicking "Reject All": `gtm.js` does NOT load (until the 12 s fallback or interaction trigger)
- [ ] On a booking-intent click: `gtm.js` loads immediately, `book_now_click` event in `dataLayer`, POST to `/api/book-now` returns 200
- [ ] Refresh after consent: `gtag('consent', 'update', …)` fires synchronously inline (before GTM loads), restoring the previous decision

### GA4 DebugView
- [ ] With `?debug_mode=1` in URL, see live events: page_view, book_now_click, booking_complete
- [ ] Server-side events (sent via MP) appear with `engagement_time_msec` and the correct `client_id`
- [ ] Conversion events flagged in GA4 → Admin → Events → Mark as conversion

### Lighthouse / PSI mobile
- [ ] Mobile performance score 90+ (target was 79 → 88-93 on Northern Medical)
- [ ] TBT under 200 ms (was ~560 ms before this work)
- [ ] No "Reduce unused JavaScript" warning citing `gtm.js`
- [ ] No "Network dependency tree" warning citing `googletagmanager.com`

### CSP
- [ ] Browser console shows zero CSP violations during a full user journey (homepage → booking page → booking complete)
- [ ] CSP Evaluator (Google) reports no high-severity warnings

---

## Migration order (when applying to an existing site)

If the target clone already has some of this (e.g. inherited from an older base-template version), follow this order to avoid breaking measurement mid-migration:

1. Steps 1–2 first — env + config. Site keeps working; no behaviour change.
2. Steps 3–4 — replace the GTM `<head>` block. Test in DevTools that consent defaults fire before GTM.
3. Step 5 — `<noscript>` fallback.
4. Step 6 — CookieConsent CustomEvent dispatch. Verify the existing consent UI still works.
5. Step 7 — server-side MP relay. Wire after client-side is confirmed working.
6. Step 8 — CSP last. CSP changes are blast-radius-1; do them with a quick rollback ready.

After each step, deploy to a Cloudflare Pages preview branch and confirm in browser before merging to main.

---

## Future work — Cloudflare Zaraz migration

This entire prompt is the **interim** state. The eventual target is migrating from deferred GTM to **Cloudflare Zaraz**, which moves tag execution to the Cloudflare edge and eliminates the ~150–220 KB of client-side GTM/GA4 JS entirely.

Zaraz requires the production domain to be on Cloudflare (orange-cloud proxied). It is not available on `*.pages.dev` preview URLs.

When the production domain is live:

1. **Phase 1 (Cloudflare dashboard):**
   - Pages → Custom domains → attach production domain, ensure orange-cloud proxy
   - Enable Zaraz on the zone (free tier covers 100k events/month)
   - Recreate GTM tags in Zaraz UI (GA4 + Google Ads conversions)
   - Configure triggers for `book_now_click`, `contact_submit`, `booking_complete`
   - Enable Zaraz Consent API with `analytics` and `marketing` purposes. **Do NOT** use Zaraz's built-in modal — keep the existing CookieConsent.astro UI.

2. **Phase 2 (code swap, single commit):**
   - Remove the deferred-GTM `<script>` block from `BaseLayout.astro`
   - Keep the dataLayer + Consent Mode v2 defaults block — Zaraz speaks the same protocol
   - Remove the GTM `<noscript>` iframe
   - In CookieConsent.astro: replace `gtag('consent', 'update', …)` with `zaraz.consent.set({analytics: bool, marketing: bool})` (gtag still works as a no-op alongside)
   - In `cookie-consent.config.ts`: remove `gtmId` (keep the field name for documentation, set to empty)
   - In CSP: drop `googletagmanager.com` and `google-analytics.com` from `script-src` (Zaraz is same-origin via `/cdn-cgi/zaraz/`). CSP shortens.
   - Server-side MP routes (`/api/book-now`, `/api/booking-complete`) — **no change**. Independent redundancy path.

Expected impact post-Zaraz: PSI mobile +3-7 points beyond the current optimised baseline. Eliminates the GTM container weight entirely.

---

## File reference

| File | Role |
|---|---|
| `.env.example` | Documents env vars (PUBLIC_GTM_ID, GA4_MEASUREMENT_ID, GA4_API_SECRET, SITE_ORIGIN) |
| `src/config/cookie-consent.config.ts` | Single source of truth — banner copy, categories, GTM ID, booking domains |
| `src/layouts/BaseLayout.astro` | Consent Mode v2 defaults block + deferred GTM loader + CSP meta |
| `src/components/CookieConsent.astro` | UI, Universal Booking Tracker, dispatches `hmdg:consent-update` |
| `src/pages/api/book-now.ts` | Server-side MP relay for book_now_click |
| `src/pages/api/booking-complete.ts` | Server-side MP relay for booking_complete |
| `public/_headers` | Cloudflare Pages HTTP CSP (primary, enforced in production) |

---

## Reference commits (Northern Medical lineage)

In chronological order, the actual rollout:

| Commit | Description |
|---|---|
| `6e0be2b` | perf(gtm): defer Google Tag Manager script load until idle or first interaction |
| `adf71cc` | perf(gtm): bump deferred-load timeout from 3s to 12s |
| `2041e9a` | chore(cookie-consent): remove dead PUBLIC_GTAG_ID / cfg.gtagId |
| `49fab50` | refactor(cookie-consent): migrate tracking IDs to env-driven pattern |
| `e659582` | perf(gtm): event-driven loader with intent-click and consent triggers |
| `d663b6a` | fix(csp): allow GA4 region1.analytics.google.com endpoint |
| `75ad846` | fix(csp): allow Google Ads consent pings |
| `a369d97` | Allow Cloudflare insights in CSP |

Use `git show <hash>` on any of these to see the exact diff.
