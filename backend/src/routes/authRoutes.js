const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', authController.register);
router.post('/register-existing', authController.registerExistingStudent);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/subscribe', authenticate, authController.subscribe);

// Public file upload for Bank Deposit Slips & Transfer Receipts
router.post('/upload-slip', upload.single('slip'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No slip file uploaded.' });
    }
    const slipUrl = `/uploads/images/${req.file.filename}`;
    return res.json({ success: true, url: slipUrl, filename: req.file.filename });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to upload slip file.' });
  }
});

module.exports = router;