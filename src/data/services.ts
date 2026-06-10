/**
 * services.ts — Services list (single source of truth)
 * ─────────────────────────────────────────────────────────────────
 * The clinic's services. Currently consumed by the Footer services
 * column; service cards/carousels on client builds should render
 * from this same list.
 *
 * hrefs are hash anchors until dedicated service pages exist —
 * switch to real routes ("/services/physiotherapy") when they do.
 *
 * SANITY-READY: maps onto future `service` documents. Replace this
 * export with a GROQ fetch (`*[_type == "service"] | order(...)`)
 * returning the same `Service` shape — zero component changes.
 */
import type { Service } from '../lib/content/types';

export const services: Service[] = [
  { title: 'Physiotherapy',      href: '#services' },
  { title: 'Sports Injuries',    href: '#services' },
  { title: 'Back & Neck Pain',   href: '#services' },
  { title: 'Post-Surgery Rehab', href: '#services' },
  { title: 'Injury Prevention',  href: '#services' },
];
