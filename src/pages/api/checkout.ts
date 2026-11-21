import type { APIRoute } from 'astro';
import { config } from '../../config';
import { env, json, lang, recordPurchase, sendAccessEmail, siteUrl, watchUrl, createCheckoutSession } from '../../lib/server';

export const prerender = false;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => ({}))) as { email?: string; lang?: string };
  const email = String(body.email ?? '').trim().toLowerCase();
  const l = lang(body.lang);
  if (!EMAIL.test(email) || email.length > 254) return json({ error: 'invalid email' }, 400);
  const base = siteUrl(request);
  const prefix = l === 'en' ? '/en' : '';

  if (!env.STRIPE_SECRET_KEY) {
    // Mock checkout for local dev only: never grant free access on a real host.
    const host = new URL(request.url).hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') return json({ error: 'payments not configured' }, 503);
    const externalId = `mock_${crypto.randomUUID()}`;
    const { token } = await recordPurchase({ source: 'mock', externalId, email, amount: config.priceEur * 100, currency: 'eur', lang: l });
    await sendAccessEmail({ email, lang: l, link: watchUrl(base, token) });
    return json({ url: `${prefix}/thanks?session_id=${externalId}` });
  }

  try {
    return json({ url: await createCheckoutSession({ email, lang: l, base }) });
  } catch (e) {
    console.error('checkout', e);
    return json({ error: 'checkout failed' }, 502);
  }
};
