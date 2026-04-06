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
      from: 'DOS KILOS <info@doskilos.com>',
      to: 'info@doskilos.com',
      subject: `New enquiry: ${subject}`,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #2E1F0F;">
          <div style="padding: 32px 0; border-bottom: 1px solid #E8E4DC;">
            <svg width="28" height="24" viewBox="0 0 90 80" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="38" r="24" fill="#2E1F0F"/>
              <circle cx="64" cy="48" r="15" fill="#E8920A"/>
            </svg>
          </div>
          <div style="padding: 32px 0;">
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #A89880; margin: 0 0 24px;">New enquiry</p>
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0 0 8px;"><strong>Interested in:</strong> ${subject}</p>
            <p style="margin: 24px 0 8px;"><strong>Message:</strong></p>
            <p style="margin: 0; line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    });

    // Confirmation to sender
    await resend.emails.send({
      from: 'DOS KILOS <info@doskilos.com>',
      to: email,
      subject: 'We received your message',
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #2E1F0F;">
          <div style="padding: 32px 0; border-bottom: 1px solid #E8E4DC;">
            <svg width="28" height="24" viewBox="0 0 90 80" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="38" r="24" fill="#2E1F0F"/>
              <circle cx="64" cy="48" r="15" fill="#E8920A"/>
            </svg>
          </div>
          <div style="padding: 32px 0;">
            <p style="font-size: 15px; line-height: 1.7; margin: 0 0 20px;">Hi ${name},</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0 0 20px;">Thank you for reaching out. We've received your message and will get back to you soon.</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0;">DOS KILOS</p>
          </div>
          <div style="padding: 24px 0; border-top: 1px solid #E8E4DC;">
            <p style="font-size: 11px; letter-spacing: 1px; color: #A89880; margin: 0;">doskilos.com</p>
          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
