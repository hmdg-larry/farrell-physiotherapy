# HMDG Astro Base Template

**Version:** 1.0.0 — [Changelog](CHANGELOG.md)

A premium clinic website base template built by [HMDG](https://github.com/felmerald-hmdg). Built with Astro + Tailwind CSS v4. Designed and engineered to Webflow quality standards. Clone this template to start any new UK clinic website project.

---

## Stack

| Technology | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | v5+ | Static site framework |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Utility-first styling |
| [Swiper.js](https://swiperjs.com) | v11 | Carousel components |

---

## What's included

### Pages
| Route | Description |
|---|---|
| `/` | Design system documentation and component reference |
| `/privacy-policy` | Premium legal page — scroll progress + active sidebar |
| `/terms-conditions` | Premium legal page — scroll progress + active sidebar |
| `/cookie-policy` | Premium legal page — cookie tables + compliance badges |
| `/thank-you` | Animated SVG checkmark thank you page |
| `/thank-you-booking` | Animated thank you page with "What happens next" steps |
| `/contact` | Contact page scaffold |

### Design system
- Global CSS token system (`--color-*`, `--font-*`, `--radius-*`, `--shadow-*`)
- Typography scale — Inter Tight (headings) + Inter (body)
- Button variants: `btn-default`, `btn-white`, `btn-outline`
- Card, badge, eyebrow, and caption patterns
- Consistent spacing and section rhythm

### Security (applied globally)
- Content Security Policy (CSP) — scoped to Google Fonts, GA, Maps, Cliniko
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera, mic, geolocation, payment blocked
- `Strict-Transport-Security` (HSTS)
- `public/_headers` — Netlify HTTP security headers
- `vercel.json` — Vercel HTTP security headers
- `.env.example` — secrets template, nothing hardcoded

### AI development standards
- `CLAUDE.md` — full design, development, and security rules for Claude Code
- `.claude/memory/` — shared team knowledge base (image formats, colour rules, code quality, security)

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/felmerald-hmdg/astro-base-template.git my-project
cd my-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_GOOGLE_MAPS_API_KEY=
PUBLIC_CLINIKO_BOOKING_URL=
PUBLIC_SITE_URL=https://yourclinic.co.uk
CONTACT_EMAIL=hello@yourclinic.co.uk
```

### 4. Start the dev server

```bash
npm run dev
```

Site runs at `http://localhost:4321`

---

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production into `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro ...` | Run Astro CLI commands |

---

## Project structure

```
astro-base-template/
├── .claude/
│   └── memory/               # Shared Claude team knowledge base
├── public/
│   ├── images/               # Site images (.avif + .webp)
│   └── _headers              # Netlify security headers
├── src/
│   ├── components/           # Reusable Astro components
│   ├── layouts/
│   │   └── BaseLayout.astro  # Shared page layout
│   ├── pages/                # All routes
│   └── styles/
│       └── global.css        # Design tokens + global styles
├── .env.example              # Environment variable template
├── CHANGELOG.md              # Version history
├── CLAUDE.md                 # AI development standards
├── VERSION                   # Current version number
└── vercel.json               # Vercel security headers
```

---

## Image format standard

All images must use `.avif` as primary with `.webp` fallback:

```html
<picture>
  <source srcset="/images/hero.avif" type="image/avif" />
  <source srcset="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.webp" alt="Description" loading="lazy" width="1600" height="900" />
</picture>
```

Use `loading="eager"` for above-the-fold images only.

---

## Deploying

### Netlify
Push to GitHub and connect to Netlify. Security headers are applied automatically via `public/_headers`.

### Vercel
Push to GitHub and import into Vercel. Security headers are applied automatically via `vercel.json`.

---

## Versioning

This template follows semantic versioning. See [CHANGELOG.md](CHANGELOG.md) for the full history.

| Bump | When to use |
|---|---|
| Patch `1.0.x` | Bug fixes, copy changes, minor tweaks |
| Minor `1.x.0` | New sections, pages, or components |
| Major `x.0.0` | Breaking changes, full redesign, stack upgrade |

---

## Maintained by

**HMDG** — [github.com/felmerald-hmdg](https://github.com/felmerald-hmdg)

For internal use only. Private repository.
