const nodemailer = require('nodemailer');

const COLLEGE_ADMIN_EMAIL = 'yuzukijapaneseschool@gmail.com';

function createTransporter() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: user && pass ? { user, pass } : undefined,
    tls: { rejectUnauthorized: false }
  });
}

async function sendAdmissionCardEmail(studentData) {
  const {
    student_id,
    name,
    email,
    phone,
    nic_number,
    city,
    course_name,
    batch_mode,
    bank_slip_url,
    registration_type = 'Batch Admission / Student Registration'
  } = studentData;

  const currentDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Colombo',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
  const waNumber = cleanPhone.startsWith('0') ? '94' + cleanPhone.slice(1) : cleanPhone;
  const waLink = waNumber ? 'https://wa.me/' + waNumber : null;

  const htmlContent = [
    '<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">',
    '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">',
    '    <div style="background: linear-gradient(135deg, #0f172a, #881337); padding: 24px; text-align: center; color: #ffffff;">',
    '      <h2 style="margin: 0; font-size: 20px;">🌸 YUZUKI JAPAN COLLEGE</h2>',
    '      <p style="margin: 4px 0 0; font-size: 12px; color: #fda4af;">Kandy Campus Admission Card & Registration Notice</p>',
    '    </div>',
    '    <div style="padding: 20px; background: #fff1f2; text-align: center; border-bottom: 2px dashed #f43f5e;">',
    '      <span style="font-size: 11px; font-weight: bold; color: #be123c;">OFFICIAL STUDENT ID</span>',
    '      <div style="font-size: 26px; font-weight: 900; font-family: monospace; color: #0f172a; margin: 4px 0;">' + student_id + '</div>',
    '      <span style="font-size: 11px; color: #64748b;">Date: ' + currentDate + '</span>',
    '    </div>',
    '    <div style="padding: 20px;">',
    '      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 40%;">Student Name:</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">' + name + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">NIC / Passport:</td><td style="padding: 8px 0;">' + (nic_number || 'Not Provided') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Contact / WhatsApp:</td><td style="padding: 8px 0;">' + (phone || 'N/A') + (waLink ? ' (<a href="' + waLink + '" style="color: #10b981; font-weight: bold;">WhatsApp Chat</a>)' : '') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email Address:</td><td style="padding: 8px 0;"><a href="mailto:' + email + '">' + email + '</a></td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">City / Location:</td><td style="padding: 8px 0;">' + (city || 'Kandy') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Enrolled Course:</td><td style="padding: 8px 0; color: #be123c; font-weight: bold;">' + (course_name || 'Japanese Language Studies') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Delivery Mode:</td><td style="padding: 8px 0;">' + (batch_mode || 'Physical Classroom (Kandy Campus)') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Category:</td><td style="padding: 8px 0; color: #059669; font-weight: bold;">' + registration_type + '</td></tr>',
    bank_slip_url ? '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Bank Deposit Slip:</td><td style="padding: 8px 0;"><a href="' + bank_slip_url + '" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 11px;" target="_blank">View Uploaded Slip 📄</a></td></tr>' : '',
    '      </table>',
    '    </div>',
    '    <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">',
    '      🏛️ YUZUKI Japan College • Hotlines: 077 353 9800 / 071 110 9800',
    '    </div>',
    '  </div>',
    '</div>'
  ].filter(Boolean).join('\n');

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: '"YUZUKI Japan College" <' + (process.env.SMTP_USER || 'no-reply@yuzukijapancollege.edu.lk') + '>',
      to: COLLEGE_ADMIN_EMAIL,
      cc: email,
      subject: '🎓 [New Admission Card] ' + student_id + ' - ' + name + ' (' + (course_name || 'Course') + ')',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Admission card email dispatched to ' + COLLEGE_ADMIN_EMAIL + ' for ' + student_id + '. MessageId: ' + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.warn('⚠️ Admission email note for ' + COLLEGE_ADMIN_EMAIL + ':', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendAdmissionCardEmail,
  COLLEGE_ADMIN_EMAIL
};
