const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { sendAdmissionCardEmail } = require('../utils/emailService');

function getSubscriptionDetails(user) {
  const now = new Date();
  
  if (user.role === 'admin') {
    return {
      status: 'active',
      is_active: true,
      plan: 'Administrator (Full Lifetime Access)',
      days_remaining: 9999,
      expires_at: null
    };
  }

  // Pending approval
  if (user.status === 'pending') {
    const isSchool = user.batch_mode === 'yjp_school_student' || 
                     user.batch_mode === 'yjp_japanese_only' ||
                     user.batch_mode === 'ytd_truck_only' ||
                     user.batch_mode === 'physical_kandy' ||
                     user.batch_mode === 'online_zoom' ||
                     (user.student_id && (user.student_id.startsWith('YJP') || user.student_id.startsWith('YTD') || user.student_id.startsWith('YAG')));
    return {
      status: 'pending',
      is_active: false,
      plan: isSchool ? 'YUZUKI School Student (Pending Admin Approval)' : 'Registration Pending Approval',
      days_remaining: 0,
      expires_at: null,
      message: isSchool 
        ? 'Your account is pending college administration approval. Your FREE 30-Day CBT Exam Pass will be activated once verified.'
        : 'Your registration is pending verification by college administration.'
    };
  }

  // Check if CBT mock exam access has been unlocked by Admin/Sensei upon course completion
  if (user.subscription_ends_at) {
    const subEnd = new Date(user.subscription_ends_at);
    if (subEnd > now) {
      const diffDays = Math.ceil((subEnd - now) / (1000 * 60 * 60 * 24));
      return {
        status: 'active',
        is_active: true,
        plan: 'CBT Exam Simulator (Active Pass)',
        days_remaining: diffDays,
        expires_at: user.subscription_ends_at
      };
    }
  }

  if (user.trial_ends_at) {
    const trialEnd = new Date(user.trial_ends_at);
    if (trialEnd > now) {
      const diffDays = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
      return {
        status: 'active',
        is_active: true,
        plan: 'CBT Exam Simulator (Special Pass)',
        days_remaining: diffDays,
        expires_at: user.trial_ends_at
      };
    }
  }

  // Course Enrolled, but CBT Exam access is locked until course completion / approval
  return {
    status: 'locked',
    is_active: false,
    plan: 'Course Enrolled (CBT Exam Unlocks Upon Course Completion)',
    days_remaining: 0,
    expires_at: null,
    message: 'CBT Computer-Based Mock Exam access will be unlocked by YUZUKI Japan College administration upon completion of your course curriculum.'
  };
}

// Sequential Student ID Generator
// - Japanese Language Track (Course ID 1, 2, 3, 4) -> 'YJP00305', 'YJP00306', ...
// - SSW Truck Driving Track (Course ID 7) -> 'YTD00101', 'YTD00102', ...
// - Other SSW Tracks (e.g. 5, 6, 8, 9, 10, 11) -> 'YJP00305', ...
async function getNextStudentId(courseId) {
  const numericCourseId = parseInt(courseId, 10);
  let prefix = 'YJP';
  let minStart = 304;

  if (numericCourseId === 7) {
    prefix = 'YTD';
    minStart = 100;
  }

  const prefixLen = prefix.length;
  // Look for highest numerical ID in the database for this prefix
  const result = await query.get(`
    SELECT MAX(CAST(SUBSTR(student_id, ${prefixLen + 1}) AS INTEGER)) as max_num 
    FROM users 
    WHERE student_id LIKE '${prefix}%' AND student_id NOT LIKE '${prefix}-%'
  `);

  const currentMax = (result && result.max_num && Number(result.max_num) >= minStart) 
    ? Number(result.max_num) 
    : minStart;
  const nextNum = currentMax + 1;
  const padded = String(nextNum).padStart(5, '0');
  const candidateId = `${prefix}${padded}`;

  // Double check uniqueness defensively against race conditions
  const exists = await query.get('SELECT id FROM users WHERE UPPER(student_id) = ?', [candidateId.toUpperCase()]);
  if (exists) {
    const fallbackNum = nextNum + 1;
    return `${prefix}${String(fallbackNum).padStart(5, '0')}`;
  }

  return candidateId;
}

