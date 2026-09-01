const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'yuzuki_japan_college_secret_key_2026_super_secure';

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token missing or invalid. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const targetId = decoded.id || decoded.userId;

    if (!targetId) {
      return res.status(401).json({ error: 'Invalid token payload.' });
    }

    const user = await query.get(
      'SELECT id, name, email, student_id, course_id, role, status, phone, subscription_status, trial_ends_at, subscription_ends_at FROM users WHERE id = ?',
      [targetId]
    );

    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }

    if (user.role !== 'admin' && user.status === 'rejected') {
      return res.status(403).json({ 
        error: 'Your account access has been restricted by the administrator.' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth verification error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired session token. Please log in again.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required to perform this action.' });
  }
  next();
}

module.exports = {
  JWT_SECRET,
  authenticate,
  requireAdmin
};