/**
 * shared/validation
 * Plain-function validators — no external dependency, runnable in
 * Node (server) and in the browser (client/admin) unchanged.
 */

const { SERVICE_TYPES, BOOKING_STATUS, IMAGE_KEYS } = require('../constants');

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isValidPhone(phone) {
  if (!isNonEmptyString(phone)) return false;
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

function isValidDate(dateStr) {
  if (!isNonEmptyString(dateStr)) return false;
  const d = new Date(dateStr);
  return !Number.isNaN(d.getTime());
}

function isValidService(service) {
  return SERVICE_TYPES.includes(service);
}

function isValidStatus(status) {
  return Object.values(BOOKING_STATUS).includes(status);
}

/**
 * Validates the payload coming from the public booking form.
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateBookingInput(body = {}) {
  const errors = [];
  if (!isNonEmptyString(body.name))    errors.push('Name is required.');
  if (!isValidPhone(body.phone))       errors.push('A valid phone number is required.');
  if (!isValidDate(body.date))         errors.push('A valid event date is required.');
  if (!isValidService(body.service))   errors.push(`Service must be one of: ${SERVICE_TYPES.join(', ')}.`);
  if (body.message && body.message.length > 2000) errors.push('Message is too long (max 2000 characters).');
  return { valid: errors.length === 0, errors };
}

function isValidUrl(url) {
  if (!isNonEmptyString(url)) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** @param {string} url */
function validateReelUrl(url) {
  if (!isValidUrl(url)) return { valid: false, error: 'Enter a valid http(s) URL.' };
  const isInstagram = /instagram\.com/.test(url);
  const isYouTube = /youtube\.com|youtu\.be/.test(url);
  const isVideoFile = /\.(mp4|webm|mov|m3u8)(\?|#|$)/i.test(url) || /res\.cloudinary\.com\/.+\/video\/upload/.test(url);
  if (!isInstagram && !isYouTube && !isVideoFile) {
    return { valid: false, error: 'Only Instagram, YouTube, or direct video (.mp4/.webm/Cloudinary) links are supported.' };
  }
  return { valid: true, error: null };
}

/** @param {string} key @param {string} url */
function validateImageOverride(key, url) {
  const errors = [];
  if (!IMAGE_KEYS.includes(key)) errors.push(`Unknown image key: ${key}`);
  if (!isValidUrl(url)) errors.push('Enter a valid http(s) image URL.');
  return { valid: errors.length === 0, errors };
}

module.exports = {
  isNonEmptyString,
  isValidPhone,
  isValidDate,
  isValidService,
  isValidStatus,
  isValidUrl,
  validateBookingInput,
  validateReelUrl,
  validateImageOverride,
};
