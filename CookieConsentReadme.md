# Cookie Consent Setup Guide — Marketing Team

This guide is for the marketing team only. You do not need to understand code. You only need to copy and paste values into the correct places.

There are **two things** you need to do for every new client site:

1. Fill in the config file with the client's details
2. Add the secret keys into Cloudflare Pages (not in the file)

---

## Before You Start — Gather These First

Before opening any file, collect the following from the client or from your accounts:

| What you need | Where to find it |
|---|---|
| GTM Container ID | Google Tag Manager → Admin tab → Container Settings → Container ID |
| GA4 Measurement ID | GA4 → Admin → Data Streams → click the stream → Measurement ID |
| GA4 API Secret | GA4 → Admin → Data Streams → click the stream → Measurement Protocol API secrets → Create |
| Client website URL | The live domain e.g. `https://cityphysio.co.uk` |
| Client's cookie policy wording | From the client's cookie policy page or brief |
| Booking platform | Which platform the client uses e.g. Cliniko, Calendly |

Write these down before you start. You will need all of them.

---

## Part 1 — Fill In the Config File

Open this file in the project:

```
src/config/cookie-consent.config.ts
```

You will see a list of fields. Find each field below and replace the placeholder text with the real value. **Only change the fields listed in this guide. Do not touch anything else.**

---

### Field 1 — GTM ID

**Find this line in the file:**
```
gtmId: 'GTM-XXXXXXX',
```

**Replace** `GTM-XXXXXXX` with the client's real GTM ID.

**Example — before:**
```
gtmId: 'GTM-XXXXXXX',
```

**Example — after:**
```
gtmId: 'GTM-ABC1234',
```

**Where to find the GTM ID:**
1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Click on the client's account
3. Click **Admin** in the top menu
4. Under Container, click **Container Settings**
5. The Container ID is shown at the top — it looks like `GTM-ABC1234`

---

### Field 2 — GA4 Measurement ID

**Find this line in the file:**
```
gtagId: 'G-XXXXXXXXXX',
```

**Replace** `G-XXXXXXXXXX` with the client's real GA4 ID.

**Example — before:**
```
gtagId: 'G-XXXXXXXXXX',
```

**Example — after:**
```
gtagId: 'G-9KW3PLMX22',
```

**Where to find the GA4 Measurement ID:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Click on the client's property
3. Click the **Admin** cog (bottom left)
4. Under Property, click **Data Streams**
5. Click on the web stream
6. The Measurement ID is shown at the top right — it looks like `G-9KW3PLMX22`

---

### Field 3 — Policy Version

**Find this line in the file:**
```
policyVersion: '1.0',
```

**For a brand new site:** Leave this as `'1.0'`. Do not change it.

**If the cookie policy has changed on an existing site:** Change it to the next number.

| Situation | What to set |
|---|---|
| New site, first time setup | `'1.0'` |
| Minor cookie policy update | `'1.1'` |
| Major cookie policy rewrite | `'2.0'` |

**Important:** Changing this number will make the cookie banner appear again for all visitors — even ones who already accepted. Only change it when the policy actually changes.

---

### Field 4 — Banner Title

**Find this line in the file:**
```
bannerTitle: 'We use cookies',
```

**Replace** the text between the single quotes `' '` with the client's preferred title.

**Example:**
```
bannerTitle: 'This site uses cookies',
```

Keep it short — 4 to 6 words maximum.

---

### Field 5 — Banner Message

**Find this line in the file:**
```
bannerText: 'We use cookies to improve your experience, personalise content, and analyse our traffic. You can choose which cookies you accept.',
```

**Replace** the message with the wording from the client's cookie policy. Keep it to one or two sentences. Write in UK English (use: personalise, analyse, authorise — not American spellings).

**Rules:**
- Do not make promises like "we never share your data" unless the policy says so
- Keep it factual and simple
- Match the tone of the client's brand

---

### Field 6 — Button Labels

**Find these lines:**
```
acceptAllLabel:       'Accept All',
rejectAllLabel:       'Reject All',
customiseLabel:       'Customise',
savePreferencesLabel: 'Save Preferences',
```

These rarely need changing. Only update them if the client has specifically asked for different wording.

**Rules:**
- Always use UK English: `Customise` not `Customize`
- Keep labels short — 1 to 3 words
- Buttons must sound like actions (Accept, Reject, Save — not Submit or Click)

---

### Field 7 — Cookie Categories (Turn On or Off)

**Find this section:**
```
categories: {
  necessary:   { enabled: true,  ... },
  functional:  { enabled: true,  ... },
  analytics:   { enabled: true,  ... },
  performance: { enabled: true,  ... },
  marketing:   { enabled: true,  ... },
},
```

Each category has `enabled: true` or `enabled: false`.

- `enabled: true` — this category shows in the cookie banner
- `enabled: false` — this category is completely hidden

**When to turn categories off:**

| Category | Turn off when... |
|---|---|
| necessary | Never — this is always required |
| functional | Client does not use live chat, saved preferences, or personalisation tools |
| analytics | Client does not use Google Analytics or any tracking |
| performance | Client does not use performance monitoring tools |
| marketing | Client does not run Google Ads, Facebook Ads, or any remarketing |

**How to turn one off — example:**

Before:
```
marketing: { enabled: true, label: 'Marketing', ... },
```

