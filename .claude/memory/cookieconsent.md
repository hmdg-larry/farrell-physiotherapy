---
name: Cookie Consent Astro Implementation Plan
description: Full plan to port hmdg-cookie-consent WordPress plugin to Astro — marketing config, Consent Mode v2, booking tracker, debug console, UI improvements, and security model
type: project
---

# HMDG Cookie Consent — Astro Implementation Plan

> **HISTORICAL DOCUMENT — implementation is COMPLETE.** The cookie consent system
> ships in the template (`src/config/cookie-consent.config.ts` + `src/components/CookieConsent.astro`).
> All "Netlify" references below are outdated: the project deploys to **Cloudflare Pages**
> (`@astrojs/cloudflare`); API routes are Cloudflare Pages Functions and env vars live in
> Cloudflare Pages → Settings → Environment variables. Treat the live code as the source of truth.

Source plugin: https://github.com/felmerald-hmdg/hmdg-cookie-consent
Status: Not yet implemented — plan only (recorded 2026-04-06, reviewed and corrected 2026-04-06)
Astro version: 6.1.3

---

## ACCURACY FIXES FROM FIRST DRAFT

These were wrong in the original plan — corrected here:

| Original (wrong) | Corrected |
|---|---|
| `output: 'hybrid'` | Does not exist in Astro v5+. Use `output: 'static'` (default) + `export const prerender = false` on API routes |
| `[POLICY_VERSION]` literal string in head script | Must be injected via Astro `define:vars` — it is a TypeScript config value |
| Head script without `is:inline` | MUST use `is:inline` — without it Astro defers/bundles the script and GTM fires BEFORE consent defaults |
| In-memory rate limiting | Netlify Functions are stateless — each invocation is a new process. Use HMAC signing instead (stateless, no storage needed) |
| `client_id` as generated UUID | Must parse from `_ga` cookie: `_ga.split('.').slice(-2).join('.')` — GA4 requires its own client ID |
| Cliniko in postMessage matchers | Cliniko does not use postMessage — it redirects to a thank-you URL. Detect via URL pattern on the page |
| Netlify adapter listed as installed | Not installed. Must run `npm install @astrojs/netlify` |

---

---
# MARKETING TEAM SECTION
# ══════════════════════════════════════════════════════════════════
# STOP HERE — Everything below this section is for developers only
# Marketing: you only need to edit these fields
# ══════════════════════════════════════════════════════════════════
---

## Marketing Team: What To Fill In

File to open: `src/config/cookie-consent.config.ts`

Only edit the fields marked below. Do not edit anything else in that file.

---

### Field 1 — GTM Container ID
```
gtmId: 'GTM-XXXXXXX'
```
Find this in Google Tag Manager → Admin → Container Settings → Container ID.
Leave blank (`''`) only if the client is not using GTM.

---

### Field 2 — GA4 Measurement ID
```
gtagId: 'G-XXXXXXXXXX'
```
Find this in GA4 → Admin → Data Streams → select stream → Measurement ID.
This is needed for the server-side booking event relay (Measurement Protocol).

---

### Field 3 — Policy Version
```
policyVersion: '1.0'
```
Start every new client at `'1.0'`.
If the client's cookie policy changes later, bump to `'1.1'` or `'2.0'`.
Changing this forces ALL existing visitors to see the banner and consent again.

---

### Field 4 — Banner Text
```
bannerTitle: 'We use cookies',
bannerText:  'We use cookies to improve your experience...',
```
Match this to the wording in the client's cookie policy page.
Keep it short — one or two sentences.

---

### Field 5 — Button Labels
```
acceptAllLabel:       'Accept All',
rejectAllLabel:       'Reject All',
customiseLabel:       'Customise',
savePreferencesLabel: 'Save Preferences',
```
Rarely need changing. UK English spelling must be used (customise not customize).

---

