/**
 * admin/components/images-manager
 * Lets the admin override any of the 11 public-site image slots.
 * Exposes window.livePreviewImage / window.clearImage / window.saveImages /
 * window.resetImages to match existing inline onclick="" handlers.
 */
import { getImages, setImages, clearImage as apiClearImage, clearAllImages } from '../services/api.service.js';
import { qs, toast } from '../utils/dom.js';

const IMG_DEFAULTS = {
  hero:          'https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=2006&auto=format&fit=crop',
  about:         'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1760&auto=format&fit=crop',
  ba_before:     'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1400&auto=format&fit=crop',
  ba_after:      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1400&auto=format&fit=crop',
  svc_redcarpet: 'https://images.unsplash.com/photo-1615212513476-8051a66bb34d?q=80&w=2070&auto=format&fit=crop',
  svc_bridal:    'https://images.unsplash.com/photo-1542332608-208151a660a1?q=80&w=2070&auto=format&fit=crop',
  svc_editorial: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1974&auto=format&fit=crop',
  portfolio_1:   'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop',
  portfolio_2:   'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
  portfolio_3:   'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop',
  portfolio_4:   'https://images.unsplash.com/photo-1512496015851-a1cbfc34384a?q=80&w=2070&auto=format&fit=crop',
};

const IMG_META = {
  hero:          { label: 'Hero Background',     section: 'Hero',           aspect: '16/9' },
  about:         { label: 'Artist Portrait',      section: 'About',         aspect: '4/5'  },
  ba_before:     { label: 'Before — Natural',     section: 'Transformation', aspect: '4/5' },
  ba_after:      { label: 'After — Glam',         section: 'Transformation', aspect: '4/5' },
  svc_redcarpet: { label: 'Red Carpet & Events',  section: 'Services',       aspect: '3/4'  },
  svc_bridal:    { label: 'Bridal',               section: 'Services',       aspect: '3/4'  },
  svc_editorial: { label: 'Editorial & Campaign', section: 'Services',       aspect: '3/4'  },
  portfolio_1:   { label: 'Portfolio — Main',     section: 'Portfolio',      aspect: '4/5'  },
  portfolio_2:   { label: 'Portfolio — Small 1',  section: 'Portfolio',      aspect: '1/1'  },
  portfolio_3:   { label: 'Portfolio — Small 2',  section: 'Portfolio',      aspect: '1/1'  },
  portfolio_4:   { label: 'Portfolio — Wide',     section: 'Portfolio',      aspect: '16/9' },
};

const IMG_SECTIONS = ['Hero', 'About', 'Transformation', 'Services', 'Portfolio'];

export async function renderImagesManager() {
  const stored = await getImages();
  const wrap = qs('#img-slots-wrap');
  if (!wrap) return;

  wrap.innerHTML = IMG_SECTIONS.map((section) => {
    const keys = Object.keys(IMG_META).filter((k) => IMG_META[k].section === section);

    const cards = keys.map((key) => {
      const meta = IMG_META[key];
      const current = stored[key] || IMG_DEFAULTS[key];
      const isCustom = !!stored[key];

      return `
      <div class="card" style="padding:0;overflow:hidden" id="imgcard-${key}">
        <div style="position:relative;width:100%;aspect-ratio:${meta.aspect};background:#0d0d0d;overflow:hidden">
          <img id="imgprev-${key}" src="${current}" style="width:100%;height:100%;object-fit:cover;display:block;transition:opacity .3s" loading="lazy" onerror="this.style.opacity='.15'">
          ${isCustom
            ? `<span style="position:absolute;top:8px;right:8px;background:rgba(74,222,128,.15);border:1px solid rgba(74,222,128,.3);color:#4ade80;font-size:.48rem;letter-spacing:.12em;text-transform:uppercase;padding:2px 7px;border-radius:100px">Custom</span>`
            : `<span style="position:absolute;top:8px;right:8px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);color:#D4AF37;font-size:.48rem;letter-spacing:.12em;text-transform:uppercase;padding:2px 7px;border-radius:100px">Default</span>`}
        </div>
        <div style="padding:14px 16px">
          <div style="font-size:.7rem;color:#ddd;margin-bottom:2px;font-weight:400">${meta.label}</div>
          <div style="font-size:.55rem;text-transform:uppercase;letter-spacing:.14em;color:#555;margin-bottom:10px">${section}</div>
          <input type="url" class="ai" id="imgurl-${key}" placeholder="Paste image URL…" value="${isCustom ? stored[key] : ''}" oninput="livePreviewImage('${key}')" style="font-size:.68rem;margin-bottom:8px">
          <div style="display:flex;gap:7px;flex-wrap:wrap">
            ${isCustom ? `<button class="btn-o" onclick="clearImage('${key}')" style="font-size:.57rem;color:#f87171;border-color:rgba(248,113,113,.2);padding:5px 10px" onmouseover="this.style.background='rgba(248,113,113,.05)'" onmouseout="this.style.background='transparent'"><i class="fa-solid fa-rotate-left" style="margin-right:4px"></i>Restore default</button>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    const cols = '1fr 1fr 1fr';
    return `
    <div style="margin-bottom:28px">
      <div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.22em;color:#555;margin-bottom:14px;display:flex;align-items:center;gap:12px">
        ${section}<div style="flex:1;height:1px;background:#1e1e1e"></div>
      </div>
      <div style="display:grid;grid-template-columns:${cols};gap:12px">${cards}</div>
    </div>`;
  }).join('');
}

export function initImagesManagerControls() {
  window.livePreviewImage = function (key) {
    const input = qs(`#imgurl-${key}`);
    const preview = qs(`#imgprev-${key}`);
    if (!input || !preview) return;
    const url = input.value.trim();
    preview.style.opacity = '1';
    if (url) {
      preview.src = url;
      preview.onerror = () => { preview.style.opacity = '.15'; };
      preview.onload = () => { preview.style.opacity = '1'; };
    } else {
      preview.src = IMG_DEFAULTS[key];
    }
  };

  window.clearImage = async function (key) {
    const input = qs(`#imgurl-${key}`);
    if (input) input.value = '';
    window.livePreviewImage(key);
    await apiClearImage(key);
    await renderImagesManager();
    toast(`Restored default for "${IMG_META[key]?.label}".`);
  };

  window.saveImages = async function () {
    const overrides = {};
    Object.keys(IMG_META).forEach((key) => {
      overrides[key] = qs(`#imgurl-${key}`)?.value?.trim() || '';
    });
    await setImages(overrides);

    const ok = qs('#images-ok');
    if (ok) { ok.style.opacity = '1'; setTimeout(() => (ok.style.opacity = '0'), 3200); }
    toast('Images saved — live on your website.');
    await renderImagesManager();
  };

  window.resetImages = async function () {
    if (!confirm('Remove all custom images and restore original defaults?')) return;
    await clearAllImages();
    await renderImagesManager();
    toast('All images reset to defaults.');
  };
}
