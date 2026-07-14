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
    'Expert physiotherapy across three Essex clinics — Chelmsford, Witham ' +
    'and Leigh-on-Sea. HCPC-registered physiotherapists helping you recover ' +
    'faster, move better and live without pain. Ease the pain, cure the cause.',

  defaultSeoDescription:
    'Expert physiotherapy in Essex, with clinics in Chelmsford, Witham and ' +
    'Leigh-on-Sea. HCPC-registered physiotherapists treating pain, injury and ' +
    'movement problems. Book your appointment today.',

  // Real shared contact details (phone/mobile/email apply across all three
  // clinics). Address below is Chelmsford's — used as the site-wide/JSON-LD
  // representative address since there's no single head office; each real
  // clinic has its own accurate address, phone, and hours on its own page
  // (src/data/locations.ts + /clinics/[slug]/). Footer.astro links out to
  // all three rather than repeating one address globally.
  contact: {
    phoneDisplay: '01245 830280',
    phoneTel:     '+441245830280',
    mobileDisplay: '07980 898212',
    mobileTel:     '+447980898212',
    email:        'infofarrellphysiotherapy@gmail.com',
    addressLine1: 'Unit 2, The Old Coal Yard, Little Waltham Road, Broomfield',
    addressLine2: 'Chelmsford, CM1 7TG',
    mapsUrl:      'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Unit 2, The Old Coal Yard, Little Waltham Road, Broomfield, Chelmsford, CM1 7TG'),
  },

  // 24h "HH:MM"; null = closed. Mon=first. Drives the contact page
  // open/closed pill, the footer hours display, and JSON-LD.
  // Hours from the live site: Mon–Fri 6am–9pm, Sat 9am–12pm.
  // (See SEO note in about/index.astro re 9pm vs 9:30pm — confirm with client.)
  hours: {
    mon: { open: '06:00', close: '21:00' },
    tue: { open: '06:00', close: '21:00' },
    wed: { open: '06:00', close: '21:00' },
    thu: { open: '06:00', close: '21:00' },
    fri: { open: '06:00', close: '21:00' },
    sat: { open: '09:00', close: '12:00' },
    sun: null,
  },

  bookingCta: { label: 'Book an Appointment', href: '/book-now/' },
};
