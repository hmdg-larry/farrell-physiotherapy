# Skill: Premium Header & Navigation System

Reusable build skill for the HMDG fixed header with transparent-to-solid scroll transition, desktop dropdowns with nested flyouts, mobile accordion drawer, dual logo swap, and active state tracking.

---

## When to use

Trigger this skill when the user asks for:
- a site header or navigation
- a sticky/fixed nav bar
- desktop mega menu or dropdown navigation
- mobile hamburger menu
- "build the header like Northern Medical"
- "use the standard header system"

---

## Architecture

| File | Purpose |
|---|---|
| `src/components/Header.astro` | Full header component — topbar, nav, mobile drawer, CTA |
| `src/components/Icon.astro` | Icon wrapper for `@lucide/astro` |
| `src/styles/global.css` | Supporting CSS classes (nav items, dropdowns, scroll states, mobile) |

### Dependencies
- `@lucide/astro` — icons (Phone, Mail, ChevronDown, ChevronRight)
- Two logo SVGs in `/public/images/`: `*-logo-white.svg` and `*-logo-colored.svg`

---

## Two-State Header System

The header has **three visual states** controlled by CSS classes on `#site-header-wrapper`:

### 1. Default (top of page)
- Transparent background
- White logo visible, coloured logo hidden
- White nav text
- Ghost-white CTA button (transparent bg, white border)
- Topbar visible with phone + email
- Hairline divider visible

### 2. Scrolled (`.is-scrolled` — added by JS at scroll > 60px)
- White background + subtle shadow
- Coloured logo visible, white logo hidden
- Dark nav text (headline colour)
- Default CTA button (primary bg, white text)
- Topbar collapsed (max-height: 0, opacity: 0)
- Divider hidden

### 3. Menu Open (`.menu-open` — added by JS on hamburger click)
- White background, full viewport height
- Coloured logo, dark text
- Default CTA button
- Mobile drawer visible
- Body scroll locked
- Topbar collapsed

---

## HTML Structure

### Outer wrapper
```html
<div id="site-header-wrapper" class="fixed top-0 left-0 right-0 z-50">
```

### Topbar (desktop only)
```html
<div id="header-topbar" class="hidden md:block bg-transparent text-white">
  <div class="container px-(--spacing-section-x) flex items-center justify-end gap-6 py-2">
    <a href="tel:PHONE" class="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors">
      <Icon name={Phone} size={14} stroke={1.5} class="shrink-0" />
      PHONE NUMBER
    </a>
    <a href="mailto:EMAIL" class="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors">
      <Icon name={Mail} size={14} stroke={1.5} class="shrink-0" />
      EMAIL ADDRESS
    </a>
  </div>
</div>
```

### Hairline divider
```html
<div id="header-divider" class="hidden md:block container px-(--spacing-section-x)">
  <div class="h-px bg-white/10"></div>
</div>
```

### Main nav bar
```html
<div id="header-nav-inner">
  <div class="container px-(--spacing-section-x) flex items-center justify-between h-[72px]">
    <!-- Logo -->
    <!-- Desktop nav (hidden xl:flex) -->
    <!-- CTA + Mobile toggle -->
  </div>
</div>
```

### Logo (dual swap)
```html
<a href="/" class="relative flex items-center shrink-0" aria-label="CLIENT — Home">
  <img id="logo-white" src="/images/CLIENT-logo-white.svg"
       alt="CLIENT" width="160" height="48"
       class="h-10 w-auto" loading="eager" decoding="async" />
  <img id="logo-coloured" src="/images/CLIENT-logo-colored.svg"
       alt="CLIENT" width="160" height="48"
       class="h-10 w-auto" loading="eager" decoding="async" />
</a>
```

CSS for logo swap:
```css
#logo-white    { transition: opacity 0.3s ease; }
#logo-coloured { position: absolute; top: 0; left: 0; opacity: 0; transition: opacity 0.3s ease; }
#site-header-wrapper.is-scrolled #logo-white   { opacity: 0; }
#site-header-wrapper.is-scrolled #logo-coloured { opacity: 1; }
```

