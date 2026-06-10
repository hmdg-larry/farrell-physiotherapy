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
import type { OpeningHours, SiteSettings, DayHours } from './types';

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
 * SiteSettings → schema.org MedicalClinic JSON-LD.
 * `pageUrl` is the absolute URL of the page carrying the schema.
 * Render server-side via BaseLayout's `schema` prop or an inline
 * ld+json script — never inject structured data client-side.
 */
export function buildMedicalClinicJsonLd(site: SiteSettings, pageUrl: string) {
  const localityRaw     = site.contact.addressLine2.split(',');
  const addressLocality = (localityRaw[0] ?? '').trim();
  const postalCode      = (localityRaw[1] ?? '').trim();

  return {
    '@context': 'https://schema.org',
    '@type':    'MedicalClinic',
    name:       site.name,
    telephone:  site.contact.phoneTel,
    email:      site.contact.email,
    url:        pageUrl,
    address: {
      '@type':        'PostalAddress',
      streetAddress:  site.contact.addressLine1,
      addressLocality,
      postalCode,
      addressCountry: 'GB',
    },
    openingHoursSpecification: buildOpeningHoursSpec(site.hours),
  };
}
