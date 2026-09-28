const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');

router.get('/portal/categories', optionalAuth, examController.getPortalCategories);
router.get('/', optionalAuth, examController.getExams);
router.get('/attempts/my', authenticate, examController.getMyAttempts);
router.get('/attempts/:id', optionalAuth, examController.getAttemptDetail);
router.get('/:id/session', optionalAuth, examController.getExamSession);
router.post('/:id/submit', optionalAuth, examController.submitExam);

module.exports = router;
