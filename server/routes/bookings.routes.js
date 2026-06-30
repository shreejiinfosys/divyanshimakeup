const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookings.controller');
const { requireAdmin } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

// Public — anyone can submit a booking from the website
router.post('/', asyncHandler(ctrl.create));

// Admin-only
router.get('/',                 requireAdmin, asyncHandler(ctrl.list));
router.get('/stats',            requireAdmin, asyncHandler(ctrl.stats));
router.get('/:id',              requireAdmin, asyncHandler(ctrl.getOne));
router.patch('/:id/status',     requireAdmin, asyncHandler(ctrl.updateStatus));
router.patch('/:id/notes',      requireAdmin, asyncHandler(ctrl.updateNotes));
router.patch('/:id/read',       requireAdmin, asyncHandler(ctrl.markRead));

module.exports = router;
