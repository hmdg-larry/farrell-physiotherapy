# Skill: Blog Migration Pipeline → Astro (Wix + WordPress)

End-to-end playbook for migrating a blog into an Astro project with
**complete content fidelity** — the migrated article matches the source
exactly (no rewriting, summarising, expanding, or AI-generated body
copy). Pulls full post content + metadata from the source, downloads
every featured + inline image, converts everything to **AVIF**, writes
typed Astro pages, and wires up 301 redirects + a data-driven sitemap +
middleware so SEO equity transfers on day one.

The skill supports **two source modes**:

- **Wix mode** (primary, documented in full below) — scrapes the
  server-rendered post HTML, reads the `BlogPosting` JSON-LD + OG tags +
  Wix data-hooks, and cleans the Ricos (`rcv-block*`) markup down to
  faithful semantic HTML. Used on `icpchealth.com` (7 posts) in Jun 2026.
- **WordPress mode** (alternate, at the end) — pulls from the WP REST
  API. Used on `physiolounge.co.uk` (68 posts) in May 2026.

The **post template** it fills is the `SpHero` + `BlogPost.astro` +
`blogPosts.ts` pattern documented inline here.

---

## Golden rule — content fidelity

> The article **body** is migrated verbatim. Never rewrite, summarise,
> shorten, expand, re-order, or inject AI/SEO filler into the body.
> SEO/metadata work happens ONLY on: meta title/description, canonical,
> OG/Twitter, schema, internal-link rewriting, image optimisation, and
> alt text where missing. Headings, paragraphs, lists, tables,
> blockquotes, links, captions and inline images are preserved as
> published.

Preserve: Title · Slug · Publication date · Last-modified date · Author ·
Read time · Featured image · Inline images · Headings · Paragraphs ·
Lists · Tables · Blockquotes · Internal links · External links · Image
captions · Alt text · SEO metadata where available.

---

## When to use (Wix mode)

- Source is a Wix site whose blog posts live at `/post/<slug>` and are
  **server-rendered** (Wix SSRs post HTML for SEO — verify with
  `curl -s https://site.com/post/<slug> | grep -c rcv-block`; a non-zero
  count means the body is in the HTML).
- Target is Astro on Cloudflare Pages using this template's `SpHero` +
  `BaseLayout` + middleware + group-sitemap patterns.

**NOT for:** Wix sites with the blog behind a JS-only render with no
SSR'd body (rare) — you'd need a headless browser. Check first.

---

## URL conversion

`https://www.site.com/post/<slug>`  →  `/blog/<slug>/` (slug preserved
exactly, trailing slash added per site convention).

---

## Wix DOM cheat-sheet (what to extract from where)

