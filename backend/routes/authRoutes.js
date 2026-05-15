const express = require('express');
const router = express.Router();
const { signup, login, getProfile, getAllUsers } = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { signupValidators, loginValidators } = require('../validators/authValidators');
const validate = require('../middleware/validate');

// Public routes
router.post('/signup', signupValidators, validate, signup);
router.post('/login', loginValidators, validate, login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.get('/users', authenticate, requireAdmin, getAllUsers);

module.exports = router;
