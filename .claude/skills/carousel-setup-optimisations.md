---
description: Reusable carousel build + optimisation prompt for Astro + Tailwind sites. Captures every smoothness, perf, a11y, and LCP fix layered on top of the base `carousel.md` skill. Use for any new Astro project that needs a premium, lag-free, PSI 90+ services/team/conditions carousel.
---

# Carousel Setup + Optimisations — Reusable Build Prompt

Complete, portable spec for shipping a smooth, lag-free, LCP-friendly Swiper carousel in any Astro project. Covers the **base implementation** AND every **structural performance fix** layered on top across the lineage:

| Commit | Optimisation |
|---|---|
| `d8a1400` | Responsive `-card.webp` variants — 480×675 portrait sized to the actual 320×450 CSS card |
| `3dc3249` | `focusin` lazy-load trigger — fixes WCAG 2.1 keyboard regression |
| `42077ad` | Build-time inlining of tiny carousel entry scripts + Vite `modulePreload: false` — removes PSI critical-chain entries |

Honours the design from the canonical Northern Medical implementation. Uses `/public/images/placeholder.webp` as default image until real artwork is supplied.

---

## When to use

Trigger this skill when the user asks for:

- A new services / team / locations / conditions carousel on any Astro site
- "Build a carousel like the Northern Medical services one"
- "Carousel keeps lagging" / "carousel jumps on init" / "Lighthouse flags the carousel"
- "Make the carousel not show up in the PageSpeed critical chain"
- Cloning the HMDG base template into a new client repo where the carousel needs to be perfect from day one

---

## Goal — what "smooth, no lag, no glitch, perfect" actually means

1. **Zero CLS** — fixed `w-[320px] h-[450px]` cards with explicit image `width` + `height`. The track reserves space before Swiper hydrates.
2. **LCP-friendly** — Swiper bundle (~60 KB gzip) and component entry scripts are kept off the initial critical request chain. The carousel is **never** the LCP element (cards are below the fold and `loading="lazy"`).
3. **No init flash** — Swiper module loads lazily; before it hydrates, the slides render as a static horizontal strip with `overflow-visible`. The user sees finished cards immediately; the JS only enriches them with autoplay + loop.
4. **No autoplay jank** — autoplay is paused until the section enters the viewport, paused when it leaves, paused when hovered.
5. **Keyboard parity** — keyboard users (Tab + Enter) trigger init via `focusin`, not just `pointerdown`. Mouse, touch, and keyboard all get the same first-interaction latency.
6. **Reduced-motion compliance** — autoplay disabled, transition speed `0` when `prefers-reduced-motion: reduce`.
7. **Multi-instance safe** — multiple carousels on one page (services + team + reviews) use unique selectors; no cross-instance autoplay conflicts.

---

## Architecture overview

```
┌────────────────────────────────────────────────────────────────────┐
│ DATA                                                               │
│   src/data/<context>Services.ts                                    │
│     export const <context>Services: Service[] = [ … ]              │
│     image paths point at responsive -card.webp variants            │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ COMPONENTS                                                         │
│   src/components/ServiceCard.astro    — single card                │
│   src/components/ServicesCarousel.astro — section + Swiper track   │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ BUILD INTEGRATION (astro.config.mjs)                               │
│   inlineTinyAstroScripts() — removes 2-3 tiny entry chunks from    │
│                              PSI's network dependency tree         │
│   vite.build.modulePreload: false — removes preload-helper chunk   │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ IMAGE PIPELINE                                                     │
│   /images/<service>.webp              — original (page-level use)  │
│   /images/<service>-card.webp         — 480×675 for 320×450 cards  │
│   /images/placeholder.webp            — fallback during stubbing   │
└────────────────────────────────────────────────────────────────────┘
```

---

## Hard rules (do not violate)

