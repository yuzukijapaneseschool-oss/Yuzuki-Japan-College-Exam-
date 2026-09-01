const fs = require('fs');
const { query } = require('../config/database');

// Admin Dashboard Summary Metrics
async function getStats(req, res) {
  try {
    const totalStudents = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const pendingStudents = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND status = 'pending'");
    const approvedStudents = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND status = 'approved'");
    const totalExams = await query.get("SELECT COUNT(*) as count FROM exams");
    const totalAttempts = await query.get("SELECT COUNT(*) as count FROM exam_attempts");
    const passedAttempts = await query.get("SELECT COUNT(*) as count FROM exam_attempts WHERE passed = 1");
    const totalCourses = await query.get("SELECT COUNT(*) as count FROM courses");

    const recentRegistrations = await query.all(`
      SELECT u.id, u.name, u.email, u.student_id, u.status, u.created_at, c.name as course_name
      FROM users u
      LEFT JOIN courses c ON u.course_id = c.id
      WHERE u.role = 'student'
      ORDER BY u.created_at DESC
      LIMIT 5
    `);

    const recentAttempts = await query.all(`
      SELECT ea.id, ea.score, ea.total_marks, ea.percentage, ea.passed, ea.completed_at,
             u.name as student_name, u.student_id,
             e.title as exam_title, c.name as course_name
      FROM exam_attempts ea
      JOIN users u ON ea.user_id = u.id
      JOIN exams e ON ea.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY ea.completed_at DESC
      LIMIT 5
    `);

    return res.json({
      stats: {
        totalStudents: totalStudents ? totalStudents.count : 0,
        pendingApprovals: pendingStudents ? pendingStudents.count : 0,
        approvedStudents: approvedStudents ? approvedStudents.count : 0,
        totalExams: totalExams ? totalExams.count : 0,
        totalAttempts: totalAttempts ? totalAttempts.count : 0,
        passedAttempts: passedAttempts ? passedAttempts.count : 0,
        totalCourses: totalCourses ? totalCourses.count : 0,
        passRate: totalAttempts.count > 0 ? Math.round((passedAttempts.count / totalAttempts.count) * 100) : 0
      },
      recentRegistrations,
      recentAttempts
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin stats.' });
  }
}

// Student Management
async function getStudents(req, res) {
  try {
    const { status, course_id, search } = req.query;
    let sql = `
      SELECT u.id, u.name, u.email, u.student_id, u.course_id, u.phone, u.nic_number, u.city, u.batch_mode, u.bank_slip_url, u.role, u.status, u.created_at, u.subscription_status, u.trial_ends_at, u.subscription_ends_at,
             c.name as course_name, c.code as course_code,
             (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.user_id = u.id) as attempts_count,
             (SELECT MAX(score) FROM exam_attempts ea WHERE ea.user_id = u.id) as best_score
      FROM users u
      LEFT JOIN courses c ON u.course_id = c.id
      WHERE u.role = 'student'
    `;
    const params = [];

    if (status) {
      sql += ' AND u.status = ?';
      params.push(status);
    }
    if (course_id) {
      sql += ' AND u.course_id = ?';
      params.push(course_id);
    }
    if (search) {
      sql += ' AND (LOWER(u.name) LIKE ? OR LOWER(u.email) LIKE ? OR UPPER(u.student_id) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term.toUpperCase());
    }

    sql += ' ORDER BY u.created_at DESC';

    const students = await query.all(sql, params);
    return res.json({ students });
  } catch (err) {
    console.error('getStudents error:', err);
    return res.status(500).json({ error: 'Failed to fetch students.' });
  }
}

// Approve / Reject / Toggle Student
async function updateStudentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, course_id } = req.body; // status: 'approved' | 'rejected' | 'pending'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be approved, rejected, or pending.' });
    }

    const student = await query.get('SELECT * FROM users WHERE id = ? AND role = "student"', [id]);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    if (course_id) {
      await query.run('UPDATE users SET status = ?, course_id = ? WHERE id = ?', [status, course_id, id]);
    } else {
      await query.run('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    }

    return res.json({ 
      success: true, 
      message: `Student ${student.name} (${student.student_id}) status updated to ${status.toUpperCase()}.` 
    });
  } catch (err) {
    console.error('updateStudentStatus error:', err);
    return res.status(500).json({ error: 'Failed to update student status.' });
  }
}

// Delete Student
async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM users WHERE id = ? AND role = "student"', [id]);
    return res.json({ success: true, message: 'Student removed successfully.' });
  } catch (err) {
    console.error('deleteStudent error:', err);
    return res.status(500).json({ error: 'Failed to delete student.' });
  }
}

