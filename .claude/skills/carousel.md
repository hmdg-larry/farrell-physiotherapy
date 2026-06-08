# Skill: Premium Card Carousel (team-style, full-bleed)

Reusable build skill for the HMDG **services / team / conditions** card carousel — a Swiper-powered, full-viewport-bleed slider whose cards mirror the HomeTeam card design (rounded image area + title/description/CTA below). This is the **current production pattern** (ICPC Health homepage Services area). It supersedes the earlier dark-overlay-with-title-on-image card.

The live reference implementation: `src/components/SliderCard.astro`, `src/components/PhysioServicesCarousel.astro`, `src/data/physiotherapyServices.ts`, embedded inside `src/components/home/HomeServiceAreas.astro`.

---

## When to use

- a services carousel / slider
- a team or conditions carousel of image cards
- any horizontal card slider that must bleed full-width but keep arrows inside the 1340 container
- "build a carousel like the services one" / "use the standard card carousel"

---

## Architecture (3 files + 1 integration)

| File | Purpose |
|---|---|
| `src/components/SliderCard.astro` | Reusable card — rounded image, top-left badge, then title / description / CTA below. Whole card is one `<a>`. |
| `src/components/<Ctx>ServicesCarousel.astro` | Embeddable track — Swiper wrapper + slides + arrows + the robust init script. **No `<section>`/heading** (the host section provides those). |
| `src/data/<ctx>Services.ts` | Typed data array `{ title, image, href, desc }`. |
| Host section (e.g. `HomeServiceAreas.astro`) | Renders the carousel inside a **full-bleed panel** and (if filtered by tabs) dispatches `service-panels:change`. |

**Naming:** the live instance is `physio`-scoped (`.physio-swiper`, `.physio-prev`, `data-physio-carousel`, `<Ctx>ServicesCarousel = PhysioServicesCarousel`). For a new instance, clone the carousel file and rename **every** `physio` token to a unique context token (e.g. `team`) so multiple carousels never collide. `SliderCard` is generic — reuse it as-is.

---

## SliderCard.astro — full current source

```astro
---
/**
 * Premium carousel card mirroring the HomeTeam card design:
 *   • rounded image area (badge top-left)
 *   • title + short description + CTA line BELOW the image
 *
 * Meta text is white for a dark/brand section (e.g. the purple Services
 * area). On a LIGHT section, switch the meta colours to --color-headline
 * (title), headline 70% (desc) like the team cards.
 */
interface Props {
  title: string;
  image: string;
  href: string;
  /** Short patient-focused description (≈team-bio length, 9–11 words). */
  desc?: string;
  /** Top-left pill label. */
  badge?: string;
  /** Short action line below the title. */
  cta?: string;
}
const { title, image, href, desc, badge = "SERVICE", cta = "Discover" } = Astro.props;
---

<a href={href} aria-label={title} class="svc-card group">
  <div class="svc-card-photo">
    <img src={image} alt="" width="600" height="720" loading="lazy" decoding="async" />
    <span class="svc-card-overlay" aria-hidden="true"></span>
    <span class="svc-card-badge">{badge}</span>
  </div>
  <div class="svc-card-meta">
    <h3 class="svc-card-title">{title}</h3>
    {desc && <p class="svc-card-desc">{desc}</p>}
    <span class="svc-card-cta">{cta} <span aria-hidden="true">→</span></span>
  </div>
</a>

<style>
  .svc-card {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 320px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .svc-card:hover { transform: translateY(-6px); }
  .svc-card:focus-visible {
    outline: 2px solid var(--color-white);
    outline-offset: 4px;
    border-radius: var(--radius-card);
  }

  .svc-card-photo {
    aspect-ratio: 3 / 3.6;
    border-radius: var(--radius-card);
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.06);
  }
  .svc-card-photo img { width: 100%; height: 100%; object-fit: cover; }
  .svc-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba(7, 5, 13, 0.5));
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .svc-card:hover .svc-card-overlay { opacity: 1; }

  /* Top-left pill — white bg + headline text ≈ 19:1 (AAA). */
  .svc-card-badge {
    position: absolute;
    top: 14px; left: 14px;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 6px 10px;
    border-radius: 999px;
    color: var(--color-headline);
    font-weight: 500;
  }

  .svc-card-meta {
    display: flex;
    flex-direction: column;
    padding: 0 4px;
  }
  /* White title on #443082 ≈ 10.5:1 (AAA). On a LIGHT section use headline. */
  .svc-card-title {
    font-size: 22px;
    font-weight: 400;
    letter-spacing: -0.025em;
    line-height: 1.1;
    color: var(--color-white);
    margin: 0;
  }
  /* 0.85 white on #443082 ≈ 8:1 (AAA). 6px to title / 14px to CTA.
     padding-right keeps the line short of the card edge (premium column).
     min-height reserves two lines so every card stays the same height. */
  .svc-card-desc {
    font-size: 13px;
    line-height: 1.5;
    letter-spacing: -0.005em;
    color: rgba(255, 255, 255, 0.85);
    margin: 6px 0 14px;
    padding-right: 30px;
    min-height: 3em;
  }
  .svc-card-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    letter-spacing: 0.02em;
    font-weight: 500;
    color: var(--color-white);
  }
  .svc-card-cta span { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
  .svc-card:hover .svc-card-cta span { transform: translateX(4px); }

  @media (prefers-reduced-motion: reduce) {
    .svc-card,
    .svc-card-overlay,
    .svc-card-cta span { transition: none; }
    .svc-card:hover { transform: none; }
  }
</style>
```

