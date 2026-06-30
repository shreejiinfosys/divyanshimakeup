/**
 * client/assets/js/main.js
 * Page bootstrap — imports every component and initialises it once the
 * DOM is ready. This is the single <script type="module"> entry point
 * loaded by pages/index.html.
 */
import { initNavbar }              from '../../components/navbar.js';
import { initPreloader }           from '../../components/preloader.js';
import { initScrollFx }            from '../../components/scroll-fx.js';
import { initCursor }              from '../../components/cursor.js';
import { initBeforeAfterSlider }   from '../../components/before-after-slider.js';
import { initTestimonialCarousel } from '../../components/testimonial-carousel.js';
import { initFaqAccordion }        from '../../components/faq-accordion.js';
import { initPortfolioLightbox }   from '../../components/portfolio-lightbox.js';
import { initBookingForm }         from '../../components/booking-form.js';
import { initReelsCarousel }       from '../../components/reels-carousel.js';
import { initImageManager }        from '../../components/image-manager.js';
import { initNewsletter }          from '../../components/newsletter.js';
import { useScrollReveal }         from '../../hooks/useScrollReveal.js';
import { useCounter }              from '../../hooks/useCounter.js';

function setCopyrightYear() {
  const yr = document.getElementById('copy-year');
  if (yr) yr.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initScrollFx();
  initCursor();
  initBeforeAfterSlider();
  initTestimonialCarousel();
  initFaqAccordion();
  initPortfolioLightbox();
  initBookingForm();
  initNewsletter();
  setCopyrightYear();
  useScrollReveal();
  useCounter();

  // Async — fetch from backend, then render
  initReelsCarousel();
  initImageManager();
});