1. **Card dimensions are fixed: `w-[320px] h-[450px]`** — Swiper `slidesPerView: 'auto'` relies on the slide having a defined width. Never use `flex-1` or percentage widths inside a Swiper slide.
2. **Swiper is bundled from npm via Vite — never CDN.** `import Swiper from 'swiper'` + `import { Autoplay, Navigation } from 'swiper/modules'`.
3. **Swiper imports are dynamic** — `await import('swiper')` inside the lazy init function. Static top-level `import Swiper from 'swiper'` would defeat the lazy-load and ship the bundle to every page that uses the component.
4. **CSS imports are static at the top of the frontmatter** — `import 'swiper/css'` + `import 'swiper/css/autoplay'`. Astro inlines them into `<head>` per the `inlineStylesheets: 'always'` build option, so they cost nothing on first paint.
5. **Section is `overflow-hidden`, inner Swiper is `!overflow-visible`** — cards bleed past the container edge while the section clips horizontal page overflow.
6. **Every image has explicit `width` + `height` matching the served file** — for the card, that's `width="320" height="450"` (CSS pixels). The actual file is 480×675 (1.5× DPR variant).
7. **Image `alt` defaults to the card title** — never `alt=""`. `ServiceCard` exposes `imageAlt?: string` with default `imageAlt ?? title`.
8. **`focusin` AND `pointerdown` BOTH trigger lazy init** — keyboard users miss `pointerdown` and would break WCAG 2.1.
9. **Autoplay paused off-screen via `IntersectionObserver`** — and stopped before the user even sees it. `swiper.autoplay?.stop()` is called immediately after construction; the IO callback starts it when in view.
10. **`prefers-reduced-motion: reduce` → `speed: 0` and `autoplay: false`** — full motion fallback path.
11. **Build-time inline integration `inlineTinyAstroScripts()` must be registered in `astro.config.mjs`** — without it, the Astro-generated component entry chunk shows up as a separate request in PSI's critical chain.
12. **`vite.build.modulePreload: false`** — paired with the inline integration above. Removes the `preload-helper.js` chunk from the critical chain.
13. **For multi-carousel pages, every Swiper selector + every arrow class must be unique** — `.services-swiper` / `.services-prev` / `.services-next` for services; `.team-swiper` / `.team-prev` / `.team-next` for team; etc.

---

## File 1 — `src/data/<context>Services.ts`

```ts
/**
 * <Context> services — data source for the <Context> carousel.
 * Each entry maps directly to an existing page under /<context>/*.
 *
 * Image convention: /images/<context>/<filename>-card.webp
 *   The "-card.webp" variants are 480×675 portrait, sized for the fixed
 *   320×450 CSS card (1.5× DPR). Originals (without "-card") are reserved
 *   for the individual detail pages where they display much larger.
 *   Until real artwork is supplied, point every entry at the placeholder.
 */

export interface Service {
  title: string;
  image: string;
  href: string;
}

export const exampleServices: Service[] = [
  {
    title: 'Service One',
    image: '/images/placeholder.webp',
    href: '/services/service-one/',
  },
  {
    title: 'Service Two',
    image: '/images/placeholder.webp',
    href: '/services/service-two/',
  },
  // … add more
];
```

**Image convention:** every site that uses this pattern stages cards on `/images/placeholder.webp` first, then swaps each entry to a real `-card.webp` (480×675) once artwork lands. The shared placeholder is the safe default — it's already in the base template at `public/images/placeholder.webp`.

---

## File 2 — `src/components/ServiceCard.astro`

Single card. Fully clickable anchor. Image background + flat overlay + title (top-left) + animated plus button (bottom-right, glass → solid-white + 90° rotate on hover).

