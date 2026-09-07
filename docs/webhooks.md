# Verify a webhook before processing it

The sample protocol signs the exact message `timestamp.raw_body` with HMAC-SHA256. The `Relayline-Signature` header contains `t=<seconds>,v1=<hex digest>`.

Use [verify-signature.mjs](../examples/verify-signature.mjs) with a `Buffer` containing the original request bytes. Parse JSON only after verification. The implementation requires one timestamp and one signature; duplicate fields and extra components are rejected.

## Processing sequence

1. Enforce a body-size limit while reading the request, before buffering arbitrary input.
2. Verify the signature with a server-side signing secret.
3. Parse JSON and validate the event schema.
4. Store the event with a unique constraint on its event ID and queue its processing durably.
5. Acknowledge only after durable acceptance. In the sample contract, return a 2xx response within ten seconds.
6. Process the queued event with idempotent business logic.

The five-minute timestamp tolerance limits the acceptance window but does not prevent replay within it. Persistent deduplication remains necessary. The example verifier does not implement a web server, persistence, key rotation, or queue processing.

## Test failure paths

```sh
node --test test/signature.test.mjs
```

The tests check valid Unicode payload bytes, body tampering, wrong secrets, malformed headers, tolerance boundaries, and duplicate fields.

`timingSafeEqual` requires buffers of the same byte length. Validating the 64-character hexadecimal digest produces a 32-byte buffer to match the SHA-256 digest. This comparison alone does not guarantee that surrounding application code is timing-safe. See [Node.js crypto documentation](https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b).

Read the [published delivery and retry guide](https://emminextechdocs.com/samples/relayline-api/webhooks) for the designed retry schedule.
