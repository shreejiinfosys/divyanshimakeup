/**
 * client/hooks/useScrollReveal
 * Adds `.in-view` to any `.reveal` element once it scrolls into the viewport.
 * (Function-style "hook" — not React, just a reusable piece of browser logic.)
 */
export function useScrollReveal(selector = '.reveal', threshold = 0.15) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });

  els.forEach((el) => observer.observe(el));
}
