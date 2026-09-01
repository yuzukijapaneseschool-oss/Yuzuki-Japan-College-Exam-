const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Public route for landing page & contact page inquiries
router.post('/', inquiryController.createInquiry);

// Admin-protected routes
router.get('/', authenticate, requireAdmin, inquiryController.getAllInquiries);
router.put('/:id/status', authenticate, requireAdmin, inquiryController.updateInquiryStatus);

module.exports = router;