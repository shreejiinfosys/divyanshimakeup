/**
 * admin/components/dashboard
 * Stat cards, pipeline bar, recent inquiries table, and Chart.js trend +
 * service-breakdown charts. Pulls data from the backend via api.service.
 */
import { getBookings, getBookingStats } from '../services/api.service.js';
import { fmtDate, timeAgo } from '../utils/format.js';
import { store } from '../services/store.js';
import { qs } from '../utils/dom.js';

let tChart = null, sChart = null;

export async function renderDashboard() {
  const [bookings, stats] = await Promise.all([getBookings(), getBookingStats()]);
  store.bookings = bookings;

  // Greeting
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning.' : hr < 17 ? 'Good afternoon.' : 'Good evening.';
  qs('#dash-greeting').textContent = greet;

  // Stat cards
  const cards = [
    { label: 'Total Inquiries', val: stats.total,     icon: 'fa-inbox',          hi: false },
    { label: 'Pending Review',  val: stats.pending,   icon: 'fa-clock',          hi: stats.pending > 0 },
    { label: 'Confirmed',       val: stats.confirmed, icon: 'fa-calendar-check', hi: false },
    { label: 'This Month',      val: stats.thisMonth, icon: 'fa-chart-line',     hi: false },
  ];
  qs('#stat-grid').innerHTML = cards.map((c) => `
    <div class="card" style="padding:20px 22px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
        <div class="sec-label" style="margin-bottom:0">${c.label}</div>
        <i class="fa-solid ${c.icon}" style="font-size:.68rem;color:${c.hi ? '#D4AF37' : '#555'}"></i>
      </div>
      <div class="stat-num-lg" style="color:${c.hi ? '#D4AF37' : '#f8f8f8'}">${c.val}</div>
    </div>
  `).join('');

  // Pipeline
  const pipeItems = [
    { label: 'New Inquiries', val: stats.pending,   col: '#fbbf24' },
    { label: 'Confirmed',     val: stats.confirmed, col: '#4ade80' },
    { label: 'Completed',     val: stats.completed, col: '#a5b4fc' },
    { label: 'Cancelled',     val: stats.cancelled, col: '#f87171' },
  ];
  qs('#pipeline').innerHTML = pipeItems.map((p) => `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
        <span style="font-size:.6rem;color:#888">${p.label}</span>
        <span style="font-size:.82rem;color:${p.col};font-weight:500">${p.val}</span>
      </div>
      <div style="height:2px;background:#2a2a2a;border-radius:1px">
        <div style="height:2px;width:${stats.total > 0 ? (p.val / stats.total * 100) : 0}%;background:${p.col};border-radius:1px;transition:width .6s"></div>
      </div>
    </div>
  `).join('');

  // Recent table
  const recent = [...bookings].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5);
  qs('#recent-rows').innerHTML = recent.length
    ? recent.map((b) => `
        <tr onclick="goTo('bookings');setTimeout(()=>selBooking('${b.id}'),120)">
          <td>
            <div style="color:#f8f8f8;font-size:.74rem">${b.name}</div>
            <div style="font-size:.6rem;color:#666;margin-top:2px">${b.phone}</div>
          </td>
          <td style="font-size:.65rem;color:#555;text-transform:uppercase;letter-spacing:.06em">${b.service}</td>
          <td style="color:#888">${fmtDate(b.date)}</td>
          <td style="color:#666">${timeAgo(b.submittedAt)}</td>
          <td><span class="sb sb-${b.status}">${b.status}</span></td>
        </tr>
      `).join('')
    : `<tr><td colspan="5" style="text-align:center;color:#555;padding:22px;font-size:.7rem">No inquiries yet.</td></tr>`;

  renderCharts(bookings);
  window.dispatchEvent(new CustomEvent('bookings:refreshed'));
}

function renderCharts(bookings) {
  const now = new Date();
  const months = [], counts = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short' }));
    counts.push(bookings.filter((b) => {
      const bd = new Date(b.submittedAt);
      return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear();
    }).length);
  }
  const svcs = ['Bridal', 'Red Carpet', 'Editorial'];
  const svcC = svcs.map((s) => bookings.filter((b) => b.service === s).length);

  if (tChart) tChart.destroy();
  if (sChart) sChart.destroy();

  const chartDefaults = { responsive: true, maintainAspectRatio: false, animation: { duration: 600 } };

  tChart = new Chart(document.getElementById('c-trend').getContext('2d'), {
    type: 'bar',
    data: { labels: months, datasets: [{ data: counts, backgroundColor: 'rgba(212,175,55,.12)', borderColor: '#D4AF37', borderWidth: 1, borderRadius: 3, hoverBackgroundColor: 'rgba(212,175,55,.22)' }] },
    options: { ...chartDefaults, plugins: { legend: { display: false }, tooltip: { bodyFont: { family: 'Montserrat', size: 10 }, titleFont: { family: 'Montserrat', size: 10 }, backgroundColor: '#161616', borderColor: '#2a2a2a', borderWidth: 1 } }, scales: { x: { grid: { color: '#222' }, ticks: { color: '#666', font: { size: 9, family: 'Montserrat' } } }, y: { grid: { color: '#222' }, ticks: { color: '#666', font: { size: 9 }, stepSize: 1 }, beginAtZero: true } } },
  });

  sChart = new Chart(document.getElementById('c-svc').getContext('2d'), {
    type: 'doughnut',
    data: { labels: svcs, datasets: [{ data: svcC.every((c) => c === 0) ? [1, 1, 1] : svcC, backgroundColor: ['rgba(212,175,55,.7)', 'rgba(212,175,55,.35)', 'rgba(212,175,55,.15)'], borderColor: ['#D4AF37', '#A8842E', '#6a5520'], borderWidth: 1 }] },
    options: { ...chartDefaults, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#888', font: { size: 9, family: 'Montserrat' }, padding: 10, boxWidth: 9 } }, tooltip: { bodyFont: { family: 'Montserrat', size: 10 }, backgroundColor: '#161616', borderColor: '#2a2a2a', borderWidth: 1 } } },
  });
}
