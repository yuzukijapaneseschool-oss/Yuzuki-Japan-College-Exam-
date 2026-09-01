const { query } = require('../config/database');

async function getExams(req, res) {
  try {
    const user = req.user;
    let sql = `
      SELECT e.*, c.name as course_name, c.code as course_code,
             (SELECT COUNT(*) FROM questions q WHERE q.exam_id = e.id) as question_count,
             (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.user_id = ?) as user_attempts_count,
             (SELECT MAX(score) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.user_id = ?) as user_best_score,
             (SELECT MAX(percentage) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.user_id = ?) as user_best_percentage
      FROM exams e
      JOIN courses c ON e.course_id = c.id
      WHERE e.is_active = 1
    `;
    let params = [user.id, user.id, user.id];

    if (user.role === 'student') {
      if (!user.course_id) return res.json({ exams: [] });
      sql += ` AND e.course_id = ?`;
      params.push(user.course_id);
    }

    sql += ` ORDER BY e.id DESC`;
    const exams = await query.all(sql, params);
    return res.json({ exams });
  } catch (err) {
    console.error('getExams error:', err);
    return res.status(500).json({ error: 'Failed to fetch available exams.' });
  }
}

async function getExamSession(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    const exam = await query.get(`
      SELECT e.*, c.name as course_name, c.code as course_code 
      FROM exams e
      JOIN courses c ON e.course_id = c.id
      WHERE e.id = ? AND e.is_active = 1
    `, [id]);

    if (!exam) return res.status(404).json({ error: 'Exam not found or inactive.' });

    
    // Check subscription / trial status
    if (user.role === 'student') {
      const studentUser = await query.get('SELECT * FROM users WHERE id = ?', [user.id]);
      const now = new Date();
      let hasActiveAccess = false;
      if (studentUser.subscription_ends_at && new Date(studentUser.subscription_ends_at) > now) {
        hasActiveAccess = true;
      } else if (studentUser.trial_ends_at && new Date(studentUser.trial_ends_at) > now) {
        hasActiveAccess = true;
      }

      if (!hasActiveAccess) {
        return res.status(403).json({
          error: '🔒 CBT Exam Simulation Room requires an active Exam Pass. Please subscribe for $9.99/mo (Card Payment) or contact your Sensei to activate your 30-day exam pass.',
          requires_subscription: true,
          locked_reason: 'subscription_required'
        });
      }
    }

    if (user.role === 'student' && exam.course_id !== user.course_id) {
      return res.status(403).json({ 
        error: `Access Denied: This exam belongs to ${exam.course_name}. Your Student ID is registered for a different course.` 
      });
    }

    const questions = await query.all(`
      SELECT id, exam_id, section_name, question_text, question_type,
             image_url, audio_url, option_a, option_b, option_c, option_d,
             marks, order_num
      FROM questions
      WHERE exam_id = ?
      ORDER BY order_num ASC, id ASC
    `, [id]);

    return res.json({
      exam: {
        id: exam.id,
        title: exam.title,
        course_name: exam.course_name,
        course_code: exam.course_code,
        duration_minutes: exam.duration_minutes,
        passing_score: exam.passing_score,
        description: exam.description,
        total_questions: questions.length,
        total_marks: questions.reduce((acc, q) => acc + (q.marks || 1), 0)
      },
      questions,
      studentWatermark: {
        student_id: user.student_id,
        name: user.name
      }
    });
  } catch (err) {
    console.error('getExamSession error:', err);
    return res.status(500).json({ error: 'Failed to load exam session.' });
  }
}

