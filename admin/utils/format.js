/** admin/utils/format — date/time + URL helpers for the admin UI. */
export function fmtDate(s) {
  if (!s) return '—';
  return new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(iso) {
  const d = Date.now() - new Date(iso);
  const m = Math.floor(d / 60000), h = Math.floor(d / 3600000), dy = Math.floor(d / 86400000);
  if (m < 1) return 'Just now';
  if (m < 60) return m + 'm ago';
  if (h < 24) return h + 'h ago';
  if (dy < 7) return dy + 'd ago';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function ytAdminThumb(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

export function getReelPlatform(url) {
  if (/instagram\.com/.test(url)) return 'instagram';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/\.(mp4|webm|mov|m3u8)(\?|#|$)/i.test(url) || /res\.cloudinary\.com\/.+\/video\/upload/.test(url)) return 'video';
  return 'link';
}
