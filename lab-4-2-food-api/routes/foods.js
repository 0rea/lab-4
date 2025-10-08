const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FOODS_FILE = path.join(__dirname, '../data/foods.json');

const loadFoods = () => {
  try {
    const data = fs.readFileSync(FOODS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

router.get('/', (req, res) => {
  try {
    let foods = loadFoods();
    const { search, category, maxSpicy, vegetarian, available, maxPrice } = req.query;

    if (search) {
      const q = search.toLowerCase();
      foods = foods.filter(f => (f.name || '').toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q));
    }
    if (category) foods = foods.filter(f => f.category === category);
    if (maxSpicy) foods = foods.filter(f => f.spicyLevel <= parseInt(maxSpicy));
    if (vegetarian) foods = foods.filter(f => f.vegetarian === (vegetarian === 'true'));
    if (available) foods = foods.filter(f => f.available === (available === 'true'));
    if (maxPrice) foods = foods.filter(f => f.price <= parseInt(maxPrice));

    res.json({ success: true, data: foods, total: foods.length, filters: { search, category, maxSpicy, vegetarian, available, maxPrice } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching foods' });
  }
});

router.get('/:id', (req, res) => {
  const foods = loadFoods();
  const food = foods.find(f => f.id === parseInt(req.params.id));
  if (!food) return res.status(404).json({ success: false, message: 'ไม่พบเมนู' });
  res.json({ success: true, data: food });
});

router.get('/category/:category', (req, res) => {
  const foods = loadFoods();
  const result = foods.filter(f => f.category === req.params.category);
  res.json({ success: true, data: result });
});

router.get('/random', (req, res) => {
  const foods = loadFoods();
  const random = foods[Math.floor(Math.random() * foods.length)];
  res.json({ success: true, data: random });
});

module.exports = router;
