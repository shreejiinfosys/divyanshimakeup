/**
 * server/index.js
 * Express application entry point.
 *
 * Run:   node server/index.js
 * Env:   PORT (default 5000), CORS_ORIGIN (comma-separated allowed origins)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRouter = require('./api');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──
// Comma-separated list of allowed origins, e.g.:
// CORS_ORIGIN="https://mysite.com,https://admin.mysite.com"
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── API routes ──
app.use('/api', apiRouter);

// ── Optional: serve uploaded files (future use) ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── 404 + error handling (must be last) ──
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Divyanshi Studios API running on http://localhost:${PORT}`);
  logger.info(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});

module.exports = app;
