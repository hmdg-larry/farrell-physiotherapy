# SEO Post-Type Settings (Rank Math-style)

Premium, reusable SEO system built into Sanity Studio for this Astro + Sanity +
Cloudflare project. Owned by the `sanity-seo` agent.

The single source of truth is the reusable **`seo` object** (`schemaTypes/seoType.ts`),
embedded on document types via `defineField({name: 'seo', type: 'seo', group: 'seo'})`.
Type-specific structured data (e.g. Person for `teamMember`) is **derived on the
frontend from the document's real fields** — the `seo` object only holds
genuinely SEO-only data, so there's no duplication or drift.

Studio components:
- `schemaTypes/components/SeoSnippetPreview.tsx` — live SERP preview + length meters + Basic SEO checklist/score.
- `schemaTypes/components/ConvertImageNote.tsx` — AVIF/WebP convert button reused by image descriptions.

> Colour note: Studio UI accents use the ICPC brand purple `#443082` — **no blue**.

---

## 1. Fields added (the `seo` object)

Grouped into editor tabs: **General · Social Preview · Robots Meta · Schema · AI / GEO SEO**.

**General**
- `preview` — read-only; renders `SeoSnippetPreview` (SERP preview + score). Stores nothing.
- `focusKeyword` — string; drives the checklist/score.
- `metaTitle` — string; ~50–60 char guidance.
- `metaDescription` — text; ~120–160 char guidance.
- `canonicalUrl` — url; blank = use the page's own URL.

**Social Preview**
- `ogTitle`, `ogDescription`, `ogImage` (AVIF/WebP), `twitterTitle`, `twitterDescription`, `twitterImage` (AVIF/WebP), `twitterCard` (`summary_large_image` | `summary`).

**Robots Meta** (booleans)
- `index` (default **true**), `noIndex`, `nofollow`, `noArchive`, `noImageIndex`, `noSnippet`.

**Schema**
- `schemaType` — Person | Article | WebPage | Organization | LocalBusiness | MedicalBusiness | Service | FAQPage. Blank = page-type default.
- `sameAs` — url[] (profiles/registers).
- `worksFor` — string (org override; else `seoSettings`).
- `faq` — array of `{question, answer}` → FAQPage.

**AI / GEO SEO** (editorial guidance, mostly not rendered)
- `aiSummary` (rendered-capable), `entityDescription`, `expertiseSignals`, `localAreaServed` (rendered-capable), `searchIntent`, `suggestedInternalLinks`, `geoNotes`.

Back-compat: `metaTitle`, `metaDescription`, `ogImage`, `noIndex` keep their original names — existing content is preserved.

---

## 2. Reusing the SEO field group for other post types

The `seo` object is already embedded on `page`, `blog`, `service`, `condition`,
`teamMember`. To add SEO to a NEW document type:

```ts
import {defineType, defineField} from 'sanity'

export const myType = defineType({
  name: 'myType',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // …content fields…
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
})
```

That's it — the full Rank Math-style panel (preview, validation, robots, schema,
AI/GEO) comes for free. Pick the right `schemaType` default for the new type on
the frontend (see §6).

---

## 3. Team Members SEO rules

- `teamMember` already embeds `seo` in its **SEO** group.
- Structured data defaults to **Person**, derived from the document:
  - `name` → `name`, `jobTitle` → `jobTitle`, `image` → `image` (Sanity CDN URL),
    `specialistAreas` + `qualifications` → `knowsAbout`, `/team/<slug>/` → `url`.
  - `seo.sameAs` → `sameAs`; `seo.worksFor` (or `seoSettings`) → `worksFor` (the clinic).
- Editors set: focus keyword, meta title/description, optional social overrides,
  robots, `sameAs`, and AI/GEO guidance. They do **not** re-enter name/jobTitle/image.

---

## 4. Schema rules

- One primary `@type` per page from `seo.schemaType`; blank falls back to the
  page-type default (Team Member → Person, Blog → Article, Service → Service, etc.).
