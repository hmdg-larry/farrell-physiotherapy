# SANITY_READY.md — Sanity Preparation Guide

> **Status: Sanity is NOT integrated.** No Sanity packages are installed, no Studio
> exists, and nothing fetches from Sanity at runtime. This document describes how the
> project is *structured* so Sanity can be integrated later without rewriting the site.

---

## 1. Current Local-Content Workflow

All CMS-like content lives in typed local data files. Components are render-only —
they receive content via props or clean imports and never store content themselves.

| Content | Lives in | Consumed by |
|---|---|---|
| Clinic identity (name, blurb, contact, address, opening hours, booking CTA) | `src/data/site.ts` | `Header.astro`, `Footer.astro`, `contact.astro`, MedicalClinic JSON-LD |
| Navigation (header nav, footer quick links, legal links) | `src/data/navigation.ts` | `Header.astro`, `Footer.astro` |
| Services list | `src/data/services.ts` | `Footer.astro` (services column); future service cards/carousels |
| Google reviews + aggregate rating | `src/data/reviews.ts` | `ReviewsSection.astro`, `TestimonialSlider.astro` |
| Hero content | Page frontmatter → props | `Hero.astro`, `PageHero.astro` (already fully props-driven) |
| SEO metadata (title, description, noindex, JSON-LD) | Page frontmatter → props | `BaseLayout.astro` (server-rendered `<head>`) |
| Content shape contracts (TypeScript) | `src/lib/content/types.ts` | every data file + future GROQ projections |
| Content transforms (hours formatting, JSON-LD builders) | `src/lib/content/normalize.ts` | `Footer.astro`, `contact.astro` |

**The rule:** to change site content you edit `src/data/*`; you never edit components.
This is exactly the seam where Sanity will plug in.

---

## 2. How Local Data Maps to Future Sanity Schemas

Each interface in `src/lib/content/types.ts` is designed to map 1:1 onto a Sanity
schema type:

| TypeScript type | Future Sanity schema | Kind |
|---|---|---|
| `SiteSettings` | `siteSettings` | singleton document |
| `NavLink[]` exports in `navigation.ts` | `navigation` | singleton document |
| `Service` | `service` | document (one per service) |
| `Review` / `ReviewsMeta` (`src/data/reviews.ts`) | `review` + `reviewsMeta` | documents (or keep the Google-fetch pipeline) |
| `TeamMember` | `teamMember` | document |
| `Faq` | `faq` | document (or array field on a page) |
| `HeroContent` / `PageHeroContent` | `hero` / `pageHero` | object embedded in page documents |
| `SeoMeta` | `seo` | object embedded in every page document |
| `ImageRef` | `image` field + asset projection | field |

Schema design notes for the future Studio:
- `alt` is required on every image field (validation rule) — `ImageRef.alt` is non-optional.
- Image projections must resolve `asset->metadata.dimensions` so `width`/`height`
  are always available (CLS protection is non-negotiable).
- `OpeningHours` stores 24h `"HH:MM"` strings; `null` = closed. Keep the same shape in
  Sanity (an object with seven day fields) so `normalize.ts` keeps working unchanged.
- Headlines may carry limited inline HTML (`<span class="heading-accent">`). In Sanity,
  model this as Portable Text with a single custom mark, serialised at build time.

---

## 3. Where Future Sanity Queries Should Live

Create `src/lib/sanity/` when integrating:

```
src/lib/sanity/
  client.ts     ← configured @sanity/client (or sanity:client from @sanity/astro)
  queries.ts    ← GROQ strings, one named export per content need
  fetch.ts      ← typed fetch wrappers returning the types from src/lib/content/types.ts
```

The integration contract: **each fetch wrapper returns the exact same TypeScript type
the local data file exports today.** Then the only change in the rest of the codebase is
the import source:

```ts
// Before (today):
import { site } from '../data/site';

// After (Sanity integrated):
const site = await getSiteSettings();   // returns SiteSettings — same shape
```

