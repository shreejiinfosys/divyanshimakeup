/**
 * server/controllers/images.controller
 */
const imagesService = require('../services/images.service');
const { validateImageOverride } = require('../../shared/validation');
const { HTTP_STATUS } = require('../../shared/constants');

/** Public endpoint — public site fetches these on load to override default photos. */
function list(req, res) {
  res.json({ images: imagesService.getAll() });
}

/** Admin-only — bulk save (blank value = restore default for that key). */
async function setMany(req, res) {
  const overrides = req.body.images || {};
  for (const [key, url] of Object.entries(overrides)) {
    if (!url) continue; // blank = clear, always allowed
    const { valid, errors } = validateImageOverride(key, url);
    if (!valid) return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errors.join(' ') });
  }
  const images = await imagesService.setMany(overrides);
  res.json({ images });
}

/** Admin-only — restore one slot to its default. */
async function clearOne(req, res) {
  const images = await imagesService.clearOne(req.params.key);
  res.json({ images });
}

/** Admin-only — restore all slots to defaults. */
async function clearAll(req, res) {
  const images = await imagesService.clearAll();
  res.json({ images });
}

module.exports = { list, setMany, clearOne, clearAll };
