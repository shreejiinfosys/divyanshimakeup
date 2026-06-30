const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/images.controller');
const { requireAdmin } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

// Public — website fetches overrides on load
router.get('/', asyncHandler(ctrl.list));

// Admin-only
router.put('/',            requireAdmin, asyncHandler(ctrl.setMany));
router.delete('/:key',     requireAdmin, asyncHandler(ctrl.clearOne));
router.delete('/',         requireAdmin, asyncHandler(ctrl.clearAll));

module.exports = router;
