const express = require('express');
const router = express.Router();
const { validateContact } = require('../middleware/validation');
const { appendToJsonFile, readJsonFile } = require('../middleware/fileManager');

router.post('/', validateContact, async (req, res) => {
  try {
    const saved = await appendToJsonFile('contacts.json', req.body);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success:false, message: 'Error saving contact' });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await readJsonFile('contacts.json');
    res.json({ success: true, total: data.length, data });
  } catch (e) {
    res.status(500).json({ success:false, message: 'Error reading contacts' });
  }
});

module.exports = router;
