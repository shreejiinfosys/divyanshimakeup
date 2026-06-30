/**
 * server/services/auth.service
 * Minimal admin authentication using a single shared credential pair
 * stored in db.json, plus signed, expiring in-memory tokens.
 *
 * This is intentionally simple (no bcrypt/JWT dependency) to keep the
 * project dependency-free. Swap in proper hashing + JWT before handling
 * real production traffic with multiple admins.
 */
const crypto = require('crypto');
const db = require('../database');

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const activeTokens = new Map(); // token -> expiresAt

function login(username, password) {
  const { adminAuth } = db.read();
  if (username !== adminAuth.username || password !== adminAuth.password) {
    return { ok: false, token: null };
  }
  const token = crypto.randomBytes(24).toString('hex');
  activeTokens.set(token, Date.now() + TOKEN_TTL_MS);
  return { ok: true, token };
}

function verify(token) {
  if (!token) return false;
  const expiresAt = activeTokens.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    activeTokens.delete(token);
    return false;
  }
  return true;
}

function logout(token) {
  activeTokens.delete(token);
}

async function changePassword(currentPassword, newPassword) {
  const { adminAuth } = db.read();
  if (currentPassword !== adminAuth.password) {
    return { ok: false, error: 'Current password is incorrect.' };
  }
  if (!newPassword || newPassword.length < 4) {
    return { ok: false, error: 'New password must be at least 4 characters.' };
  }
  await db.update((data) => {
    data.adminAuth.password = newPassword;
    return data;
  });
  return { ok: true };
}

module.exports = { login, verify, logout, changePassword };
