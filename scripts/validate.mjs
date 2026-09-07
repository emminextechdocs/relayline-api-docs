import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDocument } from 'yaml';

const document = parseDocument(await readFile(new URL('../openapi.yaml', import.meta.url), 'utf8'), { uniqueKeys: true });
assert.equal(document.errors.length, 0, 'YAML must parse without duplicate keys');
const spec = document.toJS();
assert.equal(spec.openapi, '3.1.0');
assert.equal(spec.servers[0].url, 'https://api.relayline.example');
assert.equal(spec.components.securitySchemes.bearerAuth.type, 'http');
assert.equal(spec.components.securitySchemes.bearerAuth.scheme, 'bearer');
for (const [path, method, name] of [
  ['/v1/deliveries', 'post', 'createDelivery'],
  ['/v1/deliveries', 'get', 'listDeliveries'],
  ['/v1/deliveries/{delivery_id}', 'get', 'getDelivery'],
]) assert.equal(spec.paths[path][method].operationId, name);

function walk(value) {
  if (!value || typeof value !== 'object') return;
  if (value.$ref) {
    assert.ok(value.$ref.startsWith('#/'), 'Only local references are permitted');
    const resolved = value.$ref.slice(2).split('/').reduce((node, part) => node?.[part.replaceAll('~1', '/').replaceAll('~0', '~')], spec);
    assert.notEqual(resolved, undefined, `Unresolved reference: ${value.$ref}`);
  }
  Object.values(value).forEach(walk);
}
walk(spec);
const example = spec.paths['/v1/deliveries'].post.responses['202'].content['application/json'].example;
for (const key of spec.components.schemas.Delivery.required) assert.ok(Object.hasOwn(example, key), `Missing example field: ${key}`);
assert.ok(spec.components.schemas.DeliveryStatus.enum.includes(example.status));
assert.equal(example.attempts, 0);
assert.equal(example.completed_at, null);
console.log('Contract structure, local references, and queued response fixture passed.');
