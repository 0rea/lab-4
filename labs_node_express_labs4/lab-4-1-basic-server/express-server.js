const express = require('express');
const app = express();
const PORT = 3001;

const students = [
  { id: 1, name: 'สมชาย ใจดี', major: 'วิศวกรรมคอมพิวเตอร์', year: 3 },
  { id: 2, name: 'สมศรี มีสุข', major: 'เทคโนโลยีสารสนเทศ', year: 2 },
  { id: 3, name: 'อนันต์ เก่งมาก', major: 'วิศวกรรมคอมพิวเตอร์', year: 4 },
];

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '👋 ยินดีต้อนรับสู่ Student API (Express.js)',
    endpoints: ['GET /students','GET /students/:id','GET /students/major/:major','GET /stats']
  });
});

app.get('/students', (req, res) => {
  res.json(students);
});

app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  if (student) res.json(student);
  else res.status(404).json({ message: 'ไม่พบนักศึกษา' });
});

app.get('/students/major/:major', (req, res) => {
  const major = req.params.major;
  const filtered = students.filter(s => s.major.includes(major));
  res.json(filtered);
});

app.get('/stats', (req, res) => {
  const total = students.length;
  const byMajor = {};
  students.forEach(s => { byMajor[s.major] = (byMajor[s.major] || 0) + 1; });
  res.json({ total, byMajor });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'ไม่พบเส้นทางที่ร้องขอ' });
});

app.listen(PORT, () => {
  console.log(`🚀 Express Server running on http://localhost:${PORT}`);
});
