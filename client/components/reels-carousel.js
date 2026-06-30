/**
 * client/components/reels-carousel
 * Glassmorphism "On My Feed" carousel — fetches up to 8 reel links from
 * the backend, shows 4 at a time, supports drag / swipe / arrow navigation.
 */
import { getReels } from '../services/api.service.js';
import { extractYouTubeId, detectPlatform } from '../utils/format.js';

const TOTAL = 8;

let igScriptPromise = null;
function loadInstagramEmbedScript() {
  if (igScriptPromise) return igScriptPromise;
  igScriptPromise = new Promise((resolve, reject) => {
    if (window.instgrm) return resolve(window.instgrm);
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => resolve(window.instgrm);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return igScriptPromise;
}

export async function initReelsCarousel() {
  const track   = document.getElementById('reels-track');
  const prevBtn = document.getElementById('reel-prev');
  const nextBtn = document.getElementById('reel-next');
  const dotsEl  = document.getElementById('reel-dots');
  if (!track) return;

  let current = 0;
  let dragState = null;
  let reels = [];

  try {
    reels = await getReels();
  } catch {
    reels = Array(TOTAL).fill(null);
  }

  function visibleCount() {
    const w = window.innerWidth;
    if (w < 480)  return 1;
    if (w < 768)  return 2;
    if (w < 1024) return 3;
    return 4;
  }
  function stepPx() {
    const card = track.querySelector('.reel-card, .reel-empty');
    return card ? card.offsetWidth + 14 : 0;
  }
  function maxStep() { return Math.max(0, TOTAL - visibleCount()); }

  // YouTube's (and any browser's native) fullscreen API forces the device
  // into landscape even for a portrait reel. We can't touch the control
  // inside the cross-origin YouTube iframe, so instead we offer our own
  // "expand" button that enlarges the card via CSS only — no Fullscreen
  // API call, no orientation rotation, stays portrait.
  function addExpandToggle(card) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reel-expand-btn';
    btn.setAttribute('aria-label', 'Expand reel');
    btn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = card.classList.toggle('reel-fullscreen');
      btn.innerHTML = isOpen ? '<i class="fa-solid fa-compress"></i>' : '<i class="fa-solid fa-expand"></i>';
      document.body.classList.toggle('reel-fullscreen-active', isOpen);
    });
    card.appendChild(btn);
  }

  function closeFullscreenCard() {
    const open = track.querySelector('.reel-card.reel-fullscreen');
    if (!open) return;
    open.classList.remove('reel-fullscreen');
    open.querySelector('.reel-expand-btn').innerHTML = '<i class="fa-solid fa-expand"></i>';
    document.body.classList.remove('reel-fullscreen-active');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFullscreenCard();
  });

  function playInline(card) {
    const url = card.dataset.reelUrl;
    const platform = card.dataset.platform;

    if (platform === 'video') {
      // Mobile browsers block unmuted autoplay even on a direct tap — start
      // muted (guaranteed to play) and let the native controls unmute.
      // controlsList="nofullscreen" hides the native fullscreen button —
      // our own "expand" button (added below) replaces it, since the
      // native one goes blank on some mobile browsers for portrait video.
      card.innerHTML = `<video src="${url}" controls controlsList="nofullscreen noremoteplayback" disablePictureInPicture autoplay muted playsinline></video>`;
      card.classList.add('is-playing');
      addExpandToggle(card);
      return;
    }

    const ytId = extractYouTubeId(url);
    if (!ytId) { window.open(url, '_blank', 'noopener,noreferrer'); return; }
    // mute=1 — a cross-origin iframe doesn't inherit our page's user-gesture
    // "permission" to autoplay with sound, so mobile silently refuses to
    // play at all unless it starts muted.
    // No allowfullscreen attribute — YouTube's own fullscreen button then
    // does nothing instead of going blank; our custom expand button (below)
    // is the only working "fullscreen" control.
    card.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&playsinline=1&rel=0&fs=0"
      title="Reel video" allow="autoplay; encrypted-media; picture-in-picture"></iframe>`;
    card.classList.add('is-playing');
    addExpandToggle(card);
  }

  function renderCards() {
    track.innerHTML = Array.from({ length: TOTAL }, (_, i) => {
      const r = reels[i];
      if (!r || !r.url) return `<div class="reel-empty"><i class="fa-solid fa-film"></i></div>`;

      const url = r.url;
      const p = detectPlatform(url);

      // Instagram has no public thumbnail API — embedding it live is the
      // only way to show its real thumbnail, and it plays in place already.
      if (p === 'instagram') {
        return `<div class="reel-card reel-card-ig">
          <blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="margin:0"></blockquote>
        </div>`;
      }

      const ytId = extractYouTubeId(url);
      const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
      const faIcon = p === 'youtube' ? 'fa-youtube' : p === 'video' ? 'fa-film' : 'fa-link';
      const platformLabel = p.charAt(0).toUpperCase() + p.slice(1);

      let mediaHtml;
      if (ytThumb) {
        mediaHtml = `<img class="reel-thumb" src="${ytThumb}" alt="Reel ${i + 1}" loading="lazy"
            onerror="this.replaceWith(Object.assign(document.createElement('div'),
            {className:'reel-yt-bg',innerHTML:'<i class=\\'fa-brands ${faIcon}\\'></i>'}))">`;
      } else if (p === 'video') {
        // Direct file (Cloudinary, S3, etc.) — the browser shows the first
        // frame as a natural thumbnail without needing a separate poster image.
        mediaHtml = `<video class="reel-thumb" src="${url}" muted playsinline preload="metadata"></video>`;
      } else {
        mediaHtml = `<div class="reel-yt-bg"><i class="fa-brands ${faIcon}"></i></div>`;
      }

      return `
      <div class="reel-card" data-reel-url="${url}" data-platform="${p}" tabindex="0" role="button" aria-label="Play reel ${i + 1}">
        ${mediaHtml}
        <div class="reel-overlay">
          <div class="reel-play-circle">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none"><path d="M0 0L13 8.5L0 17V0Z" fill="#050505"/></svg>
          </div>
          <div class="reel-platform-pill"><i class="fa-brands ${faIcon}"></i> ${platformLabel}</div>
        </div>
      </div>`;
    }).join('');

    track.querySelectorAll('.reel-card[data-reel-url]').forEach((card) => {
      card.addEventListener('click', () => playInline(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playInline(card); }
      });
    });

    if (track.querySelector('.instagram-media')) {
      loadInstagramEmbedScript().then((instgrm) => instgrm && instgrm.Embeds.process());
    }
  }

  function applyPos(animated = true) {
    const offset = current * stepPx();
    track.style.transition = animated ? 'transform .52s cubic-bezier(.25,.46,.45,.94)' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= maxStep();
    dotsEl.querySelectorAll('.reel-dot').forEach((d, i) => d.classList.toggle('on', i === current));
  }

  function buildDots() {
    const steps = maxStep() + 1;
    dotsEl.innerHTML = Array.from({ length: steps }, (_, i) =>
      `<button class="reel-dot${i === 0 ? ' on' : ''}" aria-label="Go to reel group ${i + 1}"></button>`
    ).join('');
    dotsEl.querySelectorAll('.reel-dot').forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  }

  function goTo(i) {
    current = Math.max(0, Math.min(maxStep(), i));
    applyPos();
    buildDots();
  }

  prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  nextBtn.addEventListener('click', () => { if (current < maxStep()) goTo(current + 1); });

  track.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.reel-card')) return;
    dragState = { startX: e.clientX, startCurrent: current, live: false };
    track.setPointerCapture(e.pointerId);
    track.classList.add('is-dragging');
    e.preventDefault();
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragState) return;
    const diff = dragState.startX - e.clientX;
    if (Math.abs(diff) > 6) dragState.live = true;
    if (!dragState.live) return;
    const baseOffset = dragState.startCurrent * stepPx();
    track.style.transition = 'none';
    track.style.transform = `translateX(-${Math.max(0, baseOffset + diff)}px)`;
  });
  track.addEventListener('pointerup', (e) => {
    if (!dragState) return;
    track.classList.remove('is-dragging');
    if (dragState.live) {
      const diff = dragState.startX - e.clientX;
      const threshold = stepPx() * 0.28;
      if (diff > threshold) goTo(Math.min(maxStep(), dragState.startCurrent + 1));
      else if (diff < -threshold) goTo(Math.max(0, dragState.startCurrent - 1));
      else goTo(dragState.startCurrent);
    }
    dragState = null;
  });
  track.addEventListener('pointercancel', () => {
    dragState = null;
    track.classList.remove('is-dragging');
    applyPos();
  });

  // Pointer Events already cover drag/swipe on touch devices, so these
  // legacy Touch Events only need to run for actual swipes — touching a
  // reel-card must fall through untouched so its tap/click can play it.
  let touchStart = 0, touchBase = 0, touchOnCard = false;
  track.addEventListener('touchstart', (e) => {
    touchOnCard = !!e.target.closest('.reel-card');
    if (touchOnCard) return;
    touchStart = e.touches[0].clientX;
    touchBase = current;
    track.style.transition = 'none';
  }, { passive: true });
  track.addEventListener('touchmove', (e) => {
    if (touchOnCard) return;
    const diff = touchStart - e.touches[0].clientX;
    const max = maxStep() * stepPx();
    track.style.transform = `translateX(-${Math.max(0, Math.min(max, touchBase * stepPx() + diff))}px)`;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchOnCard) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    const threshold = stepPx() * 0.25;
    if (diff > threshold) goTo(Math.min(maxStep(), touchBase + 1));
    else if (diff < -threshold) goTo(Math.max(0, touchBase - 1));
    else goTo(touchBase);
  });

  window.addEventListener('resize', () => {
    current = Math.min(current, maxStep());
    applyPos(false);
    buildDots();
  });

  renderCards();
  buildDots();
  applyPos(false);
}
