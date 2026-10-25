// Simple in-memory user store seeded from src/data/users.json (prototype only)
const seed = require('../data/users.json');

const users = [...seed];
let nextId = users.length + 1;

function findByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

function create({ name, email, phone, password }) {
  const user = { id: nextId++, name, email, phone, password, role: 'customer', createdAt: new Date().toISOString() };
  users.push(user);
  return user;
}

function reset() {
  users.length = 0;
  nextId = 1;
}

module.exports = { findByEmail, create, reset };
