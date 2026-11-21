import type { APIRoute } from 'astro';
import { json, tokenForExternalId } from '../../lib/server';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('session_id') ?? '';
  if (!/^(cs_(test|live)_|mock_)[A-Za-z0-9_-]{8,200}$/.test(id)) return json({ status: 'unknown' }, 400);
  const token = await tokenForExternalId(id);
  return json(token ? { status: 'ready', url: `/watch/${token}` } : { status: 'pending' });
};
