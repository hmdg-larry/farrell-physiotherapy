# Skill — Condition List with Cursor-Reveal Image Effect

Reusable editorial **hover-list + floating cursor-following preview image** pattern, exactly as built in `src/components/home/HomeConditions.astro` (the homepage "Conditions We Treat" section).

Big condition names sit in a bordered list. On desktop hover/focus a fixed-position image preview follows the cursor, showing that condition's photo with a **centred "Discover" button** and a **bottom-centre condition-name caption**. A pill tablist (≥768px) / select-only combobox (≤767px) switches between category panels. Touch/mobile and reduced-motion users get the clean list with no floating preview.

> This is **NOT a carousel**. See `.claude/skills/carousel.md` for the Swiper card carousel and `.claude/skills/carousel-tabs.md` for the standalone category selector (same tab/dropdown controller this pattern reuses).

---

## When to use

- An editorial "browse by X" list where each row is a link to a detail page (conditions, services, treatments, case studies).
- You want a premium, magazine-style interaction on desktop without a heavy gallery/carousel.
- Each row has: an index number, a large name, a short description, a target page, and a representative image.

Do **not** use it as the only way to reach content — the floating preview is a desktop-hover enhancement; the **row itself is the real link** and works everywhere.

---

## Visual anatomy

```
[ 01 ]  Spinal Conditions            Back, neck and postural pain.        ( → )
        └ index    └ big name (h-list)   └ short desc (right col)         └ arrow

        … on hover/focus, a 320×400 image floats at the cursor: ┐
                                                                │  ┌──────────────┐
                                                                │  │   (photo)    │
                                                                └─▶│  [ Discover→]│  ← centred button
                                                                   │  Spinal Cond.│  ← bottom caption
                                                                   └──────────────┘
```

- **Row grid:** `60px | name(4fr) | desc(3fr) | 48px arrow`. Hover slides the row right, translates the name, fills the arrow purple, darkens the desc.
- **Preview:** `position: fixed`, follows the cursor via `--cond-x/--cond-y` CSS vars (rAF-throttled), centred on the pointer with `translate(-50%,-50%)`, fades+scales in on `.show`.
- **Discover button:** centred, `--color-primary` bg, white text, `pointer-events:none` (clicks pass through to the row link beneath the cursor — same href).
- **Name caption:** bottom, white text over a strong bottom-up gradient scrim (guarantees WCAG AA over any photo).

---

## Required design tokens

Uses these project tokens (define equivalents when porting):

| Token | Used for | Example |
|---|---|---|
| `--color-accent` | section background (light tint) | `#eceaf3` |
| `--color-headline` | names, near-black text/borders | `#07050d` |
| `--color-body` | desc on hover | body grey |
| `--color-primary` | active pill, arrow fill, Discover bg | `#443082` |
| `--color-white` | button/caption text, dropdown surfaces | `#ffffff` |
| `--color-muted` | dropdown option hover | `#f6f5f9` |

Also assumes the global helpers used elsewhere in this template: `.container-main`, `.s-head` / `.s-head-top` / `.s-head-grid` / `.idx` / `.right` / `.h-right`, the numbered-section class (`fourthsection`), and `.reveal` scroll-entrance utility. Strip/replace these if porting to a project without them.

---

## Data shape

```ts
interface ConditionItem {
  name: string;     // big list name + bottom caption text
  desc: string;     // short right-column description
  href: string;     // row link + Discover button target
  image: string;    // preview photo (.avif/.webp), e.g. /images/.../slug.avif
  imageAlt: string; // alt text (decorative in-preview, but kept for future use)
}
// One panel per category; the category name keys the tab ↔ panel filter.
const conditionData: { name: string; items: ConditionItem[] }[] = [ … ];
```

Images live at e.g. `/images/conditions/featured-images/<slug>.avif`. A helper keeps it DRY:

```ts
const CONDITION_IMAGE_BASE = "/images/conditions/featured-images";
const conditionImage = (slug: string) => `${CONDITION_IMAGE_BASE}/${slug}.avif`;
```

---

## Full source (drop-in `.astro` component)

> This is the exact production implementation. Keep the `cond-` / `condition-` prefixes, or rename consistently (see **Renaming** below). The category-selector controller (section 1 of the script) is the same one documented in `carousel-tabs.md`; the reveal controller (section 2) is the part unique to this skill.

### Frontmatter + markup

```astro
---
const CONDITION_IMAGE_BASE = "/images/conditions/featured-images";
const conditionImage = (slug: string) => `${CONDITION_IMAGE_BASE}/${slug}.avif`;

interface ConditionItem { name: string; desc: string; href: string; image: string; imageAlt: string; }
const conditionData: { name: string; items: ConditionItem[] }[] = [
  {
    name: "Musculoskeletal",
    items: [
      { name: "Spinal Conditions", desc: "Back, neck and postural pain.", href: "/condition/spinal-conditions/", image: conditionImage("spinal-conditions"), imageAlt: "Physiotherapy support for spinal conditions and postural pain" },
      // …more items
    ],
  },
  // …more categories
];
const conditionCategories = conditionData.map((c) => c.name);
---

<section class="conditions fourthsection" id="conditions" aria-labelledby="conditions-title">
  <div class="container-main">
    <div class="s-head reveal">
      <div class="s-head-top">
        <span class="idx"><span class="num">03</span> &mdash; Conditions We Treat</span>
        <span class="right">Four areas of care &middot; one expert team</span>
      </div>
      <div class="s-head-grid">
        <h2 id="conditions-title">
          Conditions We Treat <span class="conditions-accent">Every Body, Every Need.</span>
        </h2>
        <p class="h-right">Whatever your concern, the right care pathway is here…</p>
      </div>
    </div>

    <!-- Pill tablist (≥768px) -->
    <div class="cond-tabs reveal d1" id="condition-tabs" role="tablist" aria-label="Condition categories">
      {conditionCategories.map((c, i) => (
        <button type="button" class:list={["cond-tab", { active: i === 0 }]} role="tab"
          aria-selected={i === 0 ? "true" : "false"} data-cond-tab={c}>{c}</button>
      ))}
    </div>

    <!-- Custom select-only combobox (≤767px). WAI-ARIA APG; opens upward. -->
    <div class="cond-select" id="condition-select">
      <span id="cond-select-label" class="cond-select-label">Select Condition Category</span>
      <div id="cond-select-trigger" class="cond-select-trigger" role="combobox" tabindex="0"
        aria-haspopup="listbox" aria-expanded="false" aria-controls="cond-select-listbox"
        aria-labelledby="cond-select-label cond-select-trigger">
        <span class="cond-select-value" data-select-value>{conditionCategories[0]}</span>
        <svg class="cond-select-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 15 12 9 18 15"/></svg>
      </div>
      <ul id="cond-select-listbox" class="cond-select-listbox" role="listbox" aria-labelledby="cond-select-label" tabindex="-1">
        {conditionCategories.map((c, i) => (
          <li id={`cond-opt-${i}`} class:list={["cond-option", { "is-selected": i === 0 }]} role="option"
            aria-selected={i === 0 ? "true" : "false"} data-value={c}>
            <span class="cond-option-label">{c}</span>
            <svg class="cond-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          </li>
        ))}
      </ul>
    </div>

    <!-- One panel per category: hover-list + floating preview. First visible. -->
    {conditionData.map((cat, catIdx) => (
      <div class:list={["cond-panel", { "is-hidden": catIdx !== 0 }]} data-cond-panel={cat.name}>
        <div class="cond-list">
          {cat.items.map((c, i) => (
            <a href={c.href} class:list={["cond-row", "reveal", `d${(i % 6) + 1}`]}
              data-cond-img={c.image} data-cond-alt={c.imageAlt}
              aria-label={`${c.name} — ${c.desc}`}>
              <span class="cond-n">{String(i + 1).padStart(2, "0")}</span>
              <span class="cond-name">{c.name}</span>
              <span class="cond-desc">{c.desc}</span>
              <span class="cond-arr" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </span>
            </a>
          ))}
        </div>

        <!-- Floating preview. Whole node is aria-hidden; button is tabindex=-1 +
             pointer-events:none → no duplicate tab stop / SR target. The row link
             beneath the cursor handles navigation (same href). -->
        <div class="cond-preview" aria-hidden="true">
          <img src={cat.items[0]?.image} alt={cat.items[0]?.imageAlt ?? ""} width="640" height="800" loading="lazy" decoding="async" />
          <a class="cond-preview-btn" href={cat.items[0]?.href ?? "#"} tabindex="-1">
            Discover <span aria-hidden="true">&rarr;</span>
          </a>
          <span class="cond-preview-name">{cat.items[0]?.name}</span>
        </div>
      </div>
    ))}
  </div>
</section>
```

