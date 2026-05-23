# Hero Optimisation Prompt — LCP, CLS & Above-the-Fold Speed

Use this prompt whenever building or rebuilding a homepage hero. It encodes the exact above-the-fold strategy that gets the Cheltenham Physio and Chiro homepage to pass PageSpeed Insights (mobile, 90+) and keeps the LCP under 2.5s on real devices. **Design and copy are out of scope here — this is the structural / performance recipe only.**

---

## How to invoke

Paste this when starting the hero:

> Build the homepage hero using `.claude/prompts/hero-optimisations.md` exactly. Do not deviate from the LCP preload pipeline, the `<picture>` pattern, the font preload, the hero height rules, or the padding tokens. Design and content come from the separate UI plan — this file governs structure, image loading, and layout stability only.

---

## The strategy (what makes the hero fast)

### 1. Real `<img>` inside `<picture>` — never a CSS `background-image`

The browser's HTML preload scanner discovers `<img src>` during HTML parse and starts the download before CSS is even parsed. A `background-image: url(...)` is only discovered after the browser has parsed the CSSOM, which is hundreds of milliseconds too late for LCP.

```astro
<picture>
  <source
    media="(max-width: 768px)"
    srcset="/images/hero-image-mobile.avif"
    type="image/avif"
  />
  <source
    media="(min-width: 769px)"
    srcset="/images/hero-image.avif"
    type="image/avif"
  />
  <img
    class="hero-bg-img"
    src="/images/hero-image.avif"
    alt=""
    width="1920"
    height="1080"
    loading="eager"
    decoding="async"
    fetchpriority="high"
    aria-hidden="true"
  />
</picture>
```

**Mandatory attributes on the hero `<img>`:**
- `loading="eager"` — never lazy-load the LCP element
- `decoding="async"` — never block parsing on decode
- `fetchpriority="high"` — explicit hint to the browser
- `width` + `height` — reserve layout space, eliminates CLS
- `alt=""` + `aria-hidden="true"` when the image is purely decorative (real ARIA label lives on the `<section>`)

### 2. Responsive preload split by media query (in `<head>`)

Owned by `BaseLayout.astro` — pass `heroImage` and `heroImageMobile` props and BaseLayout emits two `<link rel="preload">` tags, each guarded by a media query so mobile only preloads the mobile image and desktop only preloads the desktop image. **No double-downloads.**

```html
<link rel="preload" as="image"
      href="/images/hero-image-mobile.avif"
      type="image/avif"
      fetchpriority="high"
      media="(max-width: 768px)">
<link rel="preload" as="image"
      href="/images/hero-image.avif"
      type="image/avif"
      fetchpriority="high"
      media="(min-width: 769px)">
```

The `type="image/avif"` attribute is critical — browsers that do not support AVIF skip the preload entirely, so they never waste bytes on an asset they can't decode. The `media` attribute on the preload **must mirror** the `<picture>` breakpoint exactly (default 768px).

**Page invocation:**

```astro
<BaseLayout
  title={siteName}
  heroImage="/images/hero-image.avif"
  heroImageMobile="/images/hero-image-mobile.avif"
>
```

### 3. AVIF, not WebP, for the hero

AVIF is 25–40% smaller than equivalent-quality WebP at the same SSIM. For a 1920×1080 hero this typically saves 30–80 KB on desktop and 20–40 KB on mobile. The CLAUDE.md default is `.webp` for content images, but the hero **always uses AVIF** because LCP weight matters more there than format universality (AVIF is supported by 96%+ of UK traffic; the browsers that lack it still render the `<source>` fallback or the `<img src>` directly).

### 4. Font preload for the H1 typeface

The H1 is the LCP element on heroes whose headline outweighs the image. Preloading the woff2 file directly removes the second round-trip the browser would otherwise wait for (HTML → CSS → woff2).

```html
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/InstrumentSerif-Regular.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/InstrumentSerif-Italic.woff2" crossorigin />
```

- Self-hosted via `@fontsource` (imported in `global.css`) — no Google Fonts round-trip, no GDPR concern
- `crossorigin` is mandatory on font preloads (spec requirement) — without it the browser re-requests the font
- Only preload the H1 face — body fonts can wait

### 5. No client hydration on the hero

The hero contains **zero `client:*` directives**. Everything visible above the fold is pure HTML + CSS. The testimonial rotator on the side card is interactive but lives at the end of `<body>` as a plain `<script>` tag, so it does not block first paint.

### 6. Background-colour fallback on the section

```css
.hero-section {
  background-color: var(--color-hero-dark);
}
```

If the AVIF fails or arrives late, the section already paints the brand navy — no white flash, no perceived "missing hero" moment during LCP.

### 7. `z-index` isolation, not stacking contexts

```css
.hero-section  { position: relative; isolation: isolate; }
.hero-bg-img   { position: absolute; inset: 0; z-index: -2; }
.hero-overlay  { position: absolute; inset: 0; z-index: -1; }
.hero-shell    { position: relative; z-index: 2; }
```

