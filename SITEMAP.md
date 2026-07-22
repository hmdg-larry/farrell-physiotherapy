# Sitemap — Farrell Physiotherapy

**Status:** IA approved 2026-07-06. Source of truth for `ux-architect`, `ui-designer`,
`frontend-builder`, and `seo-reviewer` until pages are built and this can be superseded
by the live `src/data/navigation.ts` + auto-generated sitemap.

This is a **migration** from an existing live site. Existing URLs are preserved
wherever possible; only genuinely broken/inconsistent URLs change (see Redirect Map).
Do not add pages or change URLs from this document without re-running IA review.

---

## About
- About — `/about/`
- Team — `/about/our-team/`
- Prices — `/prices/`
  - Chelmsford — `/prices/chelmsford/`
  - Witham — `/prices/witham/`
  - Leigh-on-Sea — `/prices/leigh-on-sea/`
- FAQs — `/faqs/`
- Join Our Team — `/join-our-team/`

## Services

**Therapies:**
- Physiotherapy — `/service/physiotherapy-services/`
- Sports Massage — `/service/sports-massage-chelmsford-and-witham/`
- Pilates — `/service/pilates/`
- Corporate Health — `/service/corporate-health/`
- Virtual Clinic — `/service/virtual-clinic/`

**Additional Treatments:**
- Ergonomic Assessments — `/service/ergonomic-work-based-assessments/` *(changed — fixed typo)*
- Gait Analysis — `/service/gait-analysis/`
- Joint Manipulation — `/service/joint-manipulation/`
- Joint Mobilisations — `/service/joint-mobilisations/`
- Manual Traction — `/service/manual-traction/`
- Muscle Energy Techniques — `/service/muscle-energy-techniques/`
- Soft Tissue Manipulation — `/service/soft-tissue-manipulation/`
- Taping — `/service/taping-postural-and-sports/`
- TENS — `/service/transcutaneous-electrical-nerve-stimulation-tens/`
- Trigger Points — `/service/trigger-points/`

## What We Treat (condition taxonomy — consistently under `/condition/`)

**Buttock & Leg Pain** — `/condition/buttock-and-leg-pain/`
- Gluteal Strain — `/condition/buttock-and-leg-pain/gluteal-strain/`
- Hamstring Strain / Tear — `/condition/buttock-and-leg-pain/hamstring-strain-tear/`
- Piriformis Syndrome — `/condition/buttock-and-leg-pain/piriformis-syndrome/`

**Elbow** — `/condition/elbow/`
- Golfers Elbow — `/condition/elbow/golfers-elbow/`
- Tennis Elbow — `/condition/elbow/tennis-elbow/`

**Foot** — `/condition/foot/`
- Flat Feet — `/condition/foot/flat-feet/`
- Metatarsal Fractures — `/condition/foot/metatarsal-fractures/`
- Plantar Fasciitis — `/condition/foot/plantar-fasciitis/`

**Hand** — `/condition/hand/`
- Dupuytren's Contracture — `/condition/hand/dupuytrens-contracture/`
- Fractured Finger — `/condition/hand/fractured-finger/`
- Trigger Finger — `/condition/hand/trigger-finger/`
- Thumb & Fingers — `/condition/hand/wear-and-tear-thumb-and-fingers/`

**Hip & Thigh** — `/condition/hip-and-thigh/`
- Abductor Strain / Tear — `/condition/hip-and-thigh/abductor-strain-tear/` *(changed — slug corrected from "adductor" to match the confirmed condition name)*
- Hip Fractures — `/condition/hip-and-thigh/fractures/`
- Hamstring / Quadriceps Tear — `/condition/hip-and-thigh/hamstring-tear-quadriceps-tear/`
- Hip Replacements — `/condition/hip-and-thigh/hip-replacements/`
- Osteoarthritis — `/condition/hip-and-thigh/osteoarthritis/`
- Trochanteric Bursitis — `/condition/hip-and-thigh/trochanteric-bursitis/`

**Knee** — `/condition/knee-ligament-problems/`
- ACL Injuries — `/condition/knee-ligament-problems/acl-injuries/`
- Anterior Knee Pain — `/condition/knee-ligament-problems/anterior-knee-pain/`
- Cartilage Problems — `/condition/knee-ligament-problems/cartilage-problems/`
- ITB Syndrome — `/condition/knee-ligament-problems/itb-syndrome/`
- Knee Replacements — `/condition/knee-ligament-problems/knee-replacements/`
- LCL & MCL Injuries — `/condition/knee-ligament-problems/lcl-and-mcl-injuries/`
- Patella Maltracking — `/condition/knee-ligament-problems/patella-maltracking/`
- PCL Injuries — `/condition/knee-ligament-problems/pcl-injuries/`
- Pre & Post Surgical — `/condition/knee-ligament-problems/pre-and-post-surgical-pain/`

