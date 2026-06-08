# Skill: Carousel Category Selector (responsive tabs + dropdown)

Reusable build skill for the **category selector** that filters the card carousel (see `.claude/skills/carousel.md`). It is a single control with two responsive faces, kept in sync:

- **≥768px** — a **pill tablist** (WAI-ARIA `tablist`, roving tabindex + arrow keys).
- **≤767px** — a **custom select-only combobox** (WAI-ARIA APG) that opens **upward** and is scroll-into-view aware.

Both faces drive one shared `selectCategory(value)` that (1) syncs the other face, (2) shows/hides the matching `[data-panel]` region, and (3) dispatches a `service-panels:change` event so the carousel re-measures when its panel becomes visible.

Live reference: markup + CSS in `src/components/home/HomeServiceAreas.astro`; controller JS in the homepage IIFE in `src/pages/index.astro`.

---

## When to use

- a carousel / content area filtered by category (services by discipline, conditions by area, etc.)
- any "tabs on desktop, dropdown on mobile" selector that toggles `[data-panel]` regions
- pairs with `.claude/skills/carousel.md` (the selector emits `service-panels:change`; the carousel listens)

---

## Architecture

| Piece | Lives in | Purpose |
|---|---|---|
| Tablist + combobox markup | host section (`HomeServiceAreas.astro`) | both faces rendered; CSS shows one per breakpoint |
| Selector CSS | host section `<style>` | pill styling, combobox styling, `@media (max-width:767px)` swap |
| `selectCategory()` controller | page IIFE (`index.astro`) | single source of truth; wires tablist + combobox; filters panels; emits event |
| `[data-panel]` regions | host section | content panels toggled by `.is-hidden` |

Categories come from the data keys (e.g. `Object.keys(conditions)` → `Physiotherapy, Podiatry, …`). The first category is the default active/selected.

---

## Markup (host section, inside `.container-main`)

```astro
{/* ≥768px: pill tablist. ≤767px: custom dropdown below. CSS toggles
    which one shows; JS keeps both in sync via a shared selectCategory. */}
<div class="tabs" id="service-tabs" role="tablist" aria-label="Service categories">
  {categories.map((t, i) => (
    <button
      type="button"
      class:list={["tab", { active: i === 0 }]}
      role="tab"
      aria-selected={i === 0 ? "true" : "false"}
      aria-controls={hasPanel(t) ? `service-grid-${i}` : undefined}
      data-tab={t}
    >
      {t}
      {hasPanel(t) && <span class="tab-count">{String(count(t)).padStart(2, "0")}</span>}
    </button>
  ))}
</div>

{/* Custom select-only combobox (WAI-ARIA APG). Opens upward, scrolls if
    cut off. Drives the same data-value ↔ data-panel filtering as the tabs. */}
<div class="sa-select" id="service-select">
  <span id="sa-select-label" class="sa-select-label">Select Service Category</span>
  <div
    id="sa-select-trigger"
    class="sa-select-trigger"
    role="combobox"
    tabindex="0"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="sa-select-listbox"
    aria-labelledby="sa-select-label sa-select-trigger"
  >
    <span class="sa-select-value" data-select-value>{categories[0]}</span>
    <svg class="sa-select-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="6 15 12 9 18 15"/>
    </svg>
  </div>
  <ul id="sa-select-listbox" class="sa-select-listbox" role="listbox" aria-labelledby="sa-select-label" tabindex="-1">
    {categories.map((t, i) => (
      <li
        id={`sa-opt-${i}`}
        class:list={["sa-option", { "is-selected": i === 0 }]}
        role="option"
        aria-selected={i === 0 ? "true" : "false"}
        data-value={t}
      >
        <span class="sa-option-label">{t}</span>
        <svg class="sa-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </li>
    ))}
  </ul>
</div>
```

> The `aria-controls` / `aria-labelledby` ids (`service-tabs`, `service-select`, `sa-select-listbox`, `sa-opt-N`, `sa-select-label`, `sa-select-trigger`) are referenced by the controller — keep them in sync if you rename.

---

## CSS (host section `<style>`) — assumes a dark/brand (purple) section

