/**
 * locations.ts — Clinic locations (single source of truth)
 * ─────────────────────────────────────────────────────────────────
 * Farrell Physiotherapy operates three clinics. This is separate from
 * `site.ts`'s single `contact` object (which is the site-wide/JSON-LD
 * representative identity used in the header, footer, and Chelmsford-
 * anchored global schema) — each entry here has its own address for
 * the /clinics/[slug]/ and /prices/[slug]/ page templates.
 *
 * Address, phone, mobile, and email are REAL (confirmed 2026-07-06).
 * Phone/mobile/email are shared across all three clinics (one contact
 * point, not per-location numbers) — split them out per location if
 * that ever changes.
 *
 * Booking URLs are REAL per-location Cliniko links (confirmed).
 * Opening hours now set from the live site (Mon–Fri 6am–9pm, Sat
 * 9am–12pm), shared across all three clinics. Confirm the evening
 * close (9pm vs the about page's 9:30pm) and any per-clinic variation
 * with the client before launch — see .project-log.md.
 *
 * SANITY-READY: maps onto future `location` documents. Replace this
 * export with a GROQ fetch returning the same `ClinicLocation` shape —
 * zero template changes.
 */
import type { ClinicLocation, PriceItem } from '../lib/content/types';

const SHARED_PHONE_DISPLAY = '01245 830280';
const SHARED_PHONE_TEL     = '+441245830280';
const SHARED_MOBILE_DISPLAY = '07980 898212';
const SHARED_MOBILE_TEL     = '+447980898212';
const SHARED_EMAIL = 'infofarrellphysiotherapy@gmail.com';

// Real prices (confirmed from farrellphysiotherapy.co.uk/prices/).
// Chelmsford & Witham share the same rates; Leigh-on-Sea is higher.
const PRICES_STANDARD: PriceItem[] = [
  { label: 'Initial Assessment',          price: '£50'  },
  { label: 'Follow-Up Treatment Session', price: '£50'  },
  { label: 'Home Visit', detail: '30 minutes', price: '£100' },
];
const PRICES_LEIGH: PriceItem[] = [
  { label: 'Initial Assessment',          price: '£60'  },
  { label: 'Follow-Up Treatment Session', price: '£60'  },
  { label: 'Home Visit', detail: '30 minutes', price: '£100' },
];

const mapsUrlFor = (address: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);

// Live-site opening hours (Mon–Fri 6am–9pm, Sat 9am–12pm), shared across
// all three clinics until per-location hours are confirmed. Update per
// location if they ever differ. (See SEO note re 9pm vs 9:30pm.)
const SHARED_HOURS = {
  mon: { open: '06:00', close: '21:00' },
  tue: { open: '06:00', close: '21:00' },
  wed: { open: '06:00', close: '21:00' },
  thu: { open: '06:00', close: '21:00' },
  fri: { open: '06:00', close: '21:00' },
  sat: { open: '09:00', close: '12:00' },
  sun: null,
} as const;

export const locations: ClinicLocation[] = [
  {
    name: 'Chelmsford',
    slug: 'chelmsford',
    clinicHref: '/clinics/chelmsford/',
    pricesHref: '/prices/chelmsford/',
    bookingHref: 'https://farrell-physiotherapy.uk3.cliniko.com/bookings?business_id=1868094202668132472',
    contact: {
      phoneDisplay: SHARED_PHONE_DISPLAY,
      phoneTel: SHARED_PHONE_TEL,
      mobileDisplay: SHARED_MOBILE_DISPLAY,
      mobileTel: SHARED_MOBILE_TEL,
      email: SHARED_EMAIL,
      addressLine1: 'Unit 2, The Old Coal Yard, Little Waltham Road, Broomfield',
      addressLine2: 'Chelmsford, CM1 7TG',
      mapsUrl: mapsUrlFor('Unit 2, The Old Coal Yard, Little Waltham Road, Broomfield, Chelmsford, CM1 7TG'),
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.1156097860317!2d0.6365362776120218!3d51.547779057751434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8db5f7ac1b4f5%3A0x5675af8e6853afe8!2sThe%20Realignment%20Clinic!5e0!3m2!1sen!2sph!4v1783680101504!5m2!1sen!2sph',
    },
    hours: SHARED_HOURS,
    prices: PRICES_STANDARD,
  },
  {
    name: 'Witham',
    slug: 'witham',
    clinicHref: '/clinics/witham/',
    pricesHref: '/prices/witham/',
    bookingHref: 'https://farrell-physiotherapy.uk3.cliniko.com/bookings?business_id=1889146624207235678#service',
    contact: {
      phoneDisplay: SHARED_PHONE_DISPLAY,
      phoneTel: SHARED_PHONE_TEL,
      mobileDisplay: SHARED_MOBILE_DISPLAY,
      mobileTel: SHARED_MOBILE_TEL,
      email: SHARED_EMAIL,
      addressLine1: 'Witham Leisure Centre, Spinks Ln',
      addressLine2: 'Witham, CM8 1EP',
      mapsUrl: mapsUrlFor('Witham Leisure Centre, Spinks Ln, Witham, Essex, CM8 1EP'),
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2467.5481644669467!2d0.6335736!3d51.796143799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8e44fddf948df%3A0xcb224dcee76a3e30!2sWitham%20Leisure%20Centre!5e0!3m2!1sen!2sph!4v1783680045357!5m2!1sen!2sph',
    },
    hours: SHARED_HOURS,
    prices: PRICES_STANDARD,
  },
  {
    name: 'Leigh-on-Sea',
    slug: 'leigh-on-sea',
    clinicHref: '/clinics/leigh-on-sea/',
    pricesHref: '/prices/leigh-on-sea/',
    bookingHref: 'https://farrell-physiotherapy.uk3.cliniko.com/bookings?business_id=1889147855948491359',
    contact: {
      phoneDisplay: SHARED_PHONE_DISPLAY,
      phoneTel: SHARED_PHONE_TEL,
      mobileDisplay: SHARED_MOBILE_DISPLAY,
      mobileTel: SHARED_MOBILE_TEL,
      email: SHARED_EMAIL,
      addressLine1: 'Room 4, The Realignment Clinic, 1342 London Road',
      addressLine2: 'Leigh-on-Sea, SS9 2UH',
      mapsUrl: mapsUrlFor('Room 4, The Realignment Clinic, 1342 London Road, Leigh-on-Sea, SS9 2UH'),
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.1157901690053!2d0.6391112!3d51.54777574999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8da3631ff8c7f%3A0x854182faf4b1991b!2sRm%204%2C%20The%20Realignment%20Clinic%2C%201342%20London%20Rd%2C%20Southend-on-Sea%2C%20Leigh-on-Sea%20SS9%202UH%2C%20UK!5e0!3m2!1sen!2sph!4v1783680152698!5m2!1sen!2sph',
    },
    hours: SHARED_HOURS,
    prices: PRICES_LEIGH,
  },
];
