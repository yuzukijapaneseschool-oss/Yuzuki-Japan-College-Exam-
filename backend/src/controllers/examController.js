const { query } = require('../config/database');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function resolveExamCategory(exam) {
  const code = (exam.course_code || '').toUpperCase();
  const title = (exam.title || '').toUpperCase();

  // 1. Authoritative Course Code Matches (Explicit Mapping)
  if (code === 'JLPT-N5') return 'JLPT-N5';
  if (code === 'JLPT-N4') return 'JLPT-N4';
  if (code === 'JLPT-N3') return 'JLPT-N3';
  if (code === 'JFT-BASIC') return 'JFT-BASIC';
  if (code === 'SSW2-ACCOMMODATION') return 'SSW2-ACCOMMODATION';
  if (code === 'SSW-FOOD-MANUFACTURING') return 'SSW-FOOD-MANUFACTURING';
  if (code === 'SSW-CONSTRUCTION') return 'SSW-CONSTRUCTION';
  if (code === 'SSW-AIRPORT-GROUND') return 'SSW-AIRPORT-GROUND';
  if (code === 'SSW-FOOD-SERVICE') return 'SSW-FOOD-SERVICE';
  if (code === 'SSW-CAREGIVER') return 'SSW-CAREGIVER';
  if (code === 'SSW-AGRICULTURE') return 'SSW-AGRICULTURE';
  if (code === 'SSW-ACCOMMODATION') return 'SSW-ACCOMMODATION';
  if (code === 'SSW-AUTOMOBILE') return 'SSW-AUTOMOBILE';
  if (code === 'SSW-TRUCK-DRIVING') return 'SSW-TRUCK-DRIVING';

  // 2. Fallback Title Matching for dynamic or unmapped records
  if (title.includes('JLPT N5') || (title.includes('N5') && title.includes('JLPT'))) return 'JLPT-N5';
  if (title.includes('JLPT N4') || (title.includes('N4') && title.includes('JLPT')) || (exam.id >= 159 && exam.id <= 168)) return 'JLPT-N4';
  if (title.includes('JLPT N3') || (title.includes('N3') && title.includes('JLPT'))) return 'JLPT-N3';
  if (title.includes('JFT')) return 'JFT-BASIC';
  if (title.includes('SSW 2') || title.includes('特定技能2号') || title.includes('2号')) return 'SSW2-ACCOMMODATION';
  if (title.includes('FOOD MANUFACTURING') || title.includes('飲食料品製造') || title.includes('製造業')) return 'SSW-FOOD-MANUFACTURING';
  if (title.includes('CONSTRUCTION') || title.includes('建設') || title.includes('土木') || title.includes('型枠') || title.includes('鉄筋')) return 'SSW-CONSTRUCTION';
  if (title.includes('AVIATION') || title.includes('AIRPORT') || title.includes('航空') || title.includes('グランドハンドリング')) return 'SSW-AIRPORT-GROUND';
  if ((title.includes('FOOD') && !title.includes('MANUFACTURING')) || title.includes('RESTAURANT') || title.includes('外食')) return 'SSW-FOOD-SERVICE';
  if (title.includes('CAREGIVER') || title.includes('NURSING') || title.includes('介護')) return 'SSW-CAREGIVER';
  if (title.includes('AGRI') || title.includes('農業')) return 'SSW-AGRICULTURE';
  if (title.includes('ACCOM') || title.includes('宿泊')) return 'SSW-ACCOMMODATION';
  if (title.includes('AUTO') || title.includes('自動車整備')) return 'SSW-AUTOMOBILE';
  if (title.includes('TRUCK') || title.includes('トラック') || title.includes('運送')) return 'SSW-TRUCK-DRIVING';

  return code || 'UNKNOWN';
}

