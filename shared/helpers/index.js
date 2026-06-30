/**
 * shared/helpers
 * Small, pure utility functions shared by server and client code.
 */

/** Generates a booking ID like "BK-881024". */
function generateBookingId() {
  const n = Date.now().toString().slice(-6);
  return `BK-${n}`;
}

/** Generic short unique ID (for reels/images entries if ever needed). */
function generateId(prefix = 'ID') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Formats an ISO date string as "12 Jan 2026". */
function formatDate(isoStr, locale = 'en-IN') {
  if (!isoStr) return '—';
  const d = new Date(isoStr.includes('T') ? isoStr : isoStr + 'T00:00:00');
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Formats an ISO datetime as a relative "3h ago" style string. */
function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(isoStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Extracts a YouTube video ID from a watch/shorts/short-link URL. */
function extractYouTubeId(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

/** Returns 'instagram' | 'youtube' | 'link' for a given URL. */
function detectPlatform(url) {
  if (/instagram\.com/.test(url)) return 'instagram';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  return 'link';
}

module.exports = {
  generateBookingId,
  generateId,
  formatDate,
  timeAgo,
  extractYouTubeId,
  detectPlatform,
};