**Ankle** — `/condition/ankle/` *(changed — was root-level `/ankle/`, broke the `/condition/` namespace)*
- Achilles Tendonitis — `/condition/ankle/achilles-tendonitis/` *(changed — also fixes "Achillies" spelling)*
- Ankle Fractures — `/condition/ankle/fractures/` *(changed)*
- Peroneal Tendonitis — `/condition/ankle/peroneal-tendonitis/` *(changed)*
- Sprained Ankle — `/condition/ankle/sprained-ankle/` *(changed)*

**Lower Leg & Calf** — `/condition/lower-leg-calf-pain/`
- Calf Tear — `/condition/lower-leg-calf-pain/calf-tear/`
- Shin Splints — `/condition/lower-leg-calf-pain/shin-splints/`
- Compartment Syndrome — `/condition/lower-leg-calf-pain/compartment-syndrome/`

**Lower Back & Pelvis** — `/condition/lumbar-spine-lower-back-and-pelvis/`
- Acute Low Back Pain — `/condition/lumbar-spine-lower-back-and-pelvis/acute-low-back-pain/` *(changed — was root-level)*
- Bulging / Slipped Disc — `/condition/lumbar-spine-lower-back-and-pelvis/bulging-disc-slipped-disc/` *(changed)*
- Chronic Low Back Pain — `/condition/lumbar-spine-lower-back-and-pelvis/chronic-low-back-pain/` *(changed)*
- Facet Joint Dysfunction — `/condition/thoracic-spine/facet-joint-dysfunction/` *(shared page, canonical lives under Thoracic Spine — cross-linked here, no separate URL)*
- Sacroiliac Joint Pain — `/condition/lumbar-spine-lower-back-and-pelvis/sacroiliac-joint-pain/` *(changed)*
- Spondylolisthesis — `/condition/lumbar-spine-lower-back-and-pelvis/spondylolisthesis/` *(changed)*
- Trapped Nerve — `/condition/neck-trapped-nerve-pain/` *(changed — shared page, cross-linked from two categories)*

**Neck & Head** — `/condition/neck-and-head/`
- Bulging Discs — `/condition/neck-and-head/bulging-discs/` *(changed — was root-level; distinct page from the lumbar bulging disc page above, disambiguated by nesting)*
- Cervical Postural — `/condition/neck-and-head/cervical-postural-dysfunction/` *(changed)*
- Headaches — `/condition/neck-and-head/headaches/` *(changed)*
- Spondylosis — `/condition/neck-and-head/spondylosis/` *(changed)*
- Torticollis — `/condition/neck-and-head/torticollis/` *(changed)*
- Trapped Nerve — `/condition/neck-trapped-nerve-pain/` *(same canonical page as above, cross-linked)*
- Whiplash — `/condition/neck-and-head/whiplash/` *(changed)*

**Shoulder** — `/condition/shoulder/`
- ACJ Pain — `/condition/shoulder/acromioclavicular-acj-pain/` *(changed)*
- Fractured Clavicle — `/condition/shoulder/fractured-clavicle-collar-bone/` *(changed)*
- Frozen Shoulder — `/condition/shoulder/frozen-shoulder/` *(changed)*
- Impingement — `/condition/shoulder/impingement/` *(changed)*
- Instability & Weakness — `/condition/shoulder/shoulder-instability-weakness/` *(changed)*

**Thoracic Spine** — `/condition/thoracic-spine/`
- CVJ Dysfunction — `/condition/thoracic-spine/cvj-dysfunction/`
- Facet Joint Dysfunction — `/condition/thoracic-spine/facet-joint-dysfunction/` *(canonical — also cross-linked under Lower Back & Pelvis)*
- Joint Stiffness — `/condition/thoracic-spine/joint-stiffness/`
- Rib Fractures — `/condition/thoracic-spine/rib-fractures/`
- Spinal Fractures — `/condition/thoracic-spine/spinal-fractures/` *(changed — was root-level)*
- Scoliosis — `/condition/thoracic-spine/scoliosis/` *(changed)*

**Wrist** — `/condition/wrist/`
- Carpal Tunnel Syndrome — `/condition/wrist/carpal-tunnel-syndrome/` *(changed)*
- De Quervain's Tenosynovitis — `/condition/wrist/de-quervains-tenosynovitis/` *(changed)*
- Colles Fractures — `/condition/wrist/colles-fractures/` *(changed — also fixes reversed word order from `fractures-colles`)*
- Osteoarthritis — `/condition/wrist/osteoarthritis/` *(changed — disambiguates from `/condition/hip-and-thigh/osteoarthritis/`)*

## What To Expect
- `/appointments/`

