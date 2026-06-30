/**
 * server/api
 * Mounts every route module under /api/*. app.js imports just this file.
 */
const express = require('express');
const router = express.Router();

router.use('/bookings', require('../routes/bookings.routes'));
router.use('/reels',    require('../routes/reels.routes'));
router.use('/images',   require('../routes/images.routes'));
router.use('/auth',     require('../routes/auth.routes'));

router.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

module.exports = router;
