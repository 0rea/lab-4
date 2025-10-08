const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const contactRoutes = require('./routes/contact');
const feedbackRoutes = require('./routes/feedback');
const { getFileStats } = require('./middleware/fileManager');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({ windowMs: 15*60*1000, max: 10, message: { success:false, message:'Too many requests' } });

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', limiter);

app.get('/', (req, res) => res.sendFile(path.join(__dirname,'public','index.html')));

app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Contact Form API',
    endpoints: {
      'POST /api/contact': 'บันทึกข้อมูลติดต่อ',
      'GET /api/contact': 'ดึงข้อมูลติดต่อทั้งหมด',
      'POST /api/feedback': 'บันทึก feedback',
      'GET /api/feedback/stats': 'สถิติ feedback',
      'GET /api/status': 'สถานะ API และจำนวนข้อมูล'
    }
  });
});

app.get('/api/status', async (req, res) => {
  const stats = await getFileStats();
  res.json({ success: true, ...stats });
});

app.use('*', (req, res) => res.status(404).json({ success:false, message:'Endpoint not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success:false, message:'Internal server error' });
});

app.listen(PORT, () => console.log(`🚀 Contact Form API running on http://localhost:${PORT}`));
