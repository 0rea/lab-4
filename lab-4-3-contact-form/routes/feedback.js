const express = require('express');
const router = express.Router();
const { validateFeedback } = require('../middleware/validation');
const { appendToJsonFile, readJsonFile } = require('../middleware/fileManager');

router.post('/', validateFeedback, async (req, res) => {
  try {
    const saved = await appendToJsonFile('feedback.json', req.body);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success:false, message: 'Error saving feedback' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const feedbacks = await readJsonFile('feedback.json');
    const total = feedbacks.length;
    const avg = total ? (feedbacks.reduce((s,f)=>s + (Number(f.rating)||0),0)/total).toFixed(2) : 0;
    res.json({ success: true, total, avgRating: Number(avg) });
  } catch (e) {
    res.status(500).json({ success:false, message: 'Error reading feedback' });
  }
});

module.exports = router;
