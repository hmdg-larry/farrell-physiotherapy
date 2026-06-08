# Sanity Image Format Policy (AVIF / WebP only + Convert button)

Every image field in the Sanity Studio accepts **only `.avif` or `.webp`** uploads
and shows a clickable **"Convert image here ↗"** button in its description, pointing
editors at the in-house converter first. This keeps every asset aligned with the
Astro frontend's modern-image pipeline (images are served straight from Sanity's CDN
via `urlForImage`, so source format matters).

> Converter URL: **https://hmdg-elementor.flywheelsites.com/**

## Files (Studio)
- `schemaTypes/imageFormat.ts` — the shared policy: `imageFormatOptions` (accept
  filter), `imageFormatRule` (hard validation), and re-exports `convertImageDescription`
  + `IMAGE_CONVERT_URL`.
- `schemaTypes/components/ConvertImageNote.tsx` — the field-description React node
  with the **Convert image here** button (JSX requires a `.tsx` file). Button uses the
  brand purple `#443082` (no blue).

## How it's enforced — three layers
1. **Upload dialog filter (soft):** `options.accept: 'image/avif,image/webp'` — the OS
   file picker only offers AVIF/WebP.
2. **Hard validation (blocks publish):** `validation: (rule) => rule.custom(imageFormatRule)`.
   This also catches drag-and-drop / media-library picks that bypass `accept`.
3. **Editor guidance:** `description: convertImageDescription()` renders the note + the
   clickable Convert button (see screenshot in the brief).

## ⚠️ The AVIF-as-HEIF gotcha (important)
Sanity stores **AVIF** with `extension: "heif"` / `mimeType: "image/heif"`, because AVIF
uses the HEIF/ISOBMFF container. So you **cannot** decide the format from the asset
`_ref` or mime alone (a real iPhone HEIC is also "heif"). `imageFormatRule` therefore
resolves the asset and accepts it only if **`mimeType === 'image/webp'`** or the
**`originalFilename` ends in `.avif`/`.webp`** — which correctly passes genuine AVIF
uploads while rejecting HEIC/PNG/JPG. (This rule is **async** — it does one asset lookup.)

```ts
// schemaTypes/imageFormat.ts (essence)
export async function imageFormatRule(value, context) {
  const ref = value?.asset?._ref;
  if (!ref) return true; // empty handled by field-level required()
  const client = context.getClient({apiVersion: '2025-02-19'});
  const asset = await client.fetch('*[_id == $id][0]{mimeType, originalFilename}', {id: ref});
  const name = (asset?.originalFilename || '').toLowerCase();
  if (asset?.mimeType === 'image/webp' || /\.(avif|webp)$/.test(name)) return true;
  return `Only .avif or .webp images are allowed. Convert your image first at ${IMAGE_CONVERT_URL}`;
}
```

## Apply to any image field
```ts
import {convertImageDescription, imageFormatOptions, imageFormatRule} from './imageFormat'

defineField({
  name: 'image',
  type: 'image',
  description: convertImageDescription(),            // note + Convert button
  options: {hotspot: true, ...imageFormatOptions},   // accept filter
  fields: [defineField({name: 'alt', type: 'string', title: 'Alternative text'})],
  validation: (rule) => rule.custom(imageFormatRule),// hard block non-avif/webp
})
```
For fields that already have copy (e.g. OG images), pass it as a prefix:
`description: convertImageDescription('Recommended 1200×630.')`.

Currently applied to: `teamMember.image`, `blog.mainImage`, `service.image`,
`condition.image`, `seo.ogImage`, `seoSettings.defaultOgImage`, and the inline image
in `blockContent`.

## Notes
- **Editor experience:** a non-AVIF/WebP image can be temporarily attached but shows a
  red error and **cannot be published**. Since Astro reads only published content, bad
  formats never reach the live site.
- **Studio-only:** like all Sanity validation, this enforces in the Studio UI; raw API
  writes aren't blocked (expected).
- **Changing the policy/URL:** edit `imageFormat.ts` (`imageFormatOptions`, the rule) and
  `ConvertImageNote.tsx` (`IMAGE_CONVERT_URL`). Re-run `npx sanity schema extract` to verify.

## QA checklist
- [ ] `npx sanity schema extract` succeeds after any change.
- [ ] Every image field shows the note + a working **Convert image here ↗** button (new tab).
- [ ] Uploading a real `.avif` (Sanity stores it as "heif") is **accepted**.
- [ ] Uploading `.png` / `.jpg` / `.heic` is **rejected** with the convert message; publish blocked.
- [ ] File picker only lists AVIF/WebP.
