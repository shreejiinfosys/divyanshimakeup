const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { requireAdmin } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.post('/login',  asyncHandler(ctrl.login));
router.post('/logout', requireAdmin, asyncHandler(ctrl.logout));
router.post('/change-password', requireAdmin, asyncHandler(ctrl.changePassword));

module.exports = router;
