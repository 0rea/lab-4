const validateContact = (req, res, next) => {
  const { name, email, subject, message, phone, company } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)
    errors.push('ชื่อไม่ถูกต้อง (2-100 ตัวอักษร)');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('อีเมลไม่ถูกต้อง');
  if (!subject || subject.trim().length < 5 || subject.trim().length > 200)
    errors.push('หัวเรื่องไม่ถูกต้อง (5-200 ตัวอักษร)');
  if (!message || message.trim().length < 10 || message.trim().length > 1000)
    errors.push('ข้อความไม่ถูกต้อง (10-1000 ตัวอักษร)');
  if (phone && !/^[0-9]{9,10}$/.test(phone))
    errors.push('เบอร์โทรไม่ถูกต้อง (9-10 ตัวเลข)');
  if (company && company.length > 100)
    errors.push('ชื่อบริษัทต้องไม่เกิน 100 ตัวอักษร');

  if (errors.length > 0) return res.status(400).json({ success: false, errors });

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.subject = subject.trim();
  req.body.message = message.trim();
  next();
};

const validateFeedback = (req, res, next) => {
  const { rating, comment, email } = req.body;
  const errors = [];

  if (rating == null || isNaN(rating) || rating < 1 || rating > 5)
    errors.push('คะแนนต้องเป็นตัวเลข 1-5');
  if (!comment || comment.trim().length < 5 || comment.trim().length > 500)
    errors.push('ความคิดเห็นต้องมีความยาว 5-500 ตัวอักษร');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('อีเมลไม่ถูกต้อง');

  if (errors.length > 0) return res.status(400).json({ success: false, errors });
  req.body.comment = comment.trim();
  next();
};

module.exports = { validateContact, validateFeedback };