```astro
---
/**
 * ServiceCard.astro
 * Premium service card. Fully clickable anchor wraps:
 *   - Full-cover .webp background image (portrait, 320×450 CSS / 480×675 file)
 *   - Flat overlay (#1212124A) for title readability
 *   - Title pinned top-left
 *   - Animated plus button pinned bottom-right
 *
 * No inline styles. No external hover classes. Purely Tailwind + tokens.
 */
import { Plus } from '@lucide/astro';

interface Props {
  title: string;
  image: string;
  href: string;
  /** Override for the image alt. Defaults to the card title so every
   *  consumer inherits descriptive alt automatically. */
  imageAlt?: string;
}

const { title, image, href, imageAlt } = Astro.props;
const finalAlt = imageAlt ?? title;
---

<a
  href={href}
  aria-label={title}
  class="group relative block w-[320px] h-[450px] overflow-hidden rounded-(--radius-card) isolate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
>
  <!-- Background image — alt defaults to card title for SEO + a11y -->
  <img
    src={image}
    alt={finalAlt}
    width="320"
    height="450"
    loading="lazy"
    decoding="async"
    class="absolute inset-0 h-full w-full object-cover"
  />

  <!-- Overlay — subtle lighten on hover for gentle image reveal -->
  <div class="absolute inset-0 bg-[#1212124A] transition-colors duration-300 ease-out group-hover:bg-[#12121226]"></div>

  <!-- Title (top-left, clears plus-button zone on the right) -->
  <h3 class="absolute top-6 left-6 right-6 pr-14 m-0 text-white text-lg md:text-xl font-normal leading-snug tracking-tight">
    {title}
  </h3>

  <!-- Plus button (bottom-right, glass → solid-white + 90° rotate on hover) -->
  <span
    aria-hidden="true"
    class="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20 transition-all duration-300 ease-out group-hover:bg-white group-hover:text-(--color-primary) group-hover:rotate-90 group-hover:ring-white"
  >
    <Plus class="w-6 h-6" stroke-width={2} />
  </span>
</a>
```

**Notes:**
- `group` on the `<a>` drives every hover state — overlay, plus button colour, rotation, ring.
- `isolate` creates a fresh stacking context so the title and plus button always sit above the overlay regardless of parent z-index.
- `width="320" height="450"` matches the CSS pixel dimensions, not the file dimensions. This is correct — the browser uses it for the aspect ratio reservation; the actual 480×675 file is the 1.5× DPR variant.

---

## File 3 — `src/components/ServicesCarousel.astro`

Section wrapper + Swiper track + arrows + lazy-loaded init script.

