/**
 * admin/forms/settings-form
 * Change-password form + JSON data export. Exposes window.changePass /
 * window.exportData to match existing inline onclick="" handlers.
 */
import { changePassword, getBookings, getReels, getImages } from '../services/api.service.js';
import { qs, toast } from '../utils/dom.js';

export function initSettingsForm() {
  window.changePass = async function () {
    const cur = qs('#s-cur')?.value || '';
    const nw  = qs('#s-new')?.value || '';
    const cf  = qs('#s-cfm')?.value || '';

    if (nw !== cf) return toast('Passwords do not match.');

    try {
      await changePassword(cur, nw);
      qs('#s-cur').value = qs('#s-new').value = qs('#s-cfm').value = '';
      toast('Password updated successfully.');
    } catch (err) {
      toast(err.message);
    }
  };

  window.exportData = async function () {
    const [bookings, reels, images] = await Promise.all([getBookings(), getReels(), getImages()]);
    const payload = { exportedAt: new Date().toISOString(), bookings, reels, images };

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    a.download = `divyanshi-studios-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
}
