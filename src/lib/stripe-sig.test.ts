// Run: node --experimental-strip-types src/lib/stripe-sig.test.ts
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifyStripeSignature } from './stripe-sig.ts';

const secret = 'whsec_test';
const payload = '{"id":"evt_1"}';
const t = Math.floor(Date.now() / 1000);
const sig = (ts: number, body = payload) => createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex');

assert.equal(await verifyStripeSignature(payload, `t=${t},v1=${sig(t)}`, secret), true);
assert.equal(await verifyStripeSignature(payload, `t=${t},v1=deadbeef,v1=${sig(t)}`, secret), true);
assert.equal(await verifyStripeSignature(payload + ' ', `t=${t},v1=${sig(t)}`, secret), false, 'tampered body');
assert.equal(await verifyStripeSignature(payload, `t=${t - 1000},v1=${sig(t - 1000)}`, secret), false, 'too old');
assert.equal(await verifyStripeSignature(payload, `t=${t},v1=${sig(t)}`, 'other'), false, 'wrong secret');
assert.equal(await verifyStripeSignature(payload, null, secret), false);
console.log('stripe-sig ok');