### Field 6 — Cookie Categories (enable or disable)
```
categories: {
  necessary:   { enabled: true,  ... },   ← always on, cannot be turned off
  functional:  { enabled: true,  ... },   ← set false if client does not need functional cookies
  analytics:   { enabled: true,  ... },   ← set false if no GA4 / analytics
  performance: { enabled: true,  ... },   ← set false if not needed
  marketing:   { enabled: true,  ... },   ← set false if no Google Ads / remarketing
}
```
Set `enabled: false` to completely hide a category from the banner modal.
Example: a simple brochure site with no ads → set `marketing: { enabled: false }`.

---

### Field 7 — Booking Platforms
```
bookingDomains: [
  'cliniko.com',
  'calendly.com',
  'acuityscheduling.com',
  'phorest.com',
  'youcanbook.me',
  'jane.app',
  'timely.com',
  'simplybook.me',
]
```
Add the client's booking platform domain here.
Remove all platforms the client does not use — keeps the tracker clean.
The tracker will auto-detect links to these domains and fire `book_now_click` in GA4.

---

### Field 8 — Netlify Environment Variables (NOT in the config file)

These MUST be set in Netlify Dashboard → Site → Environment Variables.
Never put these in the code file.

```
GA4_API_SECRET       = (from GA4 → Admin → Data Streams → Measurement Protocol → Manage)
GA4_MEASUREMENT_ID   = G-XXXXXXXXXX
SITE_ORIGIN          = https://clientsite.co.uk
```

---

### Marketing: What NOT to Touch

Do not edit:
- `bookingCompletionMatchers` — these are technical JS expressions, changing them breaks booking tracking
- `cookieName` — changing this breaks existing user consent (they get banner again for wrong reason)
- `debug` — leave as `false` in production
- Anything in `src/components/CookieConsent.astro`
- Anything in `src/pages/api/`
- Anything in `BaseLayout.astro`

---
---

## Architecture

**Output mode:** Astro `output: 'static'` (the default — no change to astro.config.mjs output setting)

**API routes:** Individual files use `export const prerender = false` — these become Netlify Functions automatically

**Netlify adapter:** Required. Install once per project.

**Consent banner:** Pure client-side vanilla JS. No Astro SSR needed for the banner itself.

**Server relay:** API routes handle the GA4 Measurement Protocol calls server-side so the GA4 API secret is never in the browser.

---

## Full File Structure

```
src/
  config/
    cookie-consent.config.ts     ← MARKETING EDITS HERE ONLY

  components/
    CookieConsent.astro          ← Banner + modal HTML + scoped CSS + <script is:inline>

  pages/
    api/
      book-now.ts                ← Netlify Function: fires book_now_click to GA4 MP
      booking-complete.ts        ← Netlify Function: fires booking_completed to GA4 MP

  layouts/
    BaseLayout.astro             ← Add consent head script + <CookieConsent /> here

.env                             ← Local secrets (gitignored)
.env.example                    ← Template for team (committed to repo, no real values)
```

---

## Step-by-Step Developer Implementation

---

### Step 1 — Install Netlify adapter

```bash
npm install @astrojs/netlify
```

Update `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify(),             // enables Netlify Functions for API routes
  vite: {
    plugins: [tailwindcss()]
  }
});
```

No `output` field needed — it stays `'static'` by default. Only the API routes opt in to SSR.

---

### Step 2 — Create .env.example (commit this)

```
# Copy this file to .env and fill in real values
# Never commit .env to the repo

GA4_API_SECRET=
GA4_MEASUREMENT_ID=
SITE_ORIGIN=https://yourclientsite.co.uk
```

---

### Step 3 — Create the marketing config file

`src/config/cookie-consent.config.ts`