```astro
---
/**
 * ServicesCarousel.astro
 * ──────────────────────────────────────────────────────────
 * Premium services slider. The outer <section> is overflow-hidden;
 * the inner Swiper track is forced to overflow-visible so cards
 * extend past the right edge of the content container.
 *
 * Swiper is bundled from npm (not CDN) via Vite. Swiper CSS is
 * imported statically here so Astro inlines it into <head> at build
 * time (inlineStylesheets: 'always'). The Swiper JS bundle is
 * dynamic-imported inside the init function — lazy-loaded on first
 * IntersectionObserver hit, pointerdown, or focusin.
 */
import 'swiper/css';
import 'swiper/css/autoplay';

import { ArrowLeft, ArrowRight } from '@lucide/astro';
import ServiceCard from './ServiceCard.astro';
import type { Service } from '../data/exampleServices';

interface Props {
  eyebrow?: string;
  heading: string;
  services: Service[];
  class?: string;
}

const { eyebrow, heading, services, class: extraClass = '' } = Astro.props;

// Italicise the final word via <h2> <span> for the editorial accent.
const words      = heading.trim().split(' ');
const lead       = words.slice(0, -1).join(' ');
const accentWord = words[words.length - 1];
---

<section class:list={["relative overflow-hidden bg-(--color-primary) text-white py-section-y lg:py-section-y-lg", extraClass]}>
  <div class="container px-(--spacing-section-x)">

    <div class="max-w-3xl mb-[60px]">
      {eyebrow && (
        <span class="eyebrow text-(--color-secondary) mb-4">{eyebrow}</span>
      )}
      <h2 class="text-white">
        {lead && <>{lead}{' '}</>}<span>{accentWord}</span>
      </h2>
      <div class="mt-5 space-y-4 max-w-2xl [&>p]:text-white/85 [&_strong]:text-white [&_strong]:font-semibold">
        <slot />
      </div>
    </div>

    <div class="relative">
      <div class="services-swiper swiper !overflow-visible">
        <div class="swiper-wrapper">
          {services.map((s) => (
            <div class="swiper-slide !w-[320px]">
              <ServiceCard title={s.title} image={s.image} href={s.href} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous service"
        class="services-prev absolute left-2 top-1/2 z-10 -translate-y-1/2 grid place-items-center h-[54px] w-[54px] rounded-full border border-white/40 bg-transparent text-white cursor-pointer transition-colors duration-300 ease-out hover:bg-white hover:text-(--color-primary) hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ArrowLeft class="w-6 h-6" stroke-width={2} />
      </button>
      <button
        type="button"
        aria-label="Next service"
        class="services-next absolute right-2 top-1/2 z-10 -translate-y-1/2 grid place-items-center h-[54px] w-[54px] rounded-full border border-white/40 bg-transparent text-white cursor-pointer transition-colors duration-300 ease-out hover:bg-white hover:text-(--color-primary) hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ArrowRight class="w-6 h-6" stroke-width={2} />
      </button>
    </div>

  </div>
</section>

<script>
  // Lazy-load Swiper to keep it out of the initial network dependency tree.
  // The ~60KB Swiper bundle only fetches when the carousel scrolls within
  // 450px of the viewport (IntersectionObserver), or when the user
  // activates a prev/next control via pointer or keyboard focus.
  // initSwiper() is idempotent via swiperPromise — the bundle loads
  // exactly once even if multiple triggers fire.
  const carouselEl = document.querySelector<HTMLElement>('.services-swiper');

  if (carouselEl) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let swiperPromise: Promise<void> | null = null;

    const initSwiper = async () => {
      if (swiperPromise) return swiperPromise;
      swiperPromise = (async () => {
        const [{ default: Swiper }, { Autoplay, Navigation }] = await Promise.all([
          import('swiper'),
          import('swiper/modules'),
        ]);

        const swiper = new Swiper('.services-swiper', {
          modules: [Autoplay, Navigation],
          slidesPerView: 'auto',
          spaceBetween: 15,
          loop: true,
          loopAdditionalSlides: 2,
          speed: reduceMotion ? 0 : 900,
          grabCursor: true,
          autoplay: reduceMotion ? false : {
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          navigation: {
            prevEl: '.services-prev',
            nextEl: '.services-next',
          },
        });

        // Start paused — autoplay begins only when section scrolls into view
        if (!reduceMotion) {
          swiper.autoplay?.stop();
          const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) swiper.autoplay?.start();
            else swiper.autoplay?.stop();
          }, { threshold: 0, rootMargin: '0px 0px 150px 0px' });
          io.observe(carouselEl);
        }
      })();
      return swiperPromise;
    };

    // Trigger 1 — proximity. Load when the carousel is within 450px of
    // the viewport. Avoids loading on long pages where the user may
    // never scroll to the section.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      initSwiper();
    }, { rootMargin: '450px 0px', threshold: 0 });
    observer.observe(carouselEl);

    // Trigger 2 — first interaction with the prev/next controls.
    // pointerdown handles mouse + touch; focusin handles keyboard users
    // (Tab + Enter would otherwise miss pointerdown and fail WCAG 2.1).
    const initOnInteract = () => { initSwiper(); };
    ['.services-prev', '.services-next'].forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.addEventListener('pointerdown', initOnInteract, { once: true, passive: true });
      el.addEventListener('focusin',     initOnInteract, { once: true, passive: true });
    });
  }
</script>
```

**Why this exact pattern:**

| Concern | Fix |
|---|---|
| Swiper bundle in critical chain | Dynamic `await import('swiper')` inside `initSwiper()` — never top-level. |
| Bundle loads even when user never sees the section | Wrapped in IntersectionObserver with `rootMargin: '450px 0px'` — starts loading just before scroll arrival, not at page load. |
| Keyboard users hit a dead button | `focusin` event triggers init alongside `pointerdown`. |
| Autoplay jank on first paint | `swiper.autoplay?.stop()` immediately after construction; second IO starts it on viewport entry. |
| Autoplay drains CPU when off-screen | Same IO toggles start/stop on every entry/exit. |
| Reduced-motion users get spinning UI | `reduceMotion` short-circuits speed to 0 and autoplay to false. |
| Multiple triggers fire and double-init Swiper | `swiperPromise` cache — `initSwiper()` is idempotent. |

