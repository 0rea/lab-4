const contactForm = document.getElementById('contactForm');
const feedbackForm = document.getElementById('feedbackForm');
const statusDiv = document.getElementById('status');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(contactForm).entries());
  try {
    const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    const json = await res.json();
    statusDiv.textContent = JSON.stringify(json);
    contactForm.reset();
  } catch (err) {
    statusDiv.textContent = 'Error: ' + err.message;
  }
});

feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(feedbackForm).entries());
  data.rating = Number(data.rating);
  try {
    const res = await fetch('/api/feedback', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    const json = await res.json();
    statusDiv.textContent = JSON.stringify(json);
    feedbackForm.reset();
  } catch (err) {
    statusDiv.textContent = 'Error: ' + err.message;
  }
});
