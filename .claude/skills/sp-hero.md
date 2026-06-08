# Skill: Secondary Page Hero (`sp-hero`)

Reusable build skill for the HMDG **secondary-page hero** — the premium dark, full-bleed hero used on every non-homepage route (About, Services, Service detail, Conditions, Condition detail, Team, Pricing, Our Clinic, Contact, Blog, and any future secondary page).

It carries a **breadcrumb → H1 → (optional intro) → two CTAs** cluster over a full-bleed LCP image, aligned 1:1 with the homepage hero's spacing, typography, scrim and button language. Every page that uses it emits a valid **BreadcrumbList + WebPage** JSON-LD block automatically from a single `crumbs` source of truth.

**Live reference implementation (first example):** `src/components/AboutHero.astro` + `src/pages/about-us.astro`. The `AboutHero` instance is the simplest case (2-level breadcrumb, no intro). The generalised, productionised component documented below is `SpHero.astro` — drop it in once and reuse it on every secondary page.

> This skill supersedes the legacy `src/components/PageHero.astro` (pre-design-system spacing/colours, no breadcrumb, no buttons, no schema). Do **not** extend PageHero — it is still wired into Contact/Book/Team and must not change. Migrate those pages to `SpHero` only when explicitly asked.

---

## When to use

- Any new secondary (non-homepage) page that needs a hero.
- "Build the hero for the X page", "add a hero to /services/", "create the conditions page hero".
- Replacing an ad-hoc page hero with the standard one.

## When NOT to use

- The **homepage** hero — that is `src/components/home/HomeHero.astro` (full-viewport, rating block, no breadcrumb). Do not use `SpHero` there.
- Sections below the hero (use the numbered-section system + `.s-head`).

---

## Architecture (1 component + per-page wiring)

| File | Role |
|---|---|
| `src/components/SpHero.astro` | The reusable hero. All visual + breadcrumb logic lives here once — **no per-page duplication**. |
| `src/pages/<page>.astro` | Defines the page's `crumbs`, title, description, hero image; builds the JSON-LD; passes everything to `BaseLayout` + `SpHero`. |
| `src/layouts/BaseLayout.astro` | Emits `<title>`, meta description, canonical, OG/Twitter, the LCP `heroImage` preload, and the JSON-LD via its `schema` prop. **Already exists — do not modify.** |
| `src/config/booking.config.ts` | `BOOKING_URL` — the default primary-CTA target. |

**One source of truth per page = the `crumbs` array.** It drives the visible breadcrumb, the `BreadcrumbList` schema, the current-page URL, the `WebPage` schema, and the H1 leaf — so they can never drift.

---

## Required fields (per page)

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | The H1 text **and** the final breadcrumb leaf. Title Case (convertcase rules). Unique per page. |
| `crumbs` | `{ name: string; path: string }[]` | Full trail **including Home and the current page**. `path` is root-relative with a trailing slash, e.g. `[{name:'Home',path:'/'},{name:'About Us',path:'/about-us/'}]`. Nested: add the parent(s) in between. |
| `image` | `string` | LCP hero image, **`.avif`**, root-relative (e.g. `/images/about/about-hero.avif`). |
| `imageAlt` | `string` | Descriptive, local-relevant alt (see Image rules). Never `image`/`photo`/`banner`. |
| `metaTitle` | `string` | `<title>` — e.g. `About Us | ICPC Health`. ~50–60 chars. |
| `metaDescription` | `string` | 140–160 chars, local intent, no stuffing. |

## Optional fields

| Field | Type | Default |
|---|---|---|
| `imageMobile` | `string` (`.avif`) | none — desktop image used at all sizes if omitted |
| `intro` | `string` | none — supporting paragraph below the H1 |
| `primaryCta` | `{ label, href }` | `{ label: 'Book an Appointment', href: BOOKING_URL }` |
| `secondaryCta` | `{ label, href }` | `{ label: 'Contact Us', href: '/contact/' }` |

---

## `src/components/SpHero.astro` — full source (drop-in)

