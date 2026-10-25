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