```css
/* ── Pill tablist (≥768px) ──────────────────────────────────────
   White-alpha ghost pills; active = white pill, primary text (10.5:1). */
.tabs {
  display: flex; gap: 6px; margin-bottom: 56px; flex-wrap: wrap;
  border-top: 1px solid rgba(255, 255, 255, 0.18); padding-top: 28px;
}
.tab {
  padding: 14px 20px; border-radius: 999px;
  font-size: 13px; font-weight: 500; letter-spacing: -0.005em;
  color: rgba(255, 255, 255, 0.82);            /* 0.82 white ≈ 6.8:1 (AA) */
  border: 1px solid rgba(255, 255, 255, 0.30);
  background: transparent;
  display: inline-flex; align-items: center; gap: 10px;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer; font-family: inherit;
}
.tab:hover { border-color: var(--color-white); color: var(--color-white); }
.tab.active { background: var(--color-white); border-color: var(--color-white); color: var(--color-primary); }
.tab:focus-visible { outline: 2px solid var(--color-white); outline-offset: 2px; }
.tab-count { opacity: 0.75; font-size: 11px; font-weight: 400; }

/* ── Custom dropdown (select-only combobox), ≤767px only ─────────
   On-brand white pill + white popup that opens UPWARD. */
.sa-select {
  display: none;                                /* shown ≤767px */
  position: relative; width: 100%; max-width: 340px;
  margin-top: 28px; margin-bottom: 56px;
  border-top: 1px solid rgba(255, 255, 255, 0.18); padding-top: 28px;
  font-family: inherit;
}
.sa-select-label {                              /* 0.85 white ≈ 7:1 (AAA) */
  display: block; font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.85); margin-bottom: 12px;
}
.sa-select-trigger {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  width: 100%; height: 56px; padding: 0 20px; border-radius: 14px;
  background: var(--color-white); color: var(--color-headline);
  border: 1px solid color-mix(in srgb, var(--color-headline) 10%, transparent);
  box-shadow: 0 10px 30px -16px rgba(7, 5, 13, 0.4);
  font-size: 15px; font-weight: 500; letter-spacing: -0.01em;
  cursor: pointer; transition: border-color 0.3s ease, background 0.3s ease;
}
.sa-select-trigger:hover { border-color: color-mix(in srgb, var(--color-headline) 24%, transparent); }
.sa-select-trigger:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
.sa-select-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sa-select-caret { width: 18px; height: 18px; flex-shrink: 0; color: var(--color-primary); transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
.sa-select-trigger[aria-expanded="true"] .sa-select-caret { transform: rotate(180deg); }

.sa-select-listbox {
  position: absolute; bottom: calc(100% + 10px); left: 0; right: 0;  /* opens UPWARD */
  margin: 0; padding: 8px; list-style: none;
  background: var(--color-white);
  border: 1px solid color-mix(in srgb, var(--color-headline) 10%, transparent);
  border-radius: 16px; box-shadow: 0 -24px 60px -20px rgba(7, 5, 13, 0.35);
  max-height: min(50vh, 320px); overflow-y: auto; overscroll-behavior: contain; z-index: 30;
  opacity: 0; visibility: hidden; transform: translateY(8px);
  transition: opacity 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s cubic-bezier(0.22,1,0.36,1), visibility 0.25s;
  pointer-events: none;
  scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--color-headline) 25%, transparent) transparent;
}
.sa-select.is-open .sa-select-listbox { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
.sa-select-listbox::-webkit-scrollbar { width: 8px; }
.sa-select-listbox::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--color-headline) 25%, transparent); border-radius: 4px; }
.sa-option {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 16px; border-radius: 10px;
  color: var(--color-headline);                /* headline on white ≈ 19:1 */
  font-size: 15px; font-weight: 400; cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.sa-option.is-active, .sa-option:hover { background: var(--color-muted); color: var(--color-headline); }
.sa-option.is-selected { color: var(--color-primary); font-weight: 500; }   /* 9.5:1 */
.sa-option-check { width: 18px; height: 18px; flex-shrink: 0; opacity: 0; color: var(--color-primary); transition: opacity 0.2s ease; }
.sa-option.is-selected .sa-option-check { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .sa-select-caret, .sa-select-listbox { transition: none; }
}

/* ── Breakpoint swap ── */
@media (max-width: 767px) {
  .tabs { display: none; }
  .sa-select { display: block; }
}
```

> The inactive face is `display: none` at each breakpoint → removed from the a11y tree + tab order (no duplicate tab stops).
> On a **light** host section, recolour the pill/label text to dark tokens to keep ≥4.5:1.

---

