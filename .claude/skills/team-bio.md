# Team Bio Page (reusable)

Individual `/team/<slug>/` member pages. One reusable component + one data
file render every member's bio in the same premium, no-hero, dark
primary-gradient editorial layout.

## Architecture (3 pieces)

1. **`src/data/team.ts`** — canonical registry (`teamMembers`: slug → name).
   Already the single source of truth for names + categories.
2. **`src/data/teamBios.ts`** — per-member bio content keyed by slug:
   `{ jobTitle, quals?, specialties?, bio[], placeholder? }`. **Single source
   of truth for bio copy.**
3. **`src/components/team/TeamBio.astro`** — renders a complete page from a
   `slug`: resolves name (team.ts), bio (teamBios), photo
   (`/images/team-photos/<slug>.avif`), and meta + BreadcrumbList/WebPage +
   Person JSON-LD (via `buildSpHero`). No hero section.

Each page file is a **thin wrapper**:

```astro
---
import TeamBio from "../../components/team/TeamBio.astro";
---
<TeamBio slug="firstname-lastname" />
```

## Adding a new member

1. Add `{ slug, name }` to `teamMembers` in `src/data/team.ts` (and reference
   the slug in any `teamCategories`).
2. Add a `teamBios[slug]` entry (see policy below).
3. Drop the portrait at `public/images/team-photos/<slug>.avif`.
4. Create `src/pages/team/<slug>.astro` as the 3-line wrapper above.

That's it — name, breadcrumb, schema, and layout all resolve automatically.

## Updating / supplying a bio (the rule)

Edit ONLY `src/data/teamBios.ts`:

- Replace the `bio` array with the real paragraphs (verbatim — do not
  paraphrase, summarise, or pad).
- Add `quals` and/or `specialties` arrays **only if supplied**. They are
  optional; the component shows the qualifications row and the specialty
  chips only when present.
- Remove `placeholder: true` once the bio is real.

### Placeholder policy (mandatory)

- Members without a supplied bio use the shared `LOREM` paragraphs and
  `placeholder: true`, and **omit** `quals` + `specialties`.
- **Never invent** biography text, qualifications, or specialties. Lorem is
  an obvious placeholder; fabricated credentials are not — they would be
  misleading for a healthcare clinic. Leave fields omitted until the client
  supplies the real content.
- On a new client clone: every member starts as lorem; swap in real bios as
  they arrive.

## Content rules

- `jobTitle` (the eyebrow) is the member's role — keep it factual; mirror the
  role used in `teamCategories` where possible.
- Specialty chips are auto-capitalised in CSS (`text-transform: capitalize`)
  for a consistent badge look — store the source casing as given, don't
  pre-capitalise in data.
- Headings: the member name is the page's single `<h1>`. No other headings,
  no added CTAs/stats/summaries.

## Design (baked into TeamBio.astro — don't re-implement per page)

- No hero. Dark primary-gradient section reusing the Contact-hero treatment
  (`linear-gradient(168deg, headline → primary)` + primary-hover radial glow).
- Editorial split: tall 3:4 top-anchored portrait (soft radius, hairline
  border, deep shadow) | bio column. Stacks on ≤880px.
- White text on the gradient (≈9–11:1, WCAG 2.1 AA+). Lavender eyebrow
  (`--color-primary-light`, ≈5.3:1). Glass specialty chips.
- Breadcrumb above the content, white-readable, active item white/semibold.
- `prefers-reduced-motion` respected; portrait is the LCP image
  (`loading="eager"` + `fetchpriority="high"`, preloaded via BaseLayout).

## Category pages are NOT bios

`/team/physiotherapists/`, `/podiatrists/`, `/pelvic-health/`,
`/massage-therapists/`, `/personal-trainer/`, `/dietitian/`,
`/class-teachers/` are discipline listing pages (TeamPageShell), not
individuals — leave them alone.