---

## File 4 — `src/env.d.ts`

Add Swiper CSS module declarations so TypeScript stops complaining about the static CSS imports:

```ts
declare module 'swiper/css';
declare module 'swiper/css/*';
```

---

## File 5 — `astro.config.mjs` (build-time inline integration)

Two changes are required for the carousel to drop off PSI's network dependency tree:

### 5a — Disable Vite's automatic `<link rel="modulepreload">` injection

```js
export default defineConfig({
  // … existing config …
  vite: {
    plugins: [tailwindcss()],
    build: {
      modulePreload: false,
    },
  },
});
```

This stops the `preload-helper.X.js` chunk from being preloaded into the critical chain. Trade-off: dynamic imports load ~50–100 ms later on first interaction. Acceptable because every dynamic import in the project is **user-triggered** (carousels via IO + interaction, GTM via interaction events).

### 5b — Register the inline integration

Add this integration above `defineConfig`:

```js
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * inlineTinyAstroScripts — removes tiny component entry files from the
 * initial request chain while keeping their lazy dynamic imports intact.
 * Targets PSI's network dependency tree on pages with carousel bootstraps;
 * does not alter rendered markup or styles.
 */
function inlineTinyAstroScripts() {
  const maxBytes = 4096;
  const targets = [
    'ServicesCarousel.astro_astro_type_script_index_0_lang.',
    'TeamSection.astro_astro_type_script_index_0_lang.',
    // Add any further small carousel/section entry chunks here.
  ];

  return {
    name: 'inline-tiny-astro-scripts',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const assetDir = join(root, '_astro');
        const helperFile = readdirSync(assetDir).find(
          (name) => name.startsWith('preload-helper.') && name.endsWith('.js')
        );
        const helperCode = helperFile
          ? readFileSync(join(assetDir, helperFile), 'utf8')
              .replace(/export\{(\w+) as _\};?/, 'const __vitePreload=$1;')
          : '';

        const walk = (d) => {
          const out = [];
          for (const e of readdirSync(d, { withFileTypes: true })) {
            const p = join(d, e.name);
            if (e.isDirectory()) out.push(...walk(p));
            else if (p.endsWith('.html')) out.push(p);
          }
          return out;
        };

        for (const file of walk(root)) {
          let html = readFileSync(file, 'utf8');
          let changed = false;

          html = html.replace(/<script type="module" src="([^"]+)"><\/script>/g, (tag, src) => {
            if (!targets.some((target) => src.includes(target))) return tag;
            const rel = src.startsWith('/') ? src.slice(1) : src;
            const jsPath = join(root, rel);
            if (!existsSync(jsPath)) return tag;
            let code = readFileSync(jsPath, 'utf8');
            if (Buffer.byteLength(code, 'utf8') > maxBytes) return tag;
            code = code.replace(/import\{_ as (\w+)\}from"\.\/preload-helper\.[^"]+";/, (_match, alias) => {
              if (!helperCode) return _match;
              return `${helperCode}const ${alias}=__vitePreload;`;
            });
            code = code.replace(/import\("\.\//g, 'import("/_astro/');
            changed = true;
            return `<script type="module">${code}</script>`;
          });

          if (changed) writeFileSync(file, html, 'utf8');
        }
      },
    },
  };
}
```

Register it in the `integrations` array:

```js
integrations: [sitemapAutoScan(), stripHtmlComments(), inlineTinyAstroScripts()],
```

**Why this works:**

