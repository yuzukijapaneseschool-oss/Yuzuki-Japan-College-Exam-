const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');

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

  // Course Enrolled, but CBT Exam access is locked until course completion
  return {
    status: 'locked',
    is_active: false,
    plan: 'Course Enrolled (CBT Exam Unlocks Upon Course Completion)',
    days_remaining: 0,
    expires_at: null,
    message: 'CBT Computer-Based Mock Exam access will be unlocked by YUZUKI Japan College administration upon completion of your course curriculum.'
  };
}

// Sequential YJP Student ID Generator (starts from YJP00305 following YJP00304)
async function getNextYjpStudentId() {
  const result = await query.get(`
    SELECT MAX(CAST(SUBSTR(student_id, 4) AS INTEGER)) as max_num 
    FROM users 
    WHERE student_id LIKE 'YJP%' AND student_id NOT LIKE 'YJP-%'
  `);
  
  const currentMax = (result && result.max_num && result.max_num >= 304) ? result.max_num : 304;
  const nextNum = currentMax + 1;
  const padded = String(nextNum).padStart(5, '0');
  return `YJP${padded}`;
}

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

    const course = await query.get('SELECT id, name FROM courses WHERE id = ?', [course_id]);
    if (!course) {
      return res.status(400).json({ error: 'Invalid Course selection.' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Auto-generate the next official sequential YJP ID (e.g. YJP00305)
    const assignedStudentId = await getNextYjpStudentId();

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

    return res.status(201).json({
      success: true,
      message: `Batch Registration & Deposit Slip received! Your official Student ID is ${assignedStudentId}. Course materials and timetables will be provided by Kandy campus. CBT Exam platform will be unlocked upon course completion.`,
      userId: userResult.id,
      student_id: assignedStudentId,
      status: 'pending'
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
}

async function login(req, res) {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Student ID / Email and Password are required.' });
    }

    const cleanIdentifier = identifier.trim();
    const user = await query.get(`
      SELECT u.*, c.name as course_name, c.code as course_code
      FROM users u
      LEFT JOIN courses c ON u.course_id = c.id
      WHERE LOWER(u.email) = LOWER(?) OR UPPER(u.student_id) = UPPER(?)
    `, [cleanIdentifier, cleanIdentifier]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid Student ID / Email or Password.' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Student ID / Email or Password.' });
    }

    if (user.role !== 'admin' && user.status === 'rejected') {
      return res.status(403).json({
        error: 'Your account access has been restricted. Please contact YUZUKI Japan College Kandy.'
      });
    }

    const subscription = getSubscriptionDetails(user);

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        role: user.role,
        student_id: user.student_id,
        course_id: user.course_id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        student_id: user.student_id,
        role: user.role,
        course_id: user.course_id,
        course_name: user.course_name,
        course_code: user.course_code,
        subscription
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

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        student_id: user.student_id,
        role: user.role,
        course_id: user.course_id,
        course_name: course?.name,
        course_code: course?.code,
        subscription
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

module.exports = {
  register,
  login,
  getMe,
  subscribe,
  getNextYjpStudentId
};