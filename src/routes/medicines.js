const express = require('express');
const medicines = require('../data/medicines.json');
const pharmacies = require('../data/pharmacies.json');

const router = express.Router();

// GET /api/medicines?q=<text>&category=<name>
router.get('/', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const category = String(req.query.category || '').trim().toLowerCase();

  const results = medicines
    .filter((m) => !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
    .filter((m) => !category || m.category.toLowerCase() === category)
    .map((m) => ({
      ...m,
      inStock: m.stock > 0,
      pharmacy: (pharmacies.find((p) => p.id === m.pharmacyId) || {}).name || 'Unknown',
    }));

  res.json({ count: results.length, results });
});

module.exports = router;
