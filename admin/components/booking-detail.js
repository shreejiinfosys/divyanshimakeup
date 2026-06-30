/**
 * admin/components/booking-detail
 * Detail pane: full inquiry view, status buttons, private notes, WhatsApp
 * deep link. Exposes window.selBooking / window.updStatus / window.saveNotes
 * to match existing inline onclick="" handlers in pages/index.html.
 */
import { updateBookingStatus, updateBookingNotes, markBookingRead } from '../services/api.service.js';
import { fmtDate } from '../utils/format.js';
import { store } from '../services/store.js';
import { qs, toast } from '../utils/dom.js';
import { renderBookingsList, updateBadge } from './bookings-list.js';
import { renderDashboard } from './dashboard.js';

function renderDetail(b) {
  qs('#b-detail').innerHTML = `
    <div class="fu">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #161616">
        <div>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.55rem;font-weight:300;margin-bottom:5px">${b.name}</h2>
          <div style="font-size:.58rem;color:#666;letter-spacing:.08em">Inquiry ID: ${b.id}</div>
        </div>
        <span class="sb sb-${b.status}" style="font-size:.62rem;padding:3px 11px">${b.status}</span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
        ${[['Contact', b.phone], ['Service', b.service], ['Event Date', fmtDate(b.date)]].map(([l, v]) => `
        <div style="background:#111;border:1px solid #252525;border-radius:5px;padding:12px 14px">
          <div style="font-size:.52rem;text-transform:uppercase;letter-spacing:.18em;color:#666;margin-bottom:7px">${l}</div>
          <div style="font-size:.74rem;color:#ccc">${v}</div>
        </div>`).join('')}
      </div>

      <div style="font-size:.6rem;color:#666;margin-bottom:18px;display:flex;align-items:center;gap:6px">
        <i class="fa-regular fa-clock" style="font-size:.58rem"></i>
        Received ${new Date(b.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
      </div>

      <div style="background:#0d0d0d;border:1px solid #161616;border-radius:6px;padding:16px 18px;margin-bottom:16px">
        <div class="sec-label">Client's Message</div>
        <p style="font-size:.74rem;color:#aaa;line-height:1.75">${b.message || '<span style="color:#444">No message provided.</span>'}</p>
      </div>

      <div style="background:#0d0d0d;border:1px solid #161616;border-radius:6px;padding:16px 18px;margin-bottom:16px">
        <div class="sec-label">Update Status</div>
        <div style="display:flex;gap:7px;flex-wrap:wrap">
          ${['pending', 'confirmed', 'completed', 'cancelled'].map((s) => `
          <button onclick="updStatus('${b.id}','${s}')"
            style="font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border-radius:4px;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all .15s;background:${b.status === s ? 'rgba(212,175,55,.1)' : 'transparent'};color:${b.status === s ? '#D4AF37' : '#3a3a3a'};border:1px solid ${b.status === s ? 'rgba(212,175,55,.25)' : '#222'}">
            ${s}
          </button>`).join('')}
        </div>
      </div>

      <div style="background:#0d0d0d;border:1px solid #161616;border-radius:6px;padding:16px 18px">
        <div class="sec-label">Private Notes</div>
        <textarea class="ai" id="n-${b.id}" rows="3" style="resize:none;margin-bottom:11px" placeholder="Trial date, product preferences, follow-up tasks…">${b.notes || ''}</textarea>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn-g" onclick="saveNotes('${b.id}')">Save Notes</button>
          <a href="https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.name)}%2C%20this%20is%20Divyanshi's%20team%20regarding%20your%20booking%20inquiry."
            target="_blank" rel="noopener"
            style="font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:#25D366;text-decoration:none;display:flex;align-items:center;gap:5px;border:1px solid rgba(37,211,102,.18);padding:6px 13px;border-radius:4px;transition:background .2s"
            onmouseover="this.style.background='rgba(37,211,102,.05)'" onmouseout="this.style.background='transparent'">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;
}

export function initBookingDetail() {
  window.selBooking = async function (id) {
    store.selectedBookingId = id;
    let b = store.bookings.find((x) => x.id === id);
    if (!b) return;

    if (!b.read) {
      b = await markBookingRead(id);
      const idx = store.bookings.findIndex((x) => x.id === id);
      if (idx > -1) store.bookings[idx] = b;
    }

    await renderBookingsList();
    renderDetail(b);
    updateBadge();
    qs('#booking-detail-pane')?.classList.add('active');
  };

  window.updStatus = async function (id, status) {
    const b = await updateBookingStatus(id, status);
    const idx = store.bookings.findIndex((x) => x.id === id);
    if (idx > -1) store.bookings[idx] = b;

    renderDetail(b);
    await renderBookingsList();
    if (store.currentView === 'dashboard') renderDashboard();
    toast('Status → ' + status);
  };

  window.saveNotes = async function (id) {
    const notes = qs(`#n-${id}`)?.value || '';
    const b = await updateBookingNotes(id, notes);
    const idx = store.bookings.findIndex((x) => x.id === id);
    if (idx > -1) store.bookings[idx] = b;
    toast('Notes saved.');
  };
}
