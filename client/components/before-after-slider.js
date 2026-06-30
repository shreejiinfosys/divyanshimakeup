/**
 * client/components/before-after-slider
 * Draggable clip-path reveal slider for the "Transformation" section.
 */
export function initBeforeAfterSlider() {
  const wrap = document.getElementById('ba-slider');
  if (!wrap) return;

  const lblB = document.getElementById('ba-lbl-before');
  const lblA = document.getElementById('ba-lbl-after');
  const hint = document.getElementById('ba-hint');

  let pos = 50, target = 50;
  let dragging = false, interacted = false;

  function render(p) {
    wrap.style.setProperty('--pos', p.toFixed(3) + '%');
    if (lblB) lblB.style.opacity = p < 16 ? (p / 16).toFixed(2) : '1';
    if (lblA) lblA.style.opacity = p > 84 ? ((100 - p) / 16).toFixed(2) : '1';
  }

  (function tick() {
    const diff = target - pos;
    if (Math.abs(diff) > 0.008) {
      pos += diff * 0.11;
      render(pos);
    }
    requestAnimationFrame(tick);
  })();

  function clamp(clientX) {
    const r = wrap.getBoundingClientRect();
    return Math.max(3, Math.min(97, ((clientX - r.left) / r.width) * 100));
  }

  function interact() {
    if (!interacted) {
      interacted = true;
      hint && hint.classList.add('gone');
    }
  }

  wrap.addEventListener('pointerdown', (e) => {
    dragging = true;
    interact();
    wrap.setPointerCapture(e.pointerId);
    target = clamp(e.clientX);
    e.preventDefault();
  });
  wrap.addEventListener('pointermove', (e) => { if (dragging) target = clamp(e.clientX); });
  ['pointerup', 'pointercancel'].forEach((ev) => wrap.addEventListener(ev, () => { dragging = false; }));

  wrap.setAttribute('tabindex', '0');
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { target = Math.max(3,  target - 2.5); interact(); }
    if (e.key === 'ArrowRight') { target = Math.min(97, target + 2.5); interact(); }
  });

  let demoRan = false;
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !demoRan) {
        demoRan = true;
        const go = (t, ms) => setTimeout(() => { if (!interacted) target = t; }, ms);
        go(73, 500);
        go(27, 1900);
        go(50, 3400);
        setTimeout(() => { if (!interacted) hint?.classList.add('gone'); }, 3800);
      }
    });
  }, { threshold: 0.55 }).observe(wrap);

  render(50);
}
