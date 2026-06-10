# Continuation Protocol — SUPERSEDED

> **This file is superseded by `.project-log.md` (project root).**
> Session continuity now follows the Project Log Protocol in CLAUDE.md:
> read `.project-log.md` FIRST every session, update it LAST.
> Do not resume work from this file.

## Corrections to the old contents (kept so stale facts are never reused)

The previous version of this file described the v1.5.0 Netlify-era state. The following facts it contained are now WRONG:

| Old (wrong) | Current |
|---|---|
| Netlify + `@astrojs/netlify` adapter | **Cloudflare Pages + `@astrojs/cloudflare`** |
| API routes are Netlify Functions | API routes are Cloudflare Pages Functions (`prerender = false`) |
| Env vars in Netlify dashboard | Env vars in Cloudflare Pages → Settings → Environment variables (then "Retry deployment") |
| Astro 6.1.3 | Astro 6.1.9+ — check `package.json` |
| Images `.webp` only | `.webp` or `.avif` — both accepted |
| 10-agent pipeline | 12 core agents (includes visual-qa-reviewer + performance-optimisation) + domain specialists (sanity-developer, sanity-reviewer, resent-email) |

Everything still true (three-builder design system, cookie consent architecture, `is:inline` consent script rule) is documented in `.claude/rules/*`, `.claude/skills/*`, and the design-system docs page — not here.
