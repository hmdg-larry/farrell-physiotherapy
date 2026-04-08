// ─────────────────────────────────────────────────────────────────────────────
// HMDG Cookie Consent Configuration
// ─────────────────────────────────────────────────────────────────────────────
//
// MARKETING TEAM: Only edit the fields in the section marked below.
// For detailed instructions, see CookieConsentReadme.md in the project root.
//
// DEVELOPERS: All technical settings are in the lower section.
// ─────────────────────────────────────────────────────────────────────────────

export const cookieConsentConfig = {

  // ══════════════════════════════════════════════════════════════════
  // MARKETING TEAM — EDIT ONLY THESE FIELDS
  // See CookieConsentReadme.md for step-by-step instructions
  // ══════════════════════════════════════════════════════════════════

  /** Google Tag Manager container ID. Find: GTM → Admin → Container Settings */
  gtmId: '',

  /** GA4 Measurement ID. Find: GA4 → Admin → Data Streams → Measurement ID */
  gtagId: '',

  /**
   * Cookie policy version. Start every new site at '1.0'.
   * Bumping this forces ALL existing visitors to re-consent.
   * Only bump when the cookie policy actually changes.
   */
  policyVersion: '1.0',

  /** Banner heading */
  bannerTitle: 'We use cookies',

  /** Banner body text — keep to 1–2 sentences, match the client's cookie policy */
  bannerText: 'We use cookies to improve your experience, personalise content, and analyse our traffic. You can choose which cookies you accept.',

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
   * Booking platform domains tracked by the Universal Booking Tracker.
   * Keep only the platforms the client actually uses.
   * The tracker auto-detects links to these domains and fires book_now_click in GA4.
   */
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
   * postMessage completion matchers for booking platforms.
   * Each value is a JS expression evaluated against the message event.
   * Only update if a platform changes their postMessage event format.
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
