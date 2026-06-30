/**
 * server/middleware/errorHandler
 * Centralised Express error handler — must be registered LAST in app.js.
 */
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../../shared/constants');

function notFound(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message || err);
  const status = err.status || HTTP_STATUS.SERVER_ERROR;
  res.status(status).json({ error: err.message || 'Internal server error.' });
}

module.exports = { notFound, errorHandler };