```astro
---
/**
 * SpHero.astro — Secondary Page Hero (reusable)
 * See .claude/skills/sp-hero.md for the full pattern + cloning steps.
 *
 * Premium dark full-bleed hero: breadcrumb → H1 → optional intro → two
 * CTAs, over an LCP image. Spacing/scrim/typography mirror the homepage
 * hero (HomeHero.astro) so every secondary page feels part of one system.
 *
 * The JSON-LD (BreadcrumbList + WebPage) is emitted by the PAGE via
 * BaseLayout's `schema` prop, built from the SAME `crumbs` array passed
 * here — markup + structured data never drift. Image is `.avif` with a
 * `.webp` fallback derived by extension swap (matches HomeHero).
 */
import { BOOKING_URL } from "../config/booking.config";

export interface Crumb { name: string; path: string; }
interface Cta { label: string; href: string; }

interface Props {
  title: string;
  crumbs: Crumb[];                 // full trail incl. Home + current page
  image: string;                   // .avif desktop LCP image
  imageAlt: string;
  imageMobile?: string;            // optional .avif mobile crop
  intro?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

const {
  title,
  crumbs,
  image,
  imageAlt,
  imageMobile,
  intro,
  primaryCta   = { label: "Book an Appointment", href: BOOKING_URL },
  secondaryCta = { label: "Contact Us", href: "/contact/" },
} = Astro.props;

// .webp fallbacks for the <picture> (image MUST be .avif in production).
const imageFallback       = image.replace(/\.avif$/i, ".webp");
const imageMobileFallback = imageMobile?.replace(/\.avif$/i, ".webp");
---

<section class="sp-hero" aria-labelledby="sp-hero-title">
  <div class="sp-hero-media">
    <picture>
      {imageMobile && (
        <source media="(max-width: 767px)" srcset={imageMobile} type="image/avif" />
      )}
      <source media="(min-width: 768px)" srcset={image} type="image/avif" />
      {imageMobileFallback && (
        <source media="(max-width: 767px)" srcset={imageMobileFallback} type="image/webp" />
      )}
      <source media="(min-width: 768px)" srcset={imageFallback} type="image/webp" />
      <img
        class="sp-hero-img"
        src={imageFallback}
        alt={imageAlt}
        width="1920"
        height="1080"
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />
    </picture>
    <span class="sp-hero-overlay" aria-hidden="true"></span>
  </div>

  <div class="sp-hero-inner">
    <nav class="sp-crumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li>
            {i < crumbs.length - 1
              ? <a href={c.path}>{c.name}</a>
              : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>

    <div class="sp-hero-content">
      <h1 id="sp-hero-title" class="sp-hero-h1">{title}</h1>
      {intro && <p class="sp-hero-intro">{intro}</p>}
      <div class="sp-hero-actions">
        <a href={primaryCta.href} class="btn btn-default">{primaryCta.label} <span class="arrow"></span></a>
        <a href={secondaryCta.href} class="btn btn-ghost-light">{secondaryCta.label}</a>
      </div>
    </div>
  </div>
</section>

<style>
  .sp-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background: var(--color-headline);
    color: var(--color-white);
    display: flex;
    flex-direction: column;
    /* Content-driven height with a floor — never full-viewport (secondary
       hero rule, .claude/rules/design.md). */
    min-height: clamp(420px, 58vh, 620px);
    /* SAME padding as the homepage hero: 180px top (clears the fixed
       header) · 30px sides · 80px bottom → 90px ≥1201px. */
    padding: 180px 30px 80px;
  }
  @media (min-width: 1201px) { .sp-hero { padding: 180px 30px 90px; } }
  /* 4K / ultrawide — cap so the composition doesn't float in a void. */
  @media (min-width: 1536px) { .sp-hero { max-height: 760px; } }

  .sp-hero-media { position: absolute; inset: 0; z-index: 0; }
  .sp-hero-media picture { display: block; width: 100%; height: 100%; }
  .sp-hero-img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
  .sp-hero-overlay {
    position: absolute; inset: 0;
    /* Scrim kept ≥0.52 everywhere (deepest at the bottom where the content
       sits) so white text clears WCAG AA on ANY image. Transparent-of-
       #07050d, matching the homepage hero. */
    background: linear-gradient(180deg,
      rgba(7, 5, 13, 0.62) 0%,
      rgba(7, 5, 13, 0.52) 42%,
      rgba(7, 5, 13, 0.88) 100%);
  }

  .sp-hero-inner {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    /* 1340px lane, centred — same as every site section. Set explicitly,
       NOT via .container: Tailwind v4 emits its own .container utility in a
       higher cascade layer that would shadow the fixed width. */
    max-width: var(--spacing-container-max); /* 1340px */
    margin-inline: auto;
  }

  /* Breadcrumb — sits above the title, in the dark zone. */
  .sp-crumbs { margin-bottom: 28px; }
  .sp-crumbs ol {
    list-style: none; margin: 0; padding: 0;
    display: flex; flex-wrap: wrap; align-items: center;
    gap: 10px; font-size: 12px; letter-spacing: 0.04em;
  }
  .sp-crumbs li { display: inline-flex; align-items: center; gap: 10px; }
  /* Separator is decorative/generated — not in the DOM, so it never becomes
     part of the link text. The <ol> + aria-current carry the semantics. */
  .sp-crumbs li + li::before { content: "\203A"; color: rgba(255, 255, 255, 0.5); }
  .sp-crumbs a {
    color: rgba(255, 255, 255, 0.72); /* ≈8:1 on the scrim (AAA) */
    text-decoration: none;
    transition: color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .sp-crumbs a:hover { color: var(--color-white); }
  .sp-crumbs a:focus-visible { outline: 2px solid var(--color-white); outline-offset: 3px; border-radius: 2px; }
  .sp-crumbs [aria-current="page"] { color: var(--color-white); }

  .sp-hero-h1 {
    color: var(--color-white);
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 400;            /* Geist Regular — same as homepage hero */
    letter-spacing: -0.04em;
    line-height: 1;
    max-width: 18ch;
    margin: 0 0 20px;            /* 20px below the H1 — locked spec */
  }
  .sp-hero-intro {
    color: rgba(255, 255, 255, 0.82); /* ≈9:1 on the scrim */
    font-size: clamp(16px, 1.2vw, 19px);
    line-height: 1.6;
    max-width: 52ch;
    margin: 0 0 28px;
  }
  .sp-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }

  @media (prefers-reduced-motion: reduce) { .sp-crumbs a { transition: none; } }
</style>
```

