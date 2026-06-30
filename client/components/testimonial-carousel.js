/**
 * client/components/testimonial-carousel
 * Auto-playing quote carousel with dot navigation, pauses on hover.
 */
export function initTestimonialCarousel() {
  const track = document.getElementById('testi-track');
  const dotsWrap = document.getElementById('testi-dots');
  if (!track) return;

  const slides = track.querySelectorAll('.testi-slide');
  let current = 0;
  let autoTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.testi-dot');

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 6000); }
  function stopAuto() { clearInterval(autoTimer); }

  startAuto();
  const section = track.closest('section');
  section.addEventListener('mouseenter', stopAuto);
  section.addEventListener('mouseleave', startAuto);
}
