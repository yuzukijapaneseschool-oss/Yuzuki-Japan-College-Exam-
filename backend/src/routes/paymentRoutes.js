const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// 1. PayHere IPN Webhook (Public POST from PayHere Payment Servers)
router.post('/practice-pass/notify', paymentController.handlePayHereNotify);

// 2. Practice Pass Checkout & Confirmation (Authenticated Student)
router.post('/practice-pass/checkout', authenticate, paymentController.checkoutPracticePass);
router.post('/practice-pass/confirm', authenticate, paymentController.confirmPracticePassPayment);
router.post('/practice-pass/simulate', authenticate, paymentController.simulatePracticePassPayment);

// 3. Legacy Direct Checkout (Backwards Compatibility)
router.post('/checkout', authenticate, paymentController.checkout);

// 4. Student & Admin Payment Analytics
router.get('/my', authenticate, paymentController.getMyPayments);
router.get('/admin/all', authenticate, requireAdmin, paymentController.getAdminPayments);

module.exports = router;