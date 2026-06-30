/**
 * client/components/booking-form
 * Submits the public booking form to the backend API instead of
 * localStorage. Exposes handleBooking / closeModal on window since the
 * form markup calls them via inline onsubmit / onclick attributes.
 */
import { createBooking } from '../services/api.service.js';

export function initBookingForm() {
  window.handleBooking = async function (event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    const payload = {
      name:    document.getElementById('name').value.trim(),
      phone:   document.getElementById('phone').value.trim(),
      date:    document.getElementById('date').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim(),
    };

    try {
      await createBooking(payload);
      const modal = document.getElementById('success-modal');
      const modalContent = document.getElementById('modal-content');
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('scale-95');
      modalContent.classList.add('scale-100');
      document.getElementById('booking-form').reset();
    } catch (err) {
      alert(`Could not send your inquiry: ${err.message}\nPlease try again or contact us directly.`);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
    }
  };

  window.closeModal = function () {
    const modal = document.getElementById('success-modal');
    const modalContent = document.getElementById('modal-content');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
  };
}
