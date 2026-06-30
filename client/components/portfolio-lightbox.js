/**
 * client/components/portfolio-lightbox
 * Full-screen image viewer for the portfolio grid. Exposes openLightbox /
 * closeLightbox / navLightbox on `window` since the grid markup calls them
 * via inline onclick="" attributes (kept simple — no event-delegation layer).
 */
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512496015851-a1cbfc34384a?q=80&w=2070&auto=format&fit=crop',
];

/** Mutable so the Image Manager component can override entries after fetching admin data. */
export const portfolioImages = [...DEFAULT_IMAGES];

let lightboxIndex = 0;

export function initPortfolioLightbox() {
  window.openLightbox = function (index) {
    lightboxIndex = index;
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = portfolioImages[lightboxIndex];
    lb.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => img.classList.remove('scale-95'), 10);
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    lb.classList.add('opacity-0', 'pointer-events-none');
    img.classList.add('scale-95');
    document.body.style.overflow = '';
  };

  window.navLightbox = function (dir) {
    lightboxIndex = (lightboxIndex + dir + portfolioImages.length) % portfolioImages.length;
    document.getElementById('lightbox-img').src = portfolioImages[lightboxIndex];
  };

  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb || lb.classList.contains('opacity-0')) return;
    if (e.key === 'Escape')     window.closeLightbox();
    if (e.key === 'ArrowRight') window.navLightbox(1);
    if (e.key === 'ArrowLeft')  window.navLightbox(-1);
  });
}
