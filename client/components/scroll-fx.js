/**
 * client/components/scroll-fx
 * Top scroll-progress bar + "back to top" button visibility.
 */
export function initScrollFx() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  if (!progressBar && !backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (progressBar) {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progressBar.style.width = scrolled + '%';
    }
    if (backToTopBtn) {
      backToTopBtn.style.opacity = window.scrollY > 600 ? '1' : '0';
      backToTopBtn.style.pointerEvents = window.scrollY > 600 ? 'auto' : 'none';
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}
