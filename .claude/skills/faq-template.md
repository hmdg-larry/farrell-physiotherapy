# Skill: FAQ Accordion (`faq-template`)

Reusable, premium FAQ section for any HMDG clinic page — a full-width stack of luxury cards with an accessible, animated accordion, **plus auto-generated FAQPage JSON-LD from the same data**.

**Live reference implementation:** `src/pages/faqs.astro` (the `/faqs/` page is the first example).

**Files:**
| File | Role |
|---|---|
| `src/components/FaqAccordion.astro` | Renders the accordion from a `faqs` prop (markup + per-instance JS + premium card styles). |
| `src/lib/faqSchema.ts` | `Faq` type + `buildFaqSchema(faqs)` → the FAQPage JSON-LD node. |
| the page (e.g. `src/pages/faqs.astro`) | Defines the `faqs` array once; passes it to `<FaqAccordion>` **and** `buildFaqSchema()`. |

---

## ⚠️ THE RULE — single source of truth (auto-updating schema)

**The `faqs` array is the ONE source of truth. Never hand-write FAQPage JSON-LD.**

The visible accordion **and** the FAQPage structured data are both generated from the same `faqs: Faq[]` array:
- `<FaqAccordion faqs={faqs} />` renders the visible Q&As.
- `buildFaqSchema(faqs)` produces the FAQPage JSON-LD passed to `BaseLayout`.

So when you **add, edit, or remove a question or answer, you change ONLY the `faqs` array** — the JSON-LD updates automatically and can never drift from what users see.

**Why this is mandatory (not just convenient):** Google requires FAQPage structured data to match the visible answer text exactly; mismatched markup is ignored or flagged as a manual action. Coupling both to one array makes mismatch impossible.

### Assigned to: `seo-reviewer`

Any change to FAQ content (or adding a new FAQ section) is **assigned to the `seo-reviewer` agent**, which must verify:
- [ ] The FAQPage JSON-LD is built via `buildFaqSchema(faqs)` — **not** hand-written, and not a separate copy.
- [ ] Every visible Q&A appears in the schema and the **answer text matches verbatim** (no truncation, no HTML left in the `text`).
- [ ] The JSON-LD is valid (passes Google Rich Results + Schema.org validators, zero errors).
- [ ] Exactly one FAQPage per page; questions are real, non-duplicate, genuinely answered on-page.
- [ ] Existing `noindex` is unchanged.

If a contributor hand-writes or duplicates the FAQ JSON-LD, `seo-reviewer` rejects it and routes back to `frontend-builder` to wire it through `buildFaqSchema(faqs)`.

---

## When to use

- A `/faqs/` page, or an FAQ block on a service / condition / booking / pricing page.
- Any "common questions" / "good to know" accordion.
- "Add an FAQ section" / "make the FAQ reusable".

---

## Usage — drop it onto a page

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import FaqAccordion from "../components/FaqAccordion.astro";
import { buildFaqSchema, type Faq } from "../lib/faqSchema";

// ONE source of truth — drives the accordion AND the JSON-LD.
const faqs: Faq[] = [
  { q: "Do I need a referral?", a: "No — we're a private clinic, so you can self-refer for any service." },
  { q: "How do I pay?",         a: "Online when you book, or by card at reception. We no longer take cash." },
];
---
<BaseLayout title="FAQs | ICPC Health" description="…" schema={buildFaqSchema(faqs)}>
  <FaqAccordion faqs={faqs} eyebrow="Common Questions" title="Good to Know Before You Visit">
    Still have a question? <a href="/contact/">Get in touch</a> and our team will be happy to help.
  </FaqAccordion>
</BaseLayout>
```

- Combine with other structured data by passing an **array**: `schema={[breadcrumbSchema, webPageSchema, buildFaqSchema(faqs)]}` (as `/faqs/` does — it appends to the SpHero Breadcrumb+WebPage).
- The default slot is an optional supporting intro (may contain links). Omit it for no intro.
- **`idPrefix`** prop (default `"faq"`): pass a unique value if you place **more than one** accordion on a single page, so the `aria-controls`/`id` pairs stay unique.

### Props

| Prop | Required | Notes |
|---|---|---|
| `faqs` | yes | `{ q: string; a: string }[]`. `a` is **plain text** (no HTML — it must match the schema). |
| `eyebrow` | no | `.idx` eyebrow label (default "Common Questions"). |
| `title` | no | Section `<h2>` (default "Frequently Asked Questions"). |
| `idPrefix` | no | Unique prefix for `aria` ids when >1 accordion per page (default "faq"). |
| default slot | no | Supporting intro paragraph (rich content / links allowed). |

---

## Design

Full-width inside `container-main` (1340px) — a stack of rounded cards on a muted section so the white cards pop, matching the site card system:
- `border-radius: 16px`, `--shadow-card`, refined `--color-border`.
- **Hover:** primary-tinted border + `--shadow-raised`. **Open:** stronger border + raised shadow + the `+`→`−` icon fills purple and rotates.
- Generous padding (`clamp(22→36px)`), large Geist question type (`clamp(18→23px)`); questions and answers both fill the full card width.

## Animation (CSS-only)

Smooth real-height expand via `grid-template-rows: 0fr → 1fr` (works in every modern browser, content always in the DOM). No layout library. The icon transition + height transition are disabled under `prefers-reduced-motion`.

## Accessibility (WCAG 2.1 AA)

- Each question is a real `<button aria-expanded aria-controls>` inside an `<h3>`; the answer is `role="region"` `aria-labelledby` its question.
- Keyboard-operable; **inset** focus ring (the card's `overflow:hidden` would clip an outward one).
- Collapsed answers are hidden from the a11y tree + tab order via timed `visibility` (revealed on open, hidden only after the close animation).
- Exclusive accordion (one open at a time), scoped per `.faq-accordion` root so multiple instances are independent.
- Heading order: page `h1` → section `h2` (title) → question `h3`. Don't place the accordion where it would skip a level.

## Performance

Tiny vanilla JS (~15 lines, no library); CSS-only animation; no images; no render-blocking. Zero CLS (collapsed rows have no reserved-then-shifted height — they animate from 0 on user interaction, which is excluded from CLS).

---

## Cloning checklist (per page / per clone)

1. Import `FaqAccordion` + `buildFaqSchema`.
2. Define the page's `faqs: Faq[]` (the only thing you edit for content).
3. Render `<FaqAccordion faqs={faqs} eyebrow=… title=… />` and pass `buildFaqSchema(faqs)` into `BaseLayout`'s `schema`.
4. If >1 accordion on the page, give each a unique `idPrefix`.
5. **Hand off to `seo-reviewer`** to validate the schema (see THE RULE above).

## QA checklist

- [ ] `npm run build` clean; page returns 200.
- [ ] One H1 on the page; accordion title is `h2`; questions are `h3`.
- [ ] Each question toggles; only one open at a time; smooth height animation.
- [ ] Keyboard: Tab to a question, Enter/Space toggles, visible focus ring.
- [ ] `prefers-reduced-motion`: transitions disabled.
- [ ] FAQPage JSON-LD present, built via `buildFaqSchema(faqs)`, **text matches** the visible answers, valid (Rich Results + Schema.org).
- [ ] Mobile / tablet / desktop: cards full-width inside the 1340 container, no overflow.
