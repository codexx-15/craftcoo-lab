const express = require('express');
const { registerUser, loginUser, getUserProfile, verifyEmail, resendCode } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendCode);
router.get('/profile', protect, getUserProfile);

module.exports = router;
