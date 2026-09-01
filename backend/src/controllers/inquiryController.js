const { query } = require('../config/database');

// Public: Submit admission inquiry
async function createInquiry(req, res) {
  try {
    const { name, phone, email, course_interested, city, message } = req.body;
    if (!name || !phone || !course_interested) {
      return res.status(400).json({ error: 'Name, Phone number, and Course Interested are required.' });
    }

    const result = await query.run(`
      INSERT INTO inquiries (name, phone, email, course_interested, city, message, status)
      VALUES (?, ?, ?, ?, ?, ?, 'new')
    `, [
      name.trim(),
      phone.trim(),
      email ? email.trim().toLowerCase() : null,
      course_interested.trim(),
      city ? city.trim() : 'Kandy',
      message ? message.trim() : null
    ]);

    return res.status(201).json({
      success: true,
      inquiryId: result.id,
      message: 'Thank you! Your admission inquiry has been received. Our YUZUKI College counselor will contact you shortly.'
    });
  } catch (err) {
    console.error('Inquiry error:', err);
    return res.status(500).json({ error: 'Failed to submit admission inquiry.' });
  }
}

// Admin: Get all inquiries
async function getAllInquiries(req, res) {
  try {
    const inquiries = await query.all(`
      SELECT id, name, phone, email, course_interested, city, message, status, created_at
      FROM inquiries
      ORDER BY created_at DESC
    `);
    return res.json({ success: true, inquiries });
  } catch (err) {
    console.error('Get inquiries error:', err);
    return res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
}

// Admin: Update inquiry status (new, contacted, enrolled, closed)
async function updateInquiryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await query.run('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    return res.json({ success: true, message: 'Inquiry status updated.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update inquiry.' });
  }
}

module.exports = {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus
};