### Card rules
- whole card is one `<a href aria-label={title}>` — the title conveys the link name; image is `alt=""`.
- fixed `width: 320px`; image area `aspect-ratio: 3 / 3.6`, `--radius-card` corners.
- hover: card lifts `translateY(-6px)` + overlay fades in; CTA arrow nudges. All `prefers-reduced-motion`-guarded.
- title 1 line, description reserved 2 lines (`min-height: 3em`) → equal card heights. Keep service names short enough to stay 1 line at 320px; if a title needs 2 lines, add a title `min-height`.
- meta colours assume a **dark/brand section** (white text). On a light section, swap to `--color-headline` / headline 70% (the original team values).

---

## Embeddable carousel — full current source (`PhysioServicesCarousel.astro`)

Markup + style + the robust init script. Rename `physio` → your context token for a new instance.

```astro
---
import SliderCard from "./SliderCard.astro";
export interface Service { title: string; image: string; href: string; desc?: string; }
interface Props { services: Service[]; }
const { services } = Astro.props;
---

<div
  class:list={["physio-carousel relative w-full max-w-full mx-auto min-w-0", { "few-items": services.length < 4 }]}
  data-physio-carousel
>
  <div class="physio-swiper swiper w-full max-w-full min-w-0 !overflow-visible" data-physio-swiper>
    <div class="swiper-wrapper">
      {services.map((s) => (
        <div class="swiper-slide !w-[320px] !shrink-0" data-physio-slide>
          <SliderCard title={s.title} image={s.image} href={s.href} desc={s.desc} />
        </div>
      ))}
    </div>
  </div>

  <!-- Arrows in a centred max-1340 overlay → stay inside the container
       even though the track bleeds full-width. -->
  <div class="physio-arrows" aria-hidden="true">
    <button type="button" aria-label="Previous services"
      class="physio-prev grid place-items-center h-[54px] w-[54px] rounded-full
             border border-white/40 bg-transparent text-white cursor-pointer
             transition-colors duration-300 ease-out
             hover:bg-white hover:text-(--color-primary) hover:border-white
             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
      </svg>
    </button>
    <button type="button" aria-label="Next services"
      class="physio-next grid place-items-center h-[54px] w-[54px] rounded-full
             border border-white/40 bg-transparent text-white cursor-pointer
             transition-colors duration-300 ease-out
             hover:bg-white hover:text-(--color-primary) hover:border-white
             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
      </svg>
    </button>
  </div>
</div>

<style>
  .physio-carousel,
  .physio-swiper { width: 100%; max-width: 100%; min-width: 0; margin-inline: auto; }
  .physio-carousel { margin-top: -8px; padding-top: 8px; overflow-x: clip; overflow-y: visible; }
  .physio-swiper .swiper-wrapper { display: flex; align-items: stretch; width: 100%; min-width: 0; }
  .physio-swiper .swiper-slide {
    width: 320px; flex: 0 0 320px;
    max-width: calc(100vw - (2 * var(--spacing-section-x)));
    min-width: 0;
  }

  /* Arrow overlay capped at the 1340 container → buttons sit at the
     container gutters while the track bleeds full width. */
  .physio-arrows { position: absolute; inset: 0; max-width: 1340px; margin-inline: auto; pointer-events: none; z-index: 10; }
  .physio-prev, .physio-next { position: absolute; top: 50%; transform: translateY(-50%); pointer-events: auto; }
  .physio-prev { left: 30px; }
  .physio-next { right: 30px; }

  /* Fewer than 4 cards fit on large screens — hide arrows there. */
  @media (min-width: 1200px) {
    .physio-carousel.few-items .physio-prev,
    .physio-carousel.few-items .physio-next { display: none; }
  }
</style>

<script>
  import Swiper from "swiper";
  import { Autoplay, Navigation } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/autoplay";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const carouselEls = document.querySelectorAll<HTMLElement>("[data-physio-carousel]");

  carouselEls.forEach((carouselEl) => {
    if (carouselEl.dataset.swiperReady === "true") return;
    carouselEl.dataset.swiperReady = "true";

    const trackEl = carouselEl.querySelector<HTMLElement>("[data-physio-swiper]");
    const wrapperEl = trackEl?.querySelector<HTMLElement>(".swiper-wrapper") ?? null;
    const originalSlides = wrapperEl
      ? Array.from(wrapperEl.querySelectorAll<HTMLElement>("[data-physio-slide]"))
      : [];
    if (!trackEl || !wrapperEl || originalSlides.length === 0) return;

    const getSlideStride = () => {
      const first = originalSlides[0];
      const s = window.getComputedStyle(first);
      const mx = parseFloat(s.marginLeft || "0") + parseFloat(s.marginRight || "0");
      return Math.max(1, first.offsetWidth + mx + 15);
    };
    const getNeededSlides = () => {
      const vw = Math.max(trackEl.clientWidth, window.innerWidth || 0);
      const visible = Math.ceil(vw / getSlideStride()) + 2;
      return Math.max(originalSlides.length * 3, visible * 4);
    };
    // Pre-build a REAL slide pool so the track always has enough nodes to
    // fill any width (Swiper 12 loop can leave whitespace on ultrawide with
    // too few real slides). Clones are aria-hidden + tabindex -1 so AT/keyboard
    // only ever traverse the original slides.
    const ensureSlidePool = () => {
      const needed = getNeededSlides();
      let added = false, i = 0;
      while (wrapperEl.children.length < needed) {
        const clone = originalSlides[i % originalSlides.length].cloneNode(true) as HTMLElement;
        clone.dataset.physioCopy = "true";
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll<HTMLElement>('a, button, [tabindex], [href]')
          .forEach((el) => el.setAttribute("tabindex", "-1"));
        wrapperEl.appendChild(clone);
        i += 1; added = true;
      }
      return added;
    };

    ensureSlidePool();
    const physioSwiper = new Swiper(trackEl, {
      modules: [Autoplay, Navigation],
      slidesPerView: "auto",
      spaceBetween: 15,
      centeredSlides: true,
      loop: true,
      initialSlide: originalSlides.length,
      loopAdditionalSlides: 0,
      loopPreventsSliding: false,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      updateOnWindowResize: true,
      speed: reduceMotion ? 0 : 900,
      grabCursor: true,
      autoplay: reduceMotion ? false : { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: ".physio-prev", nextEl: ".physio-next" },
    });

    // Re-measure + loop recalc, coalesced into one rAF.
    let raf = 0;
    const refresh = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (physioSwiper.destroyed) return;
        const realIndex = (physioSwiper.realIndex || 0) % originalSlides.length;
        if (ensureSlidePool()) { physioSwiper.loopDestroy(); physioSwiper.update(); physioSwiper.loopCreate(); }
        physioSwiper.update();
        physioSwiper.slideToLoop(realIndex, 0, false);
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(refresh)); // after first paint
    window.addEventListener("load", refresh);
    document.addEventListener("astro:page-load", refresh);
    window.addEventListener("service-panels:change", refresh);   // tab/panel filter
    window.addEventListener("orientationchange", () => setTimeout(refresh, 200));
    window.visualViewport?.addEventListener("resize", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    trackEl.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });
    if ("ResizeObserver" in window) new ResizeObserver(refresh).observe(trackEl);

    if (!reduceMotion && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) physioSwiper.autoplay?.start();
        else physioSwiper.autoplay?.stop();
      }, { threshold: 0.1 });
      io.observe(trackEl);
    }
  });
</script>
```

