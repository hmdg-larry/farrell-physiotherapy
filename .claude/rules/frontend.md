---
description: Frontend code rules — Astro, Tailwind, images, header, footer, and code quality
---

# Frontend Rules

## Code Rules (Mandatory)
- No inline styles — no `style=""` and no `style={...}` expressions
- Exception: CSS custom property injection only (`style="--reveal-delay: 80ms"`)
- Class-based styling only — Tailwind utilities or global CSS classes
- Keep DOM clean and minimal — no unnecessary wrappers, no redundant nesting
- Semantic HTML — use `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>`, `<aside>` correctly
- Build reusable components — extract repeated patterns into Astro components
- Code must be maintainable and production ready

## Astro Rules
- Use `BaseLayout.astro` for all client-facing pages
- Header and footer are inside `BaseLayout` — never duplicate them in pages
- Never repeat the same layout structure across pages
- Prefer modular Astro components for all repeated sections (hero, services, team, reviews, booking CTA)
- Use `<slot />` and named slots correctly

## Production HTML Hygiene (Permanent)
- HTML comments (`<!-- ... -->`) are automatically stripped from production output by the `stripHtmlComments` integration in `astro.config.mjs`.
- Source files may freely use `<!-- -->` for readability — they will never leak to view-source.
- **Never remove the `stripHtmlComments` integration** — it is a permanent template feature that every client clone inherits.
- Internal-only routes go under `src/pages/_dev/` (Astro excludes underscore-prefixed paths from routing).
- Use `{/* ... */}` JSX-style comments in template blocks if you want the comment stripped at compile time rather than at build time.
- Never hardcode secrets or internal API paths into page markup — keep them in `.env` (non-`PUBLIC_` prefix) and access only from server-side code.

## Section Padding Convention

Vertical padding goes on `<section>`, not on the container.

Standard pattern:

```html
<section class="py-section-y lg:py-section-y-lg bg-white">
  <div class="container-main">
    ...content...
  </div>
</section>
```

- `<section>` owns: background colour, vertical padding
- `.container-main` owns: max-width (1340px), auto margin, 30px horizontal padding
- `.container-main` has **NO** vertical padding
- Same applies to `.section` (alias for `.container-main`)

## Image Rules

### Default format
- `.webp` or `.avif` — **both formats are accepted** across the project (do not warn about or convert `.avif`)
- No fallback setup needed for either format
- No dual-format `<picture>` source switching needed
- `.jpg` or `.png` only when explicitly required

If a developer uploads or tries to use `.jpg` or `.png` where a better format should be used, show this warning:

"Fel recommends uploading .webp images. Use this converter link: https://hmdg-elementor.flywheelsites.com/"

### Required image pattern
```html
<img
  src="/images/example.webp"
  alt="Descriptive alt text"
  loading="lazy"
  decoding="async"
  width="1600"
  height="900"
/>
```

- Use `loading="eager"` for above-the-fold hero images only
- Hero/LCP image additionally gets `fetchpriority="high"` + `<link rel="preload">` (BaseLayout `preloadImage` prop) — and is never inside a carousel, never a CSS background, never animated from `opacity: 0`
- Always include `decoding="async"` on every image
- Always set explicit `width` and `height` to prevent CLS
- Never mix aspect ratios within a card grid

## Content Data Layer (Sanity-Ready — Mandatory)

CMS-like content lives in typed local data files — components are render-only:

- **Clinic identity** (name, contact, address, hours, booking CTA) → `src/data/site.ts` — THE single source of truth; Header, Footer, contact page, and JSON-LD all consume it
- **Navigation** → `src/data/navigation.ts` · **Services** → `src/data/services.ts` · **Reviews** → `src/data/reviews.ts`
- **Content shapes** → `src/lib/content/types.ts` · **Transforms** (hours formatting, JSON-LD builders) → `src/lib/content/normalize.ts`

Rules:
- Never hardcode clinic details, nav links, or service lists in components or pages — import from `src/data/*`
- New CMS-like content gets a type in `types.ts` first, then a data file, then render-only consumption
- Future Sanity integration replaces the data source layer only — see `SANITY_READY.md`

---

## YouTube Background Video Rules

When using a YouTube video as a section background:
- Limit playback to the first **10 seconds** — use the YouTube embed `end=10` parameter
- Autoplay, mute, loop within the 10-second window, no controls
- Use `youtube-nocookie.com` for privacy compliance
- Defer iframe loading — inject after page load using a facade pattern (poster image first)
- Always provide a static poster/fallback image
- Add `prefers-reduced-motion` fallback that hides the video and shows the poster
- Reserve container dimensions to prevent CLS
- Keep performance in mind — never let a background video degrade page speed
- This rule applies automatically to every YouTube background video in the project

---

## Header and Footer Rules

### Header
- Must be consistent across all pages
- Menus and mega menus must be shared globally — never recreated per page

### Footer
Footer must be consistent across all pages and include:
- Embedded map
- Dynamic copyright year
- "Designed & Developed by HMDG" linked to `https://hmdg.co.uk/` in a new tab
- Privacy Policy
- Terms & Conditions
- Cookie Policy

These legal pages must exist even if initially empty.

---

## Navigation Active State (Mandatory — Header AND Footer)

Every nav link on the site — in `Header.astro`, `Footer.astro`, any dropdown, flyout, mega-menu, or mobile menu — MUST visually indicate the current page. Applied on desktop AND mobile. Apply this whenever any nav item is added, edited, or cloned. **Do not ask first.**

