const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, examController.getExams);
router.get('/attempts/my', authenticate, examController.getMyAttempts);
router.get('/attempts/:id', authenticate, examController.getAttemptDetail);
router.get('/:id/session', authenticate, examController.getExamSession);
router.post('/:id/submit', authenticate, examController.submitExam);

module.exports = router;
