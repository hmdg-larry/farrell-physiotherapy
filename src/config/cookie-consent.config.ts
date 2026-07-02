// ─────────────────────────────────────────────────────────────────────────────
// HMDG Cookie Consent Configuration
// ─────────────────────────────────────────────────────────────────────────────
//
// MARKETING TEAM: Only edit the fields in the section marked below.
// For detailed instructions, see CookieConsentReadme.md in the project root.
//
// DEVELOPERS: All technical settings are in the lower section.
// ─────────────────────────────────────────────────────────────────────────────

// ── Tracking IDs come from environment variables (no hardcoding) ──
// Set these in:
//   • Local dev:    .env    (PUBLIC_GTM_ID, PUBLIC_GTAG_ID, PUBLIC_ADS_CONVERSION_ID)
//   • Cloudflare:   Pages → Settings → Variables → Build scope (NOT runtime)
// PUBLIC_ prefix is required so values are baked into the static HTML at build.
// Server-side IDs (GA4_API_SECRET, GA4_MEASUREMENT_ID) are NEVER PUBLIC_.
//
// Mode selection:
//   • Set PUBLIC_GTM_ID alone           → GTM-only mode (recommended)
//   • Set PUBLIC_GTAG_ID alone          → gtag.js direct mode (no GTM)
//   • Both set                          → GTM is preferred; gtagId falls through to GTM
//   • PUBLIC_ADS_CONVERSION_ID is OPTIONAL — used for Google Ads remarketing/conversions
const ENV_GTM_ID            = import.meta.env.PUBLIC_GTM_ID            || '';
const ENV_GTAG_ID           = import.meta.env.PUBLIC_GTAG_ID           || '';
const ENV_ADS_CONVERSION_ID = import.meta.env.PUBLIC_ADS_CONVERSION_ID || '';
const ENV_SERVER_SIDE       = (import.meta.env.PUBLIC_SERVER_SIDE_TRACKING || 'true').toLowerCase() !== 'false';

// Site name — driven by PUBLIC_SITE_NAME env so the banner copy
// adapts automatically when cloned to any HMDG client project.
const ENV_SITE_NAME = import.meta.env.PUBLIC_SITE_NAME || 'this clinic';

// ── Universal Booking Tracker — platform definitions + env overrides ──
//
// Mirrors the WP plugin's "Enabled Platforms" checkbox panel. Default:
// ALL platforms enabled. Disable specific platforms via env:
//   PUBLIC_BOOKING_DISABLE=acuity,timely    (comma-separated, lowercase keys)
// Add custom domains not in the catalog via env:
//   PUBLIC_BOOKING_ADDITIONAL_DOMAINS=mybooking.co.uk,otherclinic.com

const PLATFORM_CATALOG = {
  cliniko:    { domain: 'cliniko.com',          label: 'Cliniko'         },
  calendly:   { domain: 'calendly.com',          label: 'Calendly'        },
  acuity:     { domain: 'acuityscheduling.com',  label: 'Acuity Scheduling' },
  pracsuite:  { domain: 'pracsuite.com',         label: 'PracSuite'       },
  phorest:    { domain: 'phorest.com',           label: 'Phorest'         },
  youcanbook: { domain: 'youcanbook.me',         label: 'YouCanBook.me'   },
  jane:       { domain: 'jane.app',              label: 'Jane App'        },
  timely:     { domain: 'timely.com',            label: 'Timely'          },
  simplybook: { domain: 'simplybook.me',         label: 'SimplyBook.me'   },
} as const;