### Required helpers (frontmatter of Header.astro AND Footer.astro)

```ts
const currentPath = Astro.url.pathname;

// Exact match — '/' is homepage-only; trailing slash normalised
const isActive = (href: string): boolean => {
  if (href === '/') return currentPath === '/';
  const norm = href.endsWith('/') ? href : href + '/';
  return currentPath === norm || currentPath === norm.slice(0, -1);
};

// Prefix match — use for dropdown parents and mid-level flyout
// triggers so children activate their ancestors
const isSection = (prefix: string): boolean => currentPath.startsWith(prefix);
```

### Tiers to cover (check every one — never miss any)

1. **Top-level plain links** → `isActive(href)`
2. **Top-level dropdown triggers** → `isSection(prefix)` (e.g. Services, Minor Surgeries)
3. **Mid-level flyout triggers** → `isSection(prefix)` — **MOST COMMONLY MISSED TIER, check it explicitly**
4. **Leaf links in dropdowns** → `isActive(href)`
5. **Every mobile equivalent** → same helpers, duplicated — do not let desktop and mobile drift

### Visual rules

- **Header active** = identical to hover (same colour token, weight, pill or underline treatment). Reuse classes: `.site-nav-item.is-active`, `.nav-dropdown-item.is-active`, `.mobile-nav-item.is-active`, `.mobile-sub-item.is-active`.
- **Footer active** = MUST go through `ui-designer` before implementation because the footer lives on a dark background where plain hover is not visually sufficient. Current spec: `.footer-link.is-active { color: #fff; font-weight: 600; }` — white + semibold.
- **Never invent new colours** — use existing design tokens from `src/styles/global.css @theme`.

### Astro class:list pattern

```astro
<!-- Top-level link -->
<a href="/contact/" class:list={["site-nav-item ...", { "is-active": contactActive }]}>Contact</a>

<!-- Dropdown parent button -->
<button class:list={["site-nav-item ...", { "is-active": servicesActive }]}>Services</button>

<!-- Mid-level flyout trigger -->
<button class:list={["nav-dropdown-item ...", { "is-active": conditionsActive }]}>Conditions</button>

<!-- Leaf link inside dropdown -->
<a href="/minor-surgery/moles/" class:list={["nav-dropdown-item", { "is-active": isActive("/minor-surgery/moles/") }]}>Moles</a>

<!-- Footer link (all columns except contact details and HMDG credit) -->
<a href="/about-us/" class:list={["footer-link ...", { "is-active": isActive("/about-us/") }]}>About Us</a>
```

### Checklist for any nav change (apply every time)

- [ ] `isActive` / `isSection` applied to this element?
- [ ] If dropdown trigger — does it use `isSection` so children activate it?
- [ ] If mid-level flyout trigger — does it have its own `*Active` boolean?
- [ ] Same change applied to the mobile equivalent?
- [ ] Footer links get `.footer-link` base class + `.is-active` conditional?
- [ ] Visual matches hover (header) or ui-designer's dark-bg spec (footer)?

Hash-anchor links (e.g. `#services`) are scroll targets on the same page, not routes — they do not carry active state. Only real URL paths starting with `/` use `isActive` / `isSection`.

---

## Automatic Sitemap Generation (Mandatory)

Dropping a new `.astro` file in `src/pages/` makes it appear in the correct grouped sitemap with **zero manual registration**. URLs auto-detect host (localhost, `*.workers.dev`, production domain) via `Astro.url.origin`.

### Architecture

1. **`sitemapAutoScan` integration** in `astro.config.mjs` scans `src/pages/` at config-setup and writes `src/data/sitemap-pages.generated.ts` — a string array of every indexable URL path. Runs on every dev start AND every production build.
2. **`src/lib/sitemap.ts`** consumes the generated list, classifies each path into a named group (`core`, `about`, `team`, `services`, `conditions`, `legal`, `support`) by URL pattern, applies per-group priority + changefreq, and exposes `buildSitemapXml()` + `buildSitemapIndexXml()`.
3. **SSR endpoints** at `src/pages/sitemap-*.xml.ts` — one per group plus `sitemap-index.xml.ts` as the master. Each endpoint uses `Astro.url.origin` so URLs match the request host. All `export const prerender = false`.

### Exclusion rules (enforced in the scanner)

- Files under `src/pages/api/` (SSR endpoints)
- Files/folders starting with `_` (dev-only)
- Paths under `/thank-you*` (three-layer noindex system)
- Source containing `noindex={true}` prop (grep check on file contents)
- Non-`.astro` files (e.g. the sitemap endpoints themselves)

### Rules for contributors

- **Never add a page's URL manually to any sitemap list** — just create the `.astro` file, run dev/build, done.
- **Never install `@astrojs/sitemap`** — this system replaces it with zero dependencies.
- Every generated XML (index + group sitemaps) includes `<!-- Generated by HMDG | hmdg.co.uk -->` immediately after the XML declaration.
- `public/robots.txt` references `Sitemap: <origin>/sitemap-index.xml`.
- Classification rules live in one place: `classify()` in `src/lib/sitemap.ts`. Extend them by adding a pattern before the `support` fallback.

### Adding a new group

1. Add a key + metadata to `groupMeta` in `src/lib/sitemap.ts`
2. Add a pattern match in `classify()` (first-match-wins, most-specific first)
3. Create `src/pages/sitemap-<slug>.xml.ts` copying the template of any existing endpoint

No changes to the scanner or the index endpoint needed — the index enumerates populated groups automatically.
