const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

function withServer(fn) {
  return async () => {
    const server = app.listen(0);
    const base = `http://localhost:${server.address().port}`;
    try { await fn(base); } finally { server.close(); }
  };
}

test('returns tracking timeline for an existing order', withServer(async (base) => {
  const res = await fetch(`${base}/api/orders/1001/tracking`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.status, 'Out for Delivery');
  assert.deepStrictEqual(body.steps.map((s) => s.reached), [true, true, true, false]);
}));

test('advances status forward only and stops at Delivered', withServer(async (base) => {
  let res = await fetch(`${base}/api/orders/1001/advance`, { method: 'POST' });
  let body = await res.json();
  assert.strictEqual(body.status, 'Delivered');
  res = await fetch(`${base}/api/orders/1001/advance`, { method: 'POST' });
  assert.strictEqual(res.status, 409);
}));

test('unknown order returns 404', withServer(async (base) => {
  const res = await fetch(`${base}/api/orders/9999/tracking`);
  assert.strictEqual(res.status, 404);
}));
