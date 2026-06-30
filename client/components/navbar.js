/**
 * client/components/navbar
 * Mobile menu toggle, navbar glass effect on scroll, close-on-link-click,
 * and close-on-outside-click.
 */
import { qs, qsa, on } from '../utils/dom.js';

export function initNavbar() {
  const btn = qs('#mobile-menu-btn');
  const menu = qs('#mobile-menu');
  const nav = qs('#navbar');
  if (!btn || !menu) return;
  const icon = btn.querySelector('i');

  function closeMenu() {
    menu.classList.add('hidden');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }

  on(btn, 'click', () => {
    menu.classList.toggle('hidden');
    if (menu.classList.contains('hidden')) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    } else {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    }
  });

  on(window, 'scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('glass-nav', 'py-4');
      nav.classList.remove('py-6');
    } else {
      nav.classList.remove('glass-nav');
      nav.classList.add('py-6');
      nav.classList.remove('py-4');
    }
  });

  qsa('a', menu).forEach((link) => on(link, 'click', closeMenu));

  on(document, 'click', (e) => {
    if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });
}
