const nodemailer = require('nodemailer');

const COLLEGE_ADMIN_EMAIL = 'yuzukijapaneseschool@gmail.com';

function createTransporter() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER || 'yuzukijapaneseschool@gmail.com';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || 'oqfa bqhv xael slty';

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
}

function getAdminEmailHtml(data, currentDate, waLink) {
  const { student_id, name, email, phone, nic_number, city, course_name, batch_mode, bank_slip_url, registration_type } = data;

  return [
    '<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">',
    '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">',
    '    <div style="background: linear-gradient(135deg, #0f172a, #881337); padding: 24px; text-align: center; color: #ffffff;">',
    '      <h2 style="margin: 0; font-size: 20px;">🌸 YUZUKI JAPAN COLLEGE</h2>',
    '      <p style="margin: 4px 0 0; font-size: 12px; color: #fda4af;">Campus Admin Notification • New Student Admission</p>',
    '    </div>',
    '    <div style="padding: 20px; background: #fff1f2; text-align: center; border-bottom: 2px dashed #f43f5e;">',
    '      <span style="font-size: 11px; font-weight: bold; color: #be123c;">OFFICIAL STUDENT ID ASSIGNED</span>',
    '      <div style="font-size: 28px; font-weight: 900; font-family: monospace; color: #0f172a; margin: 4px 0;">' + student_id + '</div>',
    '      <span style="font-size: 11px; color: #64748b;">Registration Date: ' + currentDate + '</span>',
    '    </div>',
    '    <div style="padding: 20px;">',
    '      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 40%;">Student Name:</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">' + name + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">NIC / Passport:</td><td style="padding: 8px 0;">' + (nic_number || 'Not Provided') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Contact Number:</td><td style="padding: 8px 0;">' + (phone || 'N/A') + (waLink ? ' (<a href="' + waLink + '" style="color: #10b981; font-weight: bold;" target="_blank">Chat on WhatsApp</a>)' : '') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email Address:</td><td style="padding: 8px 0;"><a href="mailto:' + email + '">' + email + '</a></td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">City / Location:</td><td style="padding: 8px 0;">' + (city || 'Kandy') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Enrolled Course:</td><td style="padding: 8px 0; color: #be123c; font-weight: bold;">' + (course_name || 'Japanese Language Studies') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Delivery Mode:</td><td style="padding: 8px 0;">' + (batch_mode || 'Physical Classroom (Kandy Campus)') + '</td></tr>',
    '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Category:</td><td style="padding: 8px 0; color: #059669; font-weight: bold;">' + registration_type + '</td></tr>',
    bank_slip_url ? '        <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Bank Deposit Slip:</td><td style="padding: 8px 0;"><a href="' + bank_slip_url + '" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold;" target="_blank">📄 View Uploaded Deposit Slip</a></td></tr>' : '',
    '      </table>',
    '    </div>',
    '    <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">',
    '      🏛️ YUZUKI Japan College Admin Portal • Hotlines: 077 353 9800 / 071 110 9800',
    '    </div>',
    '  </div>',
    '</div>'
  ].filter(Boolean).join('\n');
}

