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

async function getOrCreateStudentForUser(user) {
  let student = await query.get('SELECT * FROM students WHERE legacy_user_id = ?', [user.id]);
  if (student) return student;

  let person = await query.get('SELECT * FROM persons WHERE primary_email = ?', [user.email]);
  if (!person) {
    const pUuid = 'P-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const pResult = await query.run(`
      INSERT INTO persons (person_uuid, first_name, last_name, full_name, name_with_initials, primary_email, primary_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      pUuid,
      user.name.split(' ')[0] || user.name,
      user.name.split(' ').slice(1).join(' ') || 'Learner',
      user.name,
      user.name,
      user.email,
      user.phone || '+94770000000'
    ]);
    person = { id: pResult.id };
  }

  const sCode = user.student_id || ('YJ-' + String(user.id).padStart(6, '0'));
  const sResult = await query.run(`
    INSERT INTO students (student_id, person_id, legacy_user_id, enrollment_status)
    VALUES (?, ?, ?, 'active')
  `, [sCode, person.id, user.id]);

  return { id: sResult.id, student_id: sCode, person_id: person.id, legacy_user_id: user.id };
}

async function checkoutPracticePass(req, res) {
  try {
    const user = req.user;
    const { category_code, payment_method = 'Credit / Debit Card (Visa/Master)', last_four = '4242' } = req.body;

    if (['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(category_code)) {
      return res.status(400).json({
        error: `JLPT practice (${category_code}) is completely FREE for all authenticated users. No payment or pass purchase is required.`,
        is_free: true
      });
    }

    const validCategories = [
      'JFT-BASIC',
      'SSW-CAREGIVER',
      'SSW-FOOD-SERVICE',
      'SSW-AGRICULTURE',
      'SSW-ACCOMMODATION',
      'SSW-TRUCK',
      'SSW-TRUCK-DRIVING',
      'SSW-AIRPORT',
      'SSW-AIRPORT-GROUND',
      'SSW-AUTOMOBILE',
      'SSW-CONSTRUCTION',
      'SSW-FOOD-MANUFACTURING',
      'SSW2-ACCOMMODATION'
    ];
    if (!category_code || !validCategories.includes(category_code)) {
      return res.status(400).json({ 
        error: `Invalid category code: ${category_code}. Must be one of: ${validCategories.join(', ')}.` 
      });
    }

    const student = await getOrCreateStudentForUser(user);

    const now = new Date();
    const invoiceNum = 'INV-PASS-' + now.getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 7);

    // Insert Invoice with NULL program_registration_id (Preserves Academic Separation)
    const invResult = await query.run(`
      INSERT INTO invoices (
        invoice_number, student_id, program_registration_id, invoice_date, due_date,
        subtotal_cents, tax_cents, discount_cents, total_cents, paid_cents, balance_due_cents,
        overpaid_credit_cents, currency, status
      ) VALUES (?, ?, NULL, DATE('now'), ?, 999, 0, 0, 999, 0, 999, 0, 'USD', 'unpaid')
    `, [invoiceNum, student.id, dueDate.toISOString().split('T')[0]]);

    // Insert Invoice Item
    await query.run(`
      INSERT INTO invoice_items (
        invoice_id, description, quantity, unit_price_cents, line_total_cents
      ) VALUES (?, ?, 1, 999, 999)
    `, [invResult.id, `Exam Practice Pass (30 Days) - ${category_code}`]);

    return res.json({
      success: true,
      invoice_id: invResult.id,
      invoice_number: invoiceNum,
      amount_cents: 999,
      amount_usd: 9.99,
      currency: 'USD',
      category_code,
      message: `Invoice created for ${category_code} practice pass ($9.99 USD). Ready for card payment confirmation.`
    });
  } catch (err) {
    console.error('checkoutPracticePass error:', err);
    return res.status(500).json({ error: 'Failed to initiate practice pass checkout: ' + err.message });
  }
}

