/**
 * client/components/newsletter
 * Footer newsletter signup — shows a thank-you message (no backend wiring
 * yet; hook this up to a real mailing list provider when ready).
 */
export function initNewsletter() {
  window.handleNewsletter = function (event) {
    event.preventDefault();
    const msg = document.getElementById('newsletter-msg');
    msg.classList.remove('opacity-0');
    event.target.reset();
    setTimeout(() => msg.classList.add('opacity-0'), 4000);
  };
}