async function submitExam(req, res) {
  try {
    const { id } = req.params;
    const { answers, timeTakenSeconds, tabSwitchesCount } = req.body;
    const user = req.user;

    const exam = await query.get('SELECT * FROM exams WHERE id = ?', [id]);
    if (!exam) return res.status(404).json({ error: 'Exam not found.' });

    if (user.role === 'student' && exam.course_id !== user.course_id) {
      return res.status(403).json({ error: 'Unauthorized to submit for this course exam.' });
    }

    const questions = await query.all(`
      SELECT id, section_name, question_text, image_url, audio_url,
             option_a, option_b, option_c, option_d,
             correct_option, marks, explanation
      FROM questions
      WHERE exam_id = ?
      ORDER BY order_num ASC, id ASC
    `, [id]);

    let totalMarks = 0;
    let earnedMarks = 0;
    const detailedReview = [];

    for (const q of questions) {
      const qMarks = q.marks || 1;
      totalMarks += qMarks;
      const studentChoice = answers ? answers[q.id] : null;
      const isCorrect = studentChoice && studentChoice.toUpperCase() === q.correct_option.toUpperCase();

      if (isCorrect) earnedMarks += qMarks;

      detailedReview.push({
        id: q.id,
        section_name: q.section_name,
        question_text: q.question_text,
        image_url: q.image_url,
        audio_url: q.audio_url,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        student_choice: studentChoice || null,
        correct_option: q.correct_option,
        is_correct: !!isCorrect,
        marks: qMarks,
        earned_marks: isCorrect ? qMarks : 0,
        explanation: q.explanation
      });
    }

    const percentage = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 1000) / 10 : 0;
    const passed = percentage >= exam.passing_score ? 1 : 0;

    const result = await query.run(`
      INSERT INTO exam_attempts (
        user_id, exam_id, score, total_marks, percentage, passed,
        answers_json, time_taken_seconds, tab_switches_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      exam.id,
      earnedMarks,
      totalMarks,
      percentage,
      passed,
      JSON.stringify(answers || {}),
      timeTakenSeconds || 0,
      tabSwitchesCount || 0
    ]);

    return res.json({
      success: true,
      attemptId: result.id,
      score: earnedMarks,
      total_marks: totalMarks,
      percentage,
      passed: !!passed,
      passing_score: exam.passing_score,
      time_taken_seconds: timeTakenSeconds || 0,
      tab_switches_count: tabSwitchesCount || 0,
      detailedReview
    });
  } catch (err) {
    console.error('submitExam error:', err);
    return res.status(500).json({ error: 'Failed to submit and grade exam.' });
  }
}

async function getMyAttempts(req, res) {
  try {
    const user = req.user;
    const attempts = await query.all(`
      SELECT ea.*, e.title as exam_title, e.duration_minutes, e.passing_score,
             c.name as course_name, c.code as course_code
      FROM exam_attempts ea
      JOIN exams e ON ea.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE ea.user_id = ?
      ORDER BY ea.completed_at DESC
    `, [user.id]);
    return res.json({ attempts });
  } catch (err) {
    console.error('getMyAttempts error:', err);
    return res.status(500).json({ error: 'Failed to fetch exam history.' });
  }
}

async function getAttemptDetail(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    const attempt = await query.get(`
      SELECT ea.*, e.title as exam_title, e.duration_minutes, e.passing_score,
             c.name as course_name, c.code as course_code,
             u.name as student_name, u.student_id
      FROM exam_attempts ea
      JOIN exams e ON ea.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON ea.user_id = u.id
      WHERE ea.id = ?
    `, [id]);

    if (!attempt) return res.status(404).json({ error: 'Exam attempt record not found.' });

    if (user.role === 'student' && attempt.user_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this attempt.' });
    }

    const answers = JSON.parse(attempt.answers_json || '{}');
    const questions = await query.all(`
      SELECT id, section_name, question_text, image_url, audio_url,
             option_a, option_b, option_c, option_d,
             correct_option, marks, explanation
      FROM questions
      WHERE exam_id = ?
      ORDER BY order_num ASC, id ASC
    `, [attempt.exam_id]);

    const detailedReview = questions.map(q => {
      const studentChoice = answers[q.id];
      const isCorrect = studentChoice && studentChoice.toUpperCase() === q.correct_option.toUpperCase();
      return {
        id: q.id,
        section_name: q.section_name,
        question_text: q.question_text,
        image_url: q.image_url,
        audio_url: q.audio_url,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        student_choice: studentChoice || null,
        correct_option: q.correct_option,
        is_correct: !!isCorrect,
        marks: q.marks || 1,
        earned_marks: isCorrect ? (q.marks || 1) : 0,
        explanation: q.explanation
      };
    });

    return res.json({ attempt, detailedReview });
  } catch (err) {
    console.error('getAttemptDetail error:', err);
    return res.status(500).json({ error: 'Failed to load attempt details.' });
  }
}

module.exports = {
  getExams,
  getExamSession,
  submitExam,
  getMyAttempts,
  getAttemptDetail
};