// Sequential Student ID Generator for Exam Practice Candidates ('YEP00101', 'YEP00102'...)
async function getNextExamPracticeStudentId() {
  const prefix = 'YEP';
  const minStart = 100;
  const prefixLen = prefix.length;
  const result = await query.get(`
    SELECT MAX(CAST(SUBSTR(student_id, ${prefixLen + 1}) AS INTEGER)) as max_num 
    FROM users 
    WHERE student_id LIKE '${prefix}%' AND student_id NOT LIKE '${prefix}-%'
  `);

  const currentMax = (result && result.max_num && Number(result.max_num) >= minStart) 
    ? Number(result.max_num) 
    : minStart;
  const nextNum = currentMax + 1;
  const padded = String(nextNum).padStart(5, '0');
  const candidateId = `${prefix}${padded}`;

  const exists = await query.get('SELECT id FROM users WHERE UPPER(student_id) = ?', [candidateId.toUpperCase()]);
  if (exists) {
    const fallbackNum = nextNum + 1;
    return `${prefix}${String(fallbackNum).padStart(5, '0')}`;
  }

  return candidateId;
}

// Dedicated Registration for Exam Practice Candidates (No Academic/Deposit Slip requirements)
async function registerExamPractice(req, res) {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      dob,
      nic_number
    } = req.body;

    // 1. Required fields presence & format
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full Name is required.' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Full Name must be at least 2 characters.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email Address is required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
    const cleanPhone = phone.trim();
    const phoneRegex = /^[+]?[0-9\s\-()]{7,25}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please provide a valid phone number.' });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ error: 'Password is required.' });
    }
    if (password.trim().length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword !== undefined && password.trim() !== confirmPassword.trim()) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Optional DOB validation
    let cleanDob = null;
    if (dob && typeof dob === 'string' && dob.trim()) {
      const parsedDate = new Date(dob.trim());
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid Date of Birth format.' });
      }
      cleanDob = dob.trim();
    }

    const cleanNic = (nic_number && typeof nic_number === 'string') ? nic_number.trim() : null;

    // 2. School student identification vs External Candidate
    const providedStudentId = req.body.student_id || req.body.yjp_student_id || req.body.school_student_id;
    const isSchoolStudent = Boolean(
      req.body.is_school_student || 
      (providedStudentId && String(providedStudentId).trim().toUpperCase().startsWith('YJP')) ||
      (providedStudentId && String(providedStudentId).trim().toUpperCase().startsWith('YTD')) ||
      (providedStudentId && String(providedStudentId).trim().toUpperCase().startsWith('YAG'))
    );

    let assignedStudentId;
    let userStatus = 'approved';
    let subscriptionStatus = 'locked';
    let batchMode = 'exam_practice_only';
    let monthlyPrice = 9.99;
    let courseId = null;

    if (isSchoolStudent && providedStudentId) {
      const cleanCustomId = String(providedStudentId).trim().toUpperCase();

      // Impersonation defense: Check if student_id is already assigned to a different user
      const existingUserWithStudentId = await query.get(
        'SELECT id, email, name FROM users WHERE UPPER(student_id) = ?',
        [cleanCustomId]
      );
      if (existingUserWithStudentId && existingUserWithStudentId.email.toLowerCase() !== cleanEmail) {
        return res.status(400).json({
          error: `Student ID "${cleanCustomId}" is already registered. Please log in directly with your registered email or contact college administration.`
        });
      }

      assignedStudentId = cleanCustomId;
      batchMode = 'yjp_school_student';
      userStatus = 'pending'; // Pending Admin confirmation for 30-Day Free JFT Pass
      monthlyPrice = 0.00;
      courseId = cleanCustomId.startsWith('YTD') ? 7 : (cleanCustomId.startsWith('YAG') ? 8 : 1);
    } else {
      // External candidate: Generate sequential YEPxxxxx ID
      assignedStudentId = await getNextExamPracticeStudentId();
      batchMode = 'exam_practice_only';
      userStatus = 'approved';
      subscriptionStatus = 'locked';
      monthlyPrice = 9.99;
    }

    // 3. Email uniqueness check
    const existingUser = await query.get('SELECT id, student_id, role, name FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'An account with this email already exists. Please log in instead.' 
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // 5. Insert user
    const userResult = await query.run(`
      INSERT INTO users (
        name, email, password, student_id, course_id, phone, nic_number, dob,
        city, batch_mode, bank_slip_url, role, status, subscription_status,
        trial_ends_at, subscription_ends_at, monthly_price, allow_dual_track
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Online Practice', ?, NULL, 'student', ?, ?, NULL, NULL, ?, 0)
    `, [
      name.trim(),
      cleanEmail,
      hashedPassword,
      assignedStudentId,
      courseId,
      cleanPhone,
      cleanNic,
      cleanDob,
      batchMode,
      userStatus,
      subscriptionStatus,
      monthlyPrice
    ]);

    console.log(`[Exam Practice Registration] New candidate registered: ${assignedStudentId} (${batchMode}) - ${name.trim()} (${cleanEmail})`);

    // Generate immediate JWT auth token
    const token = jwt.sign(
      {
        id: userResult.id,
        userId: userResult.id,
        role: 'student',
        student_id: assignedStudentId,
        course_id: courseId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const subscription = getSubscriptionDetails({ id: userResult.id, role: 'student', status: userStatus });

    const successMessage = isSchoolStudent
      ? `Account created successfully! Your YUZUKI Student ID is ${assignedStudentId}. As a YUZUKI Japan College student, your 30-Day Free Practice Pass will be activated upon college administration approval.`
      : `Account created successfully! Your Student ID is ${assignedStudentId}.`;

    return res.status(201).json({
      success: true,
      message: successMessage,
      token,
      user: {
        id: userResult.id,
        name: name.trim(),
        email: cleanEmail,
        student_id: assignedStudentId,
        role: 'student',
        status: userStatus,
        subscription,
        active_passes: []
      },
      student_id: assignedStudentId,
      is_school_student: isSchoolStudent
    });

  } catch (err) {
    console.error('Exam practice registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration: ' + err.message });
  }
}

