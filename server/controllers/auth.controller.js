/**
 * server/controllers/auth.controller
 */
const authService = require('../services/auth.service');
const { HTTP_STATUS } = require('../../shared/constants');

function login(req, res) {
  const { username, password } = req.body;
  const { ok, token } = authService.login(username, password);
  if (!ok) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Incorrect username or password.' });
  res.json({ token });
}

function logout(req, res) {
  authService.logout(req.adminToken);
  res.status(HTTP_STATUS.NO_CONTENT).end();
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(currentPassword, newPassword);
  if (!result.ok) return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error });
  res.json({ success: true });
}

module.exports = { login, logout, changePassword };