- Generate JSON-LD from **real fields**; never emit empty/false properties.
- Use **absolute** URLs (origin + path; Sanity CDN URLs for images).
- `faq[]` → `FAQPage` (only when non-empty). Breadcrumbs → `BreadcrumbList` from the route.
- Omit a schema block entirely rather than emit invalid/partial structured data.
- Verify output with Google Rich Results Test / schema.org validator.

---

## 5. Robots Meta rules

- `index` defaults **true**. Editors flip individual directives as needed.
- **Conflict guard:** object-level validation errors if `index` AND `noIndex` are both on.
- Frontend builds the robots meta from the flags:
  `noIndex` → `noindex`; `nofollow` → `nofollow`; `noArchive` → `noarchive`;
  `noImageIndex` → `noimageindex`; `noSnippet` → `nosnippet`. If none set and
  `index` true → `index, follow` (or omit). NOTE: `BaseLayout` currently defaults
  the whole site to `noindex` until launch — the per-page robots should compose
  with that launch gate.

---

## 6. Astro frontend output requirements

GROQ: every detail query projects the shared `SEO` fragment in
`ICPC Health/src/lib/sanity/queries.ts`; the result type is `SanitySeo` in
`src/lib/sanity/types.ts`. The frontend must output, per page:

- `<title>` ← `seo.metaTitle` || document title
- `<meta name="description">` ← `seo.metaDescription` (|| `aiSummary` || excerpt)
- `<link rel="canonical">` ← `seo.canonicalUrl` || page URL
- `<meta name="robots">` ← composed from the robots flags (see §5)
- Open Graph: `og:title` (`seo.ogTitle`||metaTitle), `og:description`, `og:image`
  (`urlForImage(seo.ogImage)` || page image || site default — **absolute** URL)
- Twitter/X: `twitter:card` (`seo.twitterCard`), title/description/image with fallbacks
- JSON-LD: built from `seo.schemaType` (or per-type default) + derived fields +
  `sameAs`/`worksFor`/`faq`/`localAreaServed`.

✅ **Implemented for team pages.** The wiring exists:
- `src/lib/sanity/seo.ts` — `resolveSeo()` (head values + fallbacks), `buildRobots()`
  (secondary directives only — the `noindex` prop/launch gate governs index/noindex),
  `buildPersonJsonLd()`, `buildFaqJsonLd()`.
- `BaseLayout.astro` — now accepts optional `canonical`, `robots`, `ogTitle`,
  `ogDescription`, `ogImage`, `twitterCard` (backward-compatible; omit = old behaviour).
- `team/[member].astro` → `TeamBio.astro` pass `seo` through; the page emits canonical,
  robots, OG/Twitter, and Person + FAQ JSON-LD derived from real fields.

To wire a NEW Sanity-rendered type: fetch the `seo` projection, call `resolveSeo()`
+ the JSON-LD builders, and pass the resolved props to `BaseLayout` (same pattern as
`TeamBio.astro`).