`isolation: isolate` creates a stacking context on the hero section so the negative-z-index image cannot escape behind ancestors. Combined with `inset: 0` on the absolutely-positioned image, this avoids the layout cost of `transform` or `filter`-based positioning.

### 8. DNS prefetch (not preconnect) for non-critical third parties

```html
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
```

GTM and GA load async and are never on the critical path — `dns-prefetch` is cheaper than `preconnect` and sufficient. Reserve `preconnect` for origins the LCP depends on (in this stack, the hero image is same-origin, so no preconnect is needed).

### 9. GTM / consent loads AFTER consent defaults

Google Consent Mode v2 defaults are set in an `is:inline` script in `<head>`, **before** GTM is injected. This keeps the consent boundary tight without adding render-blocking JS — the inlined script is parser-blocking but tiny (~1 KB).

---

## Hero height rules (locked)

| Viewport | Height |
|---|---|
| **< 1536px** (mobile, tablet, laptop, standard desktop) | `min-height: 100vh` — full viewport, immersive above-the-fold |
| **≥ 1536px** (4K, ultrawide, very large desktops) | `min-height: 1000px; height: 1000px;` — fixed cap, prevents the hero from stretching into an empty void on huge displays |

```css
.hero-section {
  min-height: 100vh;
  /* … other rules … */
}

@media (min-width: 1536px) {
  .hero-section {
    min-height: 1000px;
    height:     1000px;
  }
}
```

**Why:** below 4K, a 100vh hero feels grounded and intentional. Above 4K, the same 100vh expands to 1440px+ which leaves a yawning gap below the content cluster. Pinning to exactly 1000px keeps the composition tight on the largest screens.

---

## Hero padding rules (locked — never use Tailwind utilities, use literal CSS)

The hero is the **only** exception to the global section-padding token system. It uses bespoke vertical rhythm because hero height is content/composition-driven, not padding-driven (see `.claude/rules/frontend.md` → "Section Padding Convention").

| Breakpoint | Padding (T R B L) |
|---|---|
| **Desktop** (≥ 1025px) | `180px 30px 90px 30px` |
| **iPad / Tablet** (769px–1024px) | `180px 30px 80px 30px` |
| **Mobile** (≤ 768px) | `150px 30px 70px 30px` |

```css
.hero-section {
  padding: 180px 30px 90px 30px;        /* desktop default */
}

@media (max-width: 1024px) {
  .hero-section {
    padding: 180px 30px 80px 30px;      /* iPad */
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 150px 30px 70px 30px;      /* mobile */
  }
}
```

**Rationale for the asymmetric top/bottom values:**
- The large top padding (180/150px) clears the fixed header AND visually grounds the content cluster in the lower-third of the hero (editorial composition technique — content reads as deliberate, not floating)
- The smaller bottom padding (90/80/70px) keeps the hero-to-next-section transition tight
- 30px horizontal matches the global `--spacing-section-x` token so the inner content aligns with every other section's left/right edge

---

## Build checklist (apply every time)

- [ ] `<picture>` element with two `<source>` tags (mobile + desktop AVIF) and an `<img>` fallback
- [ ] `<img>` has `loading="eager"`, `decoding="async"`, `fetchpriority="high"`, explicit `width` + `height`
- [ ] BaseLayout invocation passes both `heroImage` and `heroImageMobile` props
- [ ] `<picture>` media breakpoint and BaseLayout preload media breakpoint match (default 768px)
- [ ] H1 font is preloaded as woff2 with `crossorigin`
- [ ] `.hero-section` has `background-color` fallback set to the brand dark colour
- [ ] `isolation: isolate` on `.hero-section`, negative z-index on image + overlay
- [ ] Zero `client:*` directives on any hero component
- [ ] Hero height: `min-height: 100vh` below 1536px, fixed `1000px` at ≥ 1536px
- [ ] Hero padding: 180/30/90/30 desktop, 180/30/80/30 iPad, 150/30/70/30 mobile
- [ ] No CSS `background-image` for the hero photo — always a real `<img>` tag
- [ ] No third-party script blocks render — GTM/GA load async, after consent defaults
- [ ] Verify LCP image is identified correctly in Chrome DevTools → Performance → LCP marker (should be the hero `<img>`)
- [ ] PageSpeed Insights mobile ≥ 90; LCP < 2.5s; CLS < 0.1

---

## Reference files (do not duplicate — read these instead)

- `src/layouts/BaseLayout.astro` — preload pipeline, font preload, dns-prefetch, consent defaults
- `src/pages/index.astro` — production homepage hero (markup + scoped CSS reference)
- `src/components/Hero.astro` — reusable Hero component (alternate variant — uses Tailwind utilities)
- `.claude/rules/performance.md` — global performance non-negotiables
- `.claude/rules/design.md` → "Hero Height Rules" — design-side rules that pair with this file