// Admin Exam Management
async function getAdminExams(req, res) {
  try {
    const exams = await query.all(`
      SELECT e.*, c.name as course_name, c.code as course_code,
             (SELECT COUNT(*) FROM questions q WHERE q.exam_id = e.id) as question_count,
             (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.exam_id = e.id) as attempt_count,
             (SELECT AVG(percentage) FROM exam_attempts ea WHERE ea.exam_id = e.id) as avg_percentage
      FROM exams e
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.id DESC
    `);
    return res.json({ exams });
  } catch (err) {
    console.error('getAdminExams error:', err);
    return res.status(500).json({ error: 'Failed to fetch exams.' });
  }
}

// Create Exam
async function createExam(req, res) {
  try {
    const { title, course_id, duration_minutes, passing_score, description, is_active } = req.body;

    if (!title || !course_id) {
      return res.status(400).json({ error: 'Exam title and course are required.' });
    }

    const result = await query.run(`
      INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      title.trim(),
      course_id,
      duration_minutes ? parseInt(duration_minutes, 10) : 60,
      passing_score ? parseInt(passing_score, 10) : 50,
      description ? description.trim() : '',
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);

    return res.status(201).json({
      success: true,
      examId: result.id,
      message: 'Exam created successfully.'
    });
  } catch (err) {
    console.error('createExam error:', err);
    return res.status(500).json({ error: 'Failed to create exam.' });
  }
}

// Update Exam
async function updateExam(req, res) {
  try {
    const { id } = req.params;
    const { title, course_id, duration_minutes, passing_score, description, is_active } = req.body;

    const exam = await query.get('SELECT * FROM exams WHERE id = ?', [id]);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    await query.run(`
      UPDATE exams
      SET title = COALESCE(?, title),
          course_id = COALESCE(?, course_id),
          duration_minutes = COALESCE(?, duration_minutes),
          passing_score = COALESCE(?, passing_score),
          description = COALESCE(?, description),
          is_active = COALESCE(?, is_active)
      WHERE id = ?
    `, [
      title ? title.trim() : null,
      course_id || null,
      duration_minutes ? parseInt(duration_minutes, 10) : null,
      passing_score ? parseInt(passing_score, 10) : null,
      description !== undefined ? description.trim() : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      id
    ]);

    return res.json({ success: true, message: 'Exam updated successfully.' });
  } catch (err) {
    console.error('updateExam error:', err);
    return res.status(500).json({ error: 'Failed to update exam.' });
  }
}

// Delete Exam
async function deleteExam(req, res) {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM exams WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Exam deleted successfully.' });
  } catch (err) {
    console.error('deleteExam error:', err);
    return res.status(500).json({ error: 'Failed to delete exam.' });
  }
}

// Question Management (with full view of correct answers)
async function getExamQuestions(req, res) {
  try {
    const { examId } = req.params;
    const exam = await query.get(`
      SELECT e.*, c.name as course_name, c.code as course_code 
      FROM exams e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.id = ?
    `, [examId]);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    const questions = await query.all(`
      SELECT * FROM questions WHERE exam_id = ? ORDER BY order_num ASC, id ASC
    `, [examId]);

    return res.json({ exam, questions });
  } catch (err) {
    console.error('getExamQuestions error:', err);
    return res.status(500).json({ error: 'Failed to fetch exam questions.' });
  }
}

// Create Question
async function createQuestion(req, res) {
  try {
    const { examId } = req.params;
    const {
      section_name, question_text, question_type,
      image_url, audio_url,
      option_a, option_b, option_c, option_d,
      correct_option, marks, explanation, order_num
    } = req.body;

    if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
      return res.status(400).json({ 
        error: 'Question text, 4 options (A, B, C, D), and the correct option are required.' 
      });
    }

    const cleanCorrect = correct_option.trim().toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(cleanCorrect)) {
      return res.status(400).json({ error: 'Correct option must be A, B, C, or D.' });
    }

    const result = await query.run(`
      INSERT INTO questions (
        exam_id, section_name, question_text, question_type,
        image_url, audio_url,
        option_a, option_b, option_c, option_d,
        correct_option, marks, explanation, order_num
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      examId,
      section_name ? section_name.trim() : 'General',
      question_text.trim(),
      question_type || 'multiple_choice',
      image_url || null,
      audio_url || null,
      option_a.trim(),
      option_b.trim(),
      option_c.trim(),
      option_d.trim(),
      cleanCorrect,
      marks ? parseInt(marks, 10) : 1,
      explanation ? explanation.trim() : '',
      order_num ? parseInt(order_num, 10) : 0
    ]);

    return res.status(201).json({
      success: true,
      questionId: result.id,
      message: 'Question added successfully.'
    });
  } catch (err) {
    console.error('createQuestion error:', err);
    return res.status(500).json({ error: 'Failed to create question.' });
  }
}

