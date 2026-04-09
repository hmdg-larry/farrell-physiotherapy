# Deployment Guide — HMDG Astro Base Template

This project is built with **Astro v6 + Tailwind v4** and deployed to **Netlify** using the `@astrojs/netlify` adapter.

API routes (`/api/book-now`, `/api/booking-complete`) run as **Netlify Functions** — no extra configuration needed.

---

## Prerequisites

- Node.js 18 or higher
- A GitHub, GitLab, or Bitbucket account
- A Netlify account (netlify.com)
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

## Step 2 — Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and log in
2. Click **Add new site** → **Import an existing project**
3. Select **GitHub** (or GitLab / Bitbucket)
4. Authorise Netlify and select your repository

---

## Step 3 — Configure build settings

Netlify usually detects Astro automatically. Confirm these settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `18` (or higher) |

If Node version is not set, add an environment variable:

```
NODE_VERSION = 18
```

---

## Step 4 — Add environment variables

In Netlify: **Site settings → Environment variables → Add a variable**

Add all of the following:

| Variable | Description | Where to find it |
|---|---|---|
| `GA4_API_SECRET` | GA4 Measurement Protocol API secret | GA4 → Admin → Data Streams → Web stream → Measurement Protocol API secrets |
| `GA4_MEASUREMENT_ID` | GA4 Measurement ID (G-XXXXXXXXXX) | GA4 → Admin → Data Streams → Web stream → Measurement ID |
| `SITE_ORIGIN` | Your live domain with protocol | e.g. `https://yourclinic.co.uk` |

> These variables are used by the server-side API routes (`/api/book-now` and `/api/booking-complete`) to forward events to GA4 via the Measurement Protocol. Without them the routes will still return 200 but GA4 events will not be recorded.

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

> Do not commit live GTM or GA4 IDs to a public repository. For production, move these to Netlify environment variables and read them via `import.meta.env`.

---

## Step 6 — Deploy

1. Click **Deploy site** in Netlify
2. Netlify runs `npm run build` and uploads the `dist` folder
3. A preview URL will be generated (e.g. `https://random-name.netlify.app`)
4. Test the preview before pointing a custom domain

---

## Step 7 — Connect a custom domain

1. In Netlify: **Domain management → Add a domain**
2. Enter the client's domain (e.g. `yourclinic.co.uk`)
3. Update DNS records at the domain registrar:
   - Add a **CNAME** record pointing to the Netlify subdomain, or
   - Use **Netlify DNS** for full management
4. Netlify provisions a free **SSL certificate** automatically via Let's Encrypt

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

Once connected, Netlify automatically redeploys on every push to the `main` branch. No manual action needed.

To deploy a specific branch as a staging environment:

1. In Netlify: **Site settings → Build & deploy → Branch deploys**
2. Enable deploy previews for pull requests

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

`.env` is already in `.gitignore` by default in Astro projects.

---

## Adapter reference

The Netlify adapter is configured in `astro.config.mjs`:

```js
import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify(),
});
```

This enables:
- Netlify Functions for all SSR routes (`export const prerender = false`)
- Automatic `_redirects` file generation
- Edge-compatible output
