// In-memory session tokens (prototype only)
const crypto = require('crypto');

const sessions = new Map(); // token -> { userId, createdAt }

function create(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { userId, createdAt: new Date().toISOString() });
  return token;
}

function get(token) {
  return sessions.get(token) || null;
}

function revoke(token) {
  return sessions.delete(token);
}

function reset() {
  sessions.clear();
}

module.exports = { create, get, revoke, reset };
