// In-memory order store (prototype only). Status flow is fixed and forward-only.
const seed = require('../data/orders.json');

const STATUS_FLOW = ['Placed', 'Confirmed', 'Out for Delivery', 'Delivered'];

const orders = seed.map((o) => ({ ...o, history: [...o.history] }));

function findById(id) {
  return orders.find((o) => o.id === Number(id));
}

function nextStatus(current) {
  const i = STATUS_FLOW.indexOf(current);
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}

function advance(id) {
  const order = findById(id);
  if (!order) return { error: 'Order not found', code: 404 };
  const next = nextStatus(order.status);
  if (!next) return { error: `Order is already ${order.status}`, code: 409 };
  order.status = next;
  order.history.push({ status: next, at: new Date().toISOString() });
  return { order };
}

module.exports = { STATUS_FLOW, findById, advance };
