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

async function login(base, email, password) {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }),
  });
  return { status: res.status, body: await res.json() };
}

test('valid credentials return a token', withServer(async (base) => {
  const { status, body } = await login(base, 'customer@mediquick.test', 'customer123');
  assert.strictEqual(status, 200);
  assert.ok(body.token);
  assert.strictEqual(body.user.role, 'customer');
}));

test('invalid credentials return 401', withServer(async (base) => {
  const { status } = await login(base, 'customer@mediquick.test', 'wrong');
  assert.strictEqual(status, 401);
}));

test('logout revokes the token', withServer(async (base) => {
  const { body } = await login(base, 'customer@mediquick.test', 'customer123');
  const auth = { authorization: `Bearer ${body.token}` };
  let res = await fetch(`${base}/api/auth/me`, { headers: auth });
  assert.strictEqual(res.status, 200);
  res = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: auth });
  assert.strictEqual(res.status, 200);
  res = await fetch(`${base}/api/auth/me`, { headers: auth });
  assert.strictEqual(res.status, 401);
}));
