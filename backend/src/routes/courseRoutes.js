const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', courseController.getAllCourses);
router.post('/', authenticate, requireAdmin, courseController.createCourse);
router.put('/:id', authenticate, requireAdmin, courseController.updateCourse);
router.delete('/:id', authenticate, requireAdmin, courseController.deleteCourse);

module.exports = router;