### Styles (scoped `<style>`)

```css
.conditions { background: var(--color-accent); color: var(--color-body); }
.conditions h2 {
  color: var(--color-headline);
  font-size: clamp(44px, 6vw, 96px); font-weight: 400; letter-spacing: -0.04em;
  line-height: 0.96; margin: 0; text-wrap: balance;
}
.conditions-accent { color: var(--color-primary); font-weight: 300; }

/* ── Pill tablist (light section) ── */
.cond-tabs {
  display: flex; gap: 6px; flex-wrap: wrap;
  border-top: 1px solid color-mix(in srgb, var(--color-headline) 12%, transparent);
  padding-top: 28px;
}
.cond-tab {
  padding: 14px 20px; border-radius: 999px; font-size: 13px; font-weight: 500;
  letter-spacing: -0.005em; color: color-mix(in srgb, var(--color-headline) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-headline) 15%, transparent);
  background: transparent; display: inline-flex; align-items: center;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); cursor: pointer; font-family: inherit;
}
.cond-tab:hover { border-color: var(--color-headline); color: var(--color-headline); }
.cond-tab.active { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-white); }
.cond-tab:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

/* ── Mobile dropdown (≤767px) — white surfaces on the light section ── */
.cond-select {
  display: none; position: relative; width: 100%; max-width: 340px;
  border-top: 1px solid color-mix(in srgb, var(--color-headline) 12%, transparent);
  padding-top: 28px; font-family: inherit;
}
.cond-select-label {
  display: block; font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
  color: color-mix(in srgb, var(--color-headline) 75%, transparent); margin-bottom: 12px;
}
.cond-select-trigger {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  width: 100%; height: 56px; padding: 0 20px; border-radius: 14px;
  background: var(--color-white); color: var(--color-headline);
  border: 1px solid color-mix(in srgb, var(--color-headline) 10%, transparent);
  box-shadow: 0 10px 30px -16px rgba(7, 5, 13, 0.4);
  font-size: 15px; font-weight: 500; letter-spacing: -0.01em; cursor: pointer;
  transition: border-color 0.3s ease, background 0.3s ease;
}
.cond-select-trigger:hover { border-color: color-mix(in srgb, var(--color-headline) 24%, transparent); }
.cond-select-trigger:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
.cond-select-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cond-select-caret { width: 18px; height: 18px; flex-shrink: 0; color: var(--color-primary); transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
.cond-select-trigger[aria-expanded="true"] .cond-select-caret { transform: rotate(180deg); }
.cond-select-listbox {
  position: absolute; bottom: calc(100% + 10px); left: 0; right: 0; margin: 0; padding: 8px;
  list-style: none; background: var(--color-white);
  border: 1px solid color-mix(in srgb, var(--color-headline) 10%, transparent);
  border-radius: 16px; box-shadow: 0 -24px 60px -20px rgba(7, 5, 13, 0.35);
  max-height: min(50vh, 320px); overflow-y: auto; overscroll-behavior: contain; z-index: 30;
  opacity: 0; visibility: hidden; transform: translateY(8px);
  transition: opacity 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s cubic-bezier(0.22,1,0.36,1), visibility 0.25s;
  pointer-events: none; scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--color-headline) 25%, transparent) transparent;
}
.cond-select.is-open .cond-select-listbox { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
.cond-select-listbox::-webkit-scrollbar { width: 8px; }
.cond-select-listbox::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--color-headline) 25%, transparent); border-radius: 4px; }
.cond-option {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 16px; border-radius: 10px; color: var(--color-headline);
  font-size: 15px; font-weight: 400; cursor: pointer; transition: background 0.2s ease, color 0.2s ease;
}
.cond-option.is-active, .cond-option:hover { background: var(--color-muted); color: var(--color-headline); }
.cond-option.is-selected { color: var(--color-primary); font-weight: 500; }
.cond-option-check { width: 18px; height: 18px; flex-shrink: 0; opacity: 0; color: var(--color-primary); transition: opacity 0.2s ease; }
.cond-option.is-selected .cond-option-check { opacity: 1; }

/* Breakpoint swap — dropdown ≤767px; pill tabs ≥768px. */
@media (max-width: 767px) { .cond-tabs { display: none; } .cond-select { display: block; } }

/* ── Editorial hover-list ── */
.cond-panel { margin-top: 44px; }
.cond-panel.is-hidden { display: none; }
.cond-list { border-top: 1px solid color-mix(in srgb, var(--color-headline) 12%, transparent); position: relative; }
.cond-row {
  display: grid; grid-template-columns: 60px minmax(0, 4fr) minmax(0, 3fr) 48px; gap: 32px;
  align-items: center; padding: clamp(28px, 3.5vw, 44px) 0;
  border-bottom: 1px solid color-mix(in srgb, var(--color-headline) 12%, transparent);
  position: relative; cursor: pointer; text-decoration: none; color: inherit;
  transition: padding-left 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.cond-n { font-size: 13px; letter-spacing: 0.04em; color: color-mix(in srgb, var(--color-headline) 62%, transparent); font-weight: 500; transition: color 0.4s cubic-bezier(0.22,1,0.36,1); }
.cond-name { font-size: clamp(22px, 2.6vw, 40px); font-weight: 400; letter-spacing: -0.03em; line-height: 1.05; color: var(--color-headline); transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
.cond-desc { font-size: 14px; line-height: 1.5; letter-spacing: -0.011em; color: color-mix(in srgb, var(--color-headline) 65%, transparent); max-width: 420px; transition: color 0.4s cubic-bezier(0.22,1,0.36,1); }
.cond-arr {
  display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px;
  border-radius: 50%; border: 1px solid color-mix(in srgb, var(--color-headline) 28%, transparent);
  color: var(--color-headline);
  transition: background 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s cubic-bezier(0.22,1,0.36,1), color 0.5s cubic-bezier(0.22,1,0.36,1);
}
.cond-arr svg { width: 17px; height: 17px; }
/* Hover AND keyboard focus share the active visual. */
.cond-row:hover, .cond-row:focus-visible { padding-left: 24px; }
.cond-row:hover .cond-name, .cond-row:focus-visible .cond-name { transform: translateX(8px); }
.cond-row:hover .cond-arr, .cond-row:focus-visible .cond-arr { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-white); }
.cond-row:hover .cond-desc, .cond-row:focus-visible .cond-desc { color: var(--color-body); }
.cond-row:hover .cond-n, .cond-row:focus-visible .cond-n { color: var(--color-headline); }
.cond-row:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 4px; }

/* ── Floating preview (cursor-following) ── */
.cond-preview {
  position: fixed; left: var(--cond-x, 0); top: var(--cond-y, 0);
  pointer-events: none; width: 320px; height: 400px; z-index: 50;
  border-radius: 8px; overflow: hidden; opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
  transition: opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.6);
}
.cond-preview.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.cond-preview img { width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 1; }

/* Centred Discover button — pointer-events:none (click passes through to the
   row link). White on --color-primary ≈ 10.6:1 (AAA). Eases up + fades in. */
.cond-preview-btn {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, calc(-50% + 10px)) scale(0.92); opacity: 0; z-index: 2;
  display: inline-flex; align-items: center; gap: 8px;
  padding: clamp(11px, 1.1vw, 15px) clamp(22px, 1.9vw, 30px); border-radius: 999px;
  background: var(--color-primary); color: var(--color-white);
  font-size: clamp(13px, 0.9vw, 15px); font-weight: 500; letter-spacing: 0.02em;
  white-space: nowrap; text-decoration: none; pointer-events: none;
  box-shadow: 0 10px 26px -14px rgba(7, 5, 13, 0.6);
  transition: transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s cubic-bezier(0.22,1,0.36,1);
}
.cond-preview-btn span { transition: transform 0.45s cubic-bezier(0.22,1,0.36,1); }
.cond-preview.show .cond-preview-btn {
  opacity: 1; transform: translate(-50%, -50%) scale(1);
  box-shadow: 0 16px 38px -14px rgba(68, 48, 130, 0.65); transition-delay: 0.07s;
}
.cond-preview.show .cond-preview-btn span { transform: translateX(4px); }

/* Bottom-centre condition-name caption. Gradient scrim guarantees WCAG AA
   (worst case white-on-scrim over a WHITE photo ≈ 8.66:1; ≈18:1 at the base). */
.cond-preview-name {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
  padding: clamp(40px, 6vw, 56px) 20px clamp(14px, 2vw, 20px);
  text-align: center; font-size: clamp(16px, 1.1vw, 19px); font-weight: 500;
  letter-spacing: -0.01em; line-height: 1.2; color: var(--color-white);
  text-shadow: 0 1px 10px rgba(7, 5, 13, 0.55);
  background: linear-gradient(to top, rgba(7,5,13,0.92) 0%, rgba(7,5,13,0.72) 38%, rgba(7,5,13,0.32) 70%, transparent 100%);
  pointer-events: none; opacity: 0; transform: translateY(8px);
  transition: opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
}
.cond-preview.show .cond-preview-name { opacity: 1; transform: translateY(0); transition-delay: 0.05s; }

/* Reduced motion: button + caption appear instantly with the image. */
@media (prefers-reduced-motion: reduce) {
  .cond-preview-btn, .cond-preview-btn span, .cond-preview-name { transition: none; }
  .cond-preview-btn { transform: translate(-50%, -50%) scale(1); }
  .cond-preview-name { transform: translateY(0); }
}

/* No floating preview on mobile / touch — list stands alone. */
@media (max-width: 980px), (hover: none) { .cond-preview { display: none; } }
@media (max-width: 980px) { .cond-row { grid-template-columns: 40px 1fr 48px; gap: 16px; } .cond-desc { display: none; } }

@media (prefers-reduced-motion: reduce) {
  .cond-tab, .cond-row, .cond-name, .cond-arr, .cond-select-caret, .cond-select-listbox { transition: none; }
}
```

