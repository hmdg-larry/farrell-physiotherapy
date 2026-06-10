/**
 * types.ts — Content shape contracts (Sanity-ready)
 * ─────────────────────────────────────────────────────────────────
 * Every interface here describes a content shape that TODAY is fed
 * by local TypeScript data files (src/data/*) and LATER will be fed
 * by Sanity GROQ queries. The shapes are deliberately designed to
 * map 1:1 onto future Sanity schema types — see SANITY_READY.md.
 *
 * RULES:
 *   - Components consume these types via props or clean imports.
 *   - Components never define their own content shapes for CMS-like
 *     content — they import from here.
 *   - When Sanity is integrated, only the data source changes
 *     (src/data/* → GROQ projections). These types stay.
 *   - Keep every field JSON-serialisable (no functions, no Dates) so
 *     a CMS document can satisfy the type without transformation.
 */

/* ── Images ──────────────────────────────────────────────────────
 * Future Sanity schema: `image` field with required `alt`, consumed
 * through a projection that resolves asset metadata (dimensions).
 * Explicit width/height are MANDATORY to prevent CLS. */
export interface ImageRef {
  /** Public path today (e.g. "/images/hero.webp"); Sanity CDN URL later. */
  src: string;
  /** Alt text. Empty string = decorative (renders aria-hidden). */
  alt: string;
  width: number;
  height: number;
  /** "eager" ONLY for the LCP/hero image; everything else lazy. */
  loading?: 'eager' | 'lazy';
  /** "high" ONLY for the LCP/hero image. */
  fetchpriority?: 'high' | 'low' | 'auto';
}

/* ── SEO ─────────────────────────────────────────────────────────
 * Future Sanity schema: reusable `seo` object on every page document. */
export interface SeoMeta {
  title: string;
  description: string;
  noindex?: boolean;
}

/* ── Navigation ──────────────────────────────────────────────────
 * Future Sanity schema: singleton `navigation` document with arrays
 * of link objects. Hash hrefs (#services) are same-page anchors and
 * never carry active state; route hrefs (/contact) do. */
export interface NavLink {
  label: string;
  /** Route ("/contact"), hash anchor ("#services"), or external URL. */
  href: string;
  /** Open in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/* ── Site settings ───────────────────────────────────────────────
 * Future Sanity schema: singleton `siteSettings` document.
 * THE single source of truth for clinic identity. Header, Footer,
 * contact page, and JSON-LD all read from this — never duplicate
 * these values in components or pages. */
export interface ContactDetails {
  /** Human-readable phone, e.g. "+44 (0) 1234 567 890". */
  phoneDisplay: string;
  /** tel: href value, digits only with country code, e.g. "+441234567890". */
  phoneTel: string;
  email: string;
  addressLine1: string;
  /** "Town, Postcode" — locality and postcode split on the comma for JSON-LD. */
  addressLine2: string;
  /** Public Google Maps URL for the clinic. */
  mapsUrl: string;
}

/** Opening/closing in 24h "HH:MM"; null = closed all day. */
export type DayHours = { open: string; close: string } | null;

/** Keys are fixed and ordered Mon→Sun — JSON-LD and display helpers rely on it. */
export interface OpeningHours {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
}

export interface SiteSettings {
  /** Clinic / brand name. Env-overridable via PUBLIC_SITE_NAME. */
  name: string;
  /** Short brand description used in the footer and default meta. */
  blurb: string;
  /** Default meta description when a page does not provide one. */
  defaultSeoDescription: string;
  contact: ContactDetails;
  hours: OpeningHours;
  /** Primary booking CTA — every "Book Now" button uses this. */
  bookingCta: NavLink;
}

/* ── Page content blocks ─────────────────────────────────────────
 * Future Sanity schemas: `hero` and `pageHero` objects embedded in
 * page documents. These mirror the props of Hero.astro / PageHero.astro
 * so a page can spread CMS data straight into the component. */
export interface HeroContent {
  image: ImageRef;
  /** Optional self-hosted MP4 (see .claude/skills/hero-video.md). */
  video?: string;
  eyebrow?: string;
  /** May contain limited inline HTML (e.g. <span class="heading-accent">). */
  headline: string;
  body?: string;
  cta?: NavLink;
  secondaryCta?: NavLink;
  trustItems?: string[];
}

export interface PageHeroContent {
  image: ImageRef;
  eyebrow?: string;
  headline: string;
  intro?: string;
}

/* ── Collections ─────────────────────────────────────────────────
 * Future Sanity schemas: `service`, `teamMember`, `faq` documents.
 * Reviews/testimonials already have a typed local layer in
 * src/data/reviews.ts (Review, ReviewsMeta) — that file is the
 * reference implementation of this pattern. */
export interface Service {
  title: string;
  /** Route when a dedicated page exists; hash anchor until then. */
  href: string;
  /** Short benefit-led summary for cards. */
  excerpt?: string;
  image?: ImageRef;
}

export interface TeamMember {
  name: string;
  role: string;
  /** e.g. "HCPC registered — PH123456". */
  credentials?: string;
  bio?: string;
  image?: ImageRef;
}

export interface Faq {
  question: string;
  answer: string;
}
