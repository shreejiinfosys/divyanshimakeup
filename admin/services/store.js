/**
 * admin/services/store
 * Minimal shared UI state — which view is active, current filter/search,
 * selected booking, and a cached copy of bookings so multiple components
 * (dashboard, list, detail) don't each re-fetch independently.
 * Not a full state-management library on purpose — this app is small
 * enough that a plain mutable object is easier to follow.
 */
export const store = {
  currentView: 'dashboard',
  filter: 'all',
  search: '',
  selectedBookingId: null,
  bookings: [],
};