> **Why the H1 has `margin-bottom: 20px`** even when an intro follows: the spec locks 20px below the H1. The intro's own `margin-bottom: 28px` then separates it from the CTAs. With no intro, the 20px sits directly above the buttons.

---

## Page wiring — full example (`src/pages/<page>.astro`)

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SpHero from "../components/SpHero.astro";

const PAGE_TITLE   = "About Us";                 // H1 + breadcrumb leaf
const META_TITLE   = "About Us | ICPC Health";
const META_DESC    = "Meet ICPC Health — a multidisciplinary clinic in Kintore, Aberdeenshire offering expert physiotherapy, pelvic health and podiatry care, serving Inverurie, Aberdeen and the wider region since 1999.";
const HERO_IMAGE   = "/images/about/about-hero.avif";          // .avif LCP
const HERO_IMAGE_M = "/images/about/about-hero-mobile.avif";   // optional

// ONE source of truth — drives visible breadcrumb + both schema nodes.
const crumbs = [
  { name: "Home",     path: "/" },
  { name: "About Us", path: "/about-us/" },
];

const baseOrigin = Astro.site ? Astro.site.origin : Astro.url.origin;
const pageUrl    = `${baseOrigin}${crumbs[crumbs.length - 1].path}`;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${pageUrl}#breadcrumb`,
  "itemListElement": crumbs.map((c, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": c.name,
    "item": `${baseOrigin}${c.path}`,
  })),
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  "url": pageUrl,
  "name": META_TITLE,
  "description": META_DESC,
  "inLanguage": "en-GB",
  "isPartOf": { "@id": `${baseOrigin}/#website` },   // ties into the homepage WebSite entity
  "breadcrumb": { "@id": `${pageUrl}#breadcrumb` },
  "primaryImageOfPage": `${baseOrigin}${HERO_IMAGE}`,
};
---

<BaseLayout
  title={META_TITLE}
  description={META_DESC}
  heroImage={HERO_IMAGE}
  heroImageMobile={HERO_IMAGE_M}
  schema={[breadcrumbSchema, webPageSchema]}
>
  <SpHero
    title={PAGE_TITLE}
    crumbs={crumbs}
    image={HERO_IMAGE}
    imageMobile={HERO_IMAGE_M}
    imageAlt="The ICPC Health team at our clinic in Kintore, Aberdeenshire"
    intro="Optional one-line supporting sentence."
  />

  {/* ...rest of the page sections... */}
