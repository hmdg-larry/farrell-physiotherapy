/**
 * insurers.ts — insurance providers Farrell Physiotherapy works with.
 * ─────────────────────────────────────────────────────────────────
 * Consumed by Footer.astro (logo trust strip). Logo files live in
 * public/images/insurance-logo/ (square .avif, 1:1). Accreditation
 * marks (HCPC, Chartered Society of Physiotherapy) are intentionally
 * NOT in this list — this is insurers only.
 *
 * SANITY-READY: replace this export with a CMS fetch returning the
 * same { file, name } shape — zero template changes.
 */
export interface Insurer {
  /** Filename inside /images/insurance-logo/ */
  file: string;
  /** Brand name — used as the image alt text */
  name: string;
}

export const insurers: Insurer[] = [
  { file: 'axa.avif',          name: 'AXA Health' },
  { file: 'pruhealth.avif',    name: 'PruHealth' },
  { file: 'bupa.avif',         name: 'Bupa' },
  { file: 'standardlife.avif', name: 'Standard Life' },
  { file: 'simplyhealth.avif', name: 'Simplyhealth' },
];