After:
```
marketing: { enabled: false, label: 'Marketing', ... },
```

Only change `true` to `false`. Do not change anything else on the line.

---

### Field 8 — Booking Platforms

**Find this section:**
```
bookingDomains: [
  'cliniko.com',
  'calendly.com',
  'acuityscheduling.com',
  'phorest.com',
  'youcanbook.me',
  'jane.app',
  'timely.com',
  'simplybook.me',
],
```

This is a list of booking platforms. The tracker automatically detects when a visitor clicks a booking link to any of these sites and fires a `book_now_click` event in GA4.

**What to do:**
1. Find out which booking platform the client uses
2. Keep only that platform in the list
3. Remove all the others by deleting the line

**Example — client uses Cliniko only:**

Before:
```
bookingDomains: [
  'cliniko.com',
  'calendly.com',
  'acuityscheduling.com',
  'phorest.com',
  'youcanbook.me',
  'jane.app',
  'timely.com',
  'simplybook.me',
],
```

After:
```
bookingDomains: [
  'cliniko.com',
],
```

**If the client does not use any of these platforms**, leave the list empty:
```
bookingDomains: [],
```

---

## Part 2 — Add the Secret Keys in Cloudflare Pages

The GA4 API Secret must **never** go in the config file. It must be added directly into Cloudflare Pages. This keeps it secure.

### Step 1 — Get the GA4 API Secret

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click on the client's property
3. Click the **Admin** cog (bottom left)
4. Under Property, click **Data Streams**
5. Click on the web stream
6. Scroll down to **Measurement Protocol API secrets**
7. Click **Manage**
8. Click **Create** if no secret exists
9. Give it a name (e.g. `Astro Site`) and click **Create**
10. Copy the secret value — it looks like a long random string

### Step 2 — Add the secrets to Cloudflare Pages

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Workers & Pages** in the left menu
3. Click on the client's site
4. Click the **Settings** tab at the top
5. Click **Variables and Secrets** in the side menu
6. Click **Add variable** for each of the following:

| Variable name | What to paste in | Encrypt? |
|---|---|---|
| `GA4_API_SECRET` | The API secret you just copied from GA4 | **Yes — toggle Encrypt on** |
| `GA4_MEASUREMENT_ID` | The client's GA4 Measurement ID (e.g. `G-9KW3PLMX22`) | No |
| `SITE_ORIGIN` | The client's full website URL (e.g. `https://cityphysio.co.uk`) | No |

7. After adding all three, go to **Deployments → latest deployment → Retry deployment**.

> **Important:** Cloudflare Pages does **not** auto-redeploy when environment variables change. Without manually clicking Retry deployment, the new values will not take effect on the live site.

---

## What NOT to Change

Do not touch any of the following. If you are unsure whether something is in this list, ask the developer.

| What | Why |
|---|---|
| `bookingCompletionMatchers` | Technical code that detects when a booking is completed — changing it breaks tracking |
| `clinikoThankYouUrlPatterns` | Technical patterns for Cliniko detection — do not edit |
| `cookieName` | Changing this breaks existing user consent — all visitors will see the banner again for the wrong reason |
| `debug` | Must always be `false` on a live site — leave it alone |
| `tokens` | Colour and style settings tied to the design system — a developer sets these |
| Anything in `src/components/` | Component code — developer only |
| Anything in `src/pages/api/` | Server code — developer only |
| Anything in `src/layouts/` | Layout code — developer only |

---

## Checklist — Before You Finish

Go through this list before telling the developer it is ready:

- [ ] GTM ID filled in correctly (starts with `GTM-`)
- [ ] GA4 Measurement ID filled in correctly (starts with `G-`)
- [ ] Policy version set to `'1.0'` for a new site
- [ ] Banner title updated to match client preferences
- [ ] Banner message updated to match client's cookie policy wording
- [ ] Unused cookie categories set to `enabled: false`
- [ ] Booking platform list updated — only the client's platform remains
- [ ] `GA4_API_SECRET` added to Cloudflare Pages → Variables and Secrets (with Encrypt enabled)
- [ ] `GA4_MEASUREMENT_ID` added to Cloudflare Pages → Variables and Secrets
- [ ] `SITE_ORIGIN` added to Cloudflare Pages → Variables and Secrets (full URL with https://)
- [ ] A new deployment triggered in Cloudflare Pages (Deployments → Retry deployment) after adding environment variables

---

## Common Mistakes

**The banner is not showing on the site**
The Cloudflare Pages environment variables may not have been saved, or a redeployment was not triggered after adding them. In Cloudflare → Deployments → Retry deployment.

**The wrong GTM is firing**
Double-check the GTM ID in the config file matches the client's container, not another client's.

**Booking events are not showing in GA4**
Check that the client's booking platform domain is in the `bookingDomains` list and that the GA4 API secret is saved correctly in Cloudflare Pages → Variables and Secrets.

**All visitors are seeing the banner again after it was working**
The `policyVersion` was changed unnecessarily. If the cookie policy did not change, this should not be bumped.

**The banner says "We use cookies" for the wrong client**
The `bannerTitle` and `bannerText` fields were not updated. Update them and redeploy.

---

## Need Help?

Contact the developer. Do not guess or try to fix issues in the component or API files.
