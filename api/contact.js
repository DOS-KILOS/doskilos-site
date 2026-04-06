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

  var lockupHtml = '<a href="https://www.doskilos.com" style="display:block;background:#2E1F0F;padding:20px 40px;text-decoration:none;">' +
    '<div style="display:inline-block;position:relative;width:32px;height:25px;vertical-align:middle;margin-right:14px;">' +
    '<div style="width:19px;height:19px;border-radius:50%;background:#F5F0E8;position:absolute;top:0;left:0;"></div>' +
    '<div style="width:12px;height:12px;border-radius:50%;background:#E8920A;position:absolute;top:8px;left:17px;"></div>' +
    '</div>' +
    '<span style="font-family:Helvetica,Arial,sans-serif;font-weight:700;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#F5F0E8;vertical-align:middle;">DOS KILOS</span>' +
    '</a>';

  try {
    await resend.emails.send({
      from: 'DOS KILOS <info@doskilos.com>',
      to: 'info@doskilos.com',
      subject: 'New enquiry: ' + subject,
      html: '<div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;background:#F5F0E8;">' +
        '<div style="padding:40px 40px 32px;">' +
        '<p style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#A89880;margin:0 0 28px;">New enquiry (' + (isNL ? 'NL' : 'EN') + ')</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 4px;color:#2E1F0F;">' + name + '</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 4px;color:#A89880;">' + email + '</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 24px;color:#A89880;">' + subject + '</p>' +
        '<div style="padding-top:20px;border-top:1px solid #D6B588;">' +
        '<p style="font-size:15px;line-height:1.75;margin:0;color:#2E1F0F;">' + message.replace(/\n/g, '<br>') + '</p>' +
        '</div></div>' + lockupHtml + '</div>'
    });

    await resend.emails.send({
      from: 'DOS KILOS <info@doskilos.com>',
      to: email,
      subject: isNL ? 'We hebben je bericht ontvangen' : 'We received your message',
      html: '<div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;background:#F5F0E8;">' +
        '<div style="padding:40px 40px 32px;">' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 20px;color:#2E1F0F;">Hi ' + name + ',</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 20px;color:#2E1F0F;">' +
        (isNL
          ? 'Bedankt voor je bericht. We lezen het rustig door en nemen zo snel mogelijk contact met je op.'
          : "Thank you for your message. We'll read it carefully and get back to you.") +
        '</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0 0 20px;color:#2E1F0F;">' +
        (isNL
          ? 'Mocht je in de tussentijd nog iets te binnen schieten, reageer gerust op deze mail.'
          : 'In the meantime, if anything else comes to mind, feel free to reply to this email.') +
        '</p>' +
        '<p style="font-size:15px;line-height:1.75;margin:0;color:#2E1F0F;">DOS KILOS</p>' +
        '</div>' + lockupHtml + '</div>'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
