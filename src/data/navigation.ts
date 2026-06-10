/**
 * navigation.ts — Header and footer navigation (single source of truth)
 * ─────────────────────────────────────────────────────────────────
 * All nav links live here. Header.astro and Footer.astro render
 * from these arrays — never hardcode links in components.
 *
 * Active-state rules (see .claude/rules/frontend.md):
 *   - Route hrefs ("/contact") get is-active treatment automatically
 *     in the components (isActive helper).
 *   - Hash hrefs ("#services") are same-page anchors — never active.
 *
 * SANITY-READY: maps onto a future `navigation` singleton document
 * (arrays of link objects). Replace these exports with a GROQ fetch
 * returning the same shapes — zero component changes.
 */
import type { NavLink } from '../lib/content/types';

/** Main header navigation (desktop + mobile drawer render the same list). */
export const headerNav: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'Reviews',  href: '#testimonials' },
  { label: 'Team',     href: '#team' },
  { label: 'Contact',  href: '/contact' },
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
