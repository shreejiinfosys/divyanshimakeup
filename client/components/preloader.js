/**
 * client/components/preloader
 * Fades out the full-screen preloader once the page has loaded
 * (with a hard timeout fallback so it never gets stuck).
 */
export function initPreloader() {
  const el = document.getElementById('preloader');
  if (!el) return;
  window.addEventListener('load', () => setTimeout(() => el.classList.add('loaded'), 500));
  setTimeout(() => el.classList.add('loaded'), 3500);
}
