/**
 * src/middleware.ts
 * ─────────────────────────────────────────────────────────────
 * Rank Math "Fallback Behaviour → Redirect to Homepage" equivalent.
 *
 * Any unmatched URL is converted to a 301 redirect to "/" instead of
 * rendering the 404 page. Replicates the WordPress / Rank Math feature
 * commonly used during WP → Astro migrations to preserve link equity
 * for old URLs that haven't been explicitly mapped.
 *
 * ── Why middleware (not _redirects) ──────────────────────────────
 *
 *   public/_redirects is evaluated by Cloudflare Pages BEFORE the
 *   Astro Worker. A wildcard rule there breaks the build because
 *   Wrangler's prerender simulator loops on / before dist/client/
 *   has any static files. Middleware runs inside the Worker, which
 *   already has natural 404 fallthrough handling and is reached
 *   only after Cloudflare's static-file lookup fails.
 *
 *   With @astrojs/cloudflare on output:'static', the Worker still
 *   handles requests that don't match a static asset. Middleware
 *   intercepts the 404 response from app.render() and rewrites it
 *   to a 301 redirect.
 *
 * ── Architecture pattern ─────────────────────────────────────────
 *
 *   Reusable across all HMDG clinic site clones. Documented in
 *   .claude/prompts/fallback-redirect.md.
 *
 *   ⚠️ SEO note: redirecting all 404s to / is a soft-redirect
 *   anti-pattern if used as a substitute for proper specific
 *   redirects. ALWAYS map high-value old URLs individually first
 *   (in astro.config.mjs `redirects:` or public/_redirects) — this
 *   middleware is the catch-all for the long tail only.
 */
import { defineMiddleware } from 'astro:middleware';

/**
 * ── ENVIRONMENT GATE ───────────────────────────────────────────────
 * Fallback fires on Cloudflare deploys (production builds), NOT on
 * localhost (`astro dev`). Detected via Vite/Astro's PROD flag:
 *
 *   `astro dev`        → import.meta.env.PROD === false → fallback OFF
 *   `astro build`      → import.meta.env.PROD === true  → fallback ON
 *   Cloudflare Pages   → import.meta.env.PROD === true  → fallback ON
 *
 * Why automatic instead of a manual toggle: zero risk of forgetting
 * to flip at launch, zero risk of accidentally shipping it disabled.
 * Localhost always shows real 404s so missing routes, broken links,
 * and typos surface during development.
 *
 * Note: `astro preview` (local production preview) ALSO activates the
 * fallback because it's a production build. If you need real 404s
 * locally for QA, use `astro dev` not `astro preview`.
 */
const FALLBACK_REDIRECT_ENABLED = import.meta.env.PROD;

/**
 * Path prefixes that must NEVER fallback-redirect. Genuine 404s on
 * these paths are real bugs — silently rewriting them would mask
 * broken asset references and missing API routes.
 */
const NEVER_FALLBACK_PREFIXES: readonly string[] = [
  '/_astro/',          // Astro build assets (content-hashed)
  '/_image',           // Astro image service
  '/_server-islands/', // Astro server islands
  '/__astro_',         // Astro Cloudflare adapter prerender endpoints
  '/api/',             // SSR API routes
  '/images/',          // Static images
  '/videos/',          // Static videos
  '/fonts/',           // Self-hosted fonts
  '/icons/',           // Static icons
];

/**
 * Specific files that must always 200/404 normally. Crawler files
 * (robots, sitemap) and browser-defaults (favicon, manifest) need
 * to be authoritative — a 301 here would mislead crawlers.
 */
const NEVER_FALLBACK_PATHS: ReadonlySet<string> = new Set([
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap-0.xml',
  '/sitemap-index.xml',
  '/favicon.ico',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/site.webmanifest',
]);

/**
 * Methods safe to redirect. GET/HEAD are idempotent; POST/PUT/etc.
 * carry request bodies that would be lost across a 301.
 */
const SAFE_METHODS: ReadonlySet<string> = new Set(['GET', 'HEAD']);

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Master toggle — disabled during development, enabled at go-live.
  if (!FALLBACK_REDIRECT_ENABLED) return response;

  // Only intervene on 404 responses.
  if (response.status !== 404) return response;

  const { pathname } = context.url;
  const method = context.request.method.toUpperCase();

  // Loop prevention — never redirect / to itself, even hypothetically.
  if (pathname === '/' || pathname === '') return response;

  // Only safe HTTP methods.
  if (!SAFE_METHODS.has(method)) return response;

  // Excluded specific files.
  if (NEVER_FALLBACK_PATHS.has(pathname)) return response;

  // Excluded path prefixes (assets, APIs, internal endpoints).
  for (const prefix of NEVER_FALLBACK_PREFIXES) {
    if (pathname.startsWith(prefix)) return response;
  }

  // Excluded file extensions other than .html — broken hotlinks to
  // missing files (.jpg, .pdf, .css, .js) should 404, not redirect.
  const lastSegment = pathname.split('/').pop() ?? '';
  if (lastSegment.includes('.') && !lastSegment.endsWith('.html')) {
    return response;
  }

  // All checks passed — issue 301 to homepage. Query strings and
  // fragments are intentionally NOT preserved (homepage doesn't know
  // about them) — matches Rank Math's behaviour.
  return new Response(null, {
    status: 301,
    headers: {
      'Location': '/',
      // Short cache so adding a real route invalidates quickly.
      'Cache-Control': 'public, max-age=300',
      // Surface the redirect reason in logs for debugging.
      'X-Redirect-Reason': 'fallback-to-home',
    },
  });
});