---

## Desktop Navigation

### Nav item types

**1. Simple link (no dropdown)**
```html
<a href="/page/" class:list={["site-nav-item px-2 2xl:px-3 py-2 text-xs 2xl:text-sm font-medium text-white rounded-md transition-colors hover:text-white/70", { "is-active": isActive }]}>
  Label
</a>
```

**2. Dropdown (single level)**
```html
<div class="relative group">
  <button class:list={["site-nav-item flex items-center gap-1 px-2 2xl:px-3 py-2 text-xs 2xl:text-sm font-medium text-white rounded-md", { "is-active": sectionActive }]}
          aria-haspopup="true" aria-expanded="false">
    Label
    <Icon name={ChevronDown} size={14} stroke={1.75} class="transition-transform duration-200 group-hover:rotate-180" />
  </button>
  <div class="absolute top-full left-0 min-w-[200px] pt-2 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
    <div class="nav-dropdown-panel nav-dropdown-panel--caret">
      <a href="/sub-page/" class="nav-dropdown-item">Sub Page</a>
    </div>
  </div>
</div>
```

**3. Nested flyout (two levels)**
```html
<!-- Inside a dropdown panel -->
<div class="relative group/sub">
  <button class="nav-dropdown-item w-full flex items-center justify-between pr-3" aria-haspopup="true">
    Sub Section
    <Icon name={ChevronRight} size={14} stroke={1.5} class="text-(--color-caption) shrink-0" />
  </button>
  <div class="absolute left-full top-0 pl-2 min-w-[480px] opacity-0 invisible translate-x-1 transition-all duration-200 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0">
    <div class="nav-dropdown-panel columns-2">
      <a href="/page/" class="nav-dropdown-item">Item</a>
    </div>
  </div>
</div>
```

### Hover mechanism
All dropdowns use pure CSS via Tailwind `group-hover:` — no JS required for desktop dropdowns. The `group` class on the parent `<div>` drives visibility, opacity, and translate on the panel.

---

## Mobile Navigation

### Hamburger toggle
```html
<button id="mobile-menu-toggle"
        class="xl:hidden flex flex-col justify-center gap-[5px] p-2 min-w-[44px] min-h-[44px] items-center"
        aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav">
  <span class="mobile-toggle-bar block w-5 h-0.5 bg-white rounded-full"></span>
  <span class="mobile-toggle-bar block w-5 h-0.5 bg-white rounded-full"></span>
  <span class="mobile-toggle-bar block w-5 h-0.5 bg-white rounded-full"></span>
</button>
```

### Mobile drawer
```html
<div id="mobile-nav" class="xl:hidden hidden bg-white border-t border-(--color-border) overflow-y-auto" aria-hidden="true">
  <nav class="px-(--spacing-section-x) py-2" aria-label="Mobile navigation">
    <!-- Accordion items + simple links + CTA -->
  </nav>
</div>
```

### Mobile accordion pattern
```html
<div class="mobile-accordion">
  <button class:list={["mobile-nav-item w-full flex items-center justify-between", { "is-active": sectionActive }]} aria-expanded="false">
    Label
    <Icon name={ChevronDown} size={16} stroke={1.75} class="text-(--color-caption) transition-transform duration-200 shrink-0" />
  </button>
  <div class="mobile-accordion-panel hidden pl-3 pb-2 space-y-0.5">
    <a href="/page/" class="mobile-sub-item">Sub Page</a>
  </div>
</div>
```

Nested accordions (e.g. Conditions inside Musculoskeletal) use the same `.mobile-accordion` class nested inside a parent accordion panel.

### Mobile CTA
```html
<div class="py-4">
  <a href="/booking/" class="btn btn-default w-full justify-center">Book Now</a>
</div>
```

---

## CTA Button

The header CTA lives in the top-right area and swaps class via JS:

- Default state: `btn btn-ghost-white btn-pill` (transparent, white border)
- Scrolled state: `btn btn-default btn-pill` (primary fill, white text)
- Menu open state: `btn btn-default btn-pill`

