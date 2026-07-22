/**
 * navigation.ts — Header and footer navigation (single source of truth)
 * ─────────────────────────────────────────────────────────────────
 * All nav links live here. Header.astro and Footer.astro render
 * from these arrays — never hardcode links in components.
 *
 * headerNav mirrors SITEMAP.md exactly — do not add/remove/rename
 * entries here without updating SITEMAP.md first (re-run IA review
 * for anything beyond a straight transcription fix).
 *
 * Active-state rules (see .claude/rules/frontend.md):
 *   - Route hrefs ("/contact/") get is-active treatment automatically
 *     in the components (isActive / isSection helpers).
 *   - Hash hrefs ("#services") are same-page anchors — never active.
 *
 * SANITY-READY: maps onto a future `navigation` singleton document
 * (arrays of link objects). Replace these exports with a GROQ fetch
 * returning the same shapes — zero component changes.
 */
import type { NavLink, HeaderNavEntry } from '../lib/content/types';

/**
 * Main header navigation (desktop dropdown/flyout + mobile accordion
 * render from this same list).
 *
 * "What We Treat" is a plain link to /conditions/ (the category index —
 * src/pages/conditions/index.astro) rather than a dropdown. The full
 * 13-category / ~70-condition taxonomy still exists and is fully
 * browsable from that hub page and each category page's own listing —
 * only the header-level flyout was removed. (Previously it was a
 * dropdown of 13 flyout categories; removed per user request. If a
 * dropdown is wanted again, see git history for the prior structure —
 * it was scoped this way instead of the mega-menu skill's full-bleed
 * panel because ~70 leaf conditions exceed that pattern's documented
 * ≤10-children-per-mega scope.)
 *
 * Book Now is a plain link (`cta: true` styles it as the primary CTA
 * button, not a dropdown) to /book-now/ — a hub page listing all 3
 * clinics, each with its own booking link (still `#` placeholders
 * pending real per-location booking URLs — see SITEMAP.md).
 */
export const headerNav: HeaderNavEntry[] = [
  {
    kind: 'dropdown',
    label: 'About',
    items: [
      { label: 'About', href: '/about/' },
      { label: 'Team', href: '/team/' },
      // Plain link (flyout removed per user request) — /prices/ is the
      // existing hub page (src/pages/prices/index.astro) already listing
      // all 3 locations, so nothing is lost by dropping the sub-flyout.
      { label: 'Prices', href: '/prices/' },
      { label: "FAQs", href: '/faqs/' },
      { label: 'Join Our Team', href: '/join-our-team/' },
    ],
    cards: [
      { title: 'Our Story', desc: 'Learn more about our practice and approach to care.', href: '/about/', image: '/images/hero/about-hero.avif' },
      { title: 'Meet the Team', desc: 'Get to know our HCPC-registered physiotherapists.', href: '/team/', image: '/images/hero/team-hero.avif' },
    ],
  },
  {
    kind: 'grouped-dropdown',
    label: 'Services',
    groups: [
      {
        title: 'Therapies',
        links: [
          { label: 'Physiotherapy', href: '/service/physiotherapy-services/' },
          { label: 'Sports Massage', href: '/service/sports-massage-chelmsford-and-witham/' },
          { label: 'Pilates', href: '/service/pilates/' },
          { label: 'Corporate Health', href: '/service/corporate-health/' },
          { label: 'Virtual Clinic', href: '/service/virtual-clinic/' },
        ],
      },
      {
        title: 'Additional Treatments',
        links: [
          { label: 'Ergonomic Assessments', href: '/service/ergonomic-work-based-assessments/' },
          { label: 'Gait Analysis', href: '/service/gait-analysis/' },
          { label: 'Joint Manipulation', href: '/service/joint-manipulation/' },
          { label: 'Joint Mobilisations', href: '/service/joint-mobilisations/' },
          { label: 'Manual Traction', href: '/service/manual-traction/' },
          { label: 'Muscle Energy Techniques', href: '/service/muscle-energy-techniques/' },
          { label: 'Soft Tissue Manipulation', href: '/service/soft-tissue-manipulation/' },
          { label: 'Taping', href: '/service/taping-postural-and-sports/' },
          { label: 'TENS', href: '/service/transcutaneous-electrical-nerve-stimulation-tens/' },
          { label: 'Trigger Points', href: '/service/trigger-points/' },
        ],
      },
    ],
  },
  { kind: 'link', label: 'What We Treat', href: '/conditions/' },
  { kind: 'link', label: 'What To Expect', href: '/appointments/' },
  {
    kind: 'dropdown',
    label: 'Our Clinics',
    items: [
      { label: 'Chelmsford Clinic', href: '/clinics/chelmsford/' },
      { label: 'Witham Clinic', href: '/clinics/witham/' },
      { label: 'Leigh-on-Sea Clinic', href: '/clinics/leigh-on-sea/' },
    ],
    // Mega panel is centred under its own trigger (see Header.astro),
    // not anchored to a viewport edge, so it stays centred regardless
    // of this item's position in the nav.
    cards: [
      { title: 'All Locations', desc: 'Compare our three Essex clinics.', href: '/clinics/', image: '/images/hero/hero-clinics.avif' },
      { title: 'Book an Appointment', desc: 'Choose a clinic and book online.', href: '/book-now/', image: '/images/hero/hero-book.avif' },
    ],
  },
  { kind: 'link', label: 'Contact', href: '/contact/' },
  // Plain link (not a dropdown, per user request) to a hub page listing
  // all 3 clinics — src/pages/book-now/index.astro. Each clinic's own
  // booking link there is still a `#` placeholder pending the real
  // per-location booking URLs (see .project-log.md Unfinished / To Do).
  { kind: 'link', label: 'Book Now', href: '/book-now/', cta: true },
];

/** Footer "Quick Links" column. */
export const footerQuickLinks: NavLink[] = [
  { label: 'Home',            href: '/' },
  { label: 'Services',        href: '#services' },
  { label: 'Meet the Team',   href: '#team' },
  { label: 'Patient Reviews', href: '#testimonials' },
  { label: 'Contact Us',      href: '/contact' },
];

/** Footer legal links — these pages must always exist. */
export const footerLegalLinks: NavLink[] = [
  { label: 'Privacy Policy',       href: '/privacy-policy' },
  { label: 'Terms & Conditions',   href: '/terms-conditions' },
  { label: 'Cookie Policy',        href: '/cookie-policy' },
];
