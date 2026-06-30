/**
 * server/models/Reel
 * Shape definition for a single Reel slot entry.
 */

/**
 * @param {string} url
 * @param {number} position
 * @returns {import('../../shared/types').Reel}
 */
function createReel(url, position) {
  return { url, position };
}

module.exports = { createReel };
