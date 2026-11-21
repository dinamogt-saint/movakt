import type { APIRoute } from 'astro';
import { env, json, lang, sendAccessEmail, siteUrl, watchUrl } from '../../lib/server';

export const prerender = false;
// shortcut: check-then-insert, so a burst of parallel requests can slip past the limit; move to a Durable Object or CF rate-limit rule if abused.
const LIMIT = 3; // per hour, per email and per IP

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const body = (await request.json().catch(() => ({}))) as { email?: string; lang?: string };
  const email = String(body.email ?? '').trim().toLowerCase();
  const done = json({ ok: true }); // same answer for every email, so the form can't probe who bought
  if (!email || email.length > 254) return done;

  const ip = request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown';
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { results } = await env.DB.prepare(
    `SELECT key, COUNT(*) AS n FROM resend_requests WHERE key IN (?, ?) AND created_at > ? GROUP BY key`,
  ).bind(`e:${email}`, `ip:${ip}`, since).all<{ key: string; n: number }>();
  if (results.some((r) => r.n >= LIMIT)) return json({ ok: true, limited: true }, 429);
  const ts = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO resend_requests (key, created_at) VALUES (?, ?)`).bind(`e:${email}`, ts),
    env.DB.prepare(`INSERT INTO resend_requests (key, created_at) VALUES (?, ?)`).bind(`ip:${ip}`, ts),
  ]);

  const row = await env.DB.prepare(
    `SELECT t.token, p.lang FROM purchases p JOIN access_tokens t ON t.purchase_id = p.id
     WHERE p.email = ? AND t.revoked = 0 ORDER BY p.created_at DESC LIMIT 1`,
  ).bind(email).first<{ token: string; lang: string }>();
  if (row) await sendAccessEmail({ email, lang: lang(body.lang ?? row.lang), link: watchUrl(siteUrl(request), row.token) });
  return done;
};