```ts
export const cookieConsentConfig = {

  // ══════════════════════════════════════════
  // MARKETING TEAM — EDIT ONLY THESE FIELDS
  // ══════════════════════════════════════════

  gtmId:        'GTM-XXXXXXX',    // Google Tag Manager container ID
  gtagId:       'G-XXXXXXXXXX',   // GA4 Measurement ID

  policyVersion: '1.0',           // Bump = forces re-consent from all visitors

  bannerTitle: 'We use cookies',
  bannerText:  'We use cookies to improve your experience, personalise content, and analyse our traffic. You can choose which cookies you accept.',

  acceptAllLabel:       'Accept All',
  rejectAllLabel:       'Reject All',
  customiseLabel:       'Customise',
  savePreferencesLabel: 'Save Preferences',

  categories: {
    necessary:   { enabled: true,  label: 'Necessary',    description: 'Required for the website to work. Cannot be disabled.' },
    functional:  { enabled: true,  label: 'Functional',   description: 'Remember your preferences and personalisation settings.' },
    analytics:   { enabled: true,  label: 'Analytics',    description: 'Help us understand how visitors use the site (Google Analytics).' },
    performance: { enabled: true,  label: 'Performance',  description: 'Monitor site speed and stability.' },
    marketing:   { enabled: true,  label: 'Marketing',    description: 'Personalised advertising and remarketing (Google Ads).' },
  },

  bookingDomains: [
    'cliniko.com',
    'calendly.com',
    'acuityscheduling.com',
    'phorest.com',
    'youcanbook.me',
    'jane.app',
    'timely.com',
    'simplybook.me',
  ],

  // ══════════════════════════════════════════
  // DEVELOPER SETTINGS — DO NOT EDIT ABOVE
  // ══════════════════════════════════════════

  debug: false,                   // Set true locally to see console output — NEVER true in production

  cookieName:       'hmdg_cookie_consent',
  cookieExpiryDays: 180,

  // postMessage completion matchers — only change if a platform updates their event format
  // Cliniko is NOT here — it uses URL redirect detection (handled separately)
  bookingCompletionMatchers: {
    calendly:   `e.data.event === 'calendly.event_scheduled'`,
    acuity:     `e.data === 'booked'`,
    youcanbook: `typeof e.data === 'string' && e.data.includes('ycbm:booking:complete')`,
    jane:       `e.data && e.data.type === 'jane:appointment:booked'`,
    simplybook: `e.data && e.data.action === 'booking_complete'`,
    phorest:    `e.data && e.data.type === 'phorest:booking:confirmed'`,
    timely:     `e.data && e.data.event === 'timely:booking:confirmed'`,
  },

  // Cliniko redirects to a thank-you URL — detect by URL pattern on page load
  clinikoThankYouUrlPatterns: [
    '/appointments/confirmation',
    '/booking/confirmed',
    '/thank-you',
  ],

  // CSS tokens — maps to global.css design system
  // Change only if redesigning the banner for a specific client
  tokens: {
    primary:    'var(--color-primary)',
    text:       'var(--color-body)',
    background: 'var(--color-white)',
    surface:    'var(--color-surface)',
    border:     'var(--color-border)',
    muted:      'var(--color-muted)',
    radius:     'var(--radius-card)',
  },
};
```

---

### Step 4 — Add consent head script to BaseLayout.astro

This MUST go in `<head>` BEFORE any GTM or gtag script. Use `is:inline` — this is critical. Without `is:inline`, Astro will bundle and defer this script, meaning GTM fires BEFORE the consent defaults are set, which breaks Google Consent Mode v2 entirely.

```astro
---
import { cookieConsentConfig } from '../config/cookie-consent.config';
---

<head>
  <!-- 1. Consent Mode v2 defaults — MUST be first, before GTM -->
  <script is:inline define:vars={{ policyVersion: cookieConsentConfig.policyVersion, cookieName: cookieConsentConfig.cookieName }}>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    // Set all consent to denied before any tag fires
    gtag('consent', 'default', {
      analytics_storage:       'denied',
      ad_storage:              'denied',
      ad_user_data:            'denied',
      ad_personalization:      'denied',
      functionality_storage:   'denied',
      personalization_storage: 'denied',
      security_storage:        'granted',
      wait_for_update:         500,
    });

    // Restore consent immediately if visitor has already consented
    (function() {
      try {
        var raw = document.cookie.split(';').find(function(c) {
          return c.trim().startsWith(cookieName + '=');
        });
        if (raw) {
          var stored = JSON.parse(decodeURIComponent(raw.split('=').slice(1).join('=')));
          if (stored && stored.policyVersion === policyVersion) {
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
      } catch(e) {}
    })();
  </script>

  <!-- 2. GTM script goes here — AFTER consent defaults above -->
  {cookieConsentConfig.gtmId && (
    <script is:inline define:vars={{ gtmId: cookieConsentConfig.gtmId }}>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',gtmId);
    </script>
  )}
</head>
```