- The Astro-generated component entry chunk for `ServicesCarousel.astro` is only a few hundred bytes but appears as its own `<script type="module" src="…">` tag in the HTML. PSI counts it as a critical-chain entry.
- The integration walks every HTML file in the build output, finds those script tags, reads the small chunk, inlines the preload-helper into it (so dynamic imports still resolve), rewrites relative dynamic import paths to absolute, and inlines the result.
- Size-guarded by `maxBytes = 4096` so a future bundle growth can't accidentally bloat HTML.
- Existence-checked — falls back to the external tag if the expected file isn't found.
- Cross-platform safe — uses `path.join(root, rel)` directly, no hardcoded separators.
- CSP-compatible — inline modules are already allowed via `'unsafe-inline'`.

**After registering, verify:**

```
npm run build
grep -c "ServicesCarousel.astro_astro_type_script" dist/client/index.html
# Expected: 0 (was 1 before the integration)

grep -c "modulepreload" dist/client/index.html
# Expected: 0
```

---

## File 6 — Image variants (`-card.webp`)

For every real (non-placeholder) card image, generate a `-card.webp` variant sized **480×675** (1.5× the 320×450 CSS card — covers retina without waste).

`scripts/optimise-pagespeed-images.mjs` (one-off generator, kept in the repo for reproducibility):

```js
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_DIR = 'public/images/<context>';
const CARD_WIDTH = 480;
const CARD_HEIGHT = 675;

for (const file of readdirSync(SOURCE_DIR)) {
  if (!file.endsWith('.webp') || file.endsWith('-card.webp')) continue;
  const input = join(SOURCE_DIR, file);
  const output = join(SOURCE_DIR, file.replace(/\.webp$/, '-card.webp'));
  await sharp(input)
    .resize(CARD_WIDTH, CARD_HEIGHT, { fit: 'cover' })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);
  console.log(`✓ ${output}`);
}
```

Run once after dropping new artwork into `/public/images/<context>/`:

```
node scripts/optimise-pagespeed-images.mjs
```

Then update the data file to point at the `-card.webp` variants:

```ts
{
  title: 'Service One',
  image: '/images/<context>/service-one-card.webp',  // not service-one.webp
  href: '/<context>/service-one/',
},
```

**Why this matters:** the carousel card is fixed at 320×450 CSS pixels. Without the variant, a 1600×2400 original page-hero image would be downloaded — that's ~120 KiB of waste per card, multiplied by the number of slides. The `-card.webp` is ~12–18 KiB per slide.

---

## Page usage

```astro
---
import ServicesCarousel from '../components/ServicesCarousel.astro';
import { exampleServices } from '../data/exampleServices';
---

<ServicesCarousel
  eyebrow="Services"
  heading="What We Treat"
  services={exampleServices}
  class="secondsection"
>
  <p>
    Intro paragraph with <strong>bold key terms</strong> and regular text.
    Keep it 1–2 short paragraphs — the carousel does the heavy lifting.
  </p>
</ServicesCarousel>
```

**Reminder:** every content `<section>` on the page gets an ordinal class (`firstsection`, `secondsection`, …). Pass it via the `class` prop.

---

## Multi-instance on the same page

If a page has two or more carousels (services + team + reviews, etc.), every selector must be unique:

```ts
const carouselEl = document.querySelector<HTMLElement>('.team-swiper');
// …
new Swiper('.team-swiper', {
  navigation: { prevEl: '.team-prev', nextEl: '.team-next' },
  // …
});
```

For each duplicated carousel:

1. Copy `ServicesCarousel.astro` to e.g. `TeamCarousel.astro`.
2. Rename every occurrence of `services-swiper`, `services-prev`, `services-next` to `team-swiper`, `team-prev`, `team-next`.
3. Add the new entry chunk name to the `targets` array in `inlineTinyAstroScripts()` — e.g. `'TeamCarousel.astro_astro_type_script_index_0_lang.'`.
4. Rebuild and re-verify the grep checks above.

---

## Verification checklist

After applying the spec on a new site:

### Static / build
- [ ] `npm run build` passes
- [ ] `grep -c "ServicesCarousel.astro_astro_type_script" dist/client/index.html` → `0`
- [ ] `grep -c 'rel="modulepreload"' dist/client/index.html` → `0`
- [ ] Swiper still dynamic-loads: `grep "import(\"/_astro/swiper" dist/client/index.html` → at least 1 match in the inlined block
- [ ] No `style=` attribute exists in `ServiceCard.astro` or `ServicesCarousel.astro` (search the files)

### DevTools / Network panel (first paint)
- [ ] No `swiper-*.js` request in the initial waterfall
- [ ] No external `_astro/ServicesCarousel.astro_astro_type_script_*` request
- [ ] No `preload-helper.*.js` request
- [ ] Carousel slides render statically as a horizontal strip (before Swiper hydrates)
- [ ] Card images use `-card.webp` filenames where real artwork exists; `placeholder.webp` everywhere else

### Interaction
- [ ] Scrolling near the carousel triggers the Swiper bundle download (~60 KB gzip) and the carousel becomes interactive
- [ ] Tab-focus on a prev/next control with the carousel above the viewport ALSO triggers the bundle download
- [ ] Clicking arrow / pressing Enter on focused arrow advances by one slide smoothly
- [ ] Autoplay starts only when the carousel is in view; stops when scrolled past
- [ ] Hover pauses autoplay

### Lighthouse / PSI mobile
- [ ] Performance score 90+
- [ ] No "Network dependency tree" warning citing carousel entry chunks
- [ ] No "Avoid serving legacy JavaScript to modern browsers" citing Swiper
- [ ] CLS score < 0.05 (carousel never shifts on hydration)
- [ ] No "Improve image delivery" warning citing carousel images (the `-card.webp` variants are correctly sized)

### Reduced motion
- [ ] In DevTools, Rendering → "Emulate CSS prefers-reduced-motion: reduce"
- [ ] Reload — autoplay does not start; arrow clicks still work but transitions are instant (no slide animation)

---

## Common failure modes (and the fix)

| Symptom | Cause | Fix |
|---|---|---|
| Carousel "jumps" / cards flicker on first paint | Swiper hydrates and re-positions slides | Verify `!overflow-visible` on `.swiper`; verify cards have fixed `w-[320px] h-[450px]` |
| Carousel shifts layout when Swiper loads | Container collapses before init | Ensure `swiper-wrapper` direct children are `.swiper-slide` with explicit `!w-[320px]` — `slidesPerView: 'auto'` reads slide width directly |
| PSI still flags `ServicesCarousel…_astro_type_script` as critical | Integration not registered, or targets array wrong | Check `targets` matches the actual filename prefix in `dist/client/_astro/` |
| Keyboard user tabs to Next button, presses Enter, nothing happens | `focusin` listener missing | Add `focusin` next to `pointerdown` in the `initOnInteract` loop |
| Two carousels on one page — second one autoplays both | Same Swiper selector | Rename second selector + arrow classes + JS query |
| Carousel images blurry on retina | Used original page-hero image, not the `-card.webp` variant | Regenerate variants with `optimise-pagespeed-images.mjs` and point data file at `-card.webp` |
| Build error on Cloudflare but works locally | Hardcoded backslashes in the integration | Use `path.join()` everywhere — never string-concatenate separators |
| Inline script bloats HTML by KBs | A targeted chunk grew past 4 KB | `maxBytes` guard kicks in — chunk falls back to external. Increase `maxBytes` only if you've checked the chunk really is mostly inline-helper code, not feature code |

---

## Cross-references

- `.claude/skills/carousel.md` — the original base skill (this file builds on it)
- `.claude/skills/team-carousel.md` — sibling pattern for team cards
- `.claude/rules/performance.md` — broader perf rules (image, font, JS)
- `.claude/rules/frontend.md` — code rules (no inline styles, section ordinals)
- `.claude/prompts/cookieconsent-optimisations.md` — companion perf spec for the tracking stack
- Northern Medical commits `d8a1400`, `3dc3249`, `42077ad` — the exact lineage that produced this spec
