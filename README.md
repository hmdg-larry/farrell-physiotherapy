# Astro Base Template — Cloudflare

Premium UK clinic site template — static-first, built for speed, deployed on Cloudflare Pages.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 — static-first, zero-JS by default |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| TypeScript | v5 strict |
| Fonts | Inter + Inter Tight — self-hosted via `@fontsource-variable` |
| Carousels | Swiper.js — imported per-module |
| Hosting | Cloudflare Pages via `@astrojs/cloudflare` |
| Contact form | Web3Forms — zero backend, no file uploads needed |
| Analytics | Google Tag Manager + GA4 with Consent Mode v2 |
| Node.js | `>= 22.12.0` |

---

## Requirements

- Node.js `22.12.0` or higher
- npm (ships with Node)
- Git
- A GitHub account
- A Cloudflare account
- A Web3Forms account (free)

---

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/<org>/<repo>.git
cd <repo>

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your real values

# 4. Start the dev server
npm run dev
# → http://localhost:4321
```

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Local dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Astro CLI (`astro add`, `astro check`, etc.) |

---

## Deployment

For the full step-by-step deployment tutorial (GitHub → Web3Forms → Cloudflare Pages → custom domain → post-launch checklist), see **[deployment.md](deployment.md)**.

---

## Day-to-Day Workflow

```bash
git checkout -b feature/<short-description>
# make changes
git add .
git commit -m "Clear description of what changed"
git push origin feature/<short-description>
```

Open a pull request. Cloudflare Pages builds a **deploy preview** and attaches the URL to the PR. Merge into `main` → auto-deploys to production.

### Branch strategy

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys on push |
| `feature/*` | Preview — Cloudflare builds a unique preview URL per PR |

### Rollback

Cloudflare Dashboard → Pages → Deployments → click **Rollback** on any past successful build.

---

## Environment Variables Reference

| Variable | Exposed to browser | Required | Description |
|---|---|---|---|
| `NODE_VERSION` | — | **Yes** | Set in Cloudflare only. Must be `22` |
| `PUBLIC_SITE_NAME` | Yes | **Yes** | Site/clinic name — powers email subject + `from_name` |
| `PUBLIC_WEB3FORMS_KEY` | Yes | **Yes** | Web3Forms access key (controls which form receives submissions) |
| `PUBLIC_CLIENT_EMAIL` | Yes | **Yes** | Recipient inbox — overrides Web3Forms default (Pro feature). Comma-separated for multiple |
| `PUBLIC_RECAPTCHA_SITE_KEY` | Yes | **Yes** | Google reCAPTCHA v3 Site Key (public, safe to expose) |
| `SITE_ORIGIN` | No | For GA4 relay | Full production URL (`https://yourclinic.co.uk`) |
| `GA4_API_SECRET` | No | For GA4 relay | GA4 Measurement Protocol secret (encrypted) |
| `GA4_MEASUREMENT_ID` | No | For GA4 relay | GA4 Measurement ID (`G-XXXXXXXXXX`) |

Set local values in `.env` (never commit). Set production values in the Cloudflare Pages dashboard under **Settings → Variables and Secrets**.

> **All `PUBLIC_` env vars are build-time baked into the HTML.** Adding a new `PUBLIC_` variable in Cloudflare requires a redeploy before it takes effect.

> **Reply-to behaviour:** The contact form automatically sets `replyto` to the sender's email, so clicking Reply on the notification emails the submitter back directly.

> **reCAPTCHA Secret Key** lives on the Web3Forms dashboard, NOT in env vars. Web3Forms handles server-side verification.

---

## Project Structure

```
/src/
  components/   Header, Footer, CookieConsent
  layouts/      BaseLayout.astro — wraps every page
  pages/        Routes, contact form, API endpoints
  styles/       global.css — design tokens + Tailwind v4
  config/       cookie-consent.config.ts
/public/
  _headers      Cloudflare Pages security headers + CSP + cache rules
  images/       Static images
```

---

## Notes

- `PUBLIC_` env vars are exposed to the browser. Only use this prefix for non-secret values. The Web3Forms key is designed to be public — it only controls which inbox receives submissions.
- All other env vars are server-side only and never sent to the browser.
- The Cloudflare adapter (`@astrojs/cloudflare`) runs API routes (`/api/*`) as Cloudflare Pages Functions — zero cold start, edge-executed.
- Security headers (`X-Frame-Options`, `HSTS`, `CSP`, etc.) are applied via `public/_headers` — Cloudflare Pages serves this automatically on every route.

---

Designed & Developed by [HMDG](https://hmdg.co.uk).
