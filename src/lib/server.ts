// Server-only helpers: D1 purchases/tokens, Stripe REST, email, Bunny signed embeds.
import { env as cfEnv } from 'cloudflare:workers';
import { config } from '../config';
import ru from '../content/ru.json';
import en from '../content/en.json';

export type Lang = 'ru' | 'en';
export interface Env {
  DB: D1Database;
  SITE_URL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_ID_EUR?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  BUNNY_LIBRARY_ID?: string;
  BUNNY_TOKEN_KEY?: string;
  BUNNY_VIDEO_IDS?: string;
  TRIBUTE_SHARED_TOKEN?: string;
  ALLOW_MOCK_CHECKOUT?: string;
}
export const env = cfEnv as unknown as Env;
export const lang = (v: unknown): Lang => (v === 'en' ? 'en' : 'ru');
export const copy = (l: Lang) => (l === 'en' ? en : ru);
export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const newToken = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
const now = () => new Date().toISOString();

export function siteUrl(request: Request) {
  return (env.SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
}
export const watchUrl = (base: string, token: string) => `${base}/watch/${token}`;

/** Idempotent on external_id: a repeated webhook returns the existing token and created=false. */
export async function recordPurchase(p: {
  source: 'stripe' | 'tribute' | 'mock';
  externalId: string;
  email: string | null;
  amount: number;
  currency: string;
  lang: Lang;
  telegramUserId?: number | null;
}): Promise<{ token: string; created: boolean }> {
  const existing = await tokenForExternalId(p.externalId);
  if (existing) return { token: existing, created: false };
  const id = crypto.randomUUID();
  const token = newToken();
  const ts = now();
  const res = await env.DB.batch([
    env.DB.prepare(
      `INSERT OR IGNORE INTO purchases (id, source, external_id, email, telegram_user_id, amount, currency, lang, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(id, p.source, p.externalId, p.email, p.telegramUserId ?? null, p.amount, p.currency, p.lang, ts),
    env.DB.prepare(
      `INSERT INTO access_tokens (token, purchase_id, created_at)
       SELECT ?, ?, ? WHERE EXISTS (SELECT 1 FROM purchases WHERE id = ?)`,
    ).bind(token, id, ts, id),
  ]);
  if (!res[0].meta.changes) {
    // lost a race with a parallel delivery of the same event
    return { token: (await tokenForExternalId(p.externalId))!, created: false };
  }
  return { token, created: true };
}

export async function tokenForExternalId(externalId: string): Promise<string | null> {
  const row = await env.DB.prepare(
    `SELECT t.token FROM access_tokens t JOIN purchases p ON p.id = t.purchase_id
     WHERE p.external_id = ? AND t.revoked = 0 ORDER BY t.created_at LIMIT 1`,
  ).bind(externalId).first<{ token: string }>();
  return row?.token ?? null;
}

/** Returns the purchase language for a valid token, or null (unknown / revoked). */
export async function checkToken(token: string): Promise<{ lang: Lang } | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  if (env.TRIBUTE_SHARED_TOKEN && token === env.TRIBUTE_SHARED_TOKEN) return { lang: 'ru' };
  const row = await env.DB.prepare(
    `SELECT p.lang FROM access_tokens t LEFT JOIN purchases p ON p.id = t.purchase_id
     WHERE t.token = ? AND t.revoked = 0`,
  ).bind(token).first<{ lang: string | null }>();
  if (!row) return null;
  await env.DB.prepare(`UPDATE access_tokens SET last_used_at = ? WHERE token = ?`).bind(now(), token).run();
  return { lang: lang(row.lang) };
}

// ---------- Stripe (REST, no SDK) ----------

export async function createCheckoutSession(opts: { email: string; lang: Lang; base: string }) {
  const t = copy(opts.lang);
  const p = new URLSearchParams({
    mode: 'payment',
    customer_email: opts.email,
    locale: opts.lang,
    success_url: `${opts.base}${opts.lang === 'en' ? '/en' : ''}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.base}${opts.lang === 'en' ? '/en' : ''}/#price`,
    'metadata[lang]': opts.lang,
    'consent_collection[terms_of_service]': 'required',
    'custom_text[terms_of_service_acceptance][message]': t.mail.waiverCheckout,
  });
  if (env.STRIPE_PRICE_ID_EUR) {
    p.set('line_items[0][price]', env.STRIPE_PRICE_ID_EUR);
  } else {
    p.set('line_items[0][price_data][currency]', 'eur');
    p.set('line_items[0][price_data][unit_amount]', String(config.priceEur * 100));
    p.set('line_items[0][price_data][product_data][name]', t.price.title);
  }
  p.set('line_items[0][quantity]', '1');
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: p,
  });
  const data = (await res.json()) as { url?: string; error?: { message: string } };
  if (!res.ok || !data.url) throw new Error(data.error?.message ?? `stripe ${res.status}`);
  return data.url;
}

import { hex, verifyStripeSignature } from './stripe-sig';
export { verifyStripeSignature };

// ---------- email ----------

export async function sendAccessEmail(opts: { email: string; lang: Lang; link: string }) {
  const m = copy(opts.lang).mail;
  const text = [m.hello, '', m.body, opts.link, '', m.waiver, '', m.support, `${config.email} · ${config.telegram}`].join('\n');
  if (!env.RESEND_API_KEY) {
    // shortcut: no Resend key locally, so the email goes to the dev log; set RESEND_API_KEY to send for real.
    console.log(`[mail → ${opts.email}] ${m.subject}\n${text}`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: opts.email, subject: m.subject, text }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
}

// ---------- Bunny Stream ----------

/** Signed iframe embed URLs, or null per lesson when Bunny is not configured yet. */
export async function lessonEmbeds(count: number): Promise<(string | null)[]> {
  const ids = (env.BUNNY_VIDEO_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const lib = env.BUNNY_LIBRARY_ID;
  const key = env.BUNNY_TOKEN_KEY;
  const expires = Math.floor(Date.now() / 1000) + 6 * 3600;
  return Promise.all(
    Array.from({ length: count }, async (_, i) => {
      const id = ids[i];
      if (!lib || !id) return null;
      const base = `https://iframe.mediadelivery.net/embed/${lib}/${id}?autoplay=false&preload=false`;
      if (!key) return base;
      const sig = hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key + id + expires)));
      return `${base}&token=${sig}&expires=${expires}`;
    }),
  );
}
