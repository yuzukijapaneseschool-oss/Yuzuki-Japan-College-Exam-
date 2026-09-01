const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.post('/checkout', authenticate, paymentController.checkout);
router.get('/my', authenticate, paymentController.getMyPayments);
router.get('/admin/all', authenticate, requireAdmin, paymentController.getAdminPayments);

module.exports = router;