</BaseLayout>
```

**Nested page** (e.g. a service detail) — just extend `crumbs`; everything else updates automatically:

```ts
const crumbs = [
  { name: "Home",          path: "/" },
  { name: "Services",      path: "/services/" },
  { name: "Physiotherapy", path: "/service/physiotherapy/" },
];
// Visible: Home › Services › Physiotherapy
// Schema: 3 ListItems, positions 1–3, absolute URLs
```

---

## SEO requirements (coordinate with `seo-reviewer`)

- Exactly **one** `<h1>` (the hero title). No other H1 on the page.
- Visible breadcrumb **and** `BreadcrumbList` JSON-LD, both built from `crumbs`.
- `WebPage` JSON-LD with `@id`, `url`, `name`, `description`, `inLanguage`, `isPartOf` → `#website`, `breadcrumb` → `#breadcrumb`, `primaryImageOfPage`.
- Absolute URLs anchored to `Astro.site` (production origin), so schema matches the canonical path on every host.
- `metaTitle` ~50–60 chars; `metaDescription` 140–160 chars; local intent (town/region) where natural, **no keyword stuffing**.
- Image alt is descriptive + locally relevant.
- **Leave any existing `noindex` robots setting unchanged** — `BaseLayout` defaults `noindex` to `true` during development; do not flip it here.
- Zero schema validation errors (Google Rich Results + schema.org validator).

## Breadcrumb requirements

- Visible pattern: `Home › Page Title` (2-level) or `Home › Parent › Current` (nested). Separator (`›`) is **CSS-generated**, never in the DOM (keeps it out of the accessible name + link text).
- Markup: `<nav aria-label="Breadcrumb"> <ol> <li>…</li> </ol> </nav>`; the **last** crumb is a `<span aria-current="page">` (not a link); earlier crumbs are links.
- Schema URLs are clean, absolute, trailing-slashed, and match the visible trail 1:1.

## Image & LCP requirements (coordinate with `performance-reviewer` / `performance-optimisation`)

- **Never** a CSS `background-image` for the LCP — always a real `<img>` (inside `<picture>`).
- Primary format **`.avif`**; `.webp` fallback derived by extension swap inside the `<picture>`.
- Provide `imageMobile` (smaller `.avif` crop) where a tighter mobile composition helps — desktop/mobile are media-gated so each device fetches only its variant.
- `loading="eager"` + `fetchpriority="high"` + `decoding="async"` on the `<img>` (it is the LCP). **Never** lazy-load it.
- Explicit `width`/`height` on the `<img>` → no CLS.
- Preload the LCP image via `BaseLayout` `heroImage` (+ `heroImageMobile`) so the preload `<link>` is emitted with the correct media gating.
- Keep the scrim ≥0.52 so text stays readable and contrast holds on any image.

## Accessibility requirements (coordinate with `a11y-reviewer`)

- `<section aria-labelledby="sp-hero-title">`; the H1 carries that id.
- Breadcrumb: `nav[aria-label="Breadcrumb"]` + `<ol>` + `aria-current="page"` on the current leaf.
- Decorative layers (`.sp-hero-overlay`, the `›` separator) are `aria-hidden` / generated.
- White text on the ≥0.52 scrim clears **WCAG 2.1 AA** (body 4.5:1, large text 3:1) on any image.
- Buttons use the global `.btn` system → visible `:focus-visible` ring; breadcrumb links have their own focus ring.
- `prefers-reduced-motion` respected (transitions disabled).
- Keyboard order is natural: breadcrumb links → (none for current) → primary CTA → secondary CTA.

## Design requirements (coordinate with `ui-designer` / `ux-architect`)

- Padding **identical** to the homepage hero: `180px 30px 80px` → `90px` bottom ≥1201px. Do not invent new spacing.
- Content locked to the **1340px** lane (`--spacing-container-max`), centred; background is full-bleed.
- H1 = Geist Regular (400), `clamp(48px, 7vw, 88px)`, `-0.04em`, line-height 1, `max-width: 18ch`.
- Content cluster bottom-aligned (`justify-content: flex-end`) inside the deepest part of the scrim.
- Buttons: primary `.btn .btn-default` (purple fill), secondary `.btn .btn-ghost-light` (white-border ghost for dark bg). Global styles only — no bespoke button CSS.
- Tokens/variables only — **no hardcoded hex** beyond the scrim's transparent-`#07050d` stops (which mirror the homepage hero).
- Mobile-first: buttons go full-width ≤640px via the global `.btn` rule; breadcrumb wraps.