## Our Clinics
- Chelmsford Clinic — `/clinics/chelmsford/` *(changed — unified with the `/prices/` location pattern)*
- Witham Clinic — `/clinics/witham/` *(changed)*
- Leigh-on-Sea Clinic — `/clinics/leigh-on-sea/` *(changed)*

## Contact
- `/contact/`

## Book Now (per location)
- Chelmsford — **TBD**, real booking URL needed before build
- Witham — **TBD**
- Leigh-on-Sea — **TBD**

---

## Redirect Map (`public/_redirects` — apply at cutover, not before the new pages exist)

```
/ankle/ /condition/ankle/ 301
/ankle/achillies-tendonitis/ /condition/ankle/achilles-tendonitis/ 301
/ankle/fractures/ /condition/ankle/fractures/ 301
/ankle/peroneal-tendonitis/ /condition/ankle/peroneal-tendonitis/ 301
/ankle/sprained-ankle/ /condition/ankle/sprained-ankle/ 301
/acute-low-back-pain/ /condition/lumbar-spine-lower-back-and-pelvis/acute-low-back-pain/ 301
/bulging-disc-slipped-disc/ /condition/lumbar-spine-lower-back-and-pelvis/bulging-disc-slipped-disc/ 301
/chronic-low-back-pain/ /condition/lumbar-spine-lower-back-and-pelvis/chronic-low-back-pain/ 301
/sacroiliac-joint-pain/ /condition/lumbar-spine-lower-back-and-pelvis/sacroiliac-joint-pain/ 301
/spondylolisthesis/ /condition/lumbar-spine-lower-back-and-pelvis/spondylolisthesis/ 301
/trapped-nerve-nerve-pain/ /condition/neck-trapped-nerve-pain/ 301
/condition/trapped-nerve-nerve-pain/ /condition/neck-trapped-nerve-pain/ 301
/bulging-discs/ /condition/neck-and-head/bulging-discs/ 301
/cervical-postural-dysfunction/ /condition/neck-and-head/cervical-postural-dysfunction/ 301
/headaches/ /condition/neck-and-head/headaches/ 301
/spondylosis/ /condition/neck-and-head/spondylosis/ 301
/torticollis/ /condition/neck-and-head/torticollis/ 301
/whiplash/ /condition/neck-and-head/whiplash/ 301
/acromioclavicular-acj-pain/ /condition/shoulder/acromioclavicular-acj-pain/ 301
/fractured-clavicle-collar-bone/ /condition/shoulder/fractured-clavicle-collar-bone/ 301
/frozen-shoulder/ /condition/shoulder/frozen-shoulder/ 301
/impingement/ /condition/shoulder/impingement/ 301
/shoulder-instability-weakness/ /condition/shoulder/shoulder-instability-weakness/ 301
/spinal-fractures/ /condition/thoracic-spine/spinal-fractures/ 301
/scoliosis/ /condition/thoracic-spine/scoliosis/ 301
/carpal-tunnel-syndrome/ /condition/wrist/carpal-tunnel-syndrome/ 301
/de-quervains-tenosynovitis/ /condition/wrist/de-quervains-tenosynovitis/ 301
/fractures-colles/ /condition/wrist/colles-fractures/ 301
/osteoarthritis/ /condition/wrist/osteoarthritis/ 301
/condition/hip-and-thigh/adductor-straintear/ /condition/hip-and-thigh/abductor-strain-tear/ 301
/service/sports-massage/ /service/sports-massage-chelmsford-and-witham/ 301
/our-services/sports-massage-chelmsford-and-witham/ /service/sports-massage-chelmsford-and-witham/ 301
/service/ergonomicwork-based-assessments-desk/ /service/ergonomic-work-based-assessments/ 301
/chelmsford-physio/ /clinics/chelmsford/ 301
/physio-in-witham/ /clinics/witham/ 301
/physiotherapy-in-leigh-on-sea/ /clinics/leigh-on-sea/ 301
```

36 redirects total. All other existing URLs are preserved exactly as-is.

---

## Build Phasing (recommended — ~105 pages total, do not attempt in one pass)

1. **Wave 1 — Core:** homepage, `/about/`, `/about/our-team/`, `/contact/`, `/faqs/`, `/join-our-team/`, 3× clinic pages, `/prices/` + 3 location variants
2. **Wave 2 — Services:** 5 Therapies + 10 Additional Treatments (shared service-page template)
3. **Wave 3 — Conditions:** shared condition-page template, rolled out region by region
4. **Wave 4 — Book Now:** once real per-location booking URLs are confirmed

## Resolved Open Items

1. **Abductor vs adductor** — confirmed "Abductor Strain / Tear"; slug corrected to `abductor-strain-tear`
2. **Facet Joint Dysfunction** — confirmed one shared page, canonical under Thoracic Spine, cross-linked from Lower Back & Pelvis nav
