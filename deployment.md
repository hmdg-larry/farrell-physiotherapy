# Deployment Guide — HMDG Astro Base Template (Cloudflare)

This project is built with **Astro v6 + Tailwind v4** and deployed to **Cloudflare Pages** using the `@astrojs/cloudflare` adapter.

API routes (`/api/book-now`, `/api/booking-complete`) run as **Cloudflare Pages Functions** — no extra configuration needed.

---

## Prerequisites

- Node.js 22 or higher
- A GitHub account
- A Cloudflare account (cloudflare.com)
- GA4 Measurement ID and API Secret (from Google Analytics)
- Google Tag Manager container ID (from GTM)

---

## Step 1 — Push the project to GitHub

If not already on GitHub, initialise and push:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
git push -u origin main
```

---

## Step 2 — Connect to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and log in
2. Navigate to **Workers & Pages → Create → Pages**
3. Click **Connect to Git** and select **GitHub**
4. Authorise Cloudflare and select your repository

---

## Step 3 — Configure build settings

Cloudflare usually detects Astro automatically. Confirm these settings:

| Setting                | Value           |
|------------------------|-----------------|
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Node version           | `22`            |

If Node version is not auto-detected, add an environment variable:

```
NODE_VERSION = 22
```

---

## Step 4 — Add environment variables

In Cloudflare: **Pages project → Settings → Environment variables → Add variable**

Add the following for the **Production** environment (and optionally **Preview**):

| Variable             | Description                         | Where to find it                                                                 |
|----------------------|-------------------------------------|----------------------------------------------------------------------------------|
| `GA4_API_SECRET`     | GA4 Measurement Protocol API secret | GA4 → Admin → Data Streams → Web stream → Measurement Protocol API secrets       |
| `GA4_MEASUREMENT_ID` | GA4 Measurement ID (G-XXXXXXXXXX)   | GA4 → Admin → Data Streams → Web stream → Measurement ID                         |
| `SITE_ORIGIN`        | Your live domain with protocol      | e.g. `https://yourclinic.co.uk`                                                  |

> These variables are used by the server-side API routes (`/api/book-now` and `/api/booking-complete`) to forward events to GA4 via the Measurement Protocol. Without them the routes will still return 200 but GA4 events will not be recorded.

> Mark `GA4_API_SECRET` as **Encrypted** in the Cloudflare dashboard to keep it out of logs.

---

## Step 5 — Update the cookie consent config

Before deploying, update `src/config/cookie-consent.config.ts` with the client's real IDs:

```ts
export const cookieConsentConfig = {
  gtmId:          'GTM-XXXXXXX',   // Google Tag Manager container ID
  gtagId:         'G-XXXXXXXXXX',  // GA4 Measurement ID
  policyVersion:  '1.0',
  bannerTitle:    'We use cookies',
  bannerText:     'We use cookies to improve your experience...',
  acceptAllLabel: 'Accept All',
  rejectAllLabel: 'Reject All',
  customiseLabel: 'Customise',
};
```

> Do not commit live GTM or GA4 IDs to a public repository. For production, move these to Cloudflare Pages environment variables and read them via `import.meta.env`.

---

## Step 6 — Deploy

1. Click **Save and Deploy** in Cloudflare Pages
2. Cloudflare runs `npm run build` and uploads the `dist` folder
3. A preview URL will be generated (e.g. `https://random-hash.astro-base-template.pages.dev`)
4. Test the preview before pointing a custom domain

---

## Step 7 — Connect a custom domain

1. In Cloudflare Pages: **Custom domains → Set up a custom domain**
2. Enter the client's domain (e.g. `yourclinic.co.uk`)
3. If the domain is already on Cloudflare DNS, the CNAME record is added automatically
4. If not, add a **CNAME** at your registrar pointing to `<project>.pages.dev`
5. Cloudflare provisions a free **SSL certificate** automatically

---

## Step 8 — Post-deployment checks

After going live, verify:

- [ ] Site loads correctly on the custom domain
- [ ] HTTPS is active (padlock in browser)
- [ ] Cookie consent banner appears on first visit
- [ ] Accept All / Reject All buttons work correctly
- [ ] GTM fires after consent is given (check GTM Preview mode)
- [ ] GA4 receives events (check GA4 Realtime report)
- [ ] `/api/book-now` returns 200 when triggered
- [ ] `/api/booking-complete` returns 200 when triggered
- [ ] Thank-you pages are noindex (check with `site:yourclinic.co.uk thank-you` in Google)
- [ ] Legal pages are live: `/privacy-policy`, `/terms-conditions`, `/cookie-policy`
- [ ] Mobile layout is correct across devices
- [ ] No console errors in browser dev tools

---

## Continuous deployment

Once connected, Cloudflare Pages automatically redeploys on every push to the `main` branch. No manual action needed.

Every pull request gets a unique **deploy preview** URL for review and QA before merging.

---

## Local development

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:4321` by default.

```bash
npm run build    # production build
npm run preview  # preview the production build locally
```

---

## Environment variables for local development

Create a `.env` file in the project root (never commit this file):

```env
GA4_API_SECRET=your-api-secret-here
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
SITE_ORIGIN=http://localhost:4321
```

For Wrangler-based local preview (`wrangler pages dev dist`), use `.dev.vars` instead of `.env` — same format, same secrets. `.dev.vars` is already in `.gitignore`.

---

## Adapter reference

The Cloudflare adapter is configured in `astro.config.mjs`:

```js
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare(),
});
```

This enables:
- Cloudflare Pages Functions for all SSR routes (`export const prerender = false`)
- Edge-compatible output targeting the Cloudflare Workers runtime
- Access to Cloudflare platform bindings via `locals.runtime.env`
