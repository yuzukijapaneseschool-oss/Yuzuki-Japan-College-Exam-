const { query } = require('../config/database');
const { getPayHereConfig, generatePayHereHash, verifyPayHereNotifySignature } = require('../utils/payhere');

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
      user.name.split(' ').slice(1).join(' ') || 'Candidate',
      user.name,
      user.name,
      user.email,
      user.phone || '+94770000000'
    ]);
    person = { id: pResult.id };
  }

  student = await query.get('SELECT * FROM students WHERE person_id = ?', [person.id]);
  if (student) {
    await query.run('UPDATE students SET legacy_user_id = ? WHERE id = ?', [user.id, student.id]);
    return { ...student, legacy_user_id: user.id };
  }

  const sCode = user.student_id || ('YEP-' + String(user.id).padStart(5, '0'));
  const sResult = await query.run(`
    INSERT INTO students (student_id, person_id, legacy_user_id, enrollment_status)
    VALUES (?, ?, ?, 'active')
  `, [sCode, person.id, user.id]);

  return { id: sResult.id, student_id: sCode, person_id: person.id, legacy_user_id: user.id };
}

// 1. Initialize PayHere Checkout for Category Practice Pass ($9.99 USD / 30 Days)
async function checkoutPracticePass(req, res) {
  try {
    const user = req.user;
    const { category_code, currency = 'USD' } = req.body;

    if (!category_code) {
      return res.status(400).json({ error: 'category_code is required.' });
    }

    const cleanCategoryCode = category_code.trim().toUpperCase();

    // Check if requested category is free
    if (['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(cleanCategoryCode)) {
      return res.status(400).json({
        error: `JLPT practice (${cleanCategoryCode}) is 100% FREE for all visitors and students. No pass purchase is required.`,
        is_free: true
      });
    }

    // Verify category exists
    let catRecord = await query.get('SELECT * FROM exam_categories WHERE category_code = ?', [cleanCategoryCode]);
    if (!catRecord) {
      // Fallback check against exam controller canonical list
      const { ALL_PORTAL_CATEGORIES } = require('./examController');
      catRecord = ALL_PORTAL_CATEGORIES.find(c => c.category_code === cleanCategoryCode);
    }

    if (!catRecord) {
      return res.status(400).json({
        error: `Invalid or unknown exam category code: ${cleanCategoryCode}.`
      });
    }

    const student = await getOrCreateStudentForUser(user);
    const config = getPayHereConfig();

    const orderId = 'YZK-PP-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    const amount = Number(config.usdPrice).toFixed(2);
    const itemTitle = `YUZUKI CBT Practice Pass - ${catRecord.title || cleanCategoryCode} (30 Days)`;

    // Calculate PayHere MD5 hash
    const hash = generatePayHereHash(
      config.merchantId,
      orderId,
      amount,
      currency,
      config.merchantSecret
    );

    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 7);

    // Create pending invoice
    const invResult = await query.run(`
      INSERT INTO invoices (
        invoice_number, student_id, program_registration_id, invoice_date, due_date,
        subtotal_cents, tax_cents, discount_cents, total_cents, paid_cents, balance_due_cents,
        overpaid_credit_cents, currency, status
      ) VALUES (?, ?, NULL, DATE('now'), ?, 999, 0, 0, 999, 0, 999, 0, ?, 'unpaid')
    `, [orderId, student.id, dueDate.toISOString().split('T')[0], currency]);

    // Create invoice item
    await query.run(`
      INSERT INTO invoice_items (
        invoice_id, description, quantity, unit_price_cents, line_total_cents
      ) VALUES (?, ?, 1, 999, 999)
    `, [invResult.id, `Exam Practice Pass (30 Days) - ${cleanCategoryCode}`]);

    // Name split for PayHere
    const nameParts = (user.name || 'Student').trim().split(' ');
    const firstName = nameParts[0] || 'Student';
    const lastName = nameParts.slice(1).join(' ') || 'Candidate';

    const payhereParams = {
      merchant_id: config.merchantId,
      return_url: config.returnUrl,
      cancel_url: config.cancelUrl,
      notify_url: config.notifyUrl,
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone: user.phone || '0773539800',
      address: 'YUZUKI Japan College Kandy Campus',
      city: user.city || 'Kandy',
      country: 'Sri Lanka',
      order_id: orderId,
      items: itemTitle,
      currency: currency,
      amount: amount,
      hash: hash,
      custom_1: user.id.toString(),
      custom_2: cleanCategoryCode
    };

    return res.json({
      success: true,
      mode: config.mode,
      checkout_url: config.checkoutUrl,
      order_id: orderId,
      invoice_id: invResult.id,
      category_code: cleanCategoryCode,
      category_title: catRecord.title,
      amount_usd: 9.99,
      currency: currency,
      payhere_params: payhereParams,
      message: `PayHere checkout initialized for ${cleanCategoryCode} (USD 9.99 / 30 Days).`
    });

  } catch (err) {
    console.error('checkoutPracticePass error:', err);
    return res.status(500).json({ error: 'Failed to initiate practice pass checkout: ' + err.message });
  }
}

