import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifySignature } from '../examples/verify-signature.mjs';

const secret = 'test-only-secret';
const body = Buffer.from('{"message":"café"}');
const timestamp = 1788750000;
const now = timestamp * 1000;
const digest = createHmac('sha256', secret).update(`${timestamp}.`).update(body).digest('hex');
const header = `t=${timestamp},v1=${digest}`;

test('accepts valid raw UTF-8 bytes', () => assert.equal(verifySignature(body, header, secret, now), true));
test('rejects tampering and wrong secrets', () => {
  assert.equal(verifySignature(Buffer.from('{}'), header, secret, now), false);
  assert.equal(verifySignature(body, header, 'wrong', now), false);
});
test('enforces timestamp tolerance in both directions', () => {
  assert.equal(verifySignature(body, header, secret, now + 300000), true);
  assert.equal(verifySignature(body, header, secret, now + 301000), false);
  assert.equal(verifySignature(body, header, secret, now - 301000), false);
});
test('rejects malformed headers and invalid inputs without throwing', () => {
  for (const value of [null, undefined, '', 't=1,v1=abc', `${header},t=2`, `t=0${timestamp},v1=${digest}`]) {
    assert.equal(verifySignature(body, value, secret, now), false);
  }
  assert.equal(verifySignature(body.toString(), header, secret, now), false);
  assert.equal(verifySignature(body, header, '', now), false);
  assert.equal(verifySignature(body, header, secret, NaN), false);
});