### Script (scoped `<script>`)

Two parts: **(1)** the category selector controller (tablist + combobox, same as `carousel-tabs.md`) and **(2)** the reveal controller. Reproduce part 2 verbatim; part 1 is summarised — copy it from `HomeConditions.astro` or `carousel-tabs.md`.

```ts
/* 1. Category selector — pill tablist (≥768px) + select-only combobox (≤767px).
      A shared selectCategory(value) toggles .cond-tab.active / aria-selected,
      the combobox value + options, and the [data-cond-panel] visibility.
      (Full APG keyboard impl: see carousel-tabs.md / HomeConditions.astro.) */

/* 2. Floating preview reveal — one .cond-list + .cond-preview per panel. */
const hoverCapable = window.matchMedia("(hover: hover)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (hoverCapable && !reduceMotion) {
  document.querySelectorAll<HTMLElement>(".cond-list").forEach((list) => {
    const panel = list.closest<HTMLElement>("[data-cond-panel]");
    const preview = panel?.querySelector<HTMLElement>(".cond-preview") ?? null;
    const previewImg = preview?.querySelector("img") ?? null;
    const previewBtn = preview?.querySelector<HTMLAnchorElement>(".cond-preview-btn") ?? null;
    const previewName = preview?.querySelector<HTMLElement>(".cond-preview-name") ?? null;
    if (!preview || !previewImg) return;

    let raf = 0, lastX = 0, lastY = 0;
    const position = () => {
      raf = 0;
      preview.style.setProperty("--cond-x", lastX + "px");
      preview.style.setProperty("--cond-y", lastY + "px");
    };
    const reveal = (row: HTMLElement) => {
      const src = row.dataset.condImg;
      if (src && previewImg.getAttribute("src") !== src) previewImg.setAttribute("src", src);
      previewImg.setAttribute("alt", row.dataset.condAlt || "");
      const href = row.getAttribute("href");
      if (previewBtn && href) previewBtn.setAttribute("href", href);     // sync Discover target
      if (previewName) previewName.textContent = row.querySelector(".cond-name")?.textContent ?? ""; // sync caption
      preview.classList.add("show");
    };

    list.addEventListener("mousemove", (e) => {
      lastX = (e as MouseEvent).clientX; lastY = (e as MouseEvent).clientY;
      if (!raf) raf = requestAnimationFrame(position);
    });

    list.querySelectorAll<HTMLElement>(".cond-row").forEach((row) => {
      row.addEventListener("mouseenter", () => reveal(row));
      row.addEventListener("mouseleave", () => preview.classList.remove("show"));
      // Keyboard focus mirrors hover — park the preview at a fixed right-side spot.
      row.addEventListener("focus", () => {
        const rect = row.getBoundingClientRect();
        preview.style.setProperty("--cond-x", Math.round(window.innerWidth * 0.78) + "px");
        preview.style.setProperty("--cond-y", Math.round(rect.top + rect.height / 2) + "px");
        reveal(row);
      });
      row.addEventListener("blur", () => preview.classList.remove("show"));
    });
  });
}
```

