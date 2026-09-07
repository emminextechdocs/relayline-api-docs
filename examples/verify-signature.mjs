import { createHmac, timingSafeEqual } from 'node:crypto';

/** Verify raw bytes before parsing JSON. A timestamp check does not replace deduplication. */
export function verifySignature(rawBody, header, secret, now = Date.now()) {
  if (!Buffer.isBuffer(rawBody) || typeof header !== 'string' || typeof secret !== 'string' || !secret) return false;
  if (!Number.isFinite(now)) return false;
  const match = /^t=(0|[1-9]\d*),v1=([a-f0-9]{64})$/i.exec(header);
  if (!match) return false;
  const timestamp = Number(match[1]);
  if (!Number.isSafeInteger(timestamp) || Math.abs(Math.floor(now / 1000) - timestamp) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${match[1]}.`).update(rawBody).digest();
  return timingSafeEqual(expected, Buffer.from(match[2], 'hex'));
}
