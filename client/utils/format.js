/** client/utils/format — browser-side mirror of shared/helpers date utilities. */
export function formatDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr.includes('T') ? isoStr : isoStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function extractYouTubeId(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function detectPlatform(url) {
  if (/instagram\.com/.test(url)) return 'instagram';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/\.(mp4|webm|mov|m3u8)(\?|#|$)/i.test(url) || /res\.cloudinary\.com\/.+\/video\/upload/.test(url)) return 'video';
  return 'link';
}
