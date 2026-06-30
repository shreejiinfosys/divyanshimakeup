const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reels.controller');
const { requireAdmin } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

// Public — feeds the website's "On My Feed" carousel
router.get('/', asyncHandler(ctrl.list));

// Admin-only — replace all 8 slots
router.put('/', requireAdmin, asyncHandler(ctrl.setAll));

module.exports = router;