---

## Data file pattern (`src/data/<ctx>Services.ts`)

```typescript
export interface Service {
  title: string;
  image: string;
  href: string;
  desc: string; // short, patient-focused, ~9–11 words (SEO-supportive, no stuffing)
}

export const physiotherapyServices: Service[] = [
  { title: "Physiotherapy", image: "/images/placeholder.webp", href: "/service/physiotherapy/",
    desc: "Get back to movement and confidence with our evidence-based care." },
  // …match titles/hrefs to the real /service/* pages; keep desc one line of ~9–11 words.
];
```

Use `/images/placeholder.webp` until real `640×900` `.webp` photography is supplied. Have the **seo-reviewer agent** write the `desc` lines (patient-focused, benefit-led, distinct, no keyword stuffing).

---

## Host-section integration (full-bleed panel)

The carousel must bleed to the full viewport while the rest of the section stays in `.container-main`. In this template the **30px gutter lives on the numbered section** (`.thirdsection` etc.) and `.container-main` padding is reset to 0 inside it — so the carousel panel is a **direct section child** (NOT inside `.container-main`) and negates the section gutter:

```astro
<section class="service-areas thirdsection" id="service-areas" …>
  <div class="container-main">… eyebrow / H2 / tabs or dropdown …</div>

  <div
    class:list={["svc-carousel-panel", { "is-hidden": /* hidden unless this category active */ }]}
    role="region" aria-label="Physiotherapy services" data-panel="Physiotherapy"
  >
    <PhysioServicesCarousel services={physiotherapyServices} />
  </div>
</section>
```