---

## How it works (key mechanics)

1. **Cursor follow** — `mousemove` on `.cond-list` stores `clientX/clientY` and schedules ONE `requestAnimationFrame` that writes `--cond-x/--cond-y`. The preview is `position:fixed` and centred on those vars via `translate(-50%,-50%)`. rAF-throttling keeps it at 60fps with no layout thrash (only `transform`/custom-props animate).
2. **Per-row reveal** — `mouseenter` swaps the preview `<img>` `src`+`alt` from the row's `data-cond-img`/`data-cond-alt`, syncs the Discover `href` and the caption text, then adds `.show` (fade + scale in). `mouseleave` removes `.show`.
3. **Click passthrough** — the preview (and the Discover button) are `pointer-events:none`, so the pointer is always "on" the `.cond-row` link directly beneath the cursor. Clicking anywhere — including the centred button — navigates via the row link (same `href`). This is why the button can sit under the cursor without breaking the follow.
4. **Tabs ↔ panels** — `selectCategory()` toggles `.is-hidden` on `[data-cond-panel]`. Each panel has its own `.cond-list` + `.cond-preview`; the reveal controller loops every `.cond-list` so all panels work.

---

## Accessibility (verified WCAG 2.1 AA)

- The **`.cond-row` is the real link** with `aria-label="{name} — {desc}"` — the keyboard/SR target on every device.
- The entire **`.cond-preview` is `aria-hidden="true"`**; the Discover button is `tabindex="-1"` + `pointer-events:none`. So the caption/button/image add **no duplicate tab stop and no duplicate SR announcement**.
- **Keyboard focus** mirrors hover: focusing a row reveals the preview at a fixed right-side position (no pointer needed). `:focus-visible` shows the row outline and the same active visual as hover.
- **Contrast:** Discover button white-on-`--color-primary` ≈ **10.6:1**. Caption white-on-scrim worst case (0.72 alpha over a white photo at the text band) ≈ **8.66:1**, ≈18:1 at the base — the gradient scrim guarantees ≥4.5:1 over **any** image. Row text on the light section: name = headline (high), `.cond-n` 62% ≈ 5.2:1, `.cond-desc` 65% ≈ 5.9:1 (all AA).
- **`prefers-reduced-motion`:** the reveal controller is gated off entirely (`if (hoverCapable && !reduceMotion)`), AND a CSS reduced-motion block neutralises the button/caption transitions as belt-and-braces.

