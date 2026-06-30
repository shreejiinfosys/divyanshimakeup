/**
 * server/services/bookings.service
 * Business logic for bookings — the only layer that touches the database
 * for this domain. Controllers call these functions; they never read db.json directly.
 */
const db = require('../database');
const { createBooking } = require('../models/Booking');

function getAll() {
  return db.read().bookings;
}

function getById(id) {
  return db.read().bookings.find((b) => b.id === id) || null;
}

/** @param {object} input @returns {Promise<import('../../shared/types').Booking>} */
async function create(input) {
  const booking = createBooking(input);
  await db.update((data) => {
    data.bookings.unshift(booking);
    return data;
  });
  return booking;
}

/** @param {string} id @param {string} status */
async function updateStatus(id, status) {
  let updated = null;
  await db.update((data) => {
    const b = data.bookings.find((x) => x.id === id);
    if (b) { b.status = status; updated = b; }
    return data;
  });
  return updated;
}

/** @param {string} id @param {string} notes */
async function updateNotes(id, notes) {
  let updated = null;
  await db.update((data) => {
    const b = data.bookings.find((x) => x.id === id);
    if (b) { b.notes = notes; updated = b; }
    return data;
  });
  return updated;
}

/** @param {string} id */
async function markRead(id) {
  let updated = null;
  await db.update((data) => {
    const b = data.bookings.find((x) => x.id === id);
    if (b) { b.read = true; updated = b; }
    return data;
  });
  return updated;
}

function getStats() {
  const bookings = getAll();
  const now = new Date();
  const thisMonth = bookings.filter((b) => {
    const d = new Date(b.submittedAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    thisMonth,
    unread: bookings.filter((b) => !b.read).length,
  };
}

module.exports = { getAll, getById, create, updateStatus, updateNotes, markRead, getStats };
