const ipSubmitTimes = new Map();
const RATE_LIMIT_MS = 60000;

function sanitize(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // IP-based rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const last = ipSubmitTimes.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute before trying again.' });
  }
  ipSubmitTimes.set(ip, now);

  // Honeypot check
  const botField = req.body['bot-field'];
  if (botField) {
    return res.status(200).json({ ok: true }); // Silently ignore bots
  }

  // Input validation
  const name = sanitize(req.body.name, 100);
  const business = sanitize(req.body.business, 100);
  const email = sanitize(req.body.email, 254);
  const message = sanitize(req.body.message, 2000);
  const service = sanitize(req.body.service, 100);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Send email via Resend
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Contact Form <onboarding@resend.dev>',
      to: 'contact@braylendesigns.store',
      reply_to: email,
      subject: `New contact from ${name}${business ? ` — ${business}` : ''}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        ${business ? `<p><strong>Business:</strong> ${business}</p>` : ''}
        <p><strong>Email:</strong> ${email}</p>
        ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    }),
  });

  if (!resendRes.ok) {
    const err = await resendRes.text();
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send message.' });
  }

  return res.status(200).json({ ok: true });
}
