/**
 * site.ts — Site settings (single source of truth)
 * ─────────────────────────────────────────────────────────────────
 * THE one place where clinic identity lives: name, contact details,
 * address, opening hours, booking CTA. Header.astro, Footer.astro,
 * contact.astro, and the MedicalClinic JSON-LD all read from here.
 *
 * Per-client setup: update the values below (or set PUBLIC_SITE_NAME
 * in the environment). Nothing else needs touching — every consumer
 * updates automatically.
 *
 * SANITY-READY: this module maps 1:1 onto a future `siteSettings`
 * singleton document. When Sanity is integrated, replace the object
 * literal with a build-time GROQ fetch returning the same
 * `SiteSettings` shape — zero component changes. See SANITY_READY.md.
 */
import type { SiteSettings } from '../lib/content/types';

// Use || (not ??) so empty-string env vars fall through too.
const envSiteName = import.meta.env.PUBLIC_SITE_NAME || 'Your Clinic';

export const site: SiteSettings = {
  name: envSiteName,

  blurb:
    'Your trusted clinic, helping patients recover faster, move better, ' +
    'and live without pain. HCPC-registered and fully insured.',

  defaultSeoDescription:
    'Professional clinic providing expert care in the UK.',

  contact: {
    phoneDisplay: '+44 (0) 1234 567 890',
    phoneTel:     '+441234567890',
    email:        'hello@yourclinic.co.uk',
    addressLine1: '1 Example Street',
    addressLine2: 'Town, Postcode',
    mapsUrl:      'https://maps.google.com/?q=1+Example+Street+Town+Postcode',
  },

  // 24h "HH:MM"; null = closed. Mon=first. Drives the contact page
  // open/closed pill, the footer hours display, and JSON-LD.
  hours: {
    mon: { open: '09:00', close: '17:00' },
    tue: { open: '09:00', close: '17:00' },
    wed: { open: '09:00', close: '17:00' },
    thu: { open: '09:00', close: '17:00' },
    fri: { open: '09:00', close: '17:00' },
    sat: null,
    sun: null,
  },

  bookingCta: { label: 'Book Now', href: '#contact' },
};
