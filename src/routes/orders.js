const express = require('express');
const orders = require('../store/orders');

const router = express.Router();

function trackingView(order) {
  const currentIndex = orders.STATUS_FLOW.indexOf(order.status);
  return {
    orderId: order.id,
    status: order.status,
    total: order.total,
    paymentMethod: order.paymentMethod,
    steps: orders.STATUS_FLOW.map((status, i) => ({
      status,
      reached: i <= currentIndex,
      at: (order.history.find((h) => h.status === status) || {}).at || null,
    })),
  };
}

// GET /api/orders/:id/tracking  -> current status and timeline
router.get('/:id/tracking', (req, res) => {
  const order = orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(trackingView(order));
});

// POST /api/orders/:id/advance  -> move to the next status (pharmacy / rider action)
router.post('/:id/advance', (req, res) => {
  const result = orders.advance(req.params.id);
  if (result.error) return res.status(result.code).json({ error: result.error });
  return res.json(trackingView(result.order));
});

module.exports = router;
