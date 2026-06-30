/**
 * client/services/api.service
 * The ONLY module that talks to the backend over HTTP. Every component
 * that needs server data imports from here instead of calling fetch()
 * directly — keeps endpoints and error handling in one place.
 */
import { API_BASE_URL } from '../utils/config.js';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

/** Public — fetch all 8 reel slots (null = empty). */
export function getReels() {
  return request('/reels').then((d) => d.reels);
}

/** Public — fetch admin-overridden image URLs, keyed by image slot. */
export function getImages() {
  return request('/images').then((d) => d.images);
}

/** Public — submit the booking form. */
export function createBooking(payload) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((d) => d.booking);
}
