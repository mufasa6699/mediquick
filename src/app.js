const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'mediquick' });
});

app.use('/api/auth', authRoutes);

module.exports = app;