const _csv = (v: string | undefined): string[] =>
  (v || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

const _disabledKeys = _csv(import.meta.env.PUBLIC_BOOKING_DISABLE);
const _extraDomains = _csv(import.meta.env.PUBLIC_BOOKING_ADDITIONAL_DOMAINS);

// Final derived structures consumed by the cookieConsentConfig export below
const bookingPlatforms = Object.fromEntries(
  Object.entries(PLATFORM_CATALOG).map(([key, def]) => [
    key,
    { ...def, enabled: !_disabledKeys.includes(key) },
  ])
) as Record<keyof typeof PLATFORM_CATALOG, { domain: string; label: string; enabled: boolean }>;

const bookingDomains: string[] = [
  ...Object.values(bookingPlatforms).filter(p => p.enabled).map(p => p.domain),
  ..._extraDomains,
];

export const cookieConsentConfig = {

  // ══════════════════════════════════════════════════════════════════
  // MARKETING TEAM — EDIT ONLY THESE FIELDS
  // (Tracking IDs above are env-driven — see .env file)
  // ══════════════════════════════════════════════════════════════════

  /** Google Tag Manager container ID — driven by PUBLIC_GTM_ID in .env */
  gtmId: ENV_GTM_ID,

  /** Google tag ID (GA4 Measurement ID for direct gtag.js mode) — driven by PUBLIC_GTAG_ID in .env */
  gtagId: ENV_GTAG_ID,

  /** Google Ads Conversion ID (AW-XXXXXXXXX) — driven by PUBLIC_ADS_CONVERSION_ID in .env */
  adsConversionId: ENV_ADS_CONVERSION_ID,

  /** Server-side tracking master switch (PUBLIC_SERVER_SIDE_TRACKING in .env, default true) */
  serverSideTracking: ENV_SERVER_SIDE,

  /**
   * Cookie policy version. Start every new site at '1.0'.
   * Bumping this forces ALL existing visitors to re-consent.
   * Only bump when the cookie policy actually changes.
   */
  policyVersion: '1.0',

  /** Banner heading */
  bannerTitle: 'We use cookies',

  /**
   * Banner body text — keep to 1–2 sentences, match the client's cookie
   * policy. Uses PUBLIC_SITE_NAME from .env so the clinic/business name
   * adapts automatically when cloned to a new client project.
   */
  bannerText: `At ${ENV_SITE_NAME}, we use cookies to improve your experience, personalise content, and understand how visitors use our site. You can choose which cookies you accept.`,

  /** Button labels — UK English spelling required */
  acceptAllLabel:       'Accept All',
  rejectAllLabel:       'Reject All',
  customiseLabel:       'Customise',
  savePreferencesLabel: 'Save Preferences',

  /**
   * Legal page URLs shown as links in the cookie banner.
   * Update these if the client uses different URL slugs.
   */
  privacyPolicyUrl:  '/privacy-policy',
  termsUrl:          '/terms-conditions',
  cookiePolicyUrl:   '/cookie-policy',

  /**
   * Cookie categories shown in the preferences modal.
   * Set enabled: false to hide a category completely.
   * Necessary is always on and cannot be toggled.
   */
  categories: {
    necessary: {
      enabled:     true,
      label:       'Necessary',
      description: 'Required for the website to work correctly. These cannot be disabled.',
    },
    functional: {
      enabled:     true,
      label:       'Functional',
      description: 'Remember your preferences and personalisation settings across visits.',
    },
    analytics: {
      enabled:     true,
      label:       'Analytics',
      description: 'Help us understand how visitors use the site so we can improve it (Google Analytics).',
    },
    performance: {
      enabled:     true,
      label:       'Performance',
      description: 'Monitor site speed and stability to ensure a fast experience.',
    },
    marketing: {
      enabled:     true,
      label:       'Marketing',
      description: 'Used for personalised advertising and remarketing (Google Ads).',
    },
  },

  /**
   * Universal Booking Tracker — supported platforms + per-platform enable toggle.
   * Mirrors the WP plugin's "Enabled Platforms" checkbox panel.
   *
   * Default: ALL platforms enabled. To disable specific platforms, set:
   *   PUBLIC_BOOKING_DISABLE=acuity,timely    (comma-separated, lowercase keys)
   *
   * To add custom booking domains not in this list (e.g. white-label
   * Cliniko subdomain or proprietary booking system), set:
   *   PUBLIC_BOOKING_ADDITIONAL_DOMAINS=mybooking.co.uk,otherclinic.com
   */
  bookingPlatforms: bookingPlatforms,
  bookingDomains: bookingDomains,

  // ══════════════════════════════════════════════════════════════════
  // DEVELOPER SETTINGS — DO NOT EDIT ABOVE THIS LINE
  // ══════════════════════════════════════════════════════════════════

  /**
   * Enable debug console output.
   * Set to true locally to verify consent signals and booking events.
   * MUST be false in production — never commit as true.
   */
  debug: false,

  /** Internal cookie name — do not change on a live site (breaks existing consent) */
  cookieName: 'hmdg_cookie_consent',

  /** How many days the consent cookie lasts */
  cookieExpiryDays: 180,

  /**
   * postMessage completion matchers for booking platforms — DOCUMENTATION ONLY.
   * These expression strings are NO LONGER evaluated at runtime (the old
   * new Function() pattern was eval-adjacent and would become a code-
   * injection vector if this config ever moved to a CMS). The executable
   * matching logic is the static BOOKING_MATCHERS object in
   * src/components/CookieConsent.astro — keep BOTH in sync if a platform
   * changes their postMessage event format.
   * Cliniko is NOT here — it uses URL redirect detection (see clinikoThankYouUrlPatterns).
   */
  bookingCompletionMatchers: {
    calendly:   `e.data && e.data.event === 'calendly.event_scheduled'`,
    acuity:     `e.data === 'booked'`,
    youcanbook: `typeof e.data === 'string' && e.data.includes('ycbm:booking:complete')`,
    jane:       `e.data && e.data.type === 'jane:appointment:booked'`,
    simplybook: `e.data && e.data.action === 'booking_complete'`,
    phorest:    `e.data && e.data.type === 'phorest:booking:confirmed'`,
    timely:     `e.data && e.data.event === 'timely:booking:confirmed'`,
  },

  /**
   * Cliniko redirects to a thank-you page after booking (no postMessage).
   * If the current page URL contains any of these patterns, booking_completed fires.
   */
  clinikoThankYouUrlPatterns: [
    '/appointments/confirmation',
    '/booking/confirmed',
    '/thank-you',
  ],

  /**
   * URL query parameter that signals a completed booking redirect.
   * Used for platforms that append a param to the return URL.
   */
  redirectParam: 'booking_confirmed',

} as const;

export type CookieConsentConfig = typeof cookieConsentConfig;
