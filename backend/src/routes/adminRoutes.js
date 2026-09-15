const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All admin routes require authentication and Admin role
router.use(authenticate, requireAdmin);

// Dashboard stats
router.get('/stats', adminController.getStats);

// Student management & approvals
router.get('/students', adminController.getStudents);
router.patch('/students/:id/status', adminController.updateStudentStatus);
router.patch('/students/:id/dual-track', adminController.toggleDualTrack);
router.post('/students/:studentId/extend-subscription', adminController.extendSubscription);
router.delete('/students/:id', adminController.deleteStudent);

// Exam management
router.get('/exams', adminController.getAdminExams);
router.post('/exams', adminController.createExam);
router.put('/exams/:id', adminController.updateExam);
router.delete('/exams/:id', adminController.deleteExam);

// Question management
router.get('/exams/:examId/questions', adminController.getExamQuestions);
router.post('/exams/:examId/questions', adminController.createQuestion);
router.put('/questions/:id', adminController.updateQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);

// Media uploads (image or audio)
router.post('/upload/image', upload.single('image'), adminController.uploadMediaFile);
router.post('/upload/audio', upload.single('audio'), adminController.uploadMediaFile);

// Results analytics
router.get('/results', adminController.getAllResults);

// Database automated snapshot download
router.get('/backup-db', adminController.downloadDatabaseBackup);

module.exports = router;