## Controller JS (page IIFE)

```ts
/* Service-category selector — pill tablist (≥768px) + custom select-only
   combobox (≤767px). CSS shows one per breakpoint; both drive a shared
   selectCategory() so state stays in sync across a resize, and both update
   the same data-value ↔ data-panel filtering. */
const tabsRoot = document.getElementById('service-tabs');
const selectRoot = document.getElementById('service-select');
const tabs = tabsRoot ? Array.from(tabsRoot.querySelectorAll<HTMLButtonElement>('.tab')) : [];
const trigger = selectRoot?.querySelector<HTMLElement>('[role="combobox"]') ?? null;
const listbox = selectRoot?.querySelector<HTMLElement>('[role="listbox"]') ?? null;
const valueEl = selectRoot?.querySelector<HTMLElement>('[data-select-value]') ?? null;
const options = selectRoot ? Array.from(selectRoot.querySelectorAll<HTMLElement>('[role="option"]')) : [];

if (tabs.length || options.length) {
  const catPanels = document.querySelectorAll<HTMLElement>('[data-panel]');

  // Single source of truth — sync tablist, combobox, and panels, then emit.
  const selectCategory = (value: string) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === value;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (valueEl) valueEl.textContent = value;
    options.forEach((o) => {
      const on = o.dataset.value === value;
      o.setAttribute('aria-selected', String(on));
      o.classList.toggle('is-selected', on);
    });
    catPanels.forEach((p) => {
      const match = p.dataset.panel === value;
      p.classList.toggle('is-hidden', !match);
      p.setAttribute('aria-hidden', String(!match));
    });
    window.dispatchEvent(new CustomEvent('service-panels:change', { detail: { value } }));
  };

  /* ── Tablist (≥768px) — roving tabindex + arrow keys ── */
  if (tabsRoot && tabs.length) {
    tabs.forEach((t) => { t.tabIndex = t.classList.contains('active') ? 0 : -1; });
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => { selectCategory(btn.dataset.tab || ''); btn.focus(); });
      btn.addEventListener('keydown', (ev) => {
        const i = tabs.indexOf(btn);
        let next = -1;
        switch (ev.key) {
          case 'ArrowRight': next = (i + 1) % tabs.length; break;
          case 'ArrowLeft':  next = (i - 1 + tabs.length) % tabs.length; break;
          case 'Home':       next = 0; break;
          case 'End':        next = tabs.length - 1; break;
        }
        if (next >= 0) { ev.preventDefault(); const t = tabs[next]; selectCategory(t.dataset.tab || ''); t.focus(); }
      });
    });
  }

  /* ── Combobox (≤767px) — WAI-ARIA APG select-only ── */
  if (selectRoot && trigger && listbox && valueEl && options.length) {
    const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';
    let activeIndex = Math.max(0, options.findIndex((o) => o.getAttribute('aria-selected') === 'true'));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setActive = (i: number) => {
      activeIndex = (i + options.length) % options.length;
      options.forEach((o, idx) => o.classList.toggle('is-active', idx === activeIndex));
      const active = options[activeIndex];
      trigger.setAttribute('aria-activedescendant', active.id);
      const top = active.offsetTop, bottom = top + active.offsetHeight;   // scroll WITHIN the listbox only
      if (top < listbox.scrollTop) listbox.scrollTop = top;
      else if (bottom > listbox.scrollTop + listbox.clientHeight) listbox.scrollTop = bottom - listbox.clientHeight;
    };
    // Opens upward — if its top hides behind the fixed header, nudge the page up.
    const revealListbox = () => {
      requestAnimationFrame(() => {
        const header = document.getElementById('site-header');
        const minTop = (header ? header.offsetHeight : 0) + 16;
        const top = listbox.getBoundingClientRect().top;
        if (top < minTop) window.scrollBy({ top: top - minTop, left: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      });
    };
    const open = () => {
      activeIndex = Math.max(0, options.findIndex((o) => o.getAttribute('aria-selected') === 'true'));
      selectRoot.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      setActive(activeIndex);
      revealListbox();
    };
    const close = (focusTrigger = true) => {
      selectRoot.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.removeAttribute('aria-activedescendant');
      options.forEach((o) => o.classList.remove('is-active'));
      if (focusTrigger) trigger.focus();
    };
    const choose = (i: number) => selectCategory(options[(i + options.length) % options.length].dataset.value || '');

    trigger.addEventListener('click', () => (isOpen() ? close() : open()));
    trigger.addEventListener('keydown', (ev) => {
      const open_ = isOpen();
      switch (ev.key) {
        case 'ArrowDown': ev.preventDefault(); open_ ? setActive(activeIndex + 1) : open(); break;
        case 'ArrowUp':   ev.preventDefault(); open_ ? setActive(activeIndex - 1) : open(); break;
        case 'Enter': case ' ': ev.preventDefault(); if (!open_) { open(); } else { choose(activeIndex); close(); } break;
        case 'Home': if (open_) { ev.preventDefault(); setActive(0); } break;
        case 'End':  if (open_) { ev.preventDefault(); setActive(options.length - 1); } break;
        case 'Escape': if (open_) { ev.preventDefault(); close(); } break;
        case 'Tab': if (open_) close(false); break;
        default:
          if (open_ && ev.key.length === 1 && /\S/.test(ev.key)) {   // type-ahead
            const ch = ev.key.toLowerCase();
            for (let k = 1; k <= options.length; k++) {
              const idx = (activeIndex + k) % options.length;
              if ((options[idx].dataset.value || '').toLowerCase().startsWith(ch)) { setActive(idx); break; }
            }
          }
      }
    });

    options.forEach((opt, i) => {
      opt.addEventListener('click', () => { choose(i); close(); });
      opt.addEventListener('mousemove', () => { if (activeIndex !== i) setActive(i); });
    });
    document.addEventListener('pointerdown', (ev) => {
      if (isOpen() && !selectRoot.contains(ev.target as Node)) close(false);
    });
  }
}
```