async function confirmPracticePassPayment(req, res) {
  try {
    const user = req.user;
    const { 
      invoice_id, 
      payment_method = 'Credit / Debit Card (Visa/Master)', 
      card_holder = user.name, 
      last_four = '4242',
      payment_status = 'completed',
      failure_reason
    } = req.body;

    if (!invoice_id) {
      return res.status(400).json({ error: 'invoice_id is required.' });
    }

    const invoice = await query.get('SELECT * FROM invoices WHERE id = ?', [invoice_id]);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const invItem = await query.get('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoice.id]);
    const categoryCode = invItem?.description ? invItem.description.split(' - ')[1] : 'JLPT-N5';

    // Handle Payment Failure
    if (payment_status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: failure_reason || 'Card payment declined by issuer.',
        payment_status: 'failed',
        invoice_id: invoice.id,
        category_code: categoryCode
      });
    }

    // Idempotency: Check if completed payment already exists for this invoice
    const existingPayment = await query.get(
      "SELECT * FROM payments WHERE invoice_id = ? AND payment_status = 'completed'", 
      [invoice.id]
    );

    if (existingPayment) {
      const existingPass = await query.get(
        "SELECT * FROM exam_practice_passes WHERE payment_id = ?", 
        [existingPayment.id]
      );
      return res.json({
        success: true,
        message: 'Payment already processed (Idempotent replay)',
        payment: existingPayment,
        pass: existingPass,
        idempotent: true
      });
    }

    // Insert Payment Record
    const reference = 'PAY-PASS-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const payResult = await query.run(`
      INSERT INTO payments (
        user_id, student_id, invoice_id, invoice_num, payment_reference,
        amount_cents, currency, payment_method, payment_status, subscription_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', 30)
    `, [
      user.id,
      invoice.student_id,
      invoice.id,
      invoice.invoice_number,
      reference,
      invoice.total_cents,
      invoice.currency,
      `${payment_method} (Ends in ${last_four})`
    ]);

    // Update Invoice to Paid
    await query.run(`
      UPDATE invoices
      SET paid_cents = ?,
          balance_due_cents = 0,
          status = 'paid',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [invoice.total_cents, invoice.id]);

    // Calculate Expiry Date (1 Calendar Month from now)
    const validUntilDate = new Date();
    validUntilDate.setMonth(validUntilDate.getMonth() + 1);
    const validUntilIso = validUntilDate.toISOString();

    // Insert Category-Level Exam Practice Pass
    const passResult = await query.run(`
      INSERT INTO exam_practice_passes (
        user_id, student_id, category_code, invoice_id, payment_id,
        valid_from, valid_until, is_active
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, 1)
    `, [
      user.id,
      invoice.student_id,
      categoryCode,
      invoice.id,
      payResult.id,
      validUntilIso
    ]);

    const createdPass = await query.get('SELECT * FROM exam_practice_passes WHERE id = ?', [passResult.id]);

    return res.json({
      success: true,
      message: `🎉 Payment verified! Exam Practice Pass for ${categoryCode} is activated for 1 calendar month (USD 9.99 — 1 Month Access).`,
      payment: {
        id: payResult.id,
        payment_reference: reference,
        amount_cents: invoice.total_cents,
        currency: invoice.currency,
        invoice_number: invoice.invoice_number
      },
      pass: createdPass
    });
  } catch (err) {
    console.error('confirmPracticePassPayment error:', err);
    return res.status(500).json({ error: 'Failed to confirm practice pass payment: ' + err.message });
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
    const totalRevenue = await query.get("SELECT SUM(amount_cents) as total_cents FROM payments WHERE payment_status = 'completed'");
    const totalPaymentsCount = await query.get("SELECT COUNT(*) as count FROM payments WHERE payment_status = 'completed'");
    const activePasses = await query.get("SELECT COUNT(*) as count FROM exam_practice_passes WHERE is_active = 1 AND datetime(valid_until) > datetime('now')");

    const payments = await query.all(`
      SELECT p.*, u.name as student_name, u.student_id, u.email
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);

    return res.json({
      metrics: {
        totalRevenueUSD: totalRevenue?.total_cents ? Math.round(totalRevenue.total_cents) / 100 : 0,
        totalTransactions: totalPaymentsCount ? totalPaymentsCount.count : 0,
        activePracticePasses: activePasses ? activePasses.count : 0
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
  checkoutPracticePass,
  confirmPracticePassPayment,
  getMyPayments,
  getAdminPayments
};