// Backwards compatibility alias
const getNextYjpStudentId = () => getNextStudentId(1);

async function register(req, res) {
  try {
    const { 
      name, 
      email, 
      password, 
      course_id, 
      phone, 
      nic_number,
      city = 'Kandy',
      batch_mode = 'physical_kandy',
      bank_slip_url
    } = req.body;

    if (!name || !email || !password || !course_id) {
      return res.status(400).json({ error: 'Name, Email, Password, and Course selection are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingEmail = await query.get('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const course = await query.get('SELECT id, name, code FROM courses WHERE id = ?', [course_id]);
    if (!course) {
      return res.status(400).json({ error: 'Invalid Course selection.' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Auto-generate the next official sequential ID (e.g. YJP00305, YTD00101)
    const assignedStudentId = await getNextStudentId(course_id);

    const userResult = await query.run(`
      INSERT INTO users (
        name, email, password, student_id, course_id, phone, nic_number, city, batch_mode, bank_slip_url, role, status,
        subscription_status, trial_ends_at, monthly_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name.trim(),
      cleanEmail,
      hashedPassword,
      assignedStudentId,
      course_id,
      phone ? phone.trim() : null,
      nic_number ? nic_number.trim() : null,
      city ? city.trim() : 'Kandy',
      batch_mode || 'physical_kandy',
      bank_slip_url || null,
      'student',
      'pending', // Pending Admin verification of Rs. 5,000 Bank Deposit Slip
      'locked',  // CBT Exam platform locked by default until student completes course
      null,      // No free trial upon registration
      9.99
    ]);

    console.log(`[Registration] New student registered successfully: ${assignedStudentId} - ${name.trim()} (${cleanEmail})`);

    // Dispatch Admission Card copy to College Management & Student
    sendAdmissionCardEmail({
      student_id: assignedStudentId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      nic_number: nic_number ? nic_number.trim() : '',
      city: city ? city.trim() : 'Kandy',
      course_name: course.name,
      batch_mode: batch_mode === 'online_zoom' ? 'Online Live (Zoom)' : 'Physical Classroom (Kandy Campus)',
      bank_slip_url: bank_slip_url || null,
      registration_type: 'New Batch Admission (Rs. 5,000 Deposit Slip Submitted)'
    }).catch(err => console.error('[Registration Email Error]:', err.message));

    return res.status(201).json({
      success: true,
      message: `Batch Registration & Deposit Slip received! Your official Student ID is ${assignedStudentId}. Course materials and timetables will be provided by Kandy campus. CBT Exam platform will be unlocked upon course completion.`,
      userId: userResult.id,
      student_id: assignedStudentId,
      user: {
        id: userResult.id,
        student_id: assignedStudentId,
        name: name.trim(),
        email: cleanEmail,
        status: 'pending'
      },
      status: 'pending'
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration: ' + err.message });
  }
}

async function login(req, res) {
  try {
    const rawIdentifier = req.body.identifier || req.body.emailOrStudentId || req.body.email || req.body.student_id || req.body.username || req.body.loginId;
    const password = req.body.password;
    if (!rawIdentifier || !password) {
      return res.status(400).json({ error: 'Student ID / Email and Password are required.' });
    }

    // Clean and normalize incoming identifier
    let cleanIdentifier = String(rawIdentifier)
      .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
      .replace(/[\u2010-\u2015\u2212\uFF0D]/g, '-')
      .trim();

    const cleanAlphaNum = cleanIdentifier.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const cleanDigits = cleanIdentifier.replace(/[^0-9]/g, '');
    const phoneLast9 = cleanDigits.length >= 9 ? cleanDigits.slice(-9) : (cleanDigits.length >= 7 ? cleanDigits : null);

    // Multi-criteria resilient user lookup (ordered by match accuracy)
    const candidates = await query.all(`
      SELECT u.*, c.name as course_name, c.code as course_code,
        CASE 
          WHEN LOWER(u.email) = LOWER(?) THEN 1
          WHEN UPPER(u.student_id) = UPPER(?) THEN 2
          WHEN LENGTH(?) >= 3 AND REPLACE(REPLACE(REPLACE(UPPER(COALESCE(u.student_id, '')), '-', ''), ' ', ''), '_', '') = ? THEN 3
          WHEN LENGTH(?) >= 6 AND UPPER(REPLACE(REPLACE(COALESCE(u.nic_number, ''), ' ', ''), '-', '')) = ? THEN 4
          WHEN ? IS NOT NULL AND REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(u.phone, ''), ' ', ''), '-', ''), '+', ''), '(', ''), ')', '') LIKE '%' || ? THEN 5
          ELSE 6
        END as match_priority
      FROM users u
      LEFT JOIN courses c ON u.course_id = c.id
      WHERE 
        LOWER(u.email) = LOWER(?)
        OR UPPER(u.student_id) = UPPER(?)
        OR (
          LENGTH(?) >= 3 AND
          REPLACE(REPLACE(REPLACE(UPPER(COALESCE(u.student_id, '')), '-', ''), ' ', ''), '_', '') = ?
        )
        OR (
          ? IS NOT NULL AND
          REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(u.phone, ''), ' ', ''), '-', ''), '+', ''), '(', ''), ')', '') LIKE '%' || ?
        )
        OR (
          LENGTH(?) >= 6 AND
          UPPER(REPLACE(REPLACE(COALESCE(u.nic_number, ''), ' ', ''), '-', '')) = ?
        )
      ORDER BY match_priority ASC, u.id DESC
    `, [
      cleanIdentifier,
      cleanIdentifier,
      cleanAlphaNum,
      cleanAlphaNum,
      cleanAlphaNum,
      cleanAlphaNum,
      phoneLast9,
      phoneLast9,
      cleanIdentifier,
      cleanIdentifier,
      cleanAlphaNum,
      cleanAlphaNum,
      phoneLast9,
      phoneLast9,
      cleanAlphaNum,
      cleanAlphaNum
    ]);

    if (!candidates || candidates.length === 0) {
      return res.status(401).json({ error: 'Invalid Student ID / Email or Password.' });
    }

    const cleanPassword = String(password);
    let matchedUser = null;

    for (const candidate of candidates) {
      let isMatch = await bcrypt.compare(cleanPassword.trim(), candidate.password);
      if (!isMatch && cleanPassword !== cleanPassword.trim()) {
        isMatch = await bcrypt.compare(cleanPassword, candidate.password);
      }
      if (isMatch) {
        matchedUser = candidate;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ error: 'Invalid Student ID / Email or Password.' });
    }

    const user = matchedUser;

    if (user.role !== 'admin' && user.status === 'rejected') {
      return res.status(403).json({
        error: 'Your account access has been restricted. Please contact YUZUKI Japan College Kandy.'
      });
    }

    // Graceful Device Session Registration (allows students to login on mobile phones, browsers, and desktops reliably)
    if (user.role === 'student') {
      const clientDeviceId = (req.headers['x-device-id'] || req.body.deviceId || req.body.device_fingerprint || '').trim();
      const effectiveDeviceId = clientDeviceId || ('DEV_' + Buffer.from((req.headers['user-agent'] || 'device')).toString('base64').substring(0, 16));

      try {
        const activeBinding = await query.get(
          'SELECT * FROM user_device_bindings WHERE user_id = ? AND is_active = 1',
          [user.id]
        );

        if (!activeBinding) {
          await query.run(`
            INSERT INTO user_device_bindings (user_id, device_fingerprint, device_name, is_active)
            VALUES (?, ?, ?, 1)
          `, [user.id, effectiveDeviceId, req.headers['user-agent'] || 'Primary Device']);
        } else {
          await query.run(`
            UPDATE user_device_bindings 
            SET device_fingerprint = ?, device_name = ?, bound_at = CURRENT_TIMESTAMP
            WHERE user_id = ? AND is_active = 1
          `, [effectiveDeviceId, req.headers['user-agent'] || 'Active Device', user.id]);
        }
      } catch (e) {
        console.error('Device session registration error:', e);
      }
    }

    const subscription = getSubscriptionDetails(user);

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        student_id: user.student_id,
        course_id: user.course_id
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const activePasses = await query.all(`
      SELECT category_code, valid_from, valid_until, is_active,
             CAST(MAX(0, ROUND((julianday(valid_until) - julianday('now')))) AS INTEGER) as days_remaining
      FROM exam_practice_passes
      WHERE user_id = ? AND is_active = 1 AND datetime(valid_until) > datetime('now')
      ORDER BY valid_until DESC
    `, [user.id]);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        student_id: user.student_id,
        role: user.role,
        status: user.status || 'approved',
        batch_mode: user.batch_mode,
        course_id: user.course_id,
        course_name: user.course_name,
        course_code: user.course_code,
        allow_dual_track: Boolean(user.allow_dual_track === 1 || user.batch_mode === 'dual_track'),
        subscription,
        active_passes: activePasses || []
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
}

async function getMe(req, res) {
  try {
    const user = req.user;
    const subscription = getSubscriptionDetails(user);
    const course = await query.get('SELECT name, code FROM courses WHERE id = ?', [user.course_id]);
    const activePasses = await query.all(`
      SELECT category_code, valid_from, valid_until, is_active,
             CAST(MAX(0, ROUND((julianday(valid_until) - julianday('now')))) AS INTEGER) as days_remaining
      FROM exam_practice_passes
      WHERE user_id = ? AND is_active = 1 AND datetime(valid_until) > datetime('now')
      ORDER BY valid_until DESC
    `, [user.id]);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        student_id: user.student_id,
        role: user.role,
        status: user.status || 'approved',
        batch_mode: user.batch_mode,
        course_id: user.course_id,
        course_name: course?.name,
        course_code: course?.code,
        allow_dual_track: Boolean(user.allow_dual_track === 1 || user.batch_mode === 'dual_track'),
        subscription,
        active_passes: activePasses || []
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile.' });
  }
}

async function subscribe(req, res) {
  try {
    const user = req.user;
    const { paymentMethod = 'Credit / Debit Card', lastFour = '4242' } = req.body;

    const newSubEndDate = new Date();
    newSubEndDate.setDate(newSubEndDate.getDate() + 30);

    await query.run(`
      UPDATE users
      SET subscription_status = 'active',
          subscription_ends_at = ?,
          monthly_price = 9.99
      WHERE id = ?
    `, [newSubEndDate.toISOString(), user.id]);

    const invoiceNum = 'YZK-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const reference = 'PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    await query.run(`
      INSERT INTO payments (
        user_id, invoice_num, amount, currency, payment_method,
        payment_status, payment_reference, subscription_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      invoiceNum,
      9.99,
      'USD',
      `${paymentMethod} (Ends in ${lastFour})`,
      'completed',
      reference,
      30
    ]);

      return res.json({
        success: true,
        message: 'CBT Exam Simulator pass activated for 30 days!',
        subscription: {
          status: 'active',
          is_active: true,
          days_remaining: 30,
          expires_at: newSubEndDate.toISOString(),
          plan: 'CBT Exam Simulator (Active Pass)'
        }
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to process subscription.' });
    }
  }

