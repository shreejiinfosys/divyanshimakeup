/**
 * admin/assets/js/main.js
 * Admin panel bootstrap — wires up auth, sidebar navigation, and every
 * component. Single <script type="module"> entry point loaded by
 * pages/index.html.
 */
import { isAuthenticated } from '../../services/auth.service.js';
import { initLoginForm } from '../../forms/login-form.js';
import { initSettingsForm } from '../../forms/settings-form.js';
import { initSidebar } from '../../components/sidebar.js';
import { renderDashboard } from '../../components/dashboard.js';
import { renderBookingsList, initBookingsListControls } from '../../components/bookings-list.js';
import { initBookingDetail } from '../../components/booking-detail.js';
import { renderReelSlots, initReelsManagerControls } from '../../components/reels-manager.js';
import { renderImagesManager, initImagesManagerControls } from '../../components/images-manager.js';
import { qs } from '../../utils/dom.js';

function startApp() {
  qs('#tb-date').textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });

  initBookingsListControls();
  initBookingDetail();
  initReelsManagerControls();
  initImagesManagerControls();
  initSettingsForm();

  initSidebar({
    dashboard: renderDashboard,
    bookings: renderBookingsList,
    reels: renderReelSlots,
    images: renderImagesManager,
  });

  window.goTo('dashboard');
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm(startApp);

  if (isAuthenticated()) {
    qs('#login-screen').style.display = 'none';
    qs('#app').style.display = 'flex';
    startApp();
  }
});
