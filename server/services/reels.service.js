/**
 * server/services/reels.service
 * Manages the fixed 8-slot reels array.
 */
const db = require('../database');
const { MAX_REELS } = require('../../shared/constants');

function getAll() {
  const reels = db.read().reels || [];
  // Always return exactly MAX_REELS slots (null for empty) so the client
  // can render placeholders without extra logic.
  const slots = Array.from({ length: MAX_REELS }, (_, i) => reels[i] || null);
  return slots;
}

/** @param {(string|null)[]} urls — array of up to 8 URLs, null/empty = empty slot */
async function setAll(urls) {
  const cleaned = urls.slice(0, MAX_REELS).map((u) => (u && u.trim() ? { url: u.trim() } : null));
  await db.update((data) => {
    data.reels = cleaned;
    return data;
  });
  return getAll();
}

module.exports = { getAll, setAll };