Then just before `</body>`:
```astro
<CookieConsent />

<!-- GTM noscript fallback -->
{cookieConsentConfig.gtmId && (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${cookieConsentConfig.gtmId}`}
      height="0" width="0" style="display:none;visibility:hidden"
    />
  </noscript>
)}
```

---

### Step 5 — Create CookieConsent.astro

**UI improvements over the WordPress plugin:**
- Mobile bottom sheet (slides up from bottom) instead of a centre-screen modal — far better UX on phones
- Smooth CSS transitions on all animations using only `transform` and `opacity` (compositor-friendly, no layout shift)
- `prefers-reduced-motion` respected — all animations disabled if user has set this
- Design token CSS variables from `global.css` (no hardcoded colours)
- Category icons (inline SVG) in modal for faster visual scanning
- `role="status"` live region for screen reader announcements when consent is saved
- Escape key closes modal and returns focus to the trigger element

**HTML structure:**
```
#hmdg-ccm
  #hmdg-sr-announce [role="status", aria-live="polite"] ← screen reader only
  #hmdg-banner [role="dialog", aria-modal="true"]
    .hmdg-banner-inner
      .hmdg-banner-text (title + body)
      .hmdg-banner-actions (reject | customise | accept)
  #hmdg-modal-overlay [role="dialog", aria-modal="true"]
    .hmdg-modal
      .hmdg-modal-head (title + close button)
      .hmdg-modal-body (category rows with toggles)
      .hmdg-modal-foot (reject | save | accept)
  #hmdg-reopen [aria-label="Cookie settings"] ← floating icon after consent
```

**JS functions to implement:**
```
readCookie()           — parse hmdg_cookie_consent JSON cookie
writeCookie(obj)       — write JSON cookie, SameSite=Lax; Secure, N days expiry
getGA4ClientId()       — parse _ga cookie: _ga.split('.').slice(-2).join('.')
getSessionId()         — parse _ga_XXXXXXXX cookie for session ID
getGclid()             — read ?gclid= URL param, persist to sessionStorage
getUtmParams()         — read utm_source/medium/campaign from URL, persist to sessionStorage

doAcceptAll()          — write all true, fire gtag consent update, hide banner, push dataLayer
doRejectAll()          — write all false, fire gtag consent update, hide banner, push dataLayer
doSavePreferences()    — read checkbox states, write granular consent, fire updates

showBanner()           — add .hmdg-open to banner, set aria-hidden on page content
hideBanner()           — remove .hmdg-open
openModal()            — add .hmdg-open to overlay, trap focus inside modal
closeModal()           — remove .hmdg-open, return focus to opener element

fireConsentUpdate()    — fire gtag consent update + push hmdg_consent_update to dataLayer
fireConsentMethod()    — push hmdg_consent_method event (accept-all / reject-all / customise)
fireTimeToConsent()    — push hmdg_time_to_consent event (milliseconds from page load)

initBookingTracker()   — scan all <a> links matching bookingDomains, attach click listeners
onBookingClick(e)      — fire book_now_click POST to /api/book-now with client_id, gclid, utms
initPostMessageTracker() — window.addEventListener('message', ...) for postMessage platforms
checkClinikoUrl()      — on DOMContentLoaded, check if current URL matches clinikoThankYouUrlPatterns

log(...args)           — debug logger: wraps console.log inside console.group('[HMDG CCM]') when debug=true
```

**Console debug output (when `debug: true`):**

On boot:
```
[HMDG CCM] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[HMDG CCM] Cookie Consent Manager booted
[HMDG CCM] Policy version: 1.0
[HMDG CCM] Existing cookie: { analytics: true, marketing: false, ... }
[HMDG CCM] Consent restored: yes / showing banner
[HMDG CCM] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

