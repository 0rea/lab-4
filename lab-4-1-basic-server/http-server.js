const http = require('http');
const url = require('url');

const PORT = 3000;

const students = [
  { id: 1, name: 'สมชาย ใจดี', major: 'วิศวกรรม', year: 3 },
  { id: 2, name: 'มานี มีใจ', major: 'วิทยาการคอมพิวเตอร์', year: 2 },
  { id: 3, name: 'อนันต์ อรุณ', major: 'บริหารธุรกิจ', year: 4 }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (pathname === '/' && method === 'GET') {
    res.end(JSON.stringify({
      message: 'ยินดีต้อนรับสู่ HTTP Server',
      endpoints: ['/students', '/students/:id', '/students/major/:major']
    }));
    return;
  }

  if (pathname === '/students' && method === 'GET') {
    res.end(JSON.stringify(students));
    return;
  }

  if (pathname.startsWith('/students/major/')) {
    const major = decodeURIComponent(pathname.split('/')[3] || '');
    const filtered = students.filter(s => s.major === major);
    res.end(JSON.stringify(filtered));
    return;
  }

  if (pathname.startsWith('/students/')) {
    const id = parseInt(pathname.split('/')[2]);
    const found = students.find(s => s.id === id);
    if (found) {
      res.end(JSON.stringify(found));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'ไม่พบนักศึกษา' }));
    }
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`🌐 HTTP Server running on http://localhost:${PORT}`);
  console.log('Available endpoints: GET /, GET /students, GET /students/:id, GET /students/major/:major');
});
