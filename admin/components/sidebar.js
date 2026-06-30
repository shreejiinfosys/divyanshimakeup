/**
 * admin/components/sidebar
 * View switching (Dashboard / Bookings / Reels / Images / Settings) and
 * mobile sidebar toggle. Exposes window.goTo / window.toggleSidebar since
 * pages/index.html calls them via existing inline onclick="" attributes.
 */
import { store } from '../services/store.js';
import { qs } from '../utils/dom.js';

const VIEWS = ['dashboard', 'bookings', 'reels', 'images', 'settings'];
const TITLES = {
  dashboard: 'Dashboard',
  bookings: 'Bookings & Inquiries',
  reels: 'Social Reels',
  images: 'Image Manager',
  settings: 'Settings',
};

/** @param {Record<string, () => void>} onEnter — callback per view, run each time it's opened */
export function initSidebar(onEnter) {
  window.goTo = function (view) {
    VIEWS.forEach((v) => {
      const el = qs('#v-' + v);
      if (el) el.style.display = 'none';
      qs('#nl-' + v)?.classList.remove('active');
    });
    qs('#nl-' + view)?.classList.add('active');
    qs('#tb-title').textContent = TITLES[view] || '';
    store.currentView = view;

    if (view === 'dashboard') {
      const el = qs('#v-dashboard');
      el.style.display = 'block';
      el.classList.remove('fu'); void el.offsetWidth; el.classList.add('fu');
    } else if (view === 'bookings') {
      qs('#v-bookings').style.display = 'flex';
    } else {
      qs('#v-' + view).style.display = 'block';
    }

    onEnter[view]?.();
  };

  window.toggleSidebar = function () {
    qs('#sidebar')?.classList.toggle('open');
  };

  if (window.innerWidth < 900) {
    const burger = qs('#burger');
    if (burger) burger.style.display = 'flex';
  }
}