On consent action:
```
[HMDG CCM] Action: accept-all
[HMDG CCM] Writing cookie: { analytics: true, marketing: true, ... }
[HMDG CCM] Firing gtag consent update → { analytics_storage: 'granted', ... }
[HMDG CCM] Pushing to dataLayer → hmdg_consent_update
[HMDG CCM] Pushing to dataLayer → hmdg_consent_method { method: 'accept-all', timeToConsent: 4823 }
```

On booking click:
```
[HMDG CCM] Booking click detected → calendly.com
[HMDG CCM] Firing book_now_click to GA4 MP
[HMDG CCM] client_id: 123456789.987654321
[HMDG CCM] gclid: AKsRol...
[HMDG CCM] POST /api/book-now → 200 OK
```

On booking completion:
```
[HMDG CCM] Booking completion detected → calendly (postMessage)
[HMDG CCM] Firing booking_completed to GA4 MP
[HMDG CCM] POST /api/booking-complete → 200 OK
```

**Dev-only visual consent badge:**
When `import.meta.env.DEV === true`, render a small badge fixed to bottom-left showing current consent state. Removed entirely from production build.

---

### Step 6 — Create API routes

**`src/pages/api/book-now.ts`:**
```ts
export const prerender = false;   // This line makes it a Netlify Function

export async function POST({ request }: { request: Request }) {
  // 1. Validate origin against SITE_ORIGIN env var
  // 2. Validate content-type is application/json
  // 3. Parse and validate payload (max 8KB)
  // 4. Extract: client_id, session_id, gclid, page_location, platform, utm params
  // 5. POST to GA4 Measurement Protocol:
  //    https://www.google-analytics.com/mp/collect
  //    ?measurement_id=G-XXXXXX&api_secret=XXXXXX
  //    body: { client_id, events: [{ name: 'book_now_click', params: { platform, page_location, gclid, ... } }] }
  // 6. Return 200 or error
}
```

**`src/pages/api/booking-complete.ts`:** Same pattern, fires `booking_completed` event.

**Security model (HMAC signing, replaces nonce):**
- On page load, BaseLayout.astro injects a signed token: `HMAC-SHA256(timestamp + origin, HMAC_SECRET)` as a `<meta name="hmdg-token">` tag
- CookieConsent JS reads it, sends as `X-HMDG-Token` header
- API routes verify: re-compute HMAC, compare, reject if mismatch or timestamp > 5 minutes old
- This is stateless — works perfectly with Netlify Functions (no shared memory needed)
- Add `HMAC_SECRET` to env vars (random 32-byte string, generated once per project)

**Environment variables (full list):**
```
GA4_API_SECRET=        ← from GA4 admin
GA4_MEASUREMENT_ID=    ← G-XXXXXXXXXX
SITE_ORIGIN=           ← https://clientsite.co.uk
HMAC_SECRET=           ← random 32-char string, generate once with: openssl rand -hex 32
```

---

### Step 7 — Improvements over the WordPress plugin

These go beyond the WP plugin and make this implementation stronger:

**Tracking improvements:**
| Feature | WP Plugin | Astro version |
|---|---|---|
| GA4 client_id | Generated UUID | Parsed from `_ga` cookie — correct GA4 attribution |
| Session ID | Not tracked | Parsed from `_ga_XXXXXXXX` cookie |
| GCLID forwarding | Reads from URL once | Persisted to sessionStorage — survives page navigation before booking |
| UTM forwarding | Not included | `utm_source`, `utm_medium`, `utm_campaign` forwarded with booking events |
| Consent method event | Not fired | `hmdg_consent_method` event: accept-all / reject-all / customise |
| Time to consent | Not tracked | `hmdg_time_to_consent` in milliseconds — useful for UX analysis |
| Booking deduplication | JS variable (resets on page nav) | sessionStorage — survives navigation within session |
| Cliniko detection | postMessage (wrong) | URL pattern detection on page load |

**UI improvements:**
| Feature | WP Plugin | Astro version |
|---|---|---|
| Mobile layout | Centred modal | Bottom sheet — slides up from bottom on mobile (≤768px) |
| Animations | No entrance animations | Smooth slide-up/fade with prefers-reduced-motion fallback |
| Colours | Hardcoded with `!important` | Design token CSS variables from global.css |
| Screen reader | No live region | `role="status"` aria-live region announces consent saved |
| Escape key | Not handled | Closes modal, returns focus to opener |
| Category icons | Text only | Inline SVG icons per category |
| `!important` usage | Throughout | None — not needed in Astro scoped CSS |

