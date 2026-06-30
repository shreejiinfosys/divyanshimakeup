/**
 * client/components/image-manager
 * Fetches admin-overridden image URLs from the backend and applies them
 * to every `[data-img-key]` element on the page (replacing the default
 * Unsplash placeholders). Also keeps the portfolio lightbox array in sync.
 */
import { getImages } from '../services/api.service.js';
import { portfolioImages } from './portfolio-lightbox.js';

export async function initImageManager() {
  let overrides = {};
  try {
    overrides = await getImages();
  } catch {
    return; // fall back silently to default images
  }
  if (!overrides || !Object.keys(overrides).length) return;

  document.querySelectorAll('[data-img-key]').forEach((img) => {
    const url = overrides[img.dataset.imgKey];
    if (url) img.src = url;
  });

  ['portfolio_1', 'portfolio_2', 'portfolio_3', 'portfolio_4'].forEach((key, i) => {
    if (overrides[key]) portfolioImages[i] = overrides[key];
  });
}
