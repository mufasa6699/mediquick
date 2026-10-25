const orderRoutes = require('./routes/orders');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/login'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'mediquick' });
});

module.exports = app;
