/**
 * shared/types
 * JSDoc type definitions — give editor autocomplete + documentation
 * across server and client without needing a TypeScript build step.
 */

/**
 * @typedef {Object} Booking
 * @property {string} id              e.g. "BK-881024"
 * @property {string} name
 * @property {string} phone
 * @property {string} date            ISO date string (event date)
 * @property {'Bridal'|'Red Carpet'|'Editorial'} service
 * @property {string} message
 * @property {string} submittedAt     ISO datetime string
 * @property {'pending'|'confirmed'|'completed'|'cancelled'} status
 * @property {string} notes           private admin notes
 * @property {boolean} read           has admin opened this inquiry
 */

/**
 * @typedef {Object} Reel
 * @property {string} url             Instagram Reel or YouTube Shorts link
 * @property {number} position        0-7, display order
 */

/**
 * @typedef {Object} ImageOverride
 * @property {string} key             one of shared/constants IMAGE_KEYS
 * @property {string} url             direct image URL
 */

/**
 * @typedef {Object} AdminSession
 * @property {string} token
 * @property {number} expiresAt       epoch ms
 */

module.exports = {}; // type-only module — nothing to export at runtime
