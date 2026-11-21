import type { APIRoute } from 'astro';
import { env, json, lang, recordPurchase, sendAccessEmail, siteUrl, watchUrl, verifyStripeSignature } from '../../lib/server';

export const prerender = false;

interface Session {
  id: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  customer_details?: { email?: string };
  customer_email?: string;
  metadata?: { lang?: string };
}

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const ok = env.STRIPE_WEBHOOK_SECRET && (await verifyStripeSignature(payload, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET));
  if (!ok) return json({ error: 'bad signature' }, 400);

  const event = JSON.parse(payload) as { type: string; data: { object: Session } };
  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return json({ received: true });
  }
  const s = event.data.object;
  if (s.payment_status !== 'paid') return json({ received: true });

  const email = (s.customer_details?.email ?? s.customer_email ?? '').toLowerCase() || null;
  const l = lang(s.metadata?.lang);
  const { token, created } = await recordPurchase({ source: 'stripe', externalId: s.id, email, amount: s.amount_total, currency: s.currency, lang: l });
  // Only the first delivery sends the email; Stripe retries must not duplicate it.
  if (created && email) await sendAccessEmail({ email, lang: l, link: watchUrl(siteUrl(request), token) });
  return json({ received: true });
};