```html
<a id="header-cta" href="/booking/" class="btn btn-ghost-white btn-pill inline-flex text-sm">
  Book Now
</a>
```

---

## JavaScript Behaviours

### Scroll state (is-scrolled)
```typescript
function applyScrollState(scrolled: boolean) {
  if (wrapper?.classList.contains('menu-open')) return; // don't fight menu state
  if (scrolled) {
    wrapper?.classList.add('is-scrolled');
    headerCta?.classList.remove('btn-ghost-white');
    headerCta?.classList.add('btn-default');
  } else {
    wrapper?.classList.remove('is-scrolled');
    headerCta?.classList.remove('btn-default');
    headerCta?.classList.add('btn-ghost-white');
  }
}
applyScrollState(window.scrollY > 60);
window.addEventListener('scroll', () => applyScrollState(window.scrollY > 60), { passive: true });
```

### Menu open/close
```typescript
function openMenu() {
  wrapper?.classList.add('menu-open');
  mobileNav?.classList.remove('hidden');
  mobileNav?.setAttribute('aria-hidden', 'false');
  mobileToggle?.setAttribute('aria-expanded', 'true');
  mobileToggle?.setAttribute('aria-label', 'Close navigation menu');
  headerCta?.classList.remove('btn-ghost-white');
  headerCta?.classList.add('btn-default');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  wrapper?.classList.remove('menu-open');
  mobileNav?.classList.add('hidden');
  mobileNav?.setAttribute('aria-hidden', 'true');
  mobileToggle?.setAttribute('aria-expanded', 'false');
  mobileToggle?.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
  applyScrollState(window.scrollY > 60);
}
```

Includes: Escape key close, outside click close.

### Mobile accordion
```typescript
document.querySelectorAll('.mobile-accordion').forEach((acc) => {
  const trigger = acc.querySelector('button');
  const panel = acc.querySelector('.mobile-accordion-panel');
  const icon = trigger?.querySelector('svg');
  trigger?.addEventListener('click', () => {
    const isOpen = !panel?.classList.contains('hidden');
    panel?.classList.toggle('hidden', isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
    if (icon) icon.style.transform = isOpen ? '' : 'rotate(180deg)';
  });
});
```

---

## Required CSS Classes in global.css

### Nav items
```css
.site-nav-item {
  font-family: var(--font-heading);
  white-space: nowrap;
  transition: color 0.2s ease, background-color 0.2s ease, backdrop-filter 0.2s ease, box-shadow 0.2s ease;
}
```

### Dropdown panel
```css
.nav-dropdown-panel {
  position: relative;
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.07);
  padding: 0.375rem;
}
.nav-dropdown-panel--caret::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 1.25rem;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid #ffffff;
}
```

### Dropdown item
```css
.nav-dropdown-item {
  display: block;
  padding: 0.625rem 1rem;
  font-size: var(--text-sm);
  font-family: var(--font-heading);
  color: var(--color-body);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.nav-dropdown-item:hover,
.nav-dropdown-item:focus-visible {
  background-color: var(--color-primary);
  color: var(--color-white);
  outline: none;
}
```

### Mobile nav items
```css
.mobile-nav-item {
  display: block;
  padding: 0.75rem 0;
  font-size: 0.9375rem;
  font-family: var(--font-heading);
  font-weight: 500;
  color: var(--color-headline);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
  transition: color 0.15s ease;
}
.mobile-nav-item:hover { color: var(--color-primary); }

.mobile-sub-item {
  display: block;
  padding: 0.5rem 0;
  font-size: var(--text-sm);
  font-family: var(--font-heading);
  color: var(--color-body);
  text-decoration: none;
  transition: color 0.15s ease;
}
.mobile-sub-item:hover { color: var(--color-primary); }
```

### Hamburger bars
```css
.mobile-toggle-bar { transition: background-color 0.3s ease, transform 0.25s ease, opacity 0.2s ease; }
@media (prefers-reduced-motion: reduce) {
  .mobile-toggle-bar { transition: none; }
}
```

