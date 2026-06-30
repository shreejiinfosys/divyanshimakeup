/**
 * client/utils/config
 * Central place to point the frontend at the backend API.
 * Override at deploy time by editing API_BASE_URL below, or by injecting
 * window.__API_BASE_URL__ before this script loads (e.g. from a small
 * inline <script> in pages/index.html if you want per-environment values
 * without rebuilding).
 */
export const API_BASE_URL =
  window.__API_BASE_URL__ || 'http://localhost:5000/api';
