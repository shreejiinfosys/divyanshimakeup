/**
 * server/services/images.service
 * Manages admin-overridden image URLs, keyed by IMAGE_KEYS.
 */
const db = require('../database');
const { IMAGE_KEYS } = require('../../shared/constants');

function getAll() {
  return db.read().images || {};
}

/** @param {Record<string,string>} overrides — { [key]: url }, empty string clears the key */
async function setMany(overrides) {
  await db.update((data) => {
    data.images = data.images || {};
    for (const key of Object.keys(overrides)) {
      if (!IMAGE_KEYS.includes(key)) continue;
      const url = (overrides[key] || '').trim();
      if (url) data.images[key] = url;
      else delete data.images[key];
    }
    return data;
  });
  return getAll();
}

async function clearOne(key) {
  await db.update((data) => {
    if (data.images) delete data.images[key];
    return data;
  });
  return getAll();
}

async function clearAll() {
  await db.update((data) => {
    data.images = {};
    return data;
  });
  return getAll();
}

module.exports = { getAll, setMany, clearOne, clearAll };