function isJlptFreeCategory(categoryCode) {
  return ['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(categoryCode);
}

const ALL_PORTAL_CATEGORIES = [
  // 1. JLPT - Completely Free for all authenticated users
  {
    category_code: 'JLPT-N5',
    title: 'JLPT N5 (Beginner Level)',
    sector: 'JLPT Language',
    description: 'Foundational Japanese vocabulary, kanji (100+), basic grammar, and listening comprehension.',
    is_free: true,
    price_cents: 0,
    price_usd: 0.00,
    currency: 'USD',
    duration_days: null
  },
  {
    category_code: 'JLPT-N4',
    title: 'JLPT N4 (Elementary Level)',
    sector: 'JLPT Language',
    description: 'Elementary Japanese grammar, kanji (300+), daily conversation, and 10 official SSW mock modules.',
    is_free: true,
    price_cents: 0,
    price_usd: 0.00,
    currency: 'USD',
    duration_days: null
  },
  {
    category_code: 'JLPT-N3',
    title: 'JLPT N3 (Intermediate Level)',
    sector: 'JLPT Language',
    description: 'Bridge to advanced Japanese with complex reading comprehension, kanji (650+), and nuanced grammar.',
    is_free: true,
    price_cents: 0,
    price_usd: 0.00,
    currency: 'USD',
    duration_days: null
  },

  // 2. JFT-Basic - Paid Practice Category ($9.99 / 30 Days)
  {
    category_code: 'JFT-BASIC',
    title: 'JFT-Basic (A2 Exam Simulation)',
    sector: 'JFT Language',
    description: 'Official JFT-Basic A2 preparation with 21 mock papers, audio listening (Choukai) and reading tests.',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },

  // 3. SSW Categories - Independent Paid Practice Categories ($9.99 / 30 Days each)
  {
    category_code: 'SSW-CAREGIVER',
    title: 'SSW Caregiver / Nursing Care (特定技能 介護)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Specialized vocational Japanese and caregiving skill practice (758 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW-FOOD-SERVICE',
    title: 'SSW Food Service & Restaurant (外食業)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Food hygiene, customer service, cooking management, and safety regulations (325 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW-AGRICULTURE',
    title: 'SSW Agriculture & Crop Farming (農業・耕種)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Crop cultivation, greenhouse management, livestock basics, and farm safety (376 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW-ACCOMMODATION',
    title: 'SSW Accommodation & Hospitality (宿泊業)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Front desk operations, guest service, hotel etiquette, and hygiene (246 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW-TRUCK-DRIVING',
    title: 'SSW Truck Driving & Logistics (自動車運送業)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Driver basics, vehicle inspection, roll call, cargo safety, and road rules (583 Furigana Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW-AIRPORT-GROUND',
    title: 'SSW Airport Ground Handling (航空業)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Ramp handling, baggage sorting, aircraft marshalling, and aviation safety (297 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW-AUTOMOBILE',
    title: 'SSW Automobile Maintenance (自動車整備)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Automotive engine maintenance, chassis inspection, electronic diagnostics (419 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW-CONSTRUCTION',
    title: 'SSW Construction Industry (建設業)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Civil engineering, framework, rebar, equipment operation, and site safety (530 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW-FOOD-MANUFACTURING',
    title: 'SSW Food Manufacturing (飲食料品製造業)',
    sector: 'Specified Skilled Worker (SSW)',
    description: 'Food processing lines, HACCP sanitary management, packaging, and factory safety (371 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  },
  {
    category_code: 'SSW2-ACCOMMODATION',
    title: 'SSW 2 Accommodation Management (特定技能2号 宿泊業)',
    sector: 'Specified Skilled Worker (SSW 2)',
    description: 'Advanced hotel management, supervisory operations, safety compliance (580 Qs).',
    is_free: false,
    price_cents: 999,
    price_usd: 9.99,
    currency: 'USD',
    duration_days: 30
  }
];

async function getPortalCategories(req, res) {
  try {
    let user = req.user;
    if (!user && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const uid = decoded.id || decoded.userId;
        if (uid) {
          user = await query.get('SELECT * FROM users WHERE id = ?', [uid]);
        }
      } catch (e) {}
    }

    let userPasses = [];
    let userAcademicRegs = [];
    let registeredCourseCode = null;

    if (user) {
      try {
        userPasses = await query.all(`
          SELECT * FROM exam_practice_passes 
          WHERE user_id = ?
        `, [user.id]);
      } catch (e) {}

      try {
        userAcademicRegs = await query.all(`
          SELECT pr.*, p.program_code 
          FROM program_registrations pr
          JOIN students s ON s.id = pr.student_id
          JOIN programs p ON p.id = pr.program_id
          WHERE s.legacy_user_id = ? AND pr.status IN ('registered', 'in_training')
        `, [user.id]);
      } catch (e) {}

      if (user.course_id) {
        try {
          const c = await query.get('SELECT code FROM courses WHERE id = ?', [user.course_id]);
          if (c) registeredCourseCode = c.code;
        } catch (e) {}
      }
    }

    const categories = ALL_PORTAL_CATEGORIES.map(cat => {
      // JLPT is completely FREE for all users
      if (cat.is_free) {
        return {
          ...cat,
          has_active_pass: Boolean(user), // Authenticated users can practice free
          status: 'free_access',
          valid_until: null,
          is_actionable: true
        };
      }

      // Paid Categories Evaluation
      const activePass = userPasses.find(p => 
        (p.category_code === cat.category_code || (p.category_code === 'SSW-TRUCK' && cat.category_code === 'SSW-TRUCK-DRIVING') || (p.category_code === 'SSW-AIRPORT' && cat.category_code === 'SSW-AIRPORT-GROUND')) &&
        p.is_active === 1 && 
        new Date(p.valid_until) > new Date()
      );

      const expiredPass = userPasses.find(p => 
        (p.category_code === cat.category_code || (p.category_code === 'SSW-TRUCK' && cat.category_code === 'SSW-TRUCK-DRIVING') || (p.category_code === 'SSW-AIRPORT' && cat.category_code === 'SSW-AIRPORT-GROUND')) &&
        (p.is_active === 0 || new Date(p.valid_until) <= new Date())
      );

      let isAcademicCovered = false;
      if (userAcademicRegs.some(r => {
        if (r.program_code === 'YJP' && cat.category_code === 'JFT-BASIC') return true;
        if (r.program_code === 'YTD' && cat.category_code === 'SSW-TRUCK-DRIVING') return true;
        if (r.program_code === 'YAG' && cat.category_code === 'SSW-AIRPORT-GROUND') return true;
        return false;
      })) {
        isAcademicCovered = true;
      }

      let status = 'locked';
      let hasActivePass = false;
      let validUntil = null;

      if (user && user.role === 'admin') {
        status = 'active';
        hasActivePass = true;
      } else if (activePass || isAcademicCovered) {
        status = 'active';
        hasActivePass = true;
        validUntil = activePass ? activePass.valid_until : null;
      } else if (expiredPass) {
        status = 'expired';
        validUntil = expiredPass.valid_until;
      }

      const isUserRegisteredSector = registeredCourseCode === cat.category_code || isAcademicCovered || Boolean(activePass) || Boolean(expiredPass);

      return {
        ...cat,
        has_active_pass: hasActivePass,
        status,
        valid_until: validUntil,
        is_user_registered_sector: isUserRegisteredSector
      };
    });

    // If personalized query is requested, filter to free JLPT + user's active/registered categories
    if (req.query.personalized === 'true' && user && user.role !== 'admin') {
      const personalizedCategories = categories.filter(c => c.is_free || c.is_user_registered_sector || c.has_active_pass);
      return res.json({ categories: personalizedCategories });
    }

    return res.json({ categories });
  } catch (err) {
    console.error('getPortalCategories error:', err);
    return res.status(500).json({ error: 'Failed to fetch exam portal categories.' });
  }
}

async function getExams(req, res) {
  try {
    const user = req.user;
    let sql = `
      SELECT e.*, c.name as course_name, c.code as course_code,
             (SELECT COUNT(*) FROM questions q WHERE q.exam_id = e.id) as question_count
    `;

    if (user) {
      sql += `,
             (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.user_id = ${user.id}) as user_attempts_count,
             (SELECT MAX(score) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.user_id = ${user.id}) as user_best_score,
             (SELECT MAX(percentage) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.user_id = ${user.id}) as user_best_percentage
      `;
    } else {
      sql += `,
             0 as user_attempts_count,
             NULL as user_best_score,
             NULL as user_best_percentage
      `;
    }

    sql += `
      FROM exams e
      JOIN courses c ON e.course_id = c.id
      WHERE e.is_active = 1
    `;

    let params = [];
    if (user && user.role === 'student' && req.query.course_id) {
      sql += ` AND e.course_id = ?`;
      params.push(req.query.course_id);
    }

    sql += ` ORDER BY e.id ASC`;
    const rawExams = await query.all(sql, params);

    // Fetch user passes and academic registrations if user logged in
    let userPasses = [];
    let userAcademicRegs = [];

    if (user) {
      try {
        userPasses = await query.all(`
          SELECT * FROM exam_practice_passes 
          WHERE user_id = ?
        `, [user.id]);
      } catch (e) {}

      try {
        userAcademicRegs = await query.all(`
          SELECT pr.*, p.program_code 
          FROM program_registrations pr
          JOIN students s ON s.id = pr.student_id
          JOIN programs p ON p.id = pr.program_id
          WHERE s.legacy_user_id = ? AND pr.status IN ('registered', 'in_training')
        `, [user.id]);
      } catch (e) {}
    }

    const exams = rawExams.map(exam => {
      const category = resolveExamCategory(exam);
      const isFree = isJlptFreeCategory(category);
      const priceCents = isFree ? 0 : 999;
      const priceUsd = isFree ? 0.00 : 9.99;
      const accessType = isFree ? 'free' : 'paid';
      const durationLabel = isFree ? 'Free Practice' : '1 Month Access';

      let status = isFree ? 'free_access' : 'registration_required';
      let hasActivePass = isFree;
      let validUntil = null;

      if (user) {
        if (user.role === 'admin') {
          status = 'active';
          hasActivePass = true;
        } else if (isFree) {
          status = 'free_access';
          hasActivePass = true;
        } else {
          // Check paid pass
          const activePass = userPasses.find(p =>
            (p.category_code === category ||
             (p.category_code === 'SSW-TRUCK' && category === 'SSW-TRUCK-DRIVING') ||
             (p.category_code === 'SSW-AIRPORT' && category === 'SSW-AIRPORT-GROUND')) &&
            p.is_active === 1 &&
            new Date(p.valid_until) > new Date()
          );

          const expiredPass = userPasses.find(p =>
            (p.category_code === category ||
             (p.category_code === 'SSW-TRUCK' && category === 'SSW-TRUCK-DRIVING') ||
             (p.category_code === 'SSW-AIRPORT' && category === 'SSW-AIRPORT-GROUND')) &&
            (p.is_active === 0 || new Date(p.valid_until) <= new Date())
          );

          let isAcademicCovered = false;
          if (userAcademicRegs.some(r => {
            if (r.program_code === 'YJP' && category === 'JFT-BASIC') return true;
            if (r.program_code === 'YTD' && category === 'SSW-TRUCK-DRIVING') return true;
            if (r.program_code === 'YAG' && category === 'SSW-AIRPORT-GROUND') return true;
            return false;
          })) {
            isAcademicCovered = true;
          }

          if (activePass || isAcademicCovered) {
            status = 'active';
            hasActivePass = true;
            validUntil = activePass ? activePass.valid_until : null;
          } else if (expiredPass) {
            status = 'expired';
            hasActivePass = false;
            validUntil = expiredPass.valid_until;
          } else {
            status = 'locked';
            hasActivePass = false;
          }
        }
      }

      return {
        ...exam,
        category,
        access_type: accessType,
        is_free: isFree,
        price_cents: priceCents,
        price_usd: priceUsd,
        currency: 'USD',
        duration_label: durationLabel,
        status,
        has_active_pass: hasActivePass,
        valid_until: validUntil
      };
    });

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

    const targetCategory = resolveExamCategory(exam);
    const isFree = isJlptFreeCategory(targetCategory);

    // If paid exam, require authenticated user with active pass
    if (!isFree) {
      if (!user) {
        return res.status(401).json({
          error: `🔒 Registration required. Please log in or register to access this paid exam (${targetCategory} - USD 9.99 / 1 Month Access).`,
          code: 'REGISTRATION_REQUIRED',
          is_paid: true,
          required_category: targetCategory,
          price_usd: 9.99,
          price_cents: 999,
          duration_label: '1 Month Access'
        });
      }

      if (user.role === 'student') {
        let activePass = null;
        try {
          activePass = await query.get(`
            SELECT * FROM exam_practice_passes 
            WHERE user_id = ? 
            AND (category_code = ? OR (category_code = 'SSW-TRUCK' AND ? = 'SSW-TRUCK-DRIVING') OR (category_code = 'SSW-AIRPORT' AND ? = 'SSW-AIRPORT-GROUND'))
            AND is_active = 1 AND datetime(valid_until) > datetime('now')
          `, [user.id, targetCategory, targetCategory, targetCategory]);
        } catch (e) {}

        let isAuthorized = Boolean(activePass);

        if (!isAuthorized) {
          try {
            const academicReg = await query.get(`
              SELECT pr.* FROM program_registrations pr
              JOIN students s ON s.id = pr.student_id
              JOIN programs p ON p.id = pr.program_id
              WHERE s.legacy_user_id = ? AND pr.status IN ('registered', 'in_training')
              AND (
                (p.program_code = 'YJP' AND ? = 'JFT-BASIC')
                OR (p.program_code = 'YTD' AND ? = 'SSW-TRUCK-DRIVING')
                OR (p.program_code = 'YAG' AND ? = 'SSW-AIRPORT-GROUND')
              )
            `, [user.id, targetCategory, targetCategory, targetCategory]);

            if (academicReg) {
              isAuthorized = true;
            }
          } catch (e) {}
        }

        if (!isAuthorized) {
          let expiredPass = null;
          try {
            expiredPass = await query.get(`
              SELECT * FROM exam_practice_passes 
              WHERE user_id = ? 
              AND (category_code = ? OR (category_code = 'SSW-TRUCK' AND ? = 'SSW-TRUCK-DRIVING') OR (category_code = 'SSW-AIRPORT' AND ? = 'SSW-AIRPORT-GROUND'))
              ORDER BY valid_until DESC LIMIT 1
            `, [user.id, targetCategory, targetCategory, targetCategory]);
          } catch (e) {}

          if (expiredPass) {
            return res.status(403).json({
              error: `🔒 Your Practice Pass for ${targetCategory} has expired. Please renew your pass (USD 9.99 — 1 Month Access) to continue.`,
              code: 'PASS_EXPIRED',
              required_category: targetCategory,
              requires_subscription: true,
              price_usd: 9.99
            });
          }

          return res.status(403).json({
            error: `🔒 Access to ${targetCategory} requires an active Exam Practice Pass (USD 9.99 — 1 Month Access). Free JLPT or purchasing other SSW categories does not unlock ${targetCategory}.`,
            code: 'CATEGORY_NOT_PURCHASED',
            required_category: targetCategory,
            requires_subscription: true,
            price_usd: 9.99
          });
        }
      }
    }

    const questions = await query.all(`
      SELECT id, exam_id, section_name, question_text, question_type,
             image_url, audio_url, option_a, option_b, option_c, option_d,
             marks, order_num
      FROM questions
      WHERE exam_id = ?
      ORDER BY order_num ASC, id ASC
    `, [id]);

    const isJftExam = exam.course_id === 1 || (exam.title && exam.title.toUpperCase().includes('JFT'));
    const totalMarks = isJftExam ? 250 : questions.reduce((acc, q) => acc + (q.marks || 1), 0);
    const passingScore = isJftExam ? 200 : exam.passing_score;

    return res.json({
      exam: {
        id: exam.id,
        title: exam.title,
        course_name: exam.course_name,
        course_code: exam.course_code,
        category: targetCategory,
        is_free: isFree,
        access_type: isFree ? 'free' : 'paid',
        price_usd: isFree ? 0.00 : 9.99,
        duration_minutes: exam.duration_minutes,
        passing_score: passingScore,
        description: exam.description,
        total_questions: questions.length,
        total_marks: totalMarks,
        is_jft: isJftExam
      },
      questions,
      studentWatermark: {
        student_id: user ? user.student_id : 'GUEST-PRACTICE',
        name: user ? user.name : 'Anonymous Visitor'
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

    const exam = await query.get(`
      SELECT e.*, c.name as course_name, c.code as course_code 
      FROM exams e
      JOIN courses c ON e.course_id = c.id
      WHERE e.id = ?
    `, [id]);
    if (!exam) return res.status(404).json({ error: 'Exam not found.' });

    const targetCategory = resolveExamCategory(exam);
    const isFree = isJlptFreeCategory(targetCategory);

    // Paid category entitlement check
    if (!isFree) {
      if (!user) {
        return res.status(401).json({
          error: `🔒 Registration required to submit attempts for ${targetCategory}.`,
          code: 'REGISTRATION_REQUIRED',
          is_paid: true
        });
      }

      if (user.role === 'student') {
        let activePass = null;
        try {
          activePass = await query.get(`
            SELECT * FROM exam_practice_passes 
            WHERE user_id = ? 
            AND (category_code = ? OR (category_code = 'SSW-TRUCK' AND ? = 'SSW-TRUCK-DRIVING') OR (category_code = 'SSW-AIRPORT' AND ? = 'SSW-AIRPORT-GROUND'))
            AND is_active = 1 AND datetime(valid_until) > datetime('now')
          `, [user.id, targetCategory, targetCategory, targetCategory]);
        } catch (e) {}

        let isAuthorized = Boolean(activePass);

        if (!isAuthorized) {
          try {
            const academicReg = await query.get(`
              SELECT pr.* FROM program_registrations pr
              JOIN students s ON s.id = pr.student_id
              JOIN programs p ON p.id = pr.program_id
              WHERE s.legacy_user_id = ? AND pr.status IN ('registered', 'in_training')
              AND (
                (p.program_code = 'YJP' AND ? = 'JFT-BASIC')
                OR (p.program_code = 'YTD' AND ? = 'SSW-TRUCK-DRIVING')
                OR (p.program_code = 'YAG' AND ? = 'SSW-AIRPORT-GROUND')
              )
            `, [user.id, targetCategory, targetCategory, targetCategory]);

            if (academicReg) {
              isAuthorized = true;
            }
          } catch (e) {}
        }

        if (!isAuthorized) {
          let expiredPass = null;
          try {
            expiredPass = await query.get(`
              SELECT * FROM exam_practice_passes 
              WHERE user_id = ? 
              AND (category_code = ? OR (category_code = 'SSW-TRUCK' AND ? = 'SSW-TRUCK-DRIVING') OR (category_code = 'SSW-AIRPORT' AND ? = 'SSW-AIRPORT-GROUND'))
              ORDER BY valid_until DESC LIMIT 1
            `, [user.id, targetCategory, targetCategory, targetCategory]);
          } catch (e) {}

          if (expiredPass) {
            return res.status(403).json({
              error: `🔒 Your Practice Pass for ${targetCategory} has expired. Please renew your pass to submit attempts.`,
              code: 'PASS_EXPIRED',
              required_category: targetCategory,
              requires_subscription: true
            });
          }

          return res.status(403).json({
            error: `🔒 Access to ${targetCategory} requires an active Exam Practice Pass ($9.99/mo).`,
            code: 'CATEGORY_NOT_PURCHASED',
            required_category: targetCategory,
            requires_subscription: true
          });
        }
      }
    }

    const questions = await query.all(`
      SELECT id, section_name, question_text, image_url, audio_url,
             option_a, option_b, option_c, option_d,
             correct_option, marks, explanation
      FROM questions
      WHERE exam_id = ?
      ORDER BY order_num ASC, id ASC
    `, [id]);

    const isJftExam = exam.course_id === 1 || (exam.title && exam.title.toUpperCase().includes('JFT'));
    let correctCount = 0;
    let rawTotalMarks = 0;
    let rawEarnedMarks = 0;
    const detailedReview = [];

    for (const q of questions) {
      const qMarks = q.marks || 1;
      rawTotalMarks += qMarks;
      const studentChoice = answers ? answers[q.id] : null;
      const isCorrect = studentChoice && studentChoice.toUpperCase() === q.correct_option.toUpperCase();

      if (isCorrect) {
        correctCount++;
        rawEarnedMarks += qMarks;
      }

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

    let finalScore;
    let finalTotalMarks;
    let percentage;
    let passed;

    if (isJftExam) {
      finalTotalMarks = 250;
      finalScore = rawTotalMarks === 250 ? rawEarnedMarks : (questions.length > 0 ? Math.round((correctCount / questions.length) * 250) : 0);
      percentage = Math.round((finalScore / 250) * 1000) / 10;
      passed = finalScore >= 200 ? 1 : 0;
    } else {
      finalTotalMarks = rawTotalMarks;
      finalScore = rawEarnedMarks;
      percentage = finalTotalMarks > 0 ? Math.round((finalScore / finalTotalMarks) * 1000) / 10 : 0;
      passed = percentage >= exam.passing_score ? 1 : 0;
    }

    // If Anonymous User on Free Exam -> Return immediate score without DB pollution
    if (!user) {
      return res.json({
        success: true,
        score: finalScore,
        total_marks: finalTotalMarks,
        percentage,
        passed: !!passed,
        passing_score: isJftExam ? 200 : exam.passing_score,
        time_taken_seconds: timeTakenSeconds || 0,
        tab_switches_count: tabSwitchesCount || 0,
        is_anonymous: true,
        message: 'Practice completed! Create an account to save your exam results permanently.',
        detailedReview,
        exam_title: exam.title,
        category: targetCategory
      });
    }

    // Authenticated User -> Record in exam_attempts
    const result = await query.run(`
      INSERT INTO exam_attempts (
        user_id, exam_id, score, total_marks, percentage, passed,
        answers_json, time_taken_seconds, tab_switches_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      exam.id,
      finalScore,
      finalTotalMarks,
      percentage,
      passed,
      JSON.stringify(answers || {}),
      timeTakenSeconds || 0,
      tabSwitchesCount || 0
    ]);

    return res.json({
      success: true,
      attemptId: result.id,
      score: finalScore,
      total_marks: finalTotalMarks,
      percentage,
      passed: !!passed,
      passing_score: isJftExam ? 200 : exam.passing_score,
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

    if (!user) {
      return res.status(401).json({ error: 'Authentication required to view attempt details.' });
    }

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
  resolveExamCategory,
  isJlptFreeCategory,
  getPortalCategories,
  getExams,
  getExamSession,
  submitExam,
  getMyAttempts,
  getAttemptDetail
};