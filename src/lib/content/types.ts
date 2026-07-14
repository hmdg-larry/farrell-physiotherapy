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

/* ── Structured data ─────────────────────────────────────────────
 * One entry in a schema.org BreadcrumbList. `url` is absolute
 * (anchored to Astro.site). Consumed by buildBreadcrumbList() in
 * normalize.ts and passed through BaseLayout's `schema` prop. */
export interface BreadcrumbItem {
  name: string;
  url: string;
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

/** A dropdown item that may itself expand into a flyout (mid-level flyout
 *  tier — see .claude/rules/frontend.md "Navigation Active State"). The
 *  item's own `href` still works as a direct link (e.g. a taxonomy hub
 *  page) alongside its `children`. Used for both plain flat dropdowns
 *  (no item has children) and nested flyout dropdowns (every/some items
 *  have children), so one shape covers both cases. */
export interface NavItem extends NavLink {
  children?: NavLink[];
}

/** A visual card shown on the right side of a mega-menu dropdown panel
 *  (image + title + short description), e.g. "Our Story" / "Meet the
 *  Team". Optional per dropdown — when absent, the panel renders as a
 *  plain single-column list. */
export interface MegaCard {
  title: string;
  desc: string;
  href: string;
  /** Defaults to /images/placeholder.webp when omitted. */
  image?: string;
}

/** A top-level header navigation entry. `cta` styles the trigger as the
 *  primary CTA button instead of a plain nav item — e.g. Book Now, a
 *  plain link with `cta: true`. Present (optional) on every variant so
 *  callers can filter/find on `.cta` without a `kind` type guard first. */
export type HeaderNavEntry =
  | { kind: 'link'; label: string; href: string; cta?: boolean }
  | { kind: 'dropdown'; label: string; items: NavItem[]; cta?: boolean; cards?: MegaCard[] }
  | { kind: 'grouped-dropdown'; label: string; groups: NavGroup[]; cta?: boolean };

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
  /** Optional mobile — human-readable, e.g. "07980 898212". */
  mobileDisplay?: string;
  /** Optional mobile tel: href value. */
  mobileTel?: string;
  email: string;
  addressLine1: string;
  /** "Town, Postcode" — locality and postcode split on the comma for JSON-LD. */
  addressLine2: string;
  /** Public Google Maps URL for the clinic (link-out / facade fallback). */
  mapsUrl: string;
  /** Google Maps "Embed a map" iframe src (pb-format) for a live embed. */
  mapEmbed?: string;
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
  /** One-sentence hook shown under the H1 on the detail page. */
  intro?: string;
  /** Key benefit/what's-involved bullet points for the detail page. */
  points?: string[];
  /** "About this service" paragraph(s) for the detail page. */
  about?: string;
  /** Per-service FAQ accordions on the detail page. */
  faqs?: { q: string; a: string }[];
  image?: ImageRef;
}

export interface TeamMember {
  name: string;
  role: string;
  /** URL slug — page lives at /team/{slug}/ */
  slug: string;
  /** e.g. "HCPC registered — PH123456". */
  credentials?: string;
  /** One-sentence hook for cards + hero intro (not repeated in bio). */
  intro: string;
  /** Full biography, one paragraph per array entry. */
  bio: string[];
  /** Named clinical interests/specialisms — only when the source explicitly lists them. */
  specialisms?: string[];
  /** <title> tag override; falls back to "{name} — {role}" when omitted. */
  seoTitle?: string;
  /** <meta description> override. */
  metaDescription?: string;
  image?: ImageRef;
}

export interface Faq {
  question: string;
  answer: string;
}

/* ── Conditions taxonomy ─────────────────────────────────────────
 * Future Sanity schema: `condition` documents referencing a parent
 * `conditionCategory` document. Mirrors the Service shape — both are
 * simple title/href/excerpt collections consumed by list + detail
 * page templates. */
export interface Condition {
  title: string;
  href: string;
  /** Short summary for card/list use. */
  excerpt?: string;
  /** Fuller descriptive/treatment copy for the condition detail page. */
  body?: string;
  /** Optional hero background image; falls back to /images/placeholder.webp. */
  heroImage?: string;
  /** Optional detail-panel image; falls back to placeholder. */
  image?: string;
}

export interface ConditionCategory {
  title: string;
  href: string;
  excerpt?: string;
  /** Optional hero background image; falls back to /images/placeholder.webp. */
  heroImage?: string;
  /** Optional detail-panel image for the hub page; falls back to placeholder. */
  image?: string;
  conditions: Condition[];
}

/* ── Clinic locations ────────────────────────────────────────────
 * Future Sanity schema: `location` documents. One per physical
 * clinic — each has its own contact details, hours, and booking
 * link, distinct from the single-location `site.contact` (which
 * remains the primary/HQ identity used in the header, footer, and
 * site-wide JSON-LD). */
export interface PriceItem {
  /** Treatment/service name, e.g. "Initial Assessment" */
  label: string;
  /** Optional supporting detail, e.g. "30 minutes" */
  detail?: string;
  /** Formatted price, e.g. "£50" */
  price: string;
}

export interface ClinicLocation {
  name: string;
  slug: string;
  /** e.g. "/clinics/chelmsford/" */
  clinicHref: string;
  /** e.g. "/prices/chelmsford/" */
  pricesHref: string;
  /** Booking URL — TBD per SITEMAP.md until the real per-location link is confirmed. */
  bookingHref: string;
  contact: ContactDetails;
  hours: OpeningHours;
  /** Treatment price list for this clinic */
  prices: PriceItem[];
}