---

## How to clone to a new secondary page

1. Ensure `src/components/SpHero.astro` exists (create once from the source above).
2. Encode the hero image to `.avif` (+ optional mobile crop) under `public/images/<page>/`. Use `npm run resize-images` / project image tooling; keep it ≤~1600px wide.
3. Create / edit `src/pages/<page>.astro`. Copy the **Page wiring** block and change only:
   - `PAGE_TITLE`, `META_TITLE`, `META_DESC`
   - `HERO_IMAGE` (+ `HERO_IMAGE_M`)
   - the `crumbs` array (add parents for nested pages)
   - the `imageAlt` and optional `intro` on `<SpHero>`
4. Leave the schema-building code as-is — it regenerates from `crumbs`.
5. Run dev/build; verify with the QA checklist.

Because every page imports the **same** `SpHero`, there is zero duplicated hero logic — only per-page data changes.

---

## QA checklist (complete before marking done)

**Build / structure**
- [ ] `npm run build` is clean.
- [ ] Exactly one `<h1>` on the page; text matches `PAGE_TITLE`.
- [ ] No inline styles; tokens/global classes only; DOM is lean.

**SEO / schema**
- [ ] Visible breadcrumb matches the `crumbs` trail.
- [ ] `BreadcrumbList` JSON-LD parses; positions 1..n; absolute trailing-slashed URLs; `@id` = `<pageUrl>#breadcrumb`.
- [ ] `WebPage` JSON-LD parses; `isPartOf` → `#website`; `breadcrumb` → `#breadcrumb`; `primaryImageOfPage` set.
- [ ] No schema errors (Rich Results + schema.org).
- [ ] `metaTitle`/`metaDescription` present and within length; canonical correct.
- [ ] Existing `noindex` setting unchanged.

**LCP / performance**
- [ ] Hero is a real `<img>` in `<picture>`, `.avif` primary + `.webp` fallback.
- [ ] `eager` + `fetchpriority="high"` + `decoding="async"`; **not** lazy.
- [ ] Explicit `width`/`height`; no CLS on load or during header scroll transition.
- [ ] LCP preload emitted via `BaseLayout heroImage` (+ mobile) with correct media.

**Accessibility / contrast**
- [ ] `nav[aria-label="Breadcrumb"]` + `<ol>` + `aria-current="page"` on the leaf.
- [ ] White text passes WCAG AA over the image (scrim ≥0.52); verify on a light AND a dark image.
- [ ] Visible focus rings on breadcrumb links + both CTAs; keyboard order clean.
- [ ] `prefers-reduced-motion` respected.

**Design / responsive**
- [ ] Padding matches the homepage hero (180/30/80 → 90); content in the 1340px lane.
- [ ] Looks premium and consistent at 320 / 390 / 768 / 1024 / 1440 / 1920 / 2560 / 3840px.
- [ ] Buttons full-width ≤640px; breadcrumb wraps cleanly; no horizontal overflow.
- [ ] Header transparent-mode active state still reads correctly over this hero.

---

## Notes / gotchas

- **Tailwind `.container` clash:** do not use the `.container` class for the inner lane — Tailwind v4 emits its own `.container` utility in a higher cascade layer that overrides the fixed 1340px. Set `max-width: var(--spacing-container-max)` directly (as in the source above). This bug was hit and fixed on the About Us hero.
- **`og:image` follows `heroImage`:** `BaseLayout` derives `og:image` from `heroImage`, so a temporary placeholder becomes the social preview. Swap the real `.avif` (and its `imageAlt`) before launch.
- **About Us currently uses a temporary `/images/placeholder.webp`** (single `.webp`, not the `.avif` picture pattern). That is an interim exception — replace it with a real `.avif` (+ mobile) to make About Us fully conform to this skill.
- **Do not** reintroduce purple active styling on the transparent header — the header active state is white-based in transparent mode (see `Header.astro`); this hero sits under that header.
```
