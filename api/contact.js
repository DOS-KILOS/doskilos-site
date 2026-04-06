const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message, lang } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const isNL = lang === 'nl';

  try {
    await resend.emails.send({
      from: 'DOS KILOS <info@doskilos.com>',
      to: 'info@doskilos.com',
      subject: 'New enquiry: ' + subject,
      html: '<div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px;background:#F5F0E8;">' +
        '<p style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#A89880;margin:0 0 28px;">New enquiry (' + (isNL ? 'NL' : 'EN') + ')</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 4px;color:#2E1F0F;">' + name + '</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 4px;color:#A89880;">' + email + '</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 24px;color:#A89880;">' + subject + '</p>' +
        '<div style="padding-top:20px;border-top:1px solid #D6B588;">' +
        '<p style="font-size:15px;line-height:1.75;margin:0;color:#2E1F0F;">' + message.replace(/\n/g, '<br>') + '</p>' +
        '</div></div>'
    });

    await resend.emails.send({
      from: 'DOS KILOS <info@doskilos.com>',
      to: email,
      subject: isNL ? 'Ik heb je bericht ontvangen' : 'I received your message',
      html: '<div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px;background:#F5F0E8;">' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 20px;color:#2E1F0F;">Hi ' + name + ',</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 20px;color:#2E1F0F;">' +
        (isNL
          ? 'Bedankt voor je bericht. Ik lees het rustig door en neem zo snel mogelijk contact met je op.'
          : "Thank you for your message. I'll read it carefully and get back to you.") +
        '</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 20px;color:#2E1F0F;">' +
        (isNL
          ? 'Mocht je in de tussentijd nog iets te binnen schieten, reageer gerust op deze mail.'
          : 'In the meantime, if anything else comes to mind, feel free to reply to this email.') +
        '</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 24px;color:#2E1F0F;">Nacho de Andr\u00e9s</p>' +
        '<a href="https://www.doskilos.com" style="text-decoration:none;color:#2E1F0F;">' +
        '<img src="https://www.doskilos.com/lockup.png" alt="DOS KILOS" width="160" style="display:block;border:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:3px;color:#2E1F0F;" />' +
        '</a></div>'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
