const express = require('express');
const router = express.Router();
const { getAdminDashboard, getMemberDashboard } = require('../controllers/dashboardController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/admin', authenticate, requireAdmin, getAdminDashboard);
router.get('/member', authenticate, getMemberDashboard);

module.exports = router;
