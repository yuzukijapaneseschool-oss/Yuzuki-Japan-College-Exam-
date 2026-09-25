const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Public settings route (anyone, guests and students, can check maintenance status)
router.get('/public', settingsController.getPublicSettings);

// Admin-protected routes
router.get('/admin', authenticate, requireAdmin, settingsController.getAdminSettings);
router.put('/admin', authenticate, requireAdmin, settingsController.updateAdminSettings);
router.post('/admin/backup', authenticate, requireAdmin, settingsController.createManualBackup);

module.exports = router;
