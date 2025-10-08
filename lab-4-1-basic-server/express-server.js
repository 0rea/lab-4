const express = require('express');
const app = express();
const PORT = 3001;

const students = [
  { id: 1, name: 'สมชาย ใจดี', major: 'วิศวกรรม', year: 3 },
  { id: 2, name: 'มานี มีใจ', major: 'วิทยาการคอมพิวเตอร์', year: 2 },
  { id: 3, name: 'อนันต์ อรุณ', major: 'บริหารธุรกิจ', year: 4 }
];

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'ยินดีต้อนรับสู่ Express Server',
    endpoints: ['/students', '/students/:id', '/students/major/:major', '/stats']
  });
});

app.get('/students', (req, res) => res.json(students));

app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ error: 'ไม่พบนักศึกษา' });
  res.json(student);
});

app.get('/students/major/:major', (req, res) => {
  const major = req.params.major;
  const filtered = students.filter(s => s.major === major);
  res.json(filtered);
});

app.get('/stats', (req, res) => {
  const stats = {};
  students.forEach(s => stats[s.major] = (stats[s.major] || 0) + 1);
  res.json({ total: students.length, byMajor: stats });
});

app.use('*', (req, res) => res.status(404).json({ error: 'ไม่พบข้อมูล' }));

app.listen(PORT, () => {
  console.log(`🚀 Express Server running on http://localhost:${PORT}`);
});
