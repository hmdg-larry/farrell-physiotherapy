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

## Step-by-Step: First Deployment

### Step 1 — Set up Web3Forms (contact form)

1. Go to [web3forms.com](https://web3forms.com) and sign up for free.
2. Click **Create New Access Key**.
3. Enter the clinic's email address — all form submissions go here.
4. Copy the **Access Key**.
5. Add it to your `.env` file locally:
   ```
   PUBLIC_WEB3FORMS_KEY=your-access-key-here
   ```
6. You will also add this to Cloudflare Pages later (Step 3).

**That's it for Web3Forms.** No webhook, no backend, no dashboard config needed.
The contact form at `/contact` is already wired up and ready.

---

### Step 2 — Push to GitHub

If starting from scratch:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<org>/<repo>.git
git push -u origin main
```

---

### Step 3 — Connect to Cloudflare Pages

1. Log into [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Authorise GitHub and select your repository.
4. Configure build settings:

   | Setting | Value |
   |---|---|
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node.js version | `22` |

5. Under **Environment variables**, click **Add variable** for each:

   | Variable | Value | Notes |
   |---|---|---|
   | `PUBLIC_WEB3FORMS_KEY` | your Web3Forms key | Contact form — safe to be public |
   | `GA4_API_SECRET` | from GA4 dashboard | Mark as **Encrypted** |
   | `GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` | From GA4 dashboard |
   | `SITE_ORIGIN` | `https://yourclinic.co.uk` | Used for API origin validation |

6. Click **Save and Deploy**.
7. Cloudflare builds from `main` and gives you a preview URL (e.g. `xyz.pages.dev`).

---

### Step 4 — Update the cookie consent config

Open `src/config/cookie-consent.config.ts` and replace the placeholder IDs with the client's real values:

```ts
export const cookieConsentConfig = {
  gtmId:  'GTM-XXXXXXX',    // Google Tag Manager container ID
  gtagId: 'G-XXXXXXXXXX',   // GA4 Measurement ID
  // ...
};
```

Do not commit real GTM or GA4 IDs to a public repository — use environment variables for production.

---

### Step 5 — Connect a custom domain

1. In Cloudflare Pages: **Custom domains → Set up a custom domain**.
2. Enter the clinic's domain (`yourclinic.co.uk`).
3. If the domain is already on Cloudflare DNS, the record is added automatically.
4. If not, add a `CNAME` at your registrar pointing to `<project>.pages.dev`.
5. SSL is provisioned automatically — no action needed.

---

### Step 6 — Post-launch checklist

- [ ] Site loads on the custom domain over HTTPS
- [ ] Cookie consent banner appears on first visit
- [ ] Accept All / Reject All work correctly
- [ ] GTM fires after consent (check GTM Preview mode)
- [ ] GA4 receives events (check GA4 Realtime)
- [ ] Contact form submits successfully (check inbox linked to Web3Forms key)
- [ ] `/api/book-now` and `/api/booking-complete` return 200
- [ ] Thank-you pages are `noindex` (check `<meta name="robots">`)
- [ ] Legal pages live: `/privacy-policy`, `/terms-conditions`, `/cookie-policy`
- [ ] No console errors in browser dev tools
- [ ] PageSpeed mobile score ≥ 90

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
| `PUBLIC_WEB3FORMS_KEY` | Yes | Yes | Web3Forms access key for contact form |
| `GA4_API_SECRET` | No | For GA4 relay | GA4 Measurement Protocol secret |
| `GA4_MEASUREMENT_ID` | No | For GA4 relay | GA4 Measurement ID (`G-XXXXXXXXXX`) |
| `SITE_ORIGIN` | No | For GA4 relay | Full production URL (`https://yourclinic.co.uk`) |

Set local values in `.env` (never commit). Set production values in the Cloudflare Pages dashboard under **Settings → Environment variables**.

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
