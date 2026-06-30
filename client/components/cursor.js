/**
 * client/components/cursor
 * Custom magnetic-ring cursor — desktop / fine-pointer devices only.
 */
export function initCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  if (!cursorDot || !cursorRing) return;

  if (!window.matchMedia('(pointer: fine)').matches) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .ba-wrap, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('cursor-grow');
      cursorRing.textContent = el.dataset.cursor || '';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('cursor-grow');
      cursorRing.textContent = '';
    });
  });
}
