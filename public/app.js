// MediQuick frontend – medicine search (MOPDS-16)
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const status = document.getElementById('search-status');
const list = document.getElementById('results');

async function search(q) {
  status.textContent = 'Searching…';
  list.innerHTML = '';
  const res = await fetch(`/api/medicines?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  status.textContent = data.count ? `${data.count} result(s)` : 'No medicines found';
  for (const m of data.results) {
    const li = document.createElement('li');
    li.className = 'card' + (m.inStock ? '' : ' out');
    li.dataset.id = m.id;
    li.innerHTML = `
      <div class="card-main">
        <strong>${m.name}</strong>
        <span class="muted">${m.category} · ${m.pharmacy}</span>
      </div>
      <div class="card-side">
        <span class="price">Rs ${m.price}</span>
        <span class="badge">${m.inStock ? 'In stock' : 'Out of stock'}</span>
        ${m.prescriptionRequired ? '<span class="badge rx">Rx required</span>' : ''}
      </div>`;
    list.appendChild(li);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  search(input.value.trim());
});

search('');

// ---- Cart & checkout (MOPDS-18) ----
const cart = new Map();
const cartList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutForm = document.getElementById('checkout-form');
const checkoutStatus = document.getElementById('checkout-status');

function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  for (const [id, line] of cart) {
    total += line.qty * line.price;
    const li = document.createElement('li');
    li.className = 'card';
    li.innerHTML = `<div class="card-main"><strong>${line.name}</strong><span class="muted">Rs ${line.price} × ${line.qty}</span></div>
      <div class="card-side"><button data-remove="${id}" class="link">Remove</button></div>`;
    cartList.appendChild(li);
  }
  cartTotal.textContent = cart.size ? `Total: Rs ${total}` : 'Cart is empty';
}

list.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const { add: id, name, price } = btn.dataset;
  const line = cart.get(id) || { medicineId: Number(id), name, price: Number(price), qty: 0 };
  line.qty += 1;
  cart.set(id, line);
  renderCart();
});

cartList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]');
  if (btn) { cart.delete(btn.dataset.remove); renderCart(); }
});

// add an "Add to cart" button to each search result card
const originalSearch = search;
search = async function (q) {
  await originalSearch(q);
  document.querySelectorAll('#results .card').forEach((card, i) => {
    const name = card.querySelector('strong').textContent;
    const price = card.querySelector('.price').textContent.replace('Rs ', '');
    if (card.classList.contains('out')) return;
    const b = document.createElement('button');
    b.textContent = 'Add to cart';
    b.className = 'add';
    b.dataset.add = card.dataset.id || name;
    b.dataset.name = name;
    b.dataset.price = price;
    card.querySelector('.card-side').appendChild(b);
  });
};

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  checkoutStatus.textContent = 'Placing order…';
  const items = [...cart.values()].map((l) => ({ medicineId: l.medicineId, qty: l.qty }));
  const res = await fetch('/api/checkout', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ items, paymentMethod: document.getElementById('payment-method').value }),
  });
  const data = await res.json();
  checkoutStatus.textContent = res.ok ? `Order ${data.orderId} placed. Total Rs ${data.total}` : data.errors.join(', ');
  if (res.ok) { cart.clear(); renderCart(); }
});
