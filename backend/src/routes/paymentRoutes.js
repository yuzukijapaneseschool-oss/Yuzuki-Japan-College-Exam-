const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.post('/checkout', authenticate, paymentController.checkout);
router.post('/practice-pass/checkout', authenticate, paymentController.checkoutPracticePass);
router.post('/practice-pass/confirm', authenticate, paymentController.confirmPracticePassPayment);
router.get('/my', authenticate, paymentController.getMyPayments);
router.get('/admin/all', authenticate, requireAdmin, paymentController.getAdminPayments);

module.exports = router;