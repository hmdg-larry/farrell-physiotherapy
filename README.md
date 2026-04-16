# Astro Base Template — Cloudflare

Premium UK clinic site template — static-first, built for speed, deployed on Cloudflare Pages.

---

## Project Overview

A production-ready Astro base template used as the starting point for HMDG client websites. Static-first rendering, zero unnecessary JavaScript, Tailwind v4 for styling, and Cloudflare Pages for hosting.

Every clone of this template should deploy cleanly to Cloudflare Pages via GitHub with minimal configuration.

---

## Tech Stack

- **Astro 6** — static-first, zero-JS by default
- **Tailwind CSS v4** — via `@tailwindcss/vite`
- **TypeScript 5** — strict
- **JavaScript** — where TS is unnecessary
- **Swiper.js** — carousels, imported per-module
- **Cloudflare adapter** — `@astrojs/cloudflare` for deployment
- **Node.js** — `>= 22.12.0`

---

## Requirements

- Node.js `22.12.0` or higher
- npm (ships with Node)
- Git
- A GitHub account
- A Cloudflare account connected to GitHub

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/<org>/<repo>.git
cd <repo>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables (if the project uses them)

```bash
cp .env.example .env
# then edit .env with the real values
```

### 4. Start the development server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

### Available scripts

| Command           | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start local dev server with HMR                      |
| `npm run build`   | Build the site for production                        |
| `npm run preview` | Preview the production build locally                 |
| `npm run astro`   | Run the Astro CLI (e.g. `astro add`, `astro check`)  |

---

## Production Build

Run a production build locally before pushing major changes:

```bash
npm run build
```

Output is generated into the `/dist` directory.

Preview the production build with:

```bash
npm run preview
```

This mirrors what Cloudflare Pages will serve — use it to catch build-time issues before deploying.

---

## GitHub Workflow

### First-time setup

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<org>/<repo>.git
git push -u origin main
```

### Day-to-day workflow

```bash
git checkout -b feature/<short-description>
# ...make changes...
git add .
git commit -m "Clear, descriptive message"
git push origin feature/<short-description>
```

Open a pull request into `main`. Once merged, Cloudflare Pages will automatically deploy the updated `main` branch to production.

### Branch strategy

| Branch      | Purpose                                                         |
| ----------- | --------------------------------------------------------------- |
| `main`      | Production — auto-deploys to the live site                      |
| `feature/*` | Feature branches — auto-deploys as Cloudflare Pages previews    |

---

## Cloudflare Pages Deployment

### First-time setup

1. Log into [Cloudflare](https://dash.cloudflare.com) and go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Select your GitHub account and repository.
3. Configure build settings (Cloudflare usually auto-detects Astro):

   | Setting           | Value           |
   | ----------------- | --------------- |
   | Build command     | `npm run build` |
   | Build output directory | `dist`     |
   | Node version      | `22`            |

4. Add environment variables under **Settings → Environment variables** (only if required — see `.env.example`).
5. Click **Save and Deploy**. The first deploy will build from `main` and publish to a Cloudflare-provided URL (e.g. `xyz.pages.dev`).
6. (Optional) Add a custom domain under **Custom domains** and follow the DNS steps.

The project already includes the Cloudflare adapter (`@astrojs/cloudflare`), so server endpoints and API routes work out of the box as Cloudflare Pages Functions. Security headers are applied automatically via `public/_headers`.

---

## Ongoing Deployment Workflow

After the initial setup, all deployments are automatic.

```bash
# 1. Pull the latest main
git checkout main
git pull origin main

# 2. Create a branch, make changes, commit, and push
git checkout -b fix/<short-description>
git add .
git commit -m "Fix: <what changed and why>"
git push origin fix/<short-description>
```

3. Open a pull request. Cloudflare Pages will build a **deploy preview** and attach the URL to the PR.
4. Review the preview. When merged into `main`, Cloudflare builds and deploys to production automatically.

### Rollback

Use **Cloudflare Dashboard → Pages → Deployments** and click **Rollback** on any previous successful build to instantly roll back.

---

## Notes

- **Environment variables** — Never commit `.env`. Use `.env.example` to document required variables. Set real values in the Cloudflare Pages dashboard under **Settings → Environment variables**. Variables prefixed with `PUBLIC_` are exposed to client-side code — keep secrets server-side only.
- **Branch-based deploys** — `main` is production. Every other branch with an open PR gets a unique Cloudflare preview URL for review and QA.
- **Automatic deploys** — Every push to a connected branch triggers a Cloudflare build. No manual deploy step is needed.
- **Node version** — Pin Node 22 in Cloudflare Pages either via a `NODE_VERSION=22` env var or a `.nvmrc` file at the project root to match local dev.
- **Performance** — The template targets 90+ PageSpeed (mobile), LCP < 2.5s, CLS < 0.1, INP < 200ms. Do not regress these with heavy third-party scripts or unnecessary hydration.
- **Local secrets** — For local Wrangler dev (`wrangler pages dev dist`), put secrets in `.dev.vars` (never commit this file — it is in `.gitignore`).

### Project structure

```
/src/
  components/   Reusable Astro components (Header, Footer, etc.)
  layouts/      BaseLayout — wraps every page
  pages/        Routes and API endpoints
  styles/       Global CSS, Tailwind v4 tokens
  config/       Project config (e.g. cookie consent)
/public/        Static assets served as-is (incl. _headers)
```

---

Designed & Developed by [HMDG](https://hmdg.co.uk).
