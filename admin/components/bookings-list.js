/**
 * admin/components/bookings-list
 * The inbox-style list pane: filter tabs, search, unread badge.
 * Exposes window.setFilter / window.doSearch / window.selBooking (the
 * latter implemented in booking-detail.js) to match existing inline
 * onclick="" handlers in pages/index.html.
 */
import { getBookings } from '../services/api.service.js';
import { fmtDate, timeAgo } from '../utils/format.js';
import { store } from '../services/store.js';
import { qs, qsa } from '../utils/dom.js';

export async function renderBookingsList() {
  let bookings = store.bookings.length ? store.bookings : await getBookings();
  store.bookings = bookings;

  let bs = [...bookings];
  if (store.filter !== 'all') bs = bs.filter((b) => b.status === store.filter);
  if (store.search) {
    const q = store.search.toLowerCase();
    bs = bs.filter((b) => b.name.toLowerCase().includes(q) || b.service.toLowerCase().includes(q) || b.phone.includes(q));
  }
  bs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const el = qs('#b-list');
  if (!bs.length) {
    el.innerHTML = '<div class="empty-s"><i class="fa-regular fa-folder-open" style="font-size:1.8rem"></i><div style="font-size:.65rem;letter-spacing:.1em;text-transform:uppercase">No inquiries found</div></div>';
    updateBadge();
    return;
  }

  el.innerHTML = bs.map((b) => `
    <div class="booking-item ${b.read ? '' : 'unread'} ${store.selectedBookingId === b.id ? 'sel' : ''}" onclick="selBooking('${b.id}')">
      ${!b.read ? '<div class="unread-dot"></div>' : ''}
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:5px">
        <div style="font-size:.75rem;color:${b.read ? '#bbb' : '#f8f8f8'};font-weight:${b.read ? 300 : 400}">${b.name}</div>
        <span class="sb sb-${b.status}" style="flex-shrink:0">${b.status}</span>
      </div>
      <div style="font-size:.6rem;color:#777;letter-spacing:.04em;margin-bottom:5px">${b.service} · ${fmtDate(b.date)}</div>
      <div style="font-size:.66rem;color:#888;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:250px">${b.message}</div>
      <div style="font-size:.56rem;color:#666;margin-top:7px">${timeAgo(b.submittedAt)}</div>
    </div>
  `).join('');

  updateBadge();
}

export function updateBadge() {
  const n = store.bookings.filter((b) => !b.read).length;
  const el = qs('#notif-count');
  if (!el) return;
  el.style.display = n > 0 ? 'flex' : 'none';
  el.textContent = n;
}

export function initBookingsListControls() {
  window.setFilter = function (f) {
    store.filter = f;
    qsa('.filter-tab').forEach((t) => t.classList.remove('active'));
    qs('#ft-' + f)?.classList.add('active');
    store.selectedBookingId = null;
    qs('#b-detail').innerHTML = '<div class="empty-s"><i class="fa-regular fa-envelope-open" style="font-size:2rem"></i><div style="font-size:.65rem;letter-spacing:.12em;text-transform:uppercase">Select an inquiry</div></div>';
    qs('#booking-detail-pane')?.classList.remove('active');
    renderBookingsList();
  };

  window.doSearch = function (q) {
    store.search = q;
    renderBookingsList();
  };
}
