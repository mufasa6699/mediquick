const orderRoutes = require('./routes/orders');
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');

const medicineRoutes = require('./routes/medicines');

const checkoutRoutes = require('./routes/checkout');

const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/login'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'mediquick' });
});

app.use('/api/auth', authRoutes);

app.use('/api/medicines', medicineRoutes);

app.use('/api/checkout', checkoutRoutes);

module.exports = app;