**Security improvements:**
| Feature | WP Plugin | Astro version |
|---|---|---|
| Request signing | WP nonce (stateful, WP-specific) | HMAC-SHA256 (stateless, works on Netlify Functions) |
| Rate limiting | WP transients (stateful) | HMAC timestamp validation (stateless, 5-minute window) |
| Origin validation | Same-domain referer check | `SITE_ORIGIN` env var strict match |
| Secrets | PHP env / WP options | Netlify environment variables only |

---

### Step 8 — CHANGELOG.md and version

Cookie consent is a significant feature. When implemented, bump to `v1.3.0` and document it in `CHANGELOG.md`.

---

## Pre-Launch Testing Checklist

### Consent behaviour
- [ ] Banner shows on first visit (no cookie present)
- [ ] Banner does NOT show on return visit (cookie present and policy version matches)
- [ ] Bumping policyVersion causes banner to reappear for all users
- [ ] Accept All: all signals fire as `granted`
- [ ] Reject All: all signals fire as `denied` except `security_storage: granted`
- [ ] Customise: granular signals match each toggle state
- [ ] Saving preferences closes modal and shows reopen icon

### Google Consent Mode v2
- [ ] GTM fires AFTER consent defaults (check Network tab — GTM request must come after page load)
- [ ] GA4 DebugView shows `consent_default` at page load
- [ ] GA4 DebugView shows `consent_update` immediately when user accepts/rejects
- [ ] `hmdg_consent_method` event visible in DebugView
- [ ] `hmdg_time_to_consent` event visible in DebugView

### Booking tracker
- [ ] `book_now_click` fires in GA4 when a booking link is clicked
- [ ] `booking_completed` fires in GA4 when a booking is completed (postMessage platforms)
- [ ] Cliniko thank-you URL detection fires `booking_completed` on correct URL
- [ ] GCLID forwarded correctly from URL → sessionStorage → booking event
- [ ] UTM parameters forwarded correctly to booking events
- [ ] Booking deduplication: `booking_completed` fires only once per session per platform
- [ ] API routes return 200 for valid requests
- [ ] API routes return 403 for requests from other origins
- [ ] API routes return 403 for expired HMAC tokens (older than 5 minutes)

### Security
- [ ] GA4 API secret NOT visible in browser source or DevTools network tab
- [ ] Cookie set with `SameSite=Lax; Secure`
- [ ] HMAC token signed with correct secret
- [ ] No secrets in any committed file

### Accessibility
- [ ] Banner focus is trapped within modal when open
- [ ] Escape key closes modal
- [ ] Focus returns to the opener element when modal closes
- [ ] Screen reader announces "Preferences saved" when consent is saved
- [ ] All interactive elements have visible focus rings
- [ ] Banner is fully keyboard navigable (Tab, Space, Enter)
- [ ] Minimum 4.5:1 contrast on all banner text

### Mobile
- [ ] Banner bottom sheet slides up correctly on mobile (≤768px)
- [ ] All buttons are minimum 44×44px touch targets
- [ ] No horizontal overflow at 375px
- [ ] Modal scrollable on small screens without page scroll

### Performance
- [ ] `prefers-reduced-motion` disables all banner animations
- [ ] No layout shift (CLS) caused by banner insertion
- [ ] Banner CSS does not load blocking scripts

### Console debug mode
- [ ] `debug: true` in config produces grouped console output
- [ ] Consent signals logged correctly
- [ ] Booking clicks logged with client_id, gclid, platform
- [ ] Booking completions logged
- [ ] API response codes logged
- [ ] `debug: false` in production produces zero console output

---

## When to Implement

Implement when building the first Astro client site that:
- Uses GA4 or Google Ads
- Requires GDPR/PECR cookie consent (all UK commercial sites)
- Uses any supported booking platform

Do not implement speculatively in the base template — add it per-client build with the config file filled in for that client.
