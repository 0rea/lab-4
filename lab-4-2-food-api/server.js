const express = require('express');
const cors = require('cors');
const path = require('path');
const foodRoutes = require('./routes/foods');
const logger = require('./middleware/logger');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(logger);

app.get('/', (req, res) => {
  res.json({ message: '🍜 Welcome to Food API!', version: '1.0.0' });
});

app.use('/api/foods', foodRoutes);

app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: [
      'GET /api/foods',
      'GET /api/foods/:id',
      'GET /api/foods/category/:category',
      'GET /api/foods/random',
      'GET /api/stats'
    ]
  });
});

app.get('/api/stats', (req, res) => {
  try {
    const foods = JSON.parse(fs.readFileSync(path.join(__dirname,'data','foods.json'),'utf8'));
    const byCategory = {};
    foods.forEach(f => (byCategory[f.category] = (byCategory[f.category] || 0) + 1));
    res.json({ total: foods.length, byCategory });
  } catch (e) {
    res.status(500).json({ success:false, message: 'Error' });
  }
});

app.use('*', (req, res) => res.status(404).json({ success: false, message: 'API endpoint not found', requestedUrl: req.originalUrl }));

app.listen(PORT, () => {
  console.log(`🚀 Food API Server running on http://localhost:${PORT}`);
});