---

## Responsive

- **≥981px + hover-capable:** full experience (list + floating preview + button + caption).
- **≤980px OR `(hover:none)`:** `.cond-preview { display:none }` — clean list, no preview. The row links still work.
- **≤980px:** row grid collapses to `40px | 1fr | 48px` and `.cond-desc` is hidden (name + arrow only).
- **≤767px:** pill tabs hide, the select-only combobox shows.

---

## Performance

- Only `transform` / `opacity` / CSS custom props animate (never width/height/top/left) → no layout thrash.
- `mousemove` is rAF-coalesced (one write per frame max).
- Preview images: `.avif` (or `.webp`), `loading="lazy"`, `decoding="async"`, explicit `width`/`height` (no CLS). The first item's image is the default `src`; others swap in on hover (already cached after first reveal).
- No library — vanilla JS, ~1 small inline/bundled script. Astro bundles the component `<script>` once even with multiple panels.

---

## Renaming for reuse (e.g. a "Services" or "Treatments" list)

Swap the prefixes consistently across markup, CSS, and JS:

| This skill | Generic |
|---|---|
| `conditionData` / `ConditionItem` | your data array / interface |
| `data-cond-panel` / `data-cond-tab` / `data-value` | `data-x-panel` / `data-x-tab` |
| `data-cond-img` / `data-cond-alt` | `data-x-img` / `data-x-alt` |
| `--cond-x` / `--cond-y` | `--x-x` / `--x-y` |
| `.cond-list/-row/-name/-desc/-arr/-n` | `.x-list/-row/…` |
| `.cond-preview/-btn/-name` | `.x-preview/-btn/-name` |
| `#condition-tabs` / `#condition-select` ids | `#x-tabs` / `#x-select` |

Keep the **structural invariants**: preview is `aria-hidden` + `pointer-events:none`, button is `tabindex="-1"`, the row is the real `<a>`, the gradient scrim stays for caption contrast, and the reveal controller stays gated behind `hover: hover` + not-reduced-motion.

---

## Gotchas

- **Don't make the Discover button `pointer-events:auto`.** It sits under the cursor; enabling pointer events makes `mouseleave` fire on the row → the preview flickers/hides. Passthrough is intentional.
- **Don't drop the scrim** under the caption — over a light photo the white text fails AA without it.
- **Keep the row as the link** — the button/caption are decorative; navigation must not depend on the floating preview (it doesn't exist on touch).
- **One `.cond-preview` per panel** — the controller pairs each `.cond-list` with its sibling `.cond-preview` via `closest("[data-cond-panel]")`. Don't share a single preview across panels.
- **Caption width** — `text-align:center` with the gradient full-width; very long names wrap (line-height 1.2). Keep names short for a single line.

---

## Related skills

- `.claude/skills/carousel-tabs.md` — the responsive category tablist/combobox controller reused here (section 1 of the script).
- `.claude/skills/carousel.md` — Swiper card carousel (a different "browse" pattern; use when you want scrollable cards rather than an editorial list).
