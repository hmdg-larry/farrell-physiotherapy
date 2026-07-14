/**
 * normalize.ts — Content transformation helpers (Sanity-ready)
 * ─────────────────────────────────────────────────────────────────
 * Pure, build-time functions that turn raw content shapes into
 * render-ready or machine-readable output. No browser APIs, no
 * side effects — everything here runs during static generation.
 *
 * When Sanity is integrated these helpers keep working unchanged:
 * they accept the same typed shapes regardless of whether the data
 * came from src/data/* or a GROQ query.
 */
import type {
  OpeningHours,
  SiteSettings,
  DayHours,
  ContactDetails,
  ClinicLocation,
  BreadcrumbItem,
} from './types';

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

const DAY_LABEL_SHORT: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
};

const DAY_LABEL_FULL: Record<string, string> = {
  mon: 'Monday',    tue: 'Tuesday',  wed: 'Wednesday',
  thu: 'Thursday',  fri: 'Friday',   sat: 'Saturday',  sun: 'Sunday',
};

/** "17:00" → "5:00pm" · "09:30" → "9:30am" */
export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr}${suffix}`;
}

export interface HoursDisplayLine {
  /** e.g. "Mon – Fri", "Saturday" */
  days: string;
  /** e.g. "9:00am – 5:00pm", "Closed" */
  hours: string;
}

/**
 * Group consecutive days with identical hours into display lines.
 * { mon..fri: 9-5, sat: null, sun: null } →
 *   [{ days: "Mon – Fri", hours: "9:00am – 5:00pm" },
 *    { days: "Sat – Sun", hours: "Closed" }]
 * Used by the Footer so its hours always match the contact page
 * and the JSON-LD — one source, three consumers.
 */
export function formatOpeningHours(hours: OpeningHours): HoursDisplayLine[] {
  const specKey = (d: DayHours) => (d ? `${d.open}-${d.close}` : 'closed');

  const groups: { start: number; end: number; spec: DayHours }[] = [];
  for (let i = 0; i < DAY_ORDER.length; i++) {
    const spec = hours[DAY_ORDER[i]];
    const prev = groups[groups.length - 1];
    if (prev && specKey(prev.spec) === specKey(spec)) {
      prev.end = i;
    } else {
      groups.push({ start: i, end: i, spec });
    }
  }

  return groups.map(({ start, end, spec }) => {
    const days =
      start === end
        ? DAY_LABEL_FULL[DAY_ORDER[start]]
        : `${DAY_LABEL_SHORT[DAY_ORDER[start]]} – ${DAY_LABEL_SHORT[DAY_ORDER[end]]}`;
    const hoursText = spec
      ? `${formatTime12h(spec.open)} – ${formatTime12h(spec.close)}`
      : 'Closed';
    return { days, hours: hoursText };
  });
}

/**
 * OpeningHours → schema.org OpeningHoursSpecification array.
 * (Moved here from contact.astro so any page can build local-SEO
 * structured data from the same site settings.)
 */
export function buildOpeningHoursSpec(hours: OpeningHours) {
  return DAY_ORDER
    .filter((day) => hours[day] !== null)
    .map((day) => ({
      '@type':   'OpeningHoursSpecification',
      dayOfWeek: DAY_LABEL_FULL[day],
      opens:     hours[day]!.open,
      closes:    hours[day]!.close,
    }));
}

/**
 * SiteSettings (or any object with the same name/contact/hours shape,
 * e.g. a single ClinicLocation entry) → schema.org MedicalClinic
 * JSON-LD. `pageUrl` is the absolute URL of the page carrying the
 * schema. Render server-side via BaseLayout's `schema` prop or an
 * inline ld+json script — never inject structured data client-side.
 */
/** ContactDetails → schema.org PostalAddress. `addressLine2` is
 *  "Town, Postcode" split on the comma (locality + postal code). */
export function buildPostalAddress(contact: ContactDetails) {
  const localityRaw     = contact.addressLine2.split(',');
  const addressLocality = (localityRaw[0] ?? '').trim();
  const postalCode      = (localityRaw[1] ?? '').trim();
  return {
    '@type':        'PostalAddress',
    streetAddress:  contact.addressLine1,
    addressLocality,
    postalCode,
    addressCountry: 'GB',
  };
}

export function buildMedicalClinicJsonLd(site: Pick<SiteSettings, 'name' | 'contact' | 'hours'>, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type':    'MedicalClinic',
    name:       site.name,
    telephone:  site.contact.phoneTel,
    email:      site.contact.email,
    url:        pageUrl,
    address:    buildPostalAddress(site.contact),
    openingHoursSpecification: buildOpeningHoursSpec(site.hours),
  };
}

/**
 * Homepage / site-wide entity: a single MedicalBusiness carrying the
 * three physical clinics as nested MedicalClinic `location` nodes.
 * This is the primary local-SEO / entity signal for the brand — it
 * states name, specialism, area served, contact, and per-clinic NAP +
 * opening hours in one honest graph. `origin` is the absolute site
 * origin (Astro.site.origin). AggregateRating is emitted separately by
 * ReviewsSection.astro (real Google reviews) — kept out of here to
 * avoid a conflicting duplicate rating node.
 */
export function buildOrganizationClinicJsonLd(
  site: Pick<SiteSettings, 'name' | 'contact'>,
  locations: ClinicLocation[],
  origin: string,
) {
  const root = origin.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type':    'MedicalBusiness',
    '@id':      `${root}/#organization`,
    name:       site.name,
    url:        `${root}/`,
    telephone:  site.contact.phoneTel,
    email:      site.contact.email,
    medicalSpecialty: 'Physiotherapy',
    areaServed: { '@type': 'AdministrativeArea', name: 'Essex' },
    location: locations.map((l) => ({
      '@type':    'MedicalClinic',
      name:       `${site.name} — ${l.name}`,
      url:        root + l.clinicHref,
      telephone:  l.contact.phoneTel,
      email:      l.contact.email,
      address:    buildPostalAddress(l.contact),
      openingHoursSpecification: buildOpeningHoursSpec(l.hours),
    })),
  };
}

/** schema.org BreadcrumbList from an ordered list of {name, absolute url}. */
export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      name:      it.name,
      item:      it.url,
    })),
  };
}

/** Derive the mobile hero variant path from a desktop hero image path.
 *  Convention: /images/hero/<name>.avif → /images/hero/<name>-mobile.avif.
 *  Returns undefined for non-hero or non-.avif paths (so callers fall back
 *  to the single desktop image). Every hero in public/images/hero/ ships a
 *  matching -mobile.avif; keep that pairing when adding new heroes. */
export function heroMobileSrc(src?: string): string | undefined {
  if (!src || !/^\/images\/hero\/[^?#]+\.avif$/.test(src)) return undefined;
  return src.replace(/\.avif$/, '-mobile.avif');
}
