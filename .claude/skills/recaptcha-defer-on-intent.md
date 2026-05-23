---
description: Defer Google reCAPTCHA v3 loading until first form intent (focusin / pointerdown / submit) so it stops dragging first-visit LCP and TBT on pages that embed a form. Reusable pattern for every Astro + Web3Forms form page across the HMDG template lineage.
---

# reCAPTCHA Defer-on-Intent — Form Performance Pattern

Permanent fix for the classic "this page is slow on first visit, fast on second visit" symptom on form pages. Replaces the unconditional `<script src="https://www.google.com/recaptcha/api.js">` tag with a JS-injected loader that fires only when the user actually engages with the form.

---

## When to use

Trigger this skill when the user says:

- "The contact page is slow on first visit but fast after"
- "Booking page takes too long to load on Cloudflare"
- "First load on the form page feels heavy"
- "PageSpeed flags reCAPTCHA on the contact/booking page"
- "Lighthouse mobile score on the form page is below 90"
- "Reduce TBT / LCP on a page that uses reCAPTCHA v3 with Web3Forms"

Apply this pattern to **every** new form page that uses Google reCAPTCHA v3 — contact forms, booking forms, lead-gen landing pages, enquiry forms.

---

## The diagnosis (why this pattern exists)

The symptom — "fast on second visit, slow on first" — is the signature of a third-party script that runs on every page render but gets browser-cached after the first hit. The dominant culprit on form pages in this template lineage is:

