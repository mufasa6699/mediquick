const express = require('express');
const medicines = require('../data/medicines.json');

const router = express.Router();
const PAYMENT_METHODS = ['Card', 'COD'];
let nextOrderId = 2001;

// POST /api/checkout  { items: [{ medicineId, qty }], paymentMethod }
router.post('/', (req, res) => {
  const { items, paymentMethod } = req.body || {};
  const errors = [];
  if (!Array.isArray(items) || items.length === 0) errors.push('Cart is empty');
  if (!PAYMENT_METHODS.includes(paymentMethod)) errors.push('Payment method must be Card or COD');

  const lines = [];
  for (const it of items || []) {
    const m = medicines.find((x) => x.id === Number(it.medicineId));
    if (!m) { errors.push(`Unknown medicine ${it.medicineId}`); continue; }
    const qty = Number(it.qty) || 0;
    if (qty < 1) errors.push(`Quantity for ${m.name} must be at least 1`);
    if (qty > m.stock) errors.push(`Only ${m.stock} of ${m.name} in stock`);
    if (m.prescriptionRequired && !it.prescriptionId) errors.push(`${m.name} requires an approved prescription`);
    lines.push({ medicineId: m.id, name: m.name, qty, price: m.price, subtotal: qty * m.price });
  }
  if (errors.length) return res.status(400).json({ errors });

  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  return res.status(201).json({ orderId: nextOrderId++, status: 'Placed', paymentMethod, items: lines, total });
});

module.exports = router;