```css
/* Full-bleed = negate the section's horizontal gutter. 100%-based (NOT
   100vw) so it measures correctly and never includes the scrollbar →
   no horizontal page overflow. overflow-x:clip clips the bleed;
   overflow-y:visible lets the card hover-lift show (clip is compatible
   with visible, unlike hidden). */
.svc-carousel-panel {
  width: calc(100% + (2 * var(--spacing-section-x)));
  margin-inline: calc(-1 * var(--spacing-section-x));
  min-width: 0;
  overflow-x: clip;
  overflow-y: visible;
  padding-top: 12px;            /* headroom for the hover lift */
}
.svc-carousel-panel.is-hidden { display: none; }

/* Safety net on the host section. */
.service-areas { overflow-x: clip; }
```

### Tab/panel filtering hook
If the carousel sits under a tab/dropdown filter, the filter's selection handler must dispatch:

```ts
window.dispatchEvent(new CustomEvent("service-panels:change", { detail: { value } }));
```

The carousel listens for `service-panels:change` and refreshes Swiper (so it re-measures when its panel becomes visible after being `display:none`).

---

## Why the Swiper config looks like this

| Choice | Reason |
|---|---|
| Pre-built real **slide pool** (`ensureSlidePool`) | Swiper 12 `loop` can leave a right-side gap on wide/ultrawide when there aren't enough real slide nodes. The pool guarantees enough material on both sides of the centred slide. |
| Clones `aria-hidden` + `tabindex="-1"` | Pool clones are visual padding only — keep keyboard/SR users on the originals (mirrors Swiper's own loop-clone handling). |
| `centeredSlides: true` + `loop: true` | Centred, infinite, symmetric bleed — no trailing whitespace. |
| `slidesPerView: "auto"` + fixed `320px` slides + `flex: 0 0 320px` | Stable measurement; slides never shrink. |
| **`refresh()` on** double-rAF, `load`, `astro:page-load`, `service-panels:change`, `orientationchange`, `visualViewport`, `fonts.ready`, image `load`, `ResizeObserver` | Forces a re-measure once the full-bleed width is final and after every settle point — the fix for the "measured before layout settled" reload gap. |
| Arrow overlay `max-width:1340 / mx-auto` | Arrows stay at the container gutters while the track bleeds full width. |

---

## Accessibility (audited, WCAG 2.1 AA)

On the purple section (`#443082`): title white **10.5:1**, description `rgba(255,255,255,0.85)` **~8:1**, CTA white **10.5:1**, badge headline-on-white **~19:1**, arrows white **10.5:1**, hover-arrow primary-on-white **9.5:1** — all ≥AA, most AAA. Card + arrow `focus-visible` = 2px white outline. Image `alt=""`; overlay + arrow-overlay `aria-hidden`; pool clones `aria-hidden`/`tabindex -1`. `prefers-reduced-motion` disables card/overlay/CTA/Swiper motion. On a **light** host section, recolour the meta text to `--color-headline` to keep contrast.

---

## Multi-instance on the same page

Each carousel needs unique tokens to avoid collisions. When cloning the carousel file for a new context, rename **all** of: `data-<ctx>-carousel`, `data-<ctx>-swiper`, `data-<ctx>-slide`, `.<ctx>-carousel`, `.<ctx>-swiper`, `.<ctx>-arrows`, `.<ctx>-prev`, `.<ctx>-next`, and the navigation `prevEl/nextEl` selectors. `SliderCard` and the data interface are shared.

---

## Non-negotiable rules

- Astro + Tailwind + TypeScript only; no inline `style` attributes.
- Swiper from npm via Vite — never CDN. Declare `swiper/css` + `swiper/css/*` in `src/env.d.ts`.
- all images `.webp`, explicit `width`/`height`, `decoding="async"`, `loading="lazy"`.
- respect `prefers-reduced-motion` (autoplay off, `speed: 0`, transitions off).
- pause autoplay off-screen via `IntersectionObserver`.
- full-bleed via `calc(100% + 2·gutter)` + `margin-inline` negation — **never `100vw`** (scrollbar overflow).
- `overflow-x: clip` (not `hidden`) on the bleed panel so the hover lift isn't clipped.
- fixed `320px` slides, `15px` gap, `--radius-card` image corners.
- pool clones must be `aria-hidden` + `tabindex="-1"`.
- carousel is below-fold — no LCP/CLS/FPS impact (fixed-size cards, lazy images, rAF-coalesced refresh).
- semantic, accessible markup; WCAG 2.1 AA (4.5:1) on every text/background pair.
```
