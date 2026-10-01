const fs = require('fs');
const { query } = require('../config/database');

// Admin Dashboard Summary Metrics
async function getStats(req, res) {
  try {
    const totalUsers = await query.get("SELECT COUNT(*) as count FROM users");
    const authenticLearners = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const adminBridges = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    const pendingStudents = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND status = 'pending'");
    const approvedStudents = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND status = 'approved'");

    // Academic registrations breakdown
    const yjpRegs = await query.get("SELECT COUNT(*) as count FROM program_registrations pr JOIN programs p ON pr.program_id = p.id WHERE p.program_code = 'YJP'");
    const ytdRegs = await query.get("SELECT COUNT(*) as count FROM program_registrations pr JOIN programs p ON pr.program_id = p.id WHERE p.program_code = 'YTD'");
    const yagRegs = await query.get("SELECT COUNT(*) as count FROM program_registrations pr JOIN programs p ON pr.program_id = p.id WHERE p.program_code = 'YAG'");

    // Exam split
    const totalExams = await query.get("SELECT COUNT(*) as count FROM exams");
    const activeExams = await query.get("SELECT COUNT(*) as count FROM exams WHERE is_active = 1");
    const archivedExams = await query.get("SELECT COUNT(*) as count FROM exams WHERE is_active = 0");
    const totalQuestions = await query.get("SELECT COUNT(*) as count FROM questions");

    // Attempts
    const totalAttempts = await query.get("SELECT COUNT(*) as count FROM exam_attempts");
    const passedAttempts = await query.get("SELECT COUNT(*) as count FROM exam_attempts WHERE passed = 1");
    const totalCourses = await query.get("SELECT COUNT(*) as count FROM courses");

    // Practice passes & finance
    const paymentsUsd = await query.get("SELECT SUM(amount_cents) as total_cents, COUNT(*) as count FROM payments WHERE currency = 'USD' AND payment_status = 'completed'");
    const paymentsLkr = await query.get("SELECT SUM(amount_cents) as total_cents, COUNT(*) as count FROM payments WHERE currency = 'LKR' AND payment_status = 'completed'");
    const outstandingInvoices = await query.get("SELECT SUM(balance_due_cents) as total_balance, COUNT(*) as count FROM invoices WHERE status != 'paid'");
    const practiceUsers = await query.get("SELECT COUNT(DISTINCT user_id) as count FROM payments WHERE currency = 'USD' AND payment_status = 'completed'");
    const activePasses = await query.get("SELECT COUNT(*) as count FROM payments WHERE currency = 'USD' AND payment_status = 'completed'");

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
        // Business Overview
        registeredUsers: totalUsers ? totalUsers.count : 0,
        authenticLearners: authenticLearners ? authenticLearners.count : 0,
        adminBridges: adminBridges ? adminBridges.count : 0,
        totalStudents: authenticLearners ? authenticLearners.count : 0, // backwards compatibility
        pendingApprovals: pendingStudents ? pendingStudents.count : 0,
        approvedStudents: approvedStudents ? approvedStudents.count : 0,
        activePracticeUsers: practiceUsers ? practiceUsers.count : 0,
        activePracticePasses: activePasses ? activePasses.count : 0,

        // Academic Breakdown
        academicYJP: yjpRegs ? yjpRegs.count : 0,
        academicYTD: ytdRegs ? ytdRegs.count : 0,
        academicYAG: yagRegs ? yagRegs.count : 0,
        totalAcademicEnrollments: (yjpRegs?.count || 0) + (ytdRegs?.count || 0) + (yagRegs?.count || 0),

        // Exam Portal
        totalExams: totalExams ? totalExams.count : 0,
        activeExams: activeExams ? activeExams.count : 0,
        archivedExams: archivedExams ? archivedExams.count : 0,
        totalQuestions: totalQuestions ? totalQuestions.count : 0,
        totalAttempts: totalAttempts ? totalAttempts.count : 0,
        passedAttempts: passedAttempts ? passedAttempts.count : 0,
        totalCourses: totalCourses ? totalCourses.count : 0,
        passRate: totalAttempts && totalAttempts.count > 0 ? Math.round((passedAttempts.count / totalAttempts.count) * 100) : 0,

        // Finance
        practiceRevenueUsd: ((paymentsUsd?.total_cents || 0) / 100).toFixed(2),
        practiceSalesCount: paymentsUsd?.count || 0,
        academicRevenueLkr: ((paymentsLkr?.total_cents || 0) / 100).toFixed(2),
        outstandingFeesLkr: ((outstandingInvoices?.total_balance || 0) / 100).toFixed(2)
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
      SELECT u.id, u.name, u.email, u.student_id, u.course_id, u.phone, u.nic_number, u.city, u.batch_mode, u.bank_slip_url, u.role, u.status, u.created_at, u.subscription_status, u.trial_ends_at, u.subscription_ends_at, u.allow_dual_track,
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

    if (status === 'approved') {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      // 1. Activate any verified paid passes that were awaiting Admin Approval
      const paidPendingPasses = await query.all(`
        SELECT ep.* FROM exam_practice_passes ep
        JOIN payments p ON ep.payment_id = p.id
        WHERE ep.user_id = ? AND p.payment_status = 'completed' AND datetime(ep.valid_until) > datetime('now')
      `, [id]);

      let hasActivePaidPass = false;
      if (paidPendingPasses.length > 0) {
        await query.run(`
          UPDATE exam_practice_passes 
          SET is_active = 1, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ? AND payment_id IS NOT NULL AND datetime(valid_until) > datetime('now')
        `, [id]);
        hasActivePaidPass = true;
      }

      // 2. Identify if student is an official YUZUKI School Student (Free 30-Day Practice Pass Benefit)
      const isSchoolStudent = Boolean(
        (student.student_id && (student.student_id.startsWith('YJP') || student.student_id.startsWith('YTD') || student.student_id.startsWith('YAG'))) ||
        student.batch_mode === 'yjp_school_student' ||
        student.batch_mode === 'yjp_japanese_only' ||
        student.batch_mode === 'ytd_truck_only' ||
        student.batch_mode === 'physical_kandy' ||
        student.batch_mode === 'online_zoom'
      );

      if (isSchoolStudent) {
        // Automatically create / activate 30-Day Free JFT / SSW Practice Pass for School Students
        const targetCategory = (student.student_id && student.student_id.startsWith('YTD')) || student.course_id === 7 
          ? 'SSW-TRUCK-DRIVING' 
          : 'JFT-BASIC';

        const existingFreePass = await query.get(
          "SELECT id, valid_until, is_active FROM exam_practice_passes WHERE user_id = ? AND category_code = ? AND payment_id IS NULL",
          [id, targetCategory]
        );

        const isPassCurrentlyActive = existingFreePass && existingFreePass.is_active === 1 && new Date(existingFreePass.valid_until) > new Date();

        if (!existingFreePass) {
          // First-time approval: create 30-Day Free Pass
          await query.run(`
            INSERT INTO exam_practice_passes (
              user_id, student_id, category_code, invoice_id, payment_id,
              valid_from, valid_until, is_active
            ) VALUES (?, ?, ?, NULL, NULL, CURRENT_TIMESTAMP, ?, 1)
          `, [id, student.student_id, targetCategory, validUntil.toISOString()]);

          if (course_id) {
            await query.run(`
              UPDATE users 
              SET status = 'approved', 
                  subscription_status = 'active',
                  subscription_ends_at = ?,
                  course_id = ? 
              WHERE id = ?
            `, [validUntil.toISOString(), course_id, id]);
          } else {
            await query.run(`
              UPDATE users 
              SET status = 'approved', 
                  subscription_status = 'active',
                  subscription_ends_at = ?
              WHERE id = ?
            `, [validUntil.toISOString(), id]);
          }
        } else if (isPassCurrentlyActive) {
          // Idempotent: pass is already active and valid, keep existing validity window
          if (course_id) {
            await query.run(`
              UPDATE users 
              SET status = 'approved', 
                  subscription_status = 'active',
                  course_id = ? 
              WHERE id = ?
            `, [course_id, id]);
          } else {
            await query.run(`
              UPDATE users 
              SET status = 'approved', 
                  subscription_status = 'active'
              WHERE id = ?
            `, [id]);
          }

          await query.run(`
            UPDATE exam_practice_passes 
            SET is_active = 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [existingFreePass.id]);
        } else {
          // Pass was expired or inactive: reactivate with new 30-Day window
          if (course_id) {
            await query.run(`
              UPDATE users 
              SET status = 'approved', 
                  subscription_status = 'active',
                  subscription_ends_at = ?,
                  course_id = ? 
              WHERE id = ?
            `, [validUntil.toISOString(), course_id, id]);
          } else {
            await query.run(`
              UPDATE users 
              SET status = 'approved', 
                  subscription_status = 'active',
                  subscription_ends_at = ?
              WHERE id = ?
            `, [validUntil.toISOString(), id]);
          }

          await query.run(`
            UPDATE exam_practice_passes 
            SET valid_until = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [validUntil.toISOString(), existingFreePass.id]);
        }

        console.log(`[Admin Student Approval] School Student #${id} (${student.student_id}) approved and 30-Day FREE ${targetCategory} pass configured.`);
      } else {
        // External candidate: Account is approved, but paid passes require verified payment
        const targetSubStatus = hasActivePaidPass ? 'active' : 'locked';
        if (course_id) {
          await query.run(`
            UPDATE users 
            SET status = 'approved', 
                subscription_status = ?,
                course_id = ? 
            WHERE id = ?
          `, [targetSubStatus, course_id, id]);
        } else {
          await query.run(`
            UPDATE users 
            SET status = 'approved', 
                subscription_status = ?
            WHERE id = ?
          `, [targetSubStatus, id]);
        }
        console.log(`[Admin Student Approval] Candidate #${id} (${student.student_id}) approved. subscription_status=${targetSubStatus}.`);
      }
    } else if (status === 'rejected') {
      await query.run(`
        UPDATE users 
        SET status = 'rejected', 
            subscription_status = 'locked',
            subscription_ends_at = NULL
        WHERE id = ?
      `, [id]);

      await query.run(`
        UPDATE exam_practice_passes 
        SET is_active = 0, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [id]);

      console.log(`[Admin Student Rejection] Student #${id} (${student.student_id}) rejected and pass deactivated.`);
    } else {
      // Pending
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
      SELECT e.*, c.name as course_name, c.code as course_code, c.category as course_category,
             (SELECT COUNT(*) FROM questions q WHERE q.exam_id = e.id) as question_count,
             (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.exam_id = e.id) as attempt_count,
             (SELECT AVG(percentage) FROM exam_attempts ea WHERE ea.exam_id = e.id) as avg_percentage
      FROM exams e
      LEFT JOIN courses c ON e.course_id = c.id
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
      LEFT JOIN courses c ON e.course_id = c.id 
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

    if (!question_text || !option_a || !option_b || !option_c || !correct_option) {
      return res.status(400).json({ 
        error: 'Question text, Options (A, B, C), and the correct option are required.' 
      });
    }

    const cleanCorrect = correct_option.trim().toUpperCase();
    const cleanOptionD = option_d && typeof option_d === 'string' ? option_d.trim() : '';
    const validOptions = cleanOptionD ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C'];

    if (!validOptions.includes(cleanCorrect)) {
      return res.status(400).json({ error: `Correct option must be one of: ${validOptions.join(', ')}.` });
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
      cleanOptionD,
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
    let finalOptionD = existing.option_d || '';
    if (option_d !== undefined) {
      finalOptionD = option_d ? option_d.trim() : '';
    }

    const validOptions = finalOptionD ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C'];
    if (!validOptions.includes(cleanCorrect)) {
      if (cleanCorrect === 'D' && !finalOptionD) {
        cleanCorrect = 'A';
      } else {
        return res.status(400).json({ error: `Correct option must be one of: ${validOptions.join(', ')}.` });
      }
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
          option_d = ?,
          correct_option = ?,
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
      finalOptionD,
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

async function toggleDualTrack(req, res) {
  try {
    const { id } = req.params;
    const student = await query.get('SELECT * FROM users WHERE id = ? AND role = "student"', [id]);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const currentVal = student.allow_dual_track === 1 || student.batch_mode === 'dual_track';
    const newVal = currentVal ? 0 : 1;
    const newBatchMode = newVal === 1 ? 'dual_track' : (student.course_id === 7 ? 'ytd_truck_only' : 'yjp_japanese_only');

    await query.run('UPDATE users SET allow_dual_track = ?, batch_mode = ? WHERE id = ?', [newVal, newBatchMode, id]);

    return res.json({
      success: true,
      allow_dual_track: newVal === 1,
      message: newVal === 1
        ? `🌟 Dual Track (Japanese + Truck Driving) enabled for ${student.name} (${student.student_id}).`
        : `Track isolated to Single Course for ${student.name} (${student.student_id}).`
    });
  } catch (err) {
    console.error('toggleDualTrack error:', err);
    return res.status(500).json({ error: 'Failed to update dual track access.' });
  }
}

async function resetDeviceBinding(req, res) {
  try {
    const { id } = req.params;
    const { reason = 'Admin authorized device reset request' } = req.body;

    const user = await query.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Deactivate existing active bindings
    await query.run(`
      UPDATE user_device_bindings
      SET is_active = 0,
          reset_at = CURRENT_TIMESTAMP,
          reset_by_admin_id = ?,
          reset_reason = ?
      WHERE user_id = ? AND is_active = 1
    `, [req.user.id, reason, id]);

    // Insert Audit Log
    await query.run(`
      INSERT INTO audit_logs (
        actor_id, actor_role, action, target_entity, target_id, details_json, ip_address
      ) VALUES (?, ?, 'DEVICE_RESET', 'users', ?, ?, ?)
    `, [
      req.user.id,
      req.user.role,
      String(id),
      JSON.stringify({ reason, target_email: user.email, target_student_id: user.student_id }),
      req.ip || '127.0.0.1'
    ]);

    return res.json({
      success: true,
      message: `Device binding for user ${user.name} (${user.student_id || user.email}) has been reset. Next login will bind to new device.`,
      user_id: user.id
    });
  } catch (err) {
    console.error('resetDeviceBinding error:', err);
    return res.status(500).json({ error: 'Failed to reset device binding: ' + err.message });
  }
}

module.exports = {
  extendSubscription,
  toggleDualTrack,
  resetDeviceBinding,
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