function getStudentEmailHtml(data, currentDate) {
  const { student_id, name, course_name, batch_mode } = data;

  return [
    '<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">',
    '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">',
    '    <div style="background: linear-gradient(135deg, #0f172a, #881337); padding: 28px; text-align: center; color: #ffffff;">',
    '      <div style="display: inline-block; padding: 4px 12px; background: rgba(244,63,94,0.2); border: 1px solid rgba(244,63,94,0.4); border-radius: 20px; font-size: 11px; font-weight: bold; color: #fda4af; margin-bottom: 8px;">🌸 結月日本カレッジ • キャンパス公式通知</div>',
    '      <h1 style="margin: 0; font-size: 22px; font-weight: 900;">YUZUKI JAPAN COLLEGE</h1>',
    '      <p style="margin: 4px 0 0; font-size: 13px; color: #fda4af;">Official Student Admission Card & Welcome Notice</p>',
    '    </div>',
    '    <div style="padding: 20px; background: #fff1f2; text-align: center; border-bottom: 2px dashed #f43f5e;">',
    '      <span style="font-size: 11px; font-weight: bold; color: #be123c; text-transform: uppercase;">YOUR OFFICIAL STUDENT ID</span>',
    '      <div style="font-size: 30px; font-weight: 900; font-family: monospace; color: #0f172a; margin: 4px 0;">' + student_id + '</div>',
    '      <span style="font-size: 11px; color: #64748b;">Registration Date: ' + currentDate + '</span>',
    '    </div>',
    '    <div style="padding: 24px;">',
    '      <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">Dear ' + name + ',</h3>',
    '      <p style="font-size: 13px; color: #475569; line-height: 1.6;">',
    '        Congratulations! Your registration for <strong>YUZUKI Japan College</strong> has been successfully received. We are thrilled to welcome you on your journey towards mastering Japanese and building a rewarding career pathway in Japan.',
    '      </p>',
    '      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">',
    '        <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Enrolled Course Details:</div>',
    '        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">',
    '          <tr><td style="padding: 4px 0; color: #64748b; width: 35%;">Student Name:</td><td style="padding: 4px 0; font-weight: bold; color: #0f172a;">' + name + '</td></tr>',
    '          <tr><td style="padding: 4px 0; color: #64748b;">Student ID:</td><td style="padding: 4px 0; font-weight: bold; color: #be123c; font-family: monospace;">' + student_id + '</td></tr>',
    '          <tr><td style="padding: 4px 0; color: #64748b;">Course:</td><td style="padding: 4px 0; font-weight: bold; color: #0f172a;">' + (course_name || 'Japanese Language Studies') + '</td></tr>',
    '          <tr><td style="padding: 4px 0; color: #64748b;">Study Mode:</td><td style="padding: 4px 0; color: #059669; font-weight: bold;">' + (batch_mode || 'Physical Classroom (Kandy Campus)') + '</td></tr>',
    '        </table>',
    '      </div>',
    '      <div style="font-size: 12px; color: #334155; line-height: 1.6; border-left: 3px solid #f43f5e; padding-left: 12px; margin: 16px 0;">',
    '        <strong>📌 What Happens Next?</strong><br/>',
    '        • <strong>Textbooks & Materials:</strong> Official textbooks and listening packs are provided for registered students upon batch orientation.<br/>',
    '        • <strong>Timetable:</strong> Our Kandy Campus administration will contact you via WhatsApp with your lecture timetable and induction details.<br/>',
    '        • <strong>CBT Mock Exam Portal:</strong> Computer-based mock exam simulator access will be activated upon your course curriculum progress.',
    '      </div>',
    '      <div style="text-align: center; margin: 24px 0 8px;">',
    '        <a href="https://yuzukijapancollege.edu.lk/login" style="display: inline-block; background: #be123c; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 13px; box-shadow: 0 4px 8px rgba(190,18,60,0.3);" target="_blank">Access Student Portal 🚀</a>',
    '      </div>',
    '    </div>',
    '    <div style="background: #0f172a; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8;">',
    '      <strong style="color: #ffffff;">🏛️ YUZUKI JAPAN COLLEGE — KANDY CAMPUS</strong><br/>',
    '      📞 Hotlines: 077 353 9800 / 071 110 9800 • ✉️ Email: yuzukijapaneseschool@gmail.com<br/>',
    '      🌐 Website: <a href="https://yuzukijapancollege.edu.lk" style="color: #fda4af;">yuzukijapancollege.edu.lk</a>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');
}

async function sendAdmissionCardEmail(studentData) {
  const {
    student_id,
    name,
    email,
    phone,
    course_name,
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

  const transporter = createTransporter();
  const results = { adminEmail: null, studentEmail: null };

  // 1. Dispatch Official Admin Admission Notification
  try {
    const adminHtml = getAdminEmailHtml(studentData, currentDate, waLink);
    const adminMailOptions = {
      from: '"YUZUKI Japan College" <yuzukijapaneseschool@gmail.com>',
      to: COLLEGE_ADMIN_EMAIL,
      replyTo: (email && email.includes('@')) ? email : COLLEGE_ADMIN_EMAIL,
      subject: '🎓 [New Admission] ' + student_id + ' - ' + name + ' (' + (course_name || 'Course') + ')',
      html: adminHtml
    };

    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log('✉️ Admin notification dispatched to ' + COLLEGE_ADMIN_EMAIL + ' for ' + student_id + '. MessageId: ' + adminInfo.messageId);
    results.adminEmail = { success: true, messageId: adminInfo.messageId };
  } catch (err) {
    console.error('⚠️ Admin email dispatch failure:', err.message);
    results.adminEmail = { success: false, error: err.message };
  }

  // 2. Dispatch Dedicated Welcome & Admission Card Email to Student
  if (email && email.includes('@') && email.toLowerCase() !== COLLEGE_ADMIN_EMAIL.toLowerCase()) {
    try {
      const studentHtml = getStudentEmailHtml(studentData, currentDate);
      const studentMailOptions = {
        from: '"YUZUKI Japan College" <yuzukijapaneseschool@gmail.com>',
        to: email.trim().toLowerCase(),
        replyTo: COLLEGE_ADMIN_EMAIL,
        subject: '🌸 Welcome to YUZUKI Japan College! Your Official Admission Card (' + student_id + ')',
        html: studentHtml
      };

      const studentInfo = await transporter.sendMail(studentMailOptions);
      console.log('✉️ Welcome & Admission Card dispatched to student (' + email + ') for ' + student_id + '. MessageId: ' + studentInfo.messageId);
      results.studentEmail = { success: true, messageId: studentInfo.messageId };
    } catch (err) {
      console.error('⚠️ Student welcome email dispatch failure (' + email + '):', err.message);
      results.studentEmail = { success: false, error: err.message };
    }
  }

  return results;
}

module.exports = {
  sendAdmissionCardEmail,
  COLLEGE_ADMIN_EMAIL
};
