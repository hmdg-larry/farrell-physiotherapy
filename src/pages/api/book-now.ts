/**
 * /api/book-now
 * ─────────────────────────────────────────────────────────────────
 * Server-side relay: receives a book_now_click event from the
 * CookieConsent booking tracker and forwards it to GA4 via the
 * Measurement Protocol. The GA4 API secret never touches the browser.
 *
 * Cloudflare Pages Function — requires @astrojs/cloudflare adapter.
 * ─────────────────────────────────────────────────────────────────
 */

export const prerender = false;

interface BookNowPayload {
  client_id:    string;
  session_id?:  string;
  booking_url?: string;
  page_url?:    string;
  page_title?:  string;
  page_referrer?: string;
  gclid?:       string;
  platform?:    string;
  event_id?:    string;
  utm_source?:  string;
  utm_medium?:  string;
  utm_campaign?: string;
  utm_term?:    string;
  utm_content?: string;
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  // ── 1. Origin validation ─────────────────────────────────────────
  const siteOrigin = import.meta.env.SITE_ORIGIN || '';
  const origin     = request.headers.get('origin') || '';
  const referer    = request.headers.get('referer') || '';

  if (siteOrigin && origin && !origin.startsWith(siteOrigin) && !referer.startsWith(siteOrigin)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  // ── 2. Content-Type validation ───────────────────────────────────
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400 });
  }

  // ── 3. Payload size guard (8KB max) ─────────────────────────────
  const rawText = await request.text().catch(() => '');
  if (rawText.length > 8192) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), { status: 413 });
  }

  // ── 4. Parse payload ─────────────────────────────────────────────
  let payload: BookNowPayload;
  try {
    payload = JSON.parse(rawText);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  // ── 5. Require client_id ─────────────────────────────────────────
  if (!payload.client_id || typeof payload.client_id !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing client_id' }), { status: 400 });
  }

  // ── 6. Forward to GA4 Measurement Protocol ───────────────────────
  const apiSecret     = import.meta.env.GA4_API_SECRET || '';
  const measurementId = import.meta.env.GA4_MEASUREMENT_ID || '';

  if (!apiSecret || !measurementId) {
    // Env vars not configured — log and return 200 so client doesn't retry
    console.warn('[HMDG CCM] book-now: GA4_API_SECRET or GA4_MEASUREMENT_ID not set');
    return new Response(JSON.stringify({ ok: true, warning: 'GA4 not configured' }), { status: 200 });
  }

  const mpUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  const eventParams: Record<string, string> = {
    page_location:    payload.page_url      || '',
    page_title:       payload.page_title    || '',
    page_referrer:    payload.page_referrer || '',
    booking_platform: payload.platform      || 'unknown',
    booking_url:      payload.booking_url   || '',
    engagement_time_msec: '1',
  };

  // Append optional parameters
  if (payload.session_id)    eventParams.session_id    = payload.session_id;
  if (payload.gclid)         eventParams.gclid         = payload.gclid;
  if (payload.event_id)      eventParams.event_id      = payload.event_id;
  if (payload.utm_source)    eventParams.utm_source    = payload.utm_source;
  if (payload.utm_medium)    eventParams.utm_medium    = payload.utm_medium;
  if (payload.utm_campaign)  eventParams.utm_campaign  = payload.utm_campaign;
  if (payload.utm_term)      eventParams.utm_term      = payload.utm_term;
  if (payload.utm_content)   eventParams.utm_content   = payload.utm_content;

  const mpBody = {
    client_id: payload.client_id,
    events: [
      {
        name:   'book_now_click',
        params: eventParams,
      },
    ],
  };

  try {
    const mpResponse = await fetch(mpUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(mpBody),
    });

    // GA4 MP returns 204 on success
    if (mpResponse.ok || mpResponse.status === 204) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    console.error('[HMDG CCM] book-now: GA4 MP returned', mpResponse.status);
    return new Response(JSON.stringify({ ok: false }), { status: 200 }); // still 200 to client
  } catch (err) {
    console.error('[HMDG CCM] book-now: fetch to GA4 failed', err);
    return new Response(JSON.stringify({ ok: false }), { status: 200 });
  }
}