**Cloudflare:** reads are build-time SSG; needs `SANITY_API_READ_TOKEN` in the Pages
build env (dataset isn't publicly readable). Pre-launch, the site-wide `noindex` gate
in `BaseLayout` overrides per-page robots — lift it at launch.

---

## 7. Validation checklist (enforced in Studio)

- [ ] Meta title ≤ 60 chars (warning), ≥ 30 chars (warning), focus keyword present (warning)
- [ ] Meta description ≤ 160 chars (warning), ≥ 70 chars (warning), focus keyword present (warning)
- [ ] Focus keyword set (warning if empty)
- [ ] Canonical URL is a valid http(s) URL (error if malformed)
- [ ] Robots: `index` and `noIndex` not both on (error)
- [ ] FAQ items require both question and answer (error)
- [ ] Images are AVIF/WebP (error — see image-format policy)
- [ ] `aiSummary` concise (~≤320 chars, warning)

All copy-quality rules are **warnings** (guide, don't block); only invalid data is an **error**.

---

## 8. QA checklist

- [ ] `npx sanity schema extract` + `npm run typegen` succeed (Studio).
- [ ] Studio loads; the SEO object shows all 5 tabs; the SERP preview renders on a
      white card with the brand-purple title (no blue) and the score updates live.
- [ ] Length meters + checklist react to focus keyword / title / description / bio.
- [ ] Robots conflict (Index + No Index) blocks publish with the error.
- [ ] Non-AVIF/WebP social images are rejected.
- [ ] `npm run build` (Astro) succeeds; `seo` is queryable on every detail page.
- [ ] Rendered `<head>` has title, description, canonical, robots, OG, Twitter.
- [ ] JSON-LD validates (Google Rich Results / schema.org); no empty fields; absolute URLs.
- [ ] Existing Team Members + content unaffected (no fields removed/renamed).
- [ ] Mobile/desktop Studio layout stays clean for non-technical editors.

---

## 9. Blog Post — content + Author/Writer

**Content editor (`body`, Portable Text).** The Blog `body` is the primary,
WordPress-like editor: H2–H4, paragraphs, bullet/numbered lists, links (internal +
external), inline images (uploaded to Sanity), blockquotes, and strong/em/code.
`bodyHtml` is kept only as a **legacy backup** (verbatim migrated HTML).
- Migration: `scripts/import-blog.ts` imported the 7 posts; `scripts/convert-blog-to-pt.ts`
  converted each post's `bodyHtml` → `body` (Portable Text), uploading inline images.
  Safe + idempotent — only sets `body` when empty, never overwrites; keeps `bodyHtml`.
- Frontend: `BlogPost.astro` renders `body` via **astro-portabletext** when present
  (serializers: `PtImage.astro` → `<figure class="post-figure">` from `urlForImage`,
  `PtLink.astro` → external-aware links), falling back to `set:html={bodyHtml}`.
  The existing `.post-body :global(...)` CSS styles the standard tags, so the design
  is unchanged.

**Author / Writer (`author`, reference → teamMember).**
- A **reference** field (not plain text) to `teamMember`. The Studio dropdown shows
  the member's **photo + name + job title** (via the teamMember `preview`).
- **`authorName`** is a plain-text **fallback** byline, used ONLY when the writer is
  not a team member (e.g. a former author with no profile).
- **Validation (document-level):** every post must have `author` **or** `authorName`
  — no post can publish without a writer.
- **Auto-mapping:** existing posts were linked to the matching team member by the
  Astro author's `teamSlug` during import (6/7; the 1 non-team author uses `authorName`).
- **Frontend byline** (`BlogPost.astro`): circular author photo (Sanity avatar,
  local fallback) + "By {name}" (links to `/team/<slug>/` for team authors) + **role/
  job title** (when available) + date + read time.
- **JSON-LD:** `buildBlogPostingSchema` sets the BlogPosting `author` from the selected
  writer.

**Data layer:** `src/lib/sanity/blogAdapter.ts` maps Sanity `blog` → the legacy
`BlogPost` shape (incl. `author.jobTitle` + `author.photo`) so listing/detail
components are reused unchanged. `/blog/`, `/blog/page/N/` and `/blog/<slug>/` are
generated from Sanity; `sitemap-blog.xml` is sourced from Sanity.

### Blog QA checklist
- [ ] Studio: Blog `body` edits as rich text; publishing is blocked with no author/writer.
- [ ] Author dropdown shows photo + name + role.
- [ ] `npm run build` succeeds; `/blog/` + posts render from Sanity (design unchanged).
- [ ] Post body renders headings/lists/links/quotes + inline images from `cdn.sanity.io`.
- [ ] Byline shows avatar + linked name + role; BlogPosting JSON-LD has the author.
- [ ] Cloudflare build env has `SANITY_API_READ_TOKEN` (else blog builds empty).
