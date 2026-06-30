/**
 * server/controllers/bookings.controller
 * Translates HTTP requests <-> bookings.service calls. No business logic here.
 */
const bookingsService = require('../services/bookings.service');
const { validateBookingInput } = require('../../shared/validation');
const { HTTP_STATUS } = require('../../shared/constants');

function list(req, res) {
  res.json({ bookings: bookingsService.getAll() });
}

function stats(req, res) {
  res.json(bookingsService.getStats());
}

function getOne(req, res) {
  const booking = bookingsService.getById(req.params.id);
  if (!booking) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Booking not found.' });
  res.json({ booking });
}

/** Public endpoint — called from the booking form on the website. */
async function create(req, res) {
  const { valid, errors } = validateBookingInput(req.body);
  if (!valid) return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errors.join(' ') });

  const booking = await bookingsService.create(req.body);
  res.status(HTTP_STATUS.CREATED).json({ booking });
}

/** Admin-only — change status (pending/confirmed/completed/cancelled). */
async function updateStatus(req, res) {
  const { status } = req.body;
  const { isValidStatus } = require('../../shared/validation');
  if (!isValidStatus(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid status value.' });
  }
  const booking = await bookingsService.updateStatus(req.params.id, status);
  if (!booking) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Booking not found.' });
  res.json({ booking });
}

/** Admin-only — save private notes. */
async function updateNotes(req, res) {
  const booking = await bookingsService.updateNotes(req.params.id, req.body.notes || '');
  if (!booking) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Booking not found.' });
  res.json({ booking });
}

/** Admin-only — mark as read when opened in the inbox. */
async function markRead(req, res) {
  const booking = await bookingsService.markRead(req.params.id);
  if (!booking) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Booking not found.' });
  res.json({ booking });
}

module.exports = { list, stats, getOne, create, updateStatus, updateNotes, markRead };
