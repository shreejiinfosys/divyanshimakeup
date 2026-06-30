/**
 * admin/components/reels-manager
 * 8-slot reel link manager. Exposes window.livePreviewReel / clearReel /
 * saveReels to match existing inline onclick="" handlers.
 */
import { getReels, setReels } from '../services/api.service.js';
import { ytAdminThumb, getReelPlatform } from '../utils/format.js';
import { qs, toast } from '../utils/dom.js';

const PREVIEW_BASE = 'width:100%;aspect-ratio:16/9;border-radius:6px;overflow:hidden;margin-bottom:10px;background:#111';

function previewMarkup(url) {
  if (!url) return { style: '', html: '' };

  const thumb = ytAdminThumb(url);
  const p = getReelPlatform(url);

  if (thumb) {
    return { style: PREVIEW_BASE, html: `<img src="${thumb}" style="width:100%;height:100%;object-fit:cover" loading="lazy">` };
  }
  if (p === 'video') {
    return { style: PREVIEW_BASE, html: `<video src="${url}" muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover"></video>` };
  }
  if (p === 'instagram') {
    return {
      style: `${PREVIEW_BASE};display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#405DE6,#C13584,#F77737)`,
      html: `<i class="fa-brands fa-instagram" style="font-size:1.8rem;color:rgba(255,255,255,.65)"></i>`,
    };
  }
  return {
    style: `${PREVIEW_BASE};display:flex;align-items:center;justify-content:center`,
    html: `<i class="fa-solid fa-link" style="color:#555;font-size:1.2rem"></i>`,
  };
}

export async function renderReelSlots() {
  const saved = await getReels(); // array of 8, null = empty
  const grid = qs('#reel-slots');
  if (!grid) return;

  grid.innerHTML = Array.from({ length: 8 }, (_, i) => {
    const r = saved[i] || {};
    const url = r.url || '';
    const p = url ? getReelPlatform(url) : null;
    const faIcon = p === 'instagram' ? 'fa-instagram' : p === 'youtube' ? 'fa-youtube' : p === 'video' ? 'fa-film' : 'fa-link';
    const preview = previewMarkup(url);

    return `
    <div class="card" style="padding:16px 18px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="width:22px;height:22px;border-radius:50%;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.22);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.55rem;color:#D4AF37;font-weight:600">${i + 1}</div>
        <div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.14em;color:#555">Reel ${i + 1}</div>
        ${url ? `<span class="sb sb-confirmed" style="margin-left:auto;font-size:.5rem"><i class="fa-brands ${faIcon}" style="margin-right:3px"></i>${(p || '').charAt(0).toUpperCase() + (p || '').slice(1)}</span>` : ''}
      </div>

      <div id="rp-${i}" style="${preview.style}">${preview.html}</div>

      <input type="url" class="ai" id="ri-${i}" placeholder="https://www.instagram.com/reel/... or YouTube / Cloudinary .mp4 link" value="${url}" oninput="livePreviewReel(${i})" style="font-size:.68rem">

      ${url ? `<button onclick="clearReel(${i})" class="btn-o" style="margin-top:8px;font-size:.57rem;padding:5px 11px;color:#f87171;border-color:rgba(248,113,113,.2)" onmouseover="this.style.background='rgba(248,113,113,.05)'" onmouseout="this.style.background='transparent'"><i class="fa-solid fa-xmark" style="margin-right:4px"></i>Remove</button>` : ''}
    </div>`;
  }).join('');
}

export function initReelsManagerControls() {
  window.livePreviewReel = function (i) {
    const input = qs(`#ri-${i}`);
    const url = input?.value?.trim() || '';
    const preview = qs(`#rp-${i}`);
    if (!preview) return;

    const built = previewMarkup(url);
    preview.style.cssText = built.style;
    preview.innerHTML = built.html;
  };

  window.clearReel = function (i) {
    const input = qs(`#ri-${i}`);
    if (input) input.value = '';
    window.livePreviewReel(i);
    renderReelSlots();
  };

  window.saveReels = async function () {
    const urls = Array.from({ length: 8 }, (_, i) => qs(`#ri-${i}`)?.value?.trim() || '');
    await setReels(urls);

    const ok = qs('#reels-ok');
    if (ok) { ok.style.opacity = '1'; setTimeout(() => (ok.style.opacity = '0'), 3200); }
    toast('Reels saved — live on your website.');
  };
}