Components, layouts, JSON-LD builders, and `normalize.ts` need **zero changes**.

---

## 4. Performance Rules for the Future Integration (Non-Negotiable)

These protect Google PageSpeed, LCP, CLS, INP, and SEO when Sanity is added:

1. **Fetch at build time only.** All public marketing pages stay statically prerendered.
   GROQ queries run in page/layout frontmatter during `astro build` — never in the browser.
2. **No client-side Sanity fetching** on marketing pages. No `@sanity/client` in any
   client bundle, no loading spinners for content, no hydration to render text.
   Client-side CMS fetching destroys LCP (content paints late), CLS (content pops in),
   and SEO (crawlers see empty shells). Content changes go live via a **Sanity webhook →
   Cloudflare Pages deploy hook** rebuild, not via runtime fetching.
3. **Images:** serve Sanity CDN images as `.webp`/`.avif` (`?auto=format`), always with
   explicit `width`/`height` from asset metadata, `loading="lazy"` by default, and
   `loading="eager"` + `fetchpriority="high"` + BaseLayout preload for the hero/LCP
   image only. Cap hero sources at ~1600px wide and request a mobile variant.
4. **SEO metadata and JSON-LD stay server-rendered** through BaseLayout exactly as today.
5. **No new hydration.** Sanity is a data source, not a reason for client components.
6. **Bundle discipline:** the only acceptable new dependencies at integration time are
   the Sanity packages themselves, imported in server-side code only. If Visual Editing /
   Presentation is added later, gate it to draft-preview routes — never load overlays on
   the production site.
7. **Preview mode** (if needed) runs on a separate noindex route using
   `SANITY_READ_TOKEN` server-side — the token never reaches the browser.

---

## 5. Optional Future Environment Variables (documentation only)

**Not required yet — do not set these until Sanity is actually integrated:**

```bash
PUBLIC_SANITY_PROJECT_ID=    # Sanity project ID (public by design)
PUBLIC_SANITY_DATASET=       # usually "production" (public by design)
SANITY_API_VERSION=          # pin a date, e.g. 2026-06-01 (server-side)
SANITY_READ_TOKEN=           # ONLY if private datasets/previews are needed — server-side ONLY, never PUBLIC_
```

---

## 6. Integration Checklist (for the future session)

When the time comes, the `sanity-developer` agent leads, with `sanity-reviewer`
verifying. Steps:

1. Create the Sanity project + Studio (separate repo or `/studio` folder — decide then).
2. Define schemas matching Section 2 (validate against `src/lib/content/types.ts`).
3. Migrate the contents of `src/data/site.ts`, `navigation.ts`, `services.ts` (and
   optionally `reviews.ts`) into Sanity documents.
4. Add `src/lib/sanity/` (client, queries, typed fetch wrappers per Section 3).
5. Swap import sources in `Header.astro`, `Footer.astro`, `contact.astro` — nothing else.
6. Set up the Sanity webhook → Cloudflare Pages deploy hook for content-driven rebuilds.
7. Add env vars (Section 5) to `.env` and Cloudflare Pages → Build scope.
8. Run the performance gate: `performance-optimisation` agent + PageSpeed Insights —
   the score must NOT drop versus the pre-Sanity build.
9. Verify build output is still fully static for marketing pages (`dist/` HTML contains
   all content; no client-side content fetching).

### Blog content (future)
If/when a blog is added, prefer Sanity documents fetched at build time via
`getStaticPaths()`. Astro Content Collections (`src/content/`) are an acceptable interim
for markdown-authored posts, but don't create the collection until there is real content.

---

## 7. Why This Approach

- **Today:** content is editable in one obvious place per concern, typed, and duplicated
  nowhere (the header, footer, contact page, and JSON-LD can never disagree).
- **At integration:** Sanity replaces the *data source layer only*. UI components,
  styling, performance patterns, SEO rendering, and accessibility are untouched.
- **Performance:** the site is static HTML before and after — Sanity changes where
  content is authored, not how it is delivered.
