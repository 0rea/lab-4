const http = require('http');
const url = require('url');

const PORT = 3000;

const students = [
  { id: 1, name: 'สมชาย ใจดี', major: 'วิศวกรรมคอมพิวเตอร์', year: 3 },
  { id: 2, name: 'สมศรี มีสุข', major: 'เทคโนโลยีสารสนเทศ', year: 2 },
  { id: 3, name: 'อนันต์ เก่งมาก', major: 'วิศวกรรมคอมพิวเตอร์', year: 4 },
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (pathname === '/' && method === 'GET') {
    res.end(JSON.stringify({
      message: '👋 ยินดีต้อนรับสู่ Student API (HTTP Server)',
      endpoints: ['GET /students', 'GET /students/:id', 'GET /students/major/:major']
    }));
    return;
  }

  if (pathname === '/students' && method === 'GET') {
    res.end(JSON.stringify(students));
    return;
  }

  // /students/:id
  if (pathname.startsWith('/students/') && method === 'GET') {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[1] !== 'major') {
      const id = parseInt(parts[1]);
      const student = students.find(s => s.id === id);
      if (student) {
        res.end(JSON.stringify(student));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'ไม่พบนักศึกษาที่ระบุ' }));
      }
      return;
    }
  }

  // /students/major/:major
  if (pathname.startsWith('/students/major/') && method === 'GET') {
    const parts = pathname.split('/').filter(Boolean);
    const major = decodeURIComponent(parts.slice(2).join('/'));
    const filtered = students.filter(s => s.major.includes(major));
    res.end(JSON.stringify(filtered));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: '404 Not Found' }));
});

server.listen(PORT, () => {
  console.log(`🌐 HTTP Server running on http://localhost:${PORT}`);
  console.log('Available endpoints: GET /, GET /students, GET /students/:id, GET /students/major/:major');
});
