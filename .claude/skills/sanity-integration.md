# Sanity Integration (build-time consumer)

How this site uses Sanity, and how to extend it. Owned by `sanity-developer`;
any change here or to the files below must be reviewed by `sanity-reviewer`
(per the Agent Collaboration Rules in `CLAUDE.md`).

## Architecture (and why it's PageSpeed-safe)

This site is a **build-time consumer** of an existing, separately-managed Sanity
project. The Studio (editing UI) is **NOT** embedded here.

- All content is fetched during `astro build` (static SSG) and baked into HTML.
- `@sanity/client` and `@sanity/image-url` run **only at build time** — they are
  never bundled into client JS.
- Visitors make **zero** Sanity network requests and download **zero** Sanity JS.
- Therefore Core Web Vitals / PageSpeed are **unaffected** — the browser only
  ever sees pre-rendered HTML (same as the existing `src/data/*.ts` content).

Do not add Visual Editing / stega / overlays to public pages — those ship client
JS and would break this guarantee. If preview is ever needed, gate it behind a
dev-only/draft route, never the public build.

## Files

| File | Purpose |
|---|---|
| `src/lib/sanity/client.ts` | Env-driven client + `isSanityConfigured()` guard. Throws only if used while unconfigured. |
| `src/lib/sanity/image.ts` | `urlForImage()` — build-time Sanity Image CDN URLs (width/height/format/quality). |
| `src/lib/sanity/queries.ts` | Centralised GROQ (narrow projections only). |
| `src/lib/sanity/types.ts` | Hand-written content types (replace via TypeGen — see below). |
| `src/lib/sanity/index.ts` | Public surface + `getAllPosts()` / `getPostBySlug()` helpers. |
| `scripts/sanity-smoke-test.mjs` | `npm run sanity:check` — verifies the connection, no route/bundle impact. |

## Environment variables (server-side only — no `PUBLIC_` prefix)

```
SANITY_PROJECT_ID=        # enables Sanity; blank = disabled (build still works)
SANITY_DATASET=production
SANITY_API_VERSION=2026-03-01
SANITY_API_READ_TOKEN=    # only for PRIVATE datasets or draft/preview reads
```

On Cloudflare Pages these go in the **BUILD** scope (baked at build, not runtime).
`SANITY_API_READ_TOKEN` is a **secret** — store it as a secret, never commit it.

### Do you need a read token?

- **Public dataset + published content → NO token needed** (faster, uses the CDN).
  `npm run sanity:check` succeeding with a blank token confirms the dataset is public.
- **Token required** only if the dataset is private, or you need drafts/preview.

Create one at **manage.sanity.io → your project → API → Tokens → Add API token**
(permission: **Viewer** for read-only), or in the Studio repo:
`npx sanity tokens add`. The value is shown once — copy it immediately.

## Usage (in any .astro page, build-time)

```astro
---
import { getAllPosts, urlForImage } from '../lib/sanity';
const posts = await getAllPosts(); // [] until SANITY_PROJECT_ID is set
---
{posts.map((p) => (
  <article>
    {p.mainImage && (
      <img
        src={urlForImage(p.mainImage).width(1200).height(675).format('webp').fit('crop').url()}
        alt={p.mainImage.alt ?? p.title}
        width="1200" height="675" loading="lazy" decoding="async"
      />
    )}
    <h2>{p.title}</h2>
  </article>
))}
```

`getAllPosts()` / `getPostBySlug()` return safe empty defaults until Sanity is
configured, so pages can be wired up now and "go live" the moment the project ID
is present — the build never breaks.

## Adding a real content type

1. Define/confirm the schema in **your Studio repo** (not here).
2. Add a narrow GROQ projection to `queries.ts`.
3. Add the matching result type to `types.ts` (or generate it — see TypeGen).
4. Add a fetch helper to `index.ts` (mirror `getAllPosts`).
5. Use it in a page with `getStaticPaths()` for detail routes.
6. Run `npm run build` + `npm run sanity:check`; hand off to `sanity-reviewer`.

## Type safety (TypeGen)

TypeGen reads the schema, which lives with the **Studio**, so run it there:
`sanity schema extract` → `sanity typegen generate`, then copy the generated
`sanity.types.ts` into `src/lib/sanity/` and replace the hand-written types.
Wrap queries in `defineQuery(...)` (from `groq`) for typed results.
Doc: https://www.sanity.io/docs/apis-and-sdks/sanity-typegen

## Verify

```
npm run sanity:check   # connection + document count + types
npm run build          # must stay clean
```

## Docs referenced

- JS client: https://www.sanity.io/docs/apis-and-sdks/js-client-getting-started
- Image URLs: https://www.sanity.io/docs/apis-and-sdks/image-urls
- GROQ: https://www.sanity.io/docs/specifications/groq-syntax
- Astro integration (if Studio embedding is ever wanted): https://www.sanity.io/docs/astro
