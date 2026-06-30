/**
 * admin/services/api.service
 * The ONLY module that talks to the backend. Automatically attaches the
 * admin bearer token (if present) to every request.
 */
import { API_BASE_URL } from '../utils/config.js';
import { getToken } from './auth.service.js';

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ── Auth ──
export const login = (username, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });

export const logout = () => request('/auth/logout', { method: 'POST' });

export const changePassword = (currentPassword, newPassword) =>
  request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

// ── Bookings ──
export const getBookings = () => request('/bookings').then((d) => d.bookings);
export const getBookingStats = () => request('/bookings/stats');
export const updateBookingStatus = (id, status) =>
  request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }).then((d) => d.booking);
export const updateBookingNotes = (id, notes) =>
  request(`/bookings/${id}/notes`, { method: 'PATCH', body: JSON.stringify({ notes }) }).then((d) => d.booking);
export const markBookingRead = (id) =>
  request(`/bookings/${id}/read`, { method: 'PATCH' }).then((d) => d.booking);

// ── Reels ──
export const getReels = () => request('/reels').then((d) => d.reels);
export const setReels = (urls) =>
  request('/reels', { method: 'PUT', body: JSON.stringify({ urls }) }).then((d) => d.reels);

// ── Images ──
export const getImages = () => request('/images').then((d) => d.images);
export const setImages = (images) =>
  request('/images', { method: 'PUT', body: JSON.stringify({ images }) }).then((d) => d.images);
export const clearImage = (key) => request(`/images/${key}`, { method: 'DELETE' }).then((d) => d.images);
export const clearAllImages = () => request('/images', { method: 'DELETE' }).then((d) => d.images);
