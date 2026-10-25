const express = require('express');
const users = require('../store/users');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{10,13}$/;

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body || {};
  const errors = [];

  if (!name || name.trim().length < 2) errors.push('Name is required');
  if (!email || !EMAIL_RE.test(email)) errors.push('A valid email is required');
  if (!phone || !PHONE_RE.test(phone)) errors.push('A valid phone number is required');
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  if (password !== confirmPassword) errors.push('Passwords do not match');

  if (errors.length) return res.status(400).json({ errors });
  if (users.findByEmail(email)) return res.status(409).json({ errors: ['Email is already registered'] });

  const user = users.create({ name: name.trim(), email: email.toLowerCase(), phone, password });
  return res.status(201).json({
    message: 'Registration successful. A confirmation email has been sent.',
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
});

module.exports = router;