```astro
{recaptchaSiteKey && (
  <script is:inline src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`} async defer></script>
)}
```

Even with `async defer`, the browser still:

1. Opens a TLS handshake to `www.google.com` (one round-trip, ~150 ms on slow 4G)
2. Downloads ~150 KB of reCAPTCHA bundle JS
3. Parses and runs it — the v3 behaviour-scoring loop is a continuous main-thread task
4. Makes follow-up requests to `www.gstatic.com` for the worker module

All of this happens **before the user has touched the form**. On second visit, every byte is in the browser cache, so the page paints quickly — masking the regression.

Submission timing is not affected by deferring: `grecaptcha.execute()` is awaited inside the submit handler, and by the time the user has typed an email and pressed submit, reCAPTCHA has long since loaded from the intent-trigger.

---

## Goal — what "first paint fast" actually means

1. **No reCAPTCHA bytes in the initial network waterfall.** Neither `recaptcha/api.js` nor any `gstatic.com` follow-up should appear before user interaction.
2. **No main-thread cost during LCP window.** Removing the v3 scoring loop typically saves 100–300 ms of TBT on slow 4G.
3. **Submission still works on the first try.** The submit handler's existing `grecaptcha.ready()` call must wait correctly for the late-loaded script.
4. **Loads silently on intent.** The user notices nothing — by the time they focus the first input, reCAPTCHA is fetching in the background.

---

## Hard rules

1. **Never use the static `<script src="…recaptcha/api.js">` tag** at the bottom of the form column. Replace it with the JS-injected loader pattern below.
2. **Triggers must be `focusin` on the form + `pointerdown` on the form + `submit` fallback.** Keyboard users (Tab into a field) hit `focusin`; touch/mouse users hit `pointerdown`; auto-fill / programmatic submit hits the fallback.
3. **`focusin` and `pointerdown` are attached at the form element**, not on individual inputs. `focusin` bubbles, so a single listener covers every field.
4. **The loader must be idempotent** — a `loaded` flag guard prevents double-injection if multiple triggers fire.
5. **`grecaptcha.ready()` in the submit handler stays unchanged.** It already handles late-loaded `grecaptcha` correctly via its internal queue.
6. **The submit-event fallback runs even if `focusin`/`pointerdown` never fired.** Defends against password-manager autosubmit and programmatic `form.submit()`. Use `{ once: false }` on submit because it might fire after the script loaded successfully; the `loaded` flag short-circuits it.
7. **Do not preconnect to `www.google.com` site-wide.** Only the form pages need reCAPTCHA. If you want a preconnect, add it via `<slot name="head">` on just those pages — but with the deferred load, it's usually unnecessary.
8. **Apply to both contact.astro AND booking.astro identically.** Pattern must be uniform across every form page so future maintenance is one diff, not many.

---

## The pattern — drop-in replacement

### Before (slow first paint)

```astro
{recaptchaSiteKey && (
  <script is:inline src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`} async defer></script>
)}
```

### After (intent-triggered)

```astro
{recaptchaSiteKey && (
  <script is:inline define:vars={{ _rcKey: recaptchaSiteKey, _rcFormId: 'contact-page-form' }}>
    // reCAPTCHA defer-on-intent — load only when the user engages with the form.
    // Saves ~150KB JS + TLS handshake + main-thread scoring loop off first paint.
    // The submit handler's grecaptcha.ready() call queues correctly against a
    // late-loaded script, so submission flow is unaffected.
    (function () {
      var loaded = false;

      function loadReCaptcha() {
        if (loaded) return;
        loaded = true;
        var s = document.createElement('script');
        s.src = 'https://www.google.com/recaptcha/api.js?render=' + _rcKey;
        s.async = true;
        document.head.appendChild(s);
      }

      function bind() {
        var form = document.getElementById(_rcFormId);
        if (!form) return;
        // focusin bubbles, so one listener covers every input + textarea
        form.addEventListener('focusin',     loadReCaptcha, { once: true, passive: true });
        form.addEventListener('pointerdown', loadReCaptcha, { once: true, passive: true });
        // Submit fallback — covers programmatic submit + password-manager autofill
        form.addEventListener('submit',      loadReCaptcha, { passive: true });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind, { once: true });
      } else {
        bind();
      }
    })();
  </script>
)}
```

### Changing per form

The two values that differ between pages:

| Variable | Contact page | Booking page |
|---|---|---|
| `_rcFormId` | `'contact-page-form'` | `'booking-form'` |

Pass them via `define:vars` so the inline script stays CSP-clean (no template interpolation inside the `<script>` body).

---

## Verification checklist

After applying the pattern on a new form page:

### Build
- [ ] `npm run build` passes
- [ ] `dist/client/contact/index.html` (or equivalent) contains the inline loader, NOT a raw `<script src="…recaptcha/api.js">` tag
- [ ] `grep -c "recaptcha/api.js" dist/client/<page>/index.html` returns `1` (the URL string inside the loader, no static `<script src>`)

### DevTools Network panel (first paint, cache disabled)
- [ ] No `recaptcha/api.js` request in the initial waterfall (before any user input)
- [ ] No `www.gstatic.com/recaptcha/…` requests in the initial waterfall
- [ ] LCP element paints without waiting on Google

### DevTools Network panel (after first input focus)
- [ ] `recaptcha/api.js` request appears within ~100 ms of `focusin`
- [ ] Follow-up `gstatic.com` worker requests follow
- [ ] No console error from `grecaptcha`

### Submission
- [ ] Filling the form and pressing Submit → reCAPTCHA token is generated and sent in the Web3Forms payload
- [ ] In the Network panel of the submit POST, `recaptcha_response` field has a valid token (not empty)
- [ ] Web3Forms dashboard shows the submission as verified

### Lighthouse / PSI mobile
- [ ] Performance score on the form page is within 5 points of the rest of the site (no regression vs non-form pages)
- [ ] No "Reduce unused JavaScript" warning citing `recaptcha/api.js`
- [ ] No "Reduce JavaScript execution time" warning citing reCAPTCHA scoring
- [ ] No "Avoid chaining critical requests" warning involving google.com

### Behaviour edge cases
- [ ] Tab into the first input (no click) → loader fires (focusin)
- [ ] Touch the first input on mobile → loader fires (pointerdown)
- [ ] Programmatic `form.submit()` via DevTools console → loader fires (submit fallback) and the submission still receives a token (after the script loads)

---

## Common failure modes (and the fix)

| Symptom | Cause | Fix |
|---|---|---|
| reCAPTCHA still appears in the first-paint waterfall | Old static `<script src>` tag wasn't removed | Search the page file for `recaptcha/api.js` and remove the static tag. There should be exactly ONE reference — inside the JS-injected loader's `s.src = …` line. |
| Submit fails with "grecaptcha is undefined" | `grecaptcha.ready()` called before the script finished loading | Confirm the submit handler still uses `await new Promise(resolve => grecaptcha.ready(resolve))` — that pattern queues correctly against a late-loaded script. |
| Loader fires on every keystroke | `{ once: true }` missing from the listener options | Add `{ once: true, passive: true }` on `focusin` + `pointerdown`. Submit fallback is the exception — it omits `once: true` because it's a safety net. |
| Loader never fires for keyboard users | Only `pointerdown` listener attached | Always attach `focusin` AND `pointerdown` — keyboard users skip pointer events. |
| Two reCAPTCHA scripts in `<head>` | The `loaded` guard is missing | Add the `loaded` boolean flag check at the top of `loadReCaptcha()`. |
| First-time submitter (programmatic submit before any interaction) gets no token | Submit fallback missing | Add the `submit` event listener WITHOUT `once: true`. The `loaded` guard prevents double-load. |
| Loader injects on a page that doesn't have the form (component reuse / dynamic route) | `getElementById` returns null but no early-return | The `bind()` function early-returns when `form` is null — verify that guard is still present after copy-paste. |

---

## Why this works on Cloudflare Pages specifically

The HMDG template hosts on Cloudflare Pages with HTML uncached at the edge (per `public/_headers` line 27–29: "HTML pages are NOT listed here — Cloudflare Pages caches them by default with edge-level caching; browser revalidation is desirable"). That means:

- **First visit to a form page** → HTML round-trips to origin, then the browser parses it and sees the reCAPTCHA `<script src>` tag, then opens a separate TLS connection to `www.google.com`. Two TLS handshakes + one large JS download before LCP.
- **Second visit** → HTML revalidates (often a 304), reCAPTCHA is in the browser cache (it ships with a long max-age), and everything paints fast.

Deferring reCAPTCHA collapses the first-visit critical path to one TLS handshake (the Cloudflare HTML) + one image preload (the hero). The form bytes load asynchronously, after paint, only if the user engages.

---

## Cross-references

- `.claude/skills/contact-form.md` — the canonical contact form skill (this defer pattern should be baked into any future revision of that skill)
- `.claude/skills/booking-form.md` — the canonical booking form skill (same)
- `.claude/skills/contactform-googlerecaptcha.md` — the reCAPTCHA wiring spec
- `.claude/rules/performance.md` — broader perf rules (third-party script control section)
- `BaseLayout.astro` lines 283–335 — same intent-triggered pattern applied to GTM (the canonical example to model new deferrals on)
- Northern Medical commit lineage:
  - Initial reCAPTCHA wiring on contact + booking
  - This commit — defer-on-intent applied to both pages

---

## Future portability

When cloning the HMDG template for a new client:

1. If the client has a contact form, apply this pattern to `src/pages/contact.astro` from day one.
2. If the client has a booking form, apply this pattern to `src/pages/booking.astro` from day one.
3. Any net-new form page (lead-gen landing, enquiry form, multi-step funnel) using reCAPTCHA v3 must use this pattern — never the static `<script src>` tag.
4. The `_rcFormId` value is the only thing that changes between pages — keep the loader function body identical so the diff between forms is one line.
