const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const users = require('../src/store/users');

function withServer(fn) {
  return async () => {
    const server = app.listen(0);
    const base = `http://localhost:${server.address().port}`;
    try { await fn(base); } finally { server.close(); }
  };
}

const valid = { name: 'Ali Khan', email: 'ali@example.com', phone: '03001234567', password: 'secret123', confirmPassword: 'secret123' };

async function post(base, body) {
  const res = await fetch(`${base}/api/auth/register`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

test.beforeEach(() => users.reset());

test('registers a new user', withServer(async (base) => {
  const { status, body } = await post(base, valid);
  assert.strictEqual(status, 201);
  assert.strictEqual(body.user.email, 'ali@example.com');
  assert.ok(!('password' in body.user));
}));

test('rejects duplicate email', withServer(async (base) => {
  await post(base, valid);
  const { status, body } = await post(base, { ...valid, name: 'Other' });
  assert.strictEqual(status, 409);
  assert.deepStrictEqual(body.errors, ['Email is already registered']);
}));

test('rejects mismatched passwords and bad email', withServer(async (base) => {
  const { status, body } = await post(base, { ...valid, email: 'nope', confirmPassword: 'different' });
  assert.strictEqual(status, 400);
  assert.ok(body.errors.includes('Passwords do not match'));
  assert.ok(body.errors.includes('A valid email is required'));
}));
