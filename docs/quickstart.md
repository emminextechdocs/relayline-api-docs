# Create your first delivery

This walkthrough explains the Relayline sample contract. The hostname is reserved for examples and will not accept requests. To run code locally, use the signature demonstration at the end of this guide.

## 1. Prepare a request

In a real integration, obtain a project-scoped API key and an HTTPS destination that you control. Store the key in an environment variable rather than committing it to source control.

The designed request is:

```sh
curl --fail-with-body --request POST \
  'https://api.relayline.example/v1/deliveries' \
  --header "Authorization: Bearer ${RELAYLINE_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{"destination":"https://example.com/webhooks/orders","event":"order.created","payload":{"order_id":"ord_7M2L9","total":4800,"currency":"USD"},"idempotency_key":"order-7M2L9-created"}'
```

`destination` must use HTTPS. `event` is a lowercase identifier. `payload` contains your application data. An idempotency key identifies one logical creation attempt; the sample contract retains it for 24 hours.

## 2. Interpret acceptance

The sample response is `202 Accepted`:

```json
{
  "id": "dlv_01J6Y3G8V9K2M4P7Q1R5",
  "event": "order.created",
  "status": "queued",
  "destination": "https://example.com/webhooks/orders",
  "attempts": 0,
  "created_at": "2026-09-04T14:32:18Z",
  "completed_at": null
}
```

Acceptance does not mean the destination received the event. Save `id` and retrieve `/v1/deliveries/{delivery_id}` to inspect the designed lifecycle: `queued`, `retrying`, `delivered`, or `failed`.

## 3. Handle failures deliberately

| Status | Next action |
| --- | --- |
| 400 | Correct the request using the error message. Do not retry an unchanged invalid request. |
| 401 | Check the project key and Authorization header. |
| 409 | Reused idempotency key with different data. Investigate the original operation. |
| 429 | Respect the sample contract's `Retry-After` delay. |
| 500 | Retry with a bounded policy and the same idempotency key for the same operation. |

## 4. Run a local verification example

From the repository root:

```sh
npm ci
npm test
npm run example
```

The example signs a local payload and verifies it. A changed payload must fail verification. Continue with the [webhook guide](webhooks.md), or inspect the [complete endpoint reference](https://emminextechdocs.com/samples/relayline-api/reference).
