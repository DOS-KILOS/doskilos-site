import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Email to you
    await resend.emails.send({
      from: 'DOS KILOS <studio@doskilos.com>',
      to: 'info@doskilos.com',
      subject: `New enquiry: ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interested in:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    // Confirmation to sender
    await resend.emails.send({
      from: 'DOS KILOS <studio@doskilos.com>',
      to: email,
      subject: 'We received your message',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out. We've received your message and will get back to you soon.</p>
        <p>DOS KILOS</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
