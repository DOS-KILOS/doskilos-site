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

  var lockupHtml = '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>' +
    '<td bgcolor="#2E1F0F" style="background-color:#2E1F0F;padding:20px 40px;">' +
    '<a href="https://www.doskilos.com" style="text-decoration:none;">' +
    '<table border="0" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="padding-right:14px;" valign="middle">' +
    '<table border="0" cellpadding="0" cellspacing="0" style="width:32px;height:25px;">' +
    '<tr><td style="width:32px;height:25px;position:relative;">' +
    '<div style="width:19px;height:19px;border-radius:50%;background-color:#F5F0E8;position:absolute;top:0;left:0;"></div>' +
    '<div style="width:12px;height:12px;border-radius:50%;background-color:#E8920A;position:absolute;top:8px;left:17px;"></div>' +
    '</td></tr></table>' +
    '</td>' +
    '<td valign="middle" style="font-family:Helvetica,Arial,sans-serif;font-weight:700;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#F5F0E8;">DOS KILOS</td>' +
    '</tr></table>' +
    '</a></td></tr></table>';

  function wrap(bodyContent) {
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"></head>' +
    '<body style="margin:0;padding:0;background-color:#F5F0E8;" bgcolor="#F5F0E8">' +
    '<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F5F0E8" style="background-color:#F5F0E8;">' +
    '<tr><td align="center">' +
    '<table width="520" border="0" cellpadding="0" cellspacing="0" bgcolor="#F5F0E8" style="background-color:#F5F0E8;max-width:520px;">' +
    '<tr><td bgcolor="#F5F0E8" style="background-color:#F5F0E8;padding:40px 40px 32px;">' +
    bodyContent +
    '</td></tr>' +
    '<tr><td style="padding:0;">' + lockupHtml + '</td></tr>' +
    '</table>' +
    '</td></tr></table>' +
    '</body></html>';
  }

  try {
    await resend.emails.send({
      from: 'DOS KILOS <info@doskilos.com>',
      to: 'info@doskilos.com',
      subject: 'New enquiry: ' + subject,
      html: wrap(
        '<p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#A89880;margin:0 0 28px;">New enquiry (' + (isNL ? 'NL' : 'EN') + ')</p>' +
        '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;margin:0 0 4px;color:#2E1F0F;">' + name + '</p>' +
        '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;margin:0 0 4px;color:#A89880;">' + email + '</p>' +
        '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;margin:0 0 24px;color:#A89880;">' + subject + '</p>' +
        '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #D6B588;padding-top:20px;">' +
        '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;margin:0;color:#2E1F0F;">' + message.replace(/\n/g, '<br>') + '</p>' +
        '</td></tr></table>'
      )
    });

    await resend.emails.send({
      from: 'DOS KILOS <info@doskilos.com>',
      to: email,
      subject: isNL ? 'We hebben je bericht ontvangen' : 'We received your message',
      html: wrap(
        '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;margin:0 0 20px;color:#2E1F0F;">Hi ' + name + ',</p>' +
        '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;margin:0 0 20px;color:#2E1F0F;">' +
        (isNL
          ? 'Bedankt voor je bericht. We lezen het rustig door en nemen zo snel mogelijk contact met je op.'
          : "Thank you for your message. We'll read it carefully and get back to you.") +
        '</p>' +
        '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.75;margin:0;color:#2E1F0F;">' +
        (isNL
          ? 'Mocht je in de tussentijd nog iets te binnen schieten, reageer gerust op deze mail.'
          : 'In the meantime, if anything else comes to mind, feel free to reply to this email.') +
        '</p>'
      )
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
