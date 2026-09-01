const { query } = require('../config/database');

async function getAllCourses(req, res) {
  try {
    const courses = await query.all(`
      SELECT c.*, 
             COUNT(DISTINCT e.id) as exam_count,
             COUNT(DISTINCT u.id) as student_count
      FROM courses c
      LEFT JOIN exams e ON e.course_id = c.id
      LEFT JOIN users u ON u.course_id = c.id AND u.role = 'student' AND u.status = 'approved'
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    return res.json({ courses });
  } catch (err) {
    console.error('getAllCourses error:', err);
    return res.status(500).json({ error: 'Failed to fetch courses.' });
  }
}

async function createCourse(req, res) {
  try {
    const { code, name, description } = req.body;
    if (!code || !name) {
      return res.status(400).json({ error: 'Course code and name are required.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await query.get('SELECT id FROM courses WHERE UPPER(code) = ?', [cleanCode]);
    if (existing) {
      return res.status(400).json({ error: `Course with code ${cleanCode} already exists.` });
    }

    const result = await query.run(
      'INSERT INTO courses (code, name, description) VALUES (?, ?, ?)',
      [cleanCode, name.trim(), description ? description.trim() : '']
    );

    return res.status(201).json({
      success: true,
      course: { id: result.id, code: cleanCode, name: name.trim(), description }
    });
  } catch (err) {
    console.error('createCourse error:', err);
    return res.status(500).json({ error: 'Failed to create course.' });
  }
}

async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { code, name, description } = req.body;

    const course = await query.get('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    await query.run(`
      UPDATE courses 
      SET code = COALESCE(?, code),
          name = COALESCE(?, name),
          description = COALESCE(?, description)
      WHERE id = ?
    `, [code ? code.trim().toUpperCase() : null, name ? name.trim() : null, description, id]);

    return res.json({ success: true, message: 'Course updated successfully.' });
  } catch (err) {
    console.error('updateCourse error:', err);
    return res.status(500).json({ error: 'Failed to update course.' });
  }
}

async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM courses WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) {
    console.error('deleteCourse error:', err);
    return res.status(500).json({ error: 'Failed to delete course.' });
  }
}

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
};
