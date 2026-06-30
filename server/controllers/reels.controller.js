/**
 * server/controllers/reels.controller
 */
const reelsService = require('../services/reels.service');
const { validateReelUrl } = require('../../shared/validation');
const { HTTP_STATUS } = require('../../shared/constants');

/** Public endpoint — feeds the "On My Feed" carousel. */
function list(req, res) {
  res.json({ reels: reelsService.getAll() });
}

/** Admin-only — replace all 8 slots at once. */
async function setAll(req, res) {
  const urls = Array.isArray(req.body.urls) ? req.body.urls : [];

  for (const url of urls) {
    if (!url) continue; // empty slot is fine
    const { valid, error } = validateReelUrl(url);
    if (!valid) return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: `"${url}": ${error}` });
  }

  const reels = await reelsService.setAll(urls);
  res.json({ reels });
}

module.exports = { list, setAll };
