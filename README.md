# Relayline API documentation

A documentation sample by [Emminex Techdocs](https://emminextechdocs.com) for an event-delivery API. Explore a complete developer journey from creating a delivery to handling signed webhooks and recovering from errors.

**[Read the published documentation](https://emminextechdocs.com/samples/relayline-api)**

## Start here

| Resource | What it demonstrates |
| --- | --- |
| [Quickstart](docs/quickstart.md) | First request, expected response, and local verification |
| [OpenAPI contract](openapi.yaml) | Request schemas, responses, authentication, pagination, and webhooks |
| [Webhook guide](docs/webhooks.md) | Raw-body signature verification and failure-path tests |
| [Documentation map](docs/documentation-map.md) | Task-based navigation, content ownership, and release checks |
| [Validation](scripts/validate.mjs) | Contract structure, local references, and example consistency |

Relayline is a demonstration project. The `.example` API hostname is not a hosted service. The examples below run locally without accounts, credentials, or network calls.

## Run the examples

Prerequisites: Node.js 22 or 24 and npm.

```sh
npm ci
npm test
npm run example
```

Expected final example output:

```text
Signature accepted: true
Tampered body accepted: false
```

Tests cover valid and malformed signatures, body tampering, stale timestamps, wrong secrets, and response-contract fixtures. The structural validator is intentionally not a complete OpenAPI conformance validator.

## Scope

The specification describes a designed API contract, not an operational delivery service. This repository does not implement a delivery queue, durable deduplication, rate limiting, or a hosted API. The documentation explains these concepts without claiming production results.

The website remains the source of truth for the published guide pages. `openapi.yaml` is a reviewed snapshot of its [published contract](https://emminextechdocs.com/samples/relayline-openapi.yaml). Update both in the same release; see the [maintenance checklist](docs/documentation-map.md#release-checklist).

## Contribute

Run `npm test`, describe the reader problem, and provide sources for technical changes. See [contribution guidance](https://github.com/emminextechdocs/.github/blob/main/CONTRIBUTING.md).

## License

This repository's original code, documentation, and templates are available under the [MIT License](LICENSE). You may use, modify, and redistribute them, including commercially, provided you retain the copyright and license notice.

This license does not grant trademark rights to the Emminex Techdocs name or logo, or license content on linked websites. Third-party material retains its own license.
