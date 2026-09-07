# Documentation map and maintenance

| Developer task | Published page | Review focus |
| --- | --- | --- |
| Make a first request | [Quickstart](https://emminextechdocs.com/samples/relayline-api) | Prerequisites, request, expected output, next step |
| Understand the model | [Concepts](https://emminextechdocs.com/samples/relayline-api/concepts) | Delivery lifecycle and idempotency boundaries |
| Authenticate | [Authentication](https://emminextechdocs.com/samples/relayline-api/authentication) | Key handling and project scope |
| Implement an operation | [Reference](https://emminextechdocs.com/samples/relayline-api/reference) | Schema, parameters, status codes, pagination |
| Receive events | [Webhooks](https://emminextechdocs.com/samples/relayline-api/webhooks) | Raw bytes, signatures, durable acceptance, replay |
| Recover from failure | [Errors and limits](https://emminextechdocs.com/samples/relayline-api/errors) | Retry decisions and actionable errors |

## Release checklist

- [ ] Describe the contract or reader-task change in a pull request.
- [ ] Update the website contract and this repository's `openapi.yaml` together.
- [ ] Compare both specifications before releasing; do not overwrite either without reviewing differences.
- [ ] Update affected guides and examples, including failure responses.
- [ ] Run `npm ci`, `npm test`, and `npm run example`.
- [ ] Confirm GitHub Actions passes on the release commit.
- [ ] Check published links and remove any private information from screenshots.

Emminex maintains the sample. Report discrepancies as issues, identifying both the page URL and repository commit. No automated tool should silently change the API contract to resolve drift.