// Update Question
async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const {
      section_name, question_text, question_type,
      image_url, audio_url,
      option_a, option_b, option_c, option_d,
      correct_option, marks, explanation, order_num
    } = req.body;

    const existing = await query.get('SELECT * FROM questions WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    let cleanCorrect = correct_option ? correct_option.trim().toUpperCase() : existing.correct_option;
    if (!['A', 'B', 'C', 'D'].includes(cleanCorrect)) {
      return res.status(400).json({ error: 'Correct option must be A, B, C, or D.' });
    }

    await query.run(`
      UPDATE questions
      SET section_name = COALESCE(?, section_name),
          question_text = COALESCE(?, question_text),
          question_type = COALESCE(?, question_type),
          image_url = COALESCE(?, image_url),
          audio_url = COALESCE(?, audio_url),
          option_a = COALESCE(?, option_a),
          option_b = COALESCE(?, option_b),
          option_c = COALESCE(?, option_c),
          option_d = COALESCE(?, option_d),
          correct_option = COALESCE(?, correct_option),
          marks = COALESCE(?, marks),
          explanation = COALESCE(?, explanation),
          order_num = COALESCE(?, order_num)
      WHERE id = ?
    `, [
      section_name ? section_name.trim() : null,
      question_text ? question_text.trim() : null,
      question_type || null,
      image_url !== undefined ? image_url : null,
      audio_url !== undefined ? audio_url : null,
      option_a ? option_a.trim() : null,
      option_b ? option_b.trim() : null,
      option_c ? option_c.trim() : null,
      option_d ? option_d.trim() : null,
      cleanCorrect,
      marks ? parseInt(marks, 10) : null,
      explanation !== undefined ? explanation.trim() : null,
      order_num !== undefined ? parseInt(order_num, 10) : null,
      id
    ]);

    return res.json({ success: true, message: 'Question updated successfully.' });
  } catch (err) {
    console.error('updateQuestion error:', err);
    return res.status(500).json({ error: 'Failed to update question.' });
  }
}

// Delete Question
async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM questions WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Question deleted successfully.' });
  } catch (err) {
    console.error('deleteQuestion error:', err);
    return res.status(500).json({ error: 'Failed to delete question.' });
  }
}

// Media Upload Handler (Images / Audio)
function uploadMediaFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media file provided.' });
    }

    const isAudio = req.file.fieldname === 'audio' || req.file.mimetype.startsWith('audio/');
    const folder = isAudio ? 'audio' : 'images';
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;

    return res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type: isAudio ? 'audio' : 'image'
    });
  } catch (err) {
    console.error('uploadMediaFile error:', err);
    return res.status(500).json({ error: 'Failed to upload media file.' });
  }
}

// All Student Results Analytics
async function getAllResults(req, res) {
  try {
    const { course_id, exam_id, student_id, search } = req.query;
    let sql = `
      SELECT ea.*, u.name as student_name, u.email as student_email, u.student_id,
             e.title as exam_title, e.passing_score,
             c.name as course_name, c.code as course_code
      FROM exam_attempts ea
      JOIN users u ON ea.user_id = u.id
      JOIN exams e ON ea.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (course_id) {
      sql += ' AND e.course_id = ?';
      params.push(course_id);
    }
    if (exam_id) {
      sql += ' AND ea.exam_id = ?';
      params.push(exam_id);
    }
    if (student_id) {
      sql += ' AND UPPER(u.student_id) = ?';
      params.push(student_id.toUpperCase());
    }
    if (search) {
      sql += ' AND (LOWER(u.name) LIKE ? OR LOWER(u.email) LIKE ? OR UPPER(u.student_id) LIKE ? OR LOWER(e.title) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term.toUpperCase(), term);
    }

    sql += ' ORDER BY ea.completed_at DESC';

    const results = await query.all(sql, params);
    return res.json({ results });
  } catch (err) {
    console.error('getAllResults error:', err);
    return res.status(500).json({ error: 'Failed to fetch exam results.' });
  }
}


async function extendSubscription(req, res) {
  try {
    const { studentId } = req.params;
    const { days = 30, status = 'active' } = req.body;

    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + parseInt(days, 10));

    await query.run(`
      UPDATE users 
      SET subscription_status = ?,
          subscription_ends_at = ?
      WHERE id = ?
    `, [status, newExpiry.toISOString(), studentId]);

    return res.json({ 
      success: true, 
      message: `Extended subscription by ${days} days (valid until ${newExpiry.toLocaleDateString()}).` 
    });
  } catch (err) {
    console.error('extendSubscription error:', err);
    return res.status(500).json({ error: 'Failed to update student subscription.' });
  }
}

const { createBackup } = require('../utils/dbBackup');

async function downloadDatabaseBackup(req, res) {
  try {
    const backupFile = createBackup();
    if (!backupFile || !fs.existsSync(backupFile)) {
      return res.status(500).json({ error: 'Failed to generate database backup.' });
    }
    return res.download(backupFile);
  } catch (err) {
    console.error('downloadDatabaseBackup error:', err);
    return res.status(500).json({ error: 'Failed to download database backup.' });
  }
}

module.exports = {
  extendSubscription,
  getStats,
  getStudents,
  updateStudentStatus,
  deleteStudent,
  getAdminExams,
  createExam,
  updateExam,
  deleteExam,
  getExamQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  uploadMediaFile,
  getAllResults,
  downloadDatabaseBackup
};