---

## How it connects to the carousel

1. Each filterable content block is a `[data-panel="<Category>"]` region (the carousel lives in one of them).
2. `selectCategory(value)` toggles `.is-hidden` (`display:none`) on every `[data-panel]` whose `data-panel !== value`.
3. It then dispatches `window` `CustomEvent("service-panels:change", { detail: { value } })`.
4. The carousel (`.claude/skills/carousel.md`) listens for `service-panels:change` and calls its `refresh()` so Swiper re-measures when its panel is shown after being `display:none` (otherwise it would measure 0 width while hidden).

The default-visible panel (first category) is rendered **without** `.is-hidden` so the carousel initialises while visible.

---

## Accessibility (audited, WCAG 2.1 AA)

- **Tablist (≥768px):** `role="tablist"` + `role="tab"`, roving tabindex (only active tab in tab order), ←/→/Home/End, `aria-selected`. Pills: 0.82-white ≈6.8:1; active white-on-purple/purple-on-white ≈10.5:1; white `focus-visible` outline.
- **Combobox (≤767px):** WAI-ARIA APG **select-only combobox** — `role="combobox"` (`aria-haspopup/expanded/controls/activedescendant`, labelled by the visible label), `role="listbox"`, `role="option"`/`aria-selected`. ↑/↓ open & move, Enter/Space select, Esc/Tab close, Home/End, type-ahead, outside-click close, focus returns to trigger. Listbox `visibility:hidden` when closed (out of tab order + a11y tree). Trigger headline-on-white ≈19:1; selected primary ≈9.5:1; primary focus outline.
- **Breakpoint swap:** the inactive face is `display:none` → no duplicate tab stops / SR duplication.
- **Upward open:** `revealListbox()` smooth-scrolls the page up if the panel is clipped by the fixed header (instant under `prefers-reduced-motion`).
- **Reduced motion:** caret + listbox transitions disabled.

---

## Non-negotiable rules

- Render **both** faces; CSS `@media (max-width:767px)` swaps them; never show both.
- One `selectCategory()` is the single source of truth — both faces and all `[data-panel]` regions update through it, and it MUST emit `service-panels:change`.
- Keep the `id`s the controller queries (`service-tabs`, `service-select`, `sa-select-listbox`, `sa-opt-N`, `sa-select-label`, `sa-select-trigger`, `[data-select-value]`, `[data-panel]`) in sync with the JS.
- Default to the first category (active/selected, panel visible) so the carousel inits visible.
- Tablist = roving tabindex; combobox = APG select-only pattern — don't downgrade either.
- WCAG 2.1 AA (4.5:1) on every pill/option/label text; recolour for light sections.
- No inline styles; Astro + Tailwind + TypeScript; `prefers-reduced-motion` honoured.
```