### Scroll state overrides (UNLAYERED — after component layer)
```css
#site-header-wrapper.is-scrolled #header-topbar {
  max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0;
}
#site-header-wrapper.is-scrolled #header-nav-inner {
  background-color: var(--color-white);
  box-shadow: 0 2px 24px rgba(0,0,0,0.08);
}
#site-header-wrapper.is-scrolled .site-nav-item { color: var(--color-headline); }
#site-header-wrapper.is-scrolled .site-nav-item:hover { color: var(--color-primary); }
#site-header-wrapper.is-scrolled #logo-white { opacity: 0; }
#site-header-wrapper.is-scrolled #logo-coloured { opacity: 1; }
#site-header-wrapper.is-scrolled .mobile-toggle-bar { background-color: var(--color-headline); }
#site-header-wrapper.is-scrolled #header-divider { display: none; }
```

### Active state
```css
.site-nav-item.is-active {
  color: #fff;
  background-color: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
}
#site-header-wrapper.is-scrolled .site-nav-item.is-active {
  color: var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
  backdrop-filter: none;
  border-radius: 9999px;
  box-shadow: none;
}
.nav-dropdown-item.is-active {
  background-color: var(--color-primary);
  color: var(--color-white);
}
.mobile-nav-item.is-active,
.mobile-sub-item.is-active {
  color: var(--color-primary);
  font-weight: 600;
}
```

### Menu open state
```css
#site-header-wrapper.menu-open {
  background-color: var(--color-white);
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#site-header-wrapper.menu-open #header-nav-inner {
  background-color: var(--color-white);
  box-shadow: none;
}
#site-header-wrapper.menu-open #header-topbar {
  max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0;
}
```

### Button classes needed
```css
.btn { /* base — shared size, font, transition */ }
.btn-default { background-color: var(--color-primary); color: var(--color-white); }
.btn-ghost-white { background-color: transparent; color: var(--color-white); border-color: rgba(255,255,255,0.45); }
.btn-pill { border-radius: 9999px; }
```

---

## Active State Detection (Astro frontmatter)

```typescript
const path = Astro.url.pathname;
const isActive = (href: string) => path === href || path === href.replace(/\/$/, '');
const isSection = (prefix: string) => path.startsWith(prefix);

// Per nav section
const aboutActive = isSection('/about-us') || isSection('/meet-the-team') || isSection('/testimonials');
```

Use `class:list` for conditional active classes:
```html
class:list={["site-nav-item ...", { "is-active": aboutActive }]}
```

---

## Topbar transitions
```css
#header-topbar {
  max-height: 2.5rem;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease, opacity 0.3s ease;
}
```

---

## Adaptation guide for new clients

1. **Logos:** Replace `/public/images/*-logo-white.svg` and `*-logo-colored.svg`
2. **Phone + email:** Update topbar `href` and display text
3. **Nav items:** Replace the `<nav>` contents with the client's sitemap. Use the three patterns (simple link, dropdown, nested flyout) as building blocks
4. **CTA:** Update `href` and label on `#header-cta` and the mobile CTA
5. **Active state mappings:** Update `isSection()` calls in frontmatter to match new URL structure
6. **Breakpoint:** Desktop nav shows at `xl:` (1280px). Below that, hamburger + mobile drawer

---

## Non-negotiable rules

- Astro + Tailwind + TypeScript only
- No inline styles
- Icons via `@lucide/astro` (npm, not CDN)
- All logos `loading="eager"` + `decoding="async"` (above-fold, LCP-adjacent)
- 44×44px minimum touch target on hamburger
- `prefers-reduced-motion` respected on hamburger bar transitions
- Escape key closes mobile menu
- Outside click closes mobile menu
- `aria-expanded`, `aria-hidden`, `aria-label` managed by JS on state changes
- Body scroll locked when menu open (`document.body.style.overflow = 'hidden'`)
- CTA button class swap is JS-driven (ghost-white ↔ default) — not CSS-only
- Scroll state and menu state must not conflict (guard in `applyScrollState`)
