const express = require('express');
const sessions = require('../store/sessions');

const router = express.Router();

// Demo accounts for the prototype until registration and login share one store
const DEMO_USERS = [
  { id: 1, name: 'Demo Customer', email: 'customer@mediquick.test', password: 'customer123', role: 'customer' },
  { id: 2, name: 'Demo Pharmacist', email: 'pharmacist@mediquick.test', password: 'pharma123', role: 'pharmacist' },
];

function findUser(email, password) {
  return DEMO_USERS.find((u) => u.email === String(email).toLowerCase() && u.password === password);
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = findUser(email, password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  const token = sessions.create(user.id);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// POST /api/auth/logout  (Authorization: Bearer <token>)
router.post('/logout', (req, res) => {
  const token = bearer(req);
  if (!token || !sessions.get(token)) return res.status(401).json({ error: 'Not logged in' });
  sessions.revoke(token);
  return res.json({ message: 'Logged out' });
});

// GET /api/auth/me  -> protected route example
router.get('/me', (req, res) => {
  const token = bearer(req);
  const session = token && sessions.get(token);
  if (!session) return res.status(401).json({ error: 'Login required' });
  const user = DEMO_USERS.find((u) => u.id === session.userId);
  return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

function bearer(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}

module.exports = router;
