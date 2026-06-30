/**
 * server/models/Booking
 * Plain factory + shape definition for a Booking record.
 * (No ORM in use — this documents and normalises the shape stored in db.json.)
 */
const { generateBookingId } = require('../../shared/helpers');
const { BOOKING_STATUS } = require('../../shared/constants');

/**
 * @param {object} input
 * @returns {import('../../shared/types').Booking}
 */
function createBooking(input) {
  return {
    id: generateBookingId(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    date: input.date,
    service: input.service,
    message: (input.message || '').trim(),
    submittedAt: new Date().toISOString(),
    status: BOOKING_STATUS.PENDING,
    notes: '',
    read: false,
  };
}

module.exports = { createBooking };
