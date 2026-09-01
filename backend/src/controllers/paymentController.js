const { query } = require('../config/database');

async function checkout(req, res) {
  try {
    const user = req.user;
    const { 
      paymentMethod = 'Credit / Debit Card (Visa/Master)', 
      amount = 9.99, 
      currency = 'USD',
      cardHolder = user.name,
      lastFour = '4242'
    } = req.body;

    const now = new Date();
    const invoiceNum = 'YZK-' + now.getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const reference = 'PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Calculate new subscription expiry (30 days from now or extend existing)
    let baseDate = now;
    if (user.subscription_ends_at && new Date(user.subscription_ends_at) > now) {
      baseDate = new Date(user.subscription_ends_at);
    }
    const newExpiry = new Date(baseDate);
    newExpiry.setDate(newExpiry.getDate() + 30);

    // Save payment record
    const payResult = await query.run(`
      INSERT INTO payments (
        user_id, invoice_num, amount, currency, payment_method,
        payment_status, payment_reference, subscription_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      invoiceNum,
      amount,
      currency,
      `${paymentMethod} (Ends in ${lastFour})`,
      'completed',
      reference,
      30
    ]);

    // Update user subscription state and approve account
    await query.run(`
      UPDATE users
      SET status = 'approved',
          subscription_status = 'active',
          subscription_ends_at = ?,
          monthly_price = ?
      WHERE id = ?
    `, [newExpiry.toISOString(), amount, user.id]);

    return res.json({
      success: true,
      message: 'Payment of $9.99 processed successfully! 30-Day Exam Pass activated.',
      payment: {
        id: payResult.id,
        invoice_num: invoiceNum,
        amount,
        currency,
        reference,
        payment_method: paymentMethod,
        card_holder: cardHolder,
        completed_at: now.toISOString()
      },
      subscription: {
        status: 'active',
        is_active: true,
        days_remaining: 30,
        expires_at: newExpiry.toISOString(),
        plan: '$9.99/Month Active Pass'
      }
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Failed to process online checkout.' });
  }
}

async function getMyPayments(req, res) {
  try {
    const user = req.user;
    const payments = await query.all(`
      SELECT p.*, u.name as student_name, u.student_id, u.email
      FROM payments p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [user.id]);
    return res.json({ payments });
  } catch (err) {
    console.error('getMyPayments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve payment history.' });
  }
}

async function getAdminPayments(req, res) {
  try {
    const totalRevenue = await query.get("SELECT SUM(amount) as total FROM payments WHERE payment_status = 'completed'");
    const totalPaymentsCount = await query.get("SELECT COUNT(*) as count FROM payments WHERE payment_status = 'completed'");
    const activeSubscribers = await query.get("SELECT COUNT(*) as count FROM users WHERE subscription_status = 'active' AND datetime(subscription_ends_at) > datetime('now')");

    const payments = await query.all(`
      SELECT p.*, u.name as student_name, u.student_id, u.email, c.name as course_name
      FROM payments p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN courses c ON u.course_id = c.id
      ORDER BY p.created_at DESC
    `);

    return res.json({
      metrics: {
        totalRevenueUSD: totalRevenue?.total ? Math.round(totalRevenue.total * 100) / 100 : 0,
        estimatedLKR: totalRevenue?.total ? Math.round(totalRevenue.total * 305) : 0,
        totalTransactions: totalPaymentsCount ? totalPaymentsCount.count : 0,
        activeSubscribers: activeSubscribers ? activeSubscribers.count : 0
      },
      payments
    });
  } catch (err) {
    console.error('getAdminPayments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin payment analytics.' });
  }
}

module.exports = {
  checkout,
  getMyPayments,
  getAdminPayments
};