// 2. PayHere IPN Webhook Notification Endpoint (POST /api/payments/practice-pass/notify)
async function handlePayHereNotify(req, res) {
  try {
    const params = req.body;
    console.log('[PayHere IPN Received]:', params);

    const config = getPayHereConfig();

    const isValidSig = verifyPayHereNotifySignature(params, config.merchantSecret);
    if (!isValidSig) {
      console.warn('[PayHere IPN] Invalid MD5 signature from IPN request:', params);
      return res.status(400).send('Invalid signature');
    }

    const {
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      custom_1, // user_id
      custom_2, // category_code
      method = 'PayHere Payment Gateway',
      card_holder_name,
      card_no
    } = params;

    const invoice = await query.get('SELECT * FROM invoices WHERE invoice_number = ?', [order_id]);
    if (!invoice) {
      console.warn('[PayHere IPN] Invoice not found for order_id:', order_id);
      return res.status(404).send('Invoice not found');
    }

    // Strict Amount and Currency Verification against Invoice
    const receivedCents = Math.round(parseFloat(payhere_amount || '0') * 100);
    if (receivedCents !== invoice.total_cents) {
      console.warn(`[PayHere IPN] Amount mismatch for order ${order_id}: Expected ${invoice.total_cents} cents, got ${receivedCents} cents.`);
      return res.status(400).send('Amount mismatch');
    }

    if ((payhere_currency || '').toUpperCase() !== (invoice.currency || '').toUpperCase()) {
      console.warn(`[PayHere IPN] Currency mismatch for order ${order_id}: Expected ${invoice.currency}, got ${payhere_currency}.`);
      return res.status(400).send('Currency mismatch');
    }

    const userId = custom_1 ? parseInt(custom_1, 10) : null;
    const categoryCode = (custom_2 || 'JFT-BASIC').toUpperCase();

    // status_code = 2 means payment was successful
    if (String(status_code) === '2') {
      // Idempotency: Check if completed payment already recorded for this invoice
      const existingPayment = await query.get(
        "SELECT * FROM payments WHERE invoice_id = ? AND payment_status = 'completed'",
        [invoice.id]
      );

      if (existingPayment) {
        console.log('[PayHere IPN] Duplicate notification for already completed invoice:', invoice.id);
        return res.status(200).send('OK (Already processed)');
      }

      // Record Payment
      const paymentMethodStr = card_no 
        ? `${method} (Card ${card_no})` 
        : (method || 'PayHere Gateway');

      let finalPaymentRef = payment_id || ('PAYHERE-' + Date.now());
      const refCheck = await query.get('SELECT id FROM payments WHERE payment_reference = ?', [finalPaymentRef]);
      if (refCheck) {
        finalPaymentRef = `${finalPaymentRef}_${Date.now()}`;
      }

      const payResult = await query.run(`
        INSERT INTO payments (
          user_id, student_id, invoice_id, invoice_num, payment_reference,
          amount_cents, currency, payment_method, payment_status, subscription_days
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', 30)
      `, [
        userId,
        invoice.student_id,
        invoice.id,
        order_id,
        finalPaymentRef,
        Math.round(parseFloat(payhere_amount || '9.99') * 100),
        payhere_currency || 'USD',
        paymentMethodStr
      ]);

      // Update Invoice to Paid
      await query.run(`
        UPDATE invoices
        SET paid_cents = total_cents,
            balance_due_cents = 0,
            status = 'paid',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [invoice.id]);

      // Calculate 30-day Pass Extension or New Activation
      const existingPass = await query.get(`
        SELECT * FROM exam_practice_passes 
        WHERE user_id = ? AND category_code = ? AND is_active = 1 AND datetime(valid_until) > datetime('now')
        ORDER BY valid_until DESC LIMIT 1
      `, [userId, categoryCode]);

      let validFrom = new Date();
      let validUntil = new Date();

      if (existingPass && new Date(existingPass.valid_until) > new Date()) {
        // Extend from current expiration date by +30 days
        validUntil = new Date(existingPass.valid_until);
        validUntil.setDate(validUntil.getDate() + 30);
      } else {
        // New 30 days from now
        validUntil.setDate(validUntil.getDate() + 30);
      }

      await query.run(`
        INSERT INTO exam_practice_passes (
          user_id, student_id, category_code, invoice_id, payment_id,
          valid_from, valid_until, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `, [
        userId,
        invoice.student_id,
        categoryCode,
        invoice.id,
        payResult.id,
        validFrom.toISOString(),
        validUntil.toISOString()
      ]);

      // Update User subscription status
      if (userId) {
        await query.run(`
          UPDATE users
          SET subscription_status = 'active',
              status = 'approved',
              subscription_ends_at = ?,
              monthly_price = 9.99
          WHERE id = ?
        `, [validUntil.toISOString(), userId]);
      }

      console.log(`[PayHere IPN] Successfully activated 30-day pass for User #${userId} (${categoryCode}) until ${validUntil.toISOString()}`);
      return res.status(200).send('OK');

    } else if (String(status_code) === '0') {
      // Payment pending
      console.log('[PayHere IPN] Payment pending for order:', order_id);
      return res.status(200).send('OK (Pending)');
    } else {
      // Payment failed or cancelled (status_code = -1, -2, -3)
      console.log(`[PayHere IPN] Payment status ${status_code} for order:`, order_id);
      await query.run("UPDATE invoices SET status = 'cancelled' WHERE id = ?", [invoice.id]);
      return res.status(200).send('OK (Cancelled/Failed)');
    }

  } catch (err) {
    console.error('handlePayHereNotify error:', err);
    return res.status(500).send('Internal Server Error');
  }
}

// 3. Confirm Practice Pass Payment (Frontend Return or Manual Confirmation)
async function confirmPracticePassPayment(req, res) {
  try {
    const user = req.user;
    const { order_id, invoice_id } = req.body;

    let invoice = null;
    if (order_id) {
      invoice = await query.get('SELECT * FROM invoices WHERE invoice_number = ?', [order_id]);
    } else if (invoice_id) {
      invoice = await query.get('SELECT * FROM invoices WHERE id = ?', [invoice_id]);
    }

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const invItem = await query.get('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoice.id]);
    const categoryCode = invItem?.description ? invItem.description.split(' - ')[1] : 'JFT-BASIC';

    const activePass = await query.get(`
      SELECT * FROM exam_practice_passes 
      WHERE user_id = ? AND category_code = ? AND is_active = 1 AND datetime(valid_until) > datetime('now')
      ORDER BY valid_until DESC LIMIT 1
    `, [user.id, categoryCode]);

    const payment = await query.get('SELECT * FROM payments WHERE invoice_id = ?', [invoice.id]);

    return res.json({
      success: true,
      is_paid: invoice.status === 'paid',
      invoice,
      payment,
      active_pass: activePass,
      category_code: categoryCode
    });

  } catch (err) {
    console.error('confirmPracticePassPayment error:', err);
    return res.status(500).json({ error: 'Failed to check payment status: ' + err.message });
  }
}

// 4. Sandbox Test Simulation Endpoint (POST /api/payments/practice-pass/simulate)
// Safe simulation for test suite and staging validation
async function simulatePracticePassPayment(req, res) {
  try {
    const user = req.user;
    const { category_code } = req.body;

    if (!category_code) {
      return res.status(400).json({ error: 'category_code is required.' });
    }

    const cleanCategoryCode = category_code.trim().toUpperCase();
    const config = getPayHereConfig();

    if ((config.mode === 'live' || config.mode === 'production') && user.role !== 'admin') {
      return res.status(403).json({
        error: 'Simulation endpoint is disabled in live production mode for non-admin accounts.'
      });
    }

    const student = await getOrCreateStudentForUser(user);
    const orderId = 'SIM-PP-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    const paymentId = 'SIM-PAY-' + Date.now();

    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 7);

    // Create Invoice
    const invResult = await query.run(`
      INSERT INTO invoices (
        invoice_number, student_id, program_registration_id, invoice_date, due_date,
        subtotal_cents, tax_cents, discount_cents, total_cents, paid_cents, balance_due_cents,
        overpaid_credit_cents, currency, status
      ) VALUES (?, ?, NULL, DATE('now'), ?, 999, 0, 0, 999, 999, 0, 0, 'USD', 'paid')
    `, [orderId, student.id, dueDate.toISOString().split('T')[0]]);

    // Create Invoice Item
    await query.run(`
      INSERT INTO invoice_items (
        invoice_id, description, quantity, unit_price_cents, line_total_cents
      ) VALUES (?, ?, 1, 999, 999)
    `, [invResult.id, `Exam Practice Pass (30 Days) - ${cleanCategoryCode}`]);

    // Create Completed Payment
    const payResult = await query.run(`
      INSERT INTO payments (
        user_id, student_id, invoice_id, invoice_num, payment_reference,
        amount_cents, currency, payment_method, payment_status, subscription_days
      ) VALUES (?, ?, ?, ?, ?, 999, 'USD', 'PayHere Sandbox Simulation (Visa)', 'completed', 30)
    `, [user.id, student.id, invResult.id, orderId, paymentId]);

    // Calculate 30-day Pass Expiration
    const existingPass = await query.get(`
      SELECT * FROM exam_practice_passes 
      WHERE user_id = ? AND category_code = ? AND is_active = 1 AND datetime(valid_until) > datetime('now')
      ORDER BY valid_until DESC LIMIT 1
    `, [user.id, cleanCategoryCode]);

    let validUntil = new Date();
    if (existingPass && new Date(existingPass.valid_until) > new Date()) {
      validUntil = new Date(existingPass.valid_until);
      validUntil.setDate(validUntil.getDate() + 30);
    } else {
      validUntil.setDate(validUntil.getDate() + 30);
    }

    const passResult = await query.run(`
      INSERT INTO exam_practice_passes (
        user_id, student_id, category_code, invoice_id, payment_id,
        valid_from, valid_until, is_active
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, 1)
    `, [user.id, student.id, cleanCategoryCode, invResult.id, payResult.id, validUntil.toISOString()]);

    await query.run(`
      UPDATE users
      SET subscription_status = 'active',
          status = 'approved',
          subscription_ends_at = ?,
          monthly_price = 9.99
      WHERE id = ?
    `, [validUntil.toISOString(), user.id]);

    const createdPass = await query.get('SELECT * FROM exam_practice_passes WHERE id = ?', [passResult.id]);

    return res.json({
      success: true,
      message: `🎉 Simulated PayHere payment success! 30-Day pass for ${cleanCategoryCode} activated until ${validUntil.toISOString()}.`,
      order_id: orderId,
      payment_id: paymentId,
      pass: createdPass
    });

  } catch (err) {
    console.error('simulatePracticePassPayment error:', err);
    return res.status(500).json({ error: 'Simulation failed: ' + err.message });
  }
}

// 5. Legacy Direct Checkout (Backwards Compatibility)
async function checkout(req, res) {
  return simulatePracticePassPayment(req, res);
}

// 6. Student Payment History & Active Passes
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

    const activePasses = await query.all(`
      SELECT ep.*, ec.title as category_title, ec.sector, ec.price_usd
      FROM exam_practice_passes ep
      LEFT JOIN exam_categories ec ON ep.category_code = ec.category_code
      WHERE ep.user_id = ? AND ep.is_active = 1 AND datetime(ep.valid_until) > datetime('now')
      ORDER BY ep.valid_until DESC
    `, [user.id]);

    return res.json({ payments, active_passes: activePasses });
  } catch (err) {
    console.error('getMyPayments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve payment history.' });
  }
}

// 7. Admin Payment Analytics
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
  checkoutPracticePass,
  handlePayHereNotify,
  confirmPracticePassPayment,
  simulatePracticePassPayment,
  checkout,
  getMyPayments,
  getAdminPayments
};