async function registerExistingStudent(req, res) {
  try {
    const { 
      name, 
      email, 
      password, 
      student_id, 
      course_id, 
      phone, 
      nic_number,
      city = 'Kandy'
    } = req.body;

    if (!name || !email || !password || !student_id) {
      return res.status(400).json({ error: 'Name, Email, Password, and Student ID are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanStudentId = student_id.trim().toUpperCase();

    // Determine course based on Student ID prefix:
    // YTD prefix -> SSW Truck Driving ONLY (Course ID 7)
    // YJP prefix -> Japanese Language ONLY (Course ID 1)
    let effectiveCourseId = course_id ? parseInt(course_id, 10) : 1;
    let trackName = 'Japanese Language (JFT-Basic / JLPT)';

    if (cleanStudentId.startsWith('YTD')) {
      effectiveCourseId = 7; // SSW Truck Driving
      trackName = 'SSW Truck Driving & Logistics (19 Exams / 583 Furigana Qs)';
    } else if (cleanStudentId.startsWith('YJP')) {
      effectiveCourseId = 1; // JFT-Basic / Japanese Language
      trackName = 'Japanese Language (JFT-Basic / JLPT N5)';
    } else {
      // If student ID is custom format, use requested course or default
      if (effectiveCourseId === 7) {
        trackName = 'SSW Truck Driving & Logistics';
      }
    }

    // Check if email is already taken
    const existingEmail = await query.get('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in or use your primary email.' });
    }

    // Check if Student ID is already registered
    const existingStudent = await query.get('SELECT id, name FROM users WHERE UPPER(student_id) = ?', [cleanStudentId]);
    if (existingStudent) {
      return res.status(400).json({ error: `Student ID "${cleanStudentId}" is already active under ${existingStudent.name}. Please log in directly.` });
    }

    const course = await query.get('SELECT id, name FROM courses WHERE id = ?', [effectiveCourseId]);
    if (!course) {
      return res.status(400).json({ error: 'Invalid Course selection.' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // 30-Day Active CBT Exam Pass for existing college students
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const batchModeStr = cleanStudentId.startsWith('YTD') ? 'ytd_truck_only' : 'yjp_japanese_only';

    const userResult = await query.run(`
      INSERT INTO users (
        name, email, password, student_id, course_id, phone, nic_number, city, batch_mode, bank_slip_url, role, status,
        subscription_status, subscription_ends_at, trial_ends_at, monthly_price, allow_dual_track
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, 0)
    `, [
      name.trim(),
      cleanEmail,
      hashedPassword,
      cleanStudentId,
      effectiveCourseId,
      phone ? phone.trim() : null,
      nic_number ? nic_number.trim() : null,
      city ? city.trim() : 'Kandy',
      batchModeStr,
      null,
      'student',
      'pending', // Mandatory Admin Approval for School Students!
      'locked',  // CBT Exam Pass locked until Admin reviews and approves
      0.00
    ]);

    // Note: Free 30-Day CBT Practice Pass is ONLY activated upon explicit Admin Approval!

    // Create JWT token for immediate access to dashboard (in pending status)
    const token = jwt.sign(
      { 
        id: userResult.id, 
        email: cleanEmail, 
        role: 'student',
        student_id: cleanStudentId,
        name: name.trim(),
        course_id: effectiveCourseId
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Dispatch Admission Card copy to College Management & Student
    sendAdmissionCardEmail({
      student_id: cleanStudentId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      nic_number: nic_number ? nic_number.trim() : '',
      city: city ? city.trim() : 'Kandy',
      course_name: course.name,
      batch_mode: cleanStudentId.startsWith('YTD') ? 'SSW Truck Driving Track' : 'Japanese Language Track',
      bank_slip_url: null,
      registration_type: 'Existing College Student Verification (Pending Admin Approval)'
    }).catch(err => console.error('Admission email notification error:', err));

    const subscription = getSubscriptionDetails({
      id: userResult.id,
      role: 'student',
      status: 'pending',
      batch_mode: batchModeStr,
      student_id: cleanStudentId
    });

    return res.status(201).json({
      success: true,
      message: `🎉 Welcome to YUZUKI Japan College! Registration received for Student ID ${cleanStudentId} (${trackName}). Your account is pending college administration verification. Once approved, your 30-day FREE CBT practice pass will be activated.`,
      token,
      user: {
        id: userResult.id,
        name: name.trim(),
        email: cleanEmail,
        student_id: cleanStudentId,
        role: 'student',
        status: 'pending',
        batch_mode: batchModeStr,
        course_id: effectiveCourseId,
        course_name: course.name,
        allow_dual_track: false,
        subscription,
        active_passes: []
      },
      student_id: cleanStudentId,
      track_name: trackName
    });

  } catch (err) {
    console.error('Existing student registration error:', err);
    return res.status(500).json({ error: 'Internal server error during existing student activation.' });
  }
}

async function changePassword(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const {
      currentPassword,
      current_password,
      newPassword,
      new_password,
      confirmPassword,
      confirm_password,
      confirmNewPassword
    } = req.body;

    const rawCurrent = currentPassword || current_password;
    const rawNew = newPassword || new_password;
    const rawConfirm = confirmPassword || confirm_password || confirmNewPassword;

    if (!rawCurrent || !rawNew) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    const cleanCurrent = String(rawCurrent).trim();
    const cleanNew = String(rawNew).trim();
    const cleanConfirm = rawConfirm ? String(rawConfirm).trim() : null;

    if (cleanConfirm && cleanNew !== cleanConfirm) {
      return res.status(400).json({ error: 'New password and confirmation do not match.' });
    }

    if (cleanNew.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const userRecord = await query.get('SELECT id, password, email, student_id, role, name, course_id FROM users WHERE id = ?', [req.user.id]);
    if (!userRecord) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const isCurrentValid = await bcrypt.compare(cleanCurrent, userRecord.password);
    if (!isCurrentValid) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const isSame = await bcrypt.compare(cleanNew, userRecord.password);
    if (isSame) {
      return res.status(400).json({ error: 'New password cannot be the same as your current password.' });
    }

    const newHashedPassword = await bcrypt.hash(cleanNew, 10);
    await query.run('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, req.user.id]);

    const newToken = jwt.sign(
      {
        id: userRecord.id,
        userId: userRecord.id,
        role: userRecord.role,
        email: userRecord.email,
        name: userRecord.name,
        student_id: userRecord.student_id,
        course_id: userRecord.course_id
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      message: 'Password changed successfully. Please sign in again using your new password.',
      token: newToken,
      user: {
        id: userRecord.id,
        student_id: userRecord.student_id,
        name: userRecord.name,
        email: userRecord.email
      }
    });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ error: 'Internal server error while changing password.' });
  }
}

module.exports = {
  register,
  registerExamPractice,
  registerExistingStudent,
  login,
  getMe,
  subscribe,
  changePassword,
  getNextStudentId,
  getNextYjpStudentId,
  getNextExamPracticeStudentId
};