| Data | Source in the page |
|---|---|
| Title (verbatim) | `BlogPosting` JSON-LD `headline` (fallback `og:title`) |
| Slug | the URL |
| Publication date | JSON-LD `datePublished` (also `data-hook="time-ago"`) |
| Last-modified | JSON-LD `dateModified` |
| Author name | JSON-LD `author.name` (also `data-hook="user-name"`) |
| Author profile | JSON-LD `author.url` (a Wix `/profile/<id>` — map to a `/team/` page by slugifying the name) |
| Read time | `data-hook="time-to-read"` → `"N min read"` |
| Featured image | JSON-LD `image.url` / `og:image` → extract the `…/media/<id>~mv2.jpg` media id. (Visible in the DOM under `gallery-item-visible gallery-item gallery-item-preloaded` / `data-hook="post-hero-image"`.) |
| Article body | `data-hook="post-description"` … up to `data-hook="post-footer"` |
| Body blocks | `rcv-block*` elements (Ricos rich-content viewer) |
| Inline images | `<figure data-hook="figure-IMAGE">` → `data-image-info` JSON → `imageData.uri` |
| Image caption | `<figcaption>` inside the figure (if present) |
| Links | `<a data-hook="web-link">` (external/internal) and `data-hook="anchor-link"` (#viewer-* in-page jumps) |
| SEO meta | `og:*`, `twitter:*`, `<meta name="description">` |

---

## The two scripts

The migration is **two idempotent Node scripts** (no extra deps beyond
`sharp`, already a devDep):

### 1. `scripts/migrate-wix-blog.mjs` — extract + download images

For each slug: fetches the live post, reads JSON-LD + OG + hooks, isolates
`post-description`, and **cleans the body to faithful semantic HTML**:

- Extracts each `figure-IMAGE` → records `{uri,width,height,caption,alt}`,
  replaces it with an `@@IMG:n@@` token.
- Removes non-content elements (`svg`, `button`, `style`, `script`,
  `wow-image`, stray `img`).
- Unwraps in-page `#viewer-*` anchor links (their target IDs are stripped
  → would break) keeping the visible text.
- Rewrites `<a>`: `/post/<slug>` → `/blog/<slug>/`; known internal Wix
  paths → Astro routes (an editable `INTERNAL_MAP`); external links get
  `target="_blank" rel="noopener noreferrer"`; unmapped internal links are
  kept as absolute live URLs and **logged as exceptions**.
- Strips wrapper `<div>`/`<span>` and Wix's `<u>` link-underline styling
  (use `\b` so `<ul>`/`<ol>` survive — the classic footgun).
- Strips all attributes from semantic tags (keeps `<a href>` only).
- Unwraps `<p>` inside `<li>`.
- Replaces `@@IMG:n@@` with a local `<figure class="post-figure">` →
  `/images/blog/<slug>-<n>.avif` (+ `<figcaption>` if present).
- Collapses empty paragraphs/headings/list-items (Wix spacer blocks) and
  removes spacing `<br>`s between block elements.
- Downloads the featured image (`<slug>.avif`) + every inline image
  (`<slug>-<n>.avif`) from `static.wixstatic.com/media/<uri>` (the
  **original**, no Wix transform) → `sharp` AVIF (max 1600w, q50, effort6)
  into `public/images/blog/`. **No Wix hotlink survives.**

Author → `/team/<slug>/`: slugify the author name and check it against the
`TEAM_SLUGS` set (the existing `src/pages/team/*.astro` slugs). If it
matches, link; if not, the author shows **without** a link (never invent
a team member). Logged as an exception.

Output: `.tmp-wix/extracted.json` (`{records, exceptions}`).

Per-client knobs at the top of the file: `SLUGS`, `WIX` origin,
`TEAM_SLUGS`, `INTERNAL_MAP`, AVIF quality.

### 2. `scripts/build-blog-data.mjs` — write the typed data file

Reads `extracted.json` and writes `src/data/blogPosts.ts`. Body HTML is
embedded **verbatim** (`JSON.stringify`'d, never edited). Only per-post
**metadata** is curated in a `META` map here — `category`, featured-image
`imageAlt`, `metaTitle`, `metaDescription` (local-SEO: Inverurie /
Aberdeenshire / Scotland), and `excerpt`. Emits the `BlogPost` interface,
`blogPostBySlug`, `blogPostsByDateDesc` (newest-first), and
`buildBlogPostingSchema()`.

Run order:
```bash
node scripts/migrate-wix-blog.mjs   # fetch + clean + download/convert images
node scripts/build-blog-data.mjs    # → src/data/blogPosts.ts
npm run build                       # validate
```

---

## Page wiring (per post — ~24 lines)

Each `src/pages/blog/<slug>.astro` is a thin page over the shared
components — identical except the `slug` constant:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SpHero from "../../components/SpHero.astro";
import BlogPost from "../../components/BlogPost.astro";
import { buildSpHero } from "../../lib/spHero";
import { blogPostBySlug, buildBlogPostingSchema } from "../../data/blogPosts";

const slug = "<slug>";
const post = blogPostBySlug(slug)!;
const origin = Astro.site ? Astro.site.origin : Astro.url.origin;

const hero = buildSpHero({
  origin, section: "blog", title: post.title, path: `/blog/${slug}/`,
  image: post.image, imageAlt: post.imageAlt,
  metaTitle: post.metaTitle, metaDescription: post.metaDescription,
});
const schema = [...hero.schema, buildBlogPostingSchema(post, origin)];
---
<BaseLayout title={hero.metaTitle} description={post.metaDescription} heroImage={hero.image} schema={schema}>
  <SpHero {...hero.heroProps} />
  <BlogPost post={post} />
</BaseLayout>
```

- `buildSpHero` needs a `"blog"` section (parent crumb Home › Blog). Add it
  to `SpSection`, `PARENT`, and `DESCRIPTION` in `src/lib/spHero.ts`.
- `BlogPost.astro` renders the byline (author → `/team/` link if it exists,
  date, read time) then `post.bodyHtml` via `set:html`, styled with
  `:global()` descendant selectors (h2/h3/p/ul/ol/li/a/strong/em/
  blockquote/.post-figure/figcaption/table), then a closing booking CTA.
- The featured image is the SpHero LCP backdrop (eager + preloaded);
  inline body images are `loading="lazy"`. No image is hotlinked.

Generate the 6 repeat pages with a shell loop (see the reference repo) —
only the `slug` constant differs.

---

## Blog listing — `src/pages/blog.astro`

SpHero + a responsive card grid (1/2/3-col) reading `blogPostsByDateDesc`
(**newest-first, sorted by `datePublished`**). Each card: featured AVIF
(`loading="lazy"`, explicit width/height), `.idx` category eyebrow,
`<time datetime={datePublished}>`, H2 title, 3-line clamped `excerpt`,
"Read Article". Scroll-reveal stagger matches the rest of the site.
For >~12 posts add pagination (`/blog/page/[page].astro` with
`getStaticPaths`).

---

## Redirects — use the EXISTING architecture (do not add a new system)

This template redirects via the **`WP_REDIRECTS` map in
`src/middleware.ts`** (runs identically on `astro dev` localhost AND
Cloudflare Pages Functions; `public/_redirects` does NOT run in dev).
Add one entry per post — bare-form source key, slashed destination:

```ts
'/post/<slug>': '/blog/<slug>/',
```

The middleware strips a trailing slash before lookup, so `/post/<slug>`
and `/post/<slug>/` both 301 (single-hop) to `/blog/<slug>/`. Do NOT add
rules to `public/_redirects` or `astro.config.mjs` `redirects:` — that
would create a conflicting/dev-broken second system.

---

## Sitemap — `src/pages/sitemap-blog.xml.ts` (data-driven)

SSR endpoint (`prerender = false`) that emits the `/blog/` index + every
post from `blogPosts.ts`, using each post's **real `dateModified`** as
`<lastmod>` (never "today" — avoids forcing Google to re-crawl migrated
posts as fresh). `url.origin` makes URLs match the request host
(localhost / production). Only `/blog/` URLs appear — the `/post/` URLs
are redirects and never indexed. Register a `blog` group in
`src/lib/sitemap.ts` (`groupMeta` + `classify()` + `groupPaths()` init) so
`sitemap-index.xml` references `sitemap-blog.xml`.

---

## Reviewer pipeline (Tier 5)

Run after the build is green. They may touch metadata/CSS/alt/schema —
**never the article body**:

- **seo-reviewer** — meta title/description (unique, length, local SEO:
  Inverurie/Aberdeenshire/Scotland), canonical, OG/Twitter, BlogPosting +
  BreadcrumbList schema, internal-linking, alt text, heading hierarchy,
  duplicate-title/description + broken-link checks, rich-results validity.
- **performance-reviewer** — all images local AVIF, explicit dims (CLS),
  lazy inline / eager+preload hero, zero unnecessary JS, fast LCP.
- **a11y-reviewer** — heading structure, descriptive alt (fill empties on
  migrated inline images), accessible links, WCAG 2.1 AA, keyboard, SR.
- **security-reviewer** — safe redirects (static targets, no open-redirect),
  external links `rel="noopener"`, `set:html` body is migrated/owned
  content (not user input), safe JSON-LD (`JSON.stringify`), safe XML.
- **visual-qa-reviewer** — desktop/tablet/mobile, image rendering,
  typography, layout, author display, listing, related posts.

---

## Validation checklist

- [ ] `npm run build` clean; N+1 routes under `/blog/` (N posts + index)
- [ ] Each post: 1 H1 (verbatim title), body h2→h3 (no skips), byline
      shows author (+ `/team/` link where it exists) + date + read time
- [ ] `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' /post/<slug>`
      → `301 …/blog/<slug>/` (and again with a trailing slash)
- [ ] `grep -rc wixstatic.com dist/client/blog` → **0** (no hotlinks)
- [ ] `public/images/blog/` holds `<slug>.avif` + `<slug>-<n>.avif` for all
- [ ] `sitemap-blog.xml`: index + N posts, real `dateModified` lastmods,
      0 `/post/` URLs, valid XML
- [ ] body verbatim vs source (spot-check 2–3 posts against the live Wix
      article: headings, lists, links, images, wording identical)

---

## Migration exceptions to expect + how they're handled

- **Author with no `/team/` page** → shown unlinked (never invent a member).
- **Unmapped internal Wix link** → kept as absolute live URL + logged;
  add it to `INTERNAL_MAP` if a clean Astro equivalent exists.
- **In-page `#viewer-*` anchors** → unwrapped to plain text (targets gone).
- **Empty inline-image alt** (Wix authors often skip it) → a11y-reviewer
  fills descriptive alts post-migration.
- **Category not in Wix export** → editorially assigned in the `META` map
  (taxonomy metadata, not body content).
- **Non-Title-Case source titles** → preserved verbatim in the H1 (fidelity
  rule); a separate Title-Case `metaTitle` is fine for SEO.

---

## Reference run (icpchealth.com, Wix, Jun 2026)

| Metric | Value |
|---|---|
| Posts migrated | 7 |
| Featured images | 7 |
| Inline images | 15 |
| Total AVIF saved | 22 (`public/images/blog/`) |
| Image sizes | 8–58 KB each |
| Wix hotlinks remaining | 0 |
| Authors linked to `/team/` | 4 of 7 (Nicole Christie ×2, Alison Middleton ×3, Grace Chau; Amanda Barclay-Black unlinked) |
| Date range preserved | 2021-08-30 → 2021-11-15 (pub), 2022-08-12 (mod) |
| Build errors | 0 |
| Old `/post/` URLs 301'd | 7 (100%) |

---

## WordPress mode (alternate source)

When the source is WordPress with the REST API enabled
(`/wp-json/wp/v2/posts?per_page=100&_embed=true` returns JSON), use the WP
extractor instead of the Wix one. Everything downstream (page wiring,
listing, redirects, sitemap, reviewers, validation) is identical — only
the extraction source changes.

WP extractor responsibilities (`scripts/migrate-wp-blog.mjs`, ~526 lines,
reference: `github.com/felmerald-hmdg/physiolounge`):

- Fetch all posts via the REST API (`_embed` brings the featured image +
  author inline). Paginate `?per_page=100&page=N` for 100+ posts.
- Clean Elementor / wp-block / Rank Math scaffolding from
  `content.rendered`; strip WP widgets (latest-posts, jp-relatedposts,
  share-buttons); promote heading levels only if the post lacked H2s.
- Download featured (`_embedded`) + every inline `<img>`; convert to image
  format; rewrite `src` to local paths; preserve alt where present.
- Resumable batches via `.wp-migration-progress.json` (`--slug`, `--batch
  N`, `--all`).

Reference WP run: 68 posts, 252 images, 0 errors, ~25 min.

**WP gotchas:** REST API blocked on hardened installs (fall back to
per-URL HTML scraping); `per_page` defaults to 10 (bump to 100); pre-
Gutenberg page-builder HTML (Visual Composer/WP Bakery) may need extra
cleaner patterns.
```
