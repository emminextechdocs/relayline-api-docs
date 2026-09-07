import { createHmac } from 'node:crypto';
import { verifySignature } from './verify-signature.mjs';

// Local demonstration secret only. Never reuse this value in an application.
const secret = 'local-demo-not-a-real-secret';
const body = Buffer.from('{"id":"evt_demo","type":"order.created"}');
const now = Date.now();
const timestamp = Math.floor(now / 1000);
const signature = createHmac('sha256', secret).update(`${timestamp}.`).update(body).digest('hex');
const header = `t=${timestamp},v1=${signature}`;
console.log('Signature accepted:', verifySignature(body, header, secret, now));
console.log('Tampered body accepted:', verifySignature(Buffer.from('{}'), header, secret, now));
