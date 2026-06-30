/**
 * server/middleware/auth.middleware
 * Protects admin-only routes. Expects: Authorization: Bearer <token>
 */
const authService = require('../services/auth.service');
const { HTTP_STATUS } = require('../../shared/constants');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!authService.verify(token)) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Unauthorized. Please log in again.' });
  }
  req.adminToken = token;
  next();
}

module.exports = { requireAdmin };
