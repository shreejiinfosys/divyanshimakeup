/**
 * shared/constants
 * Single source of truth for values used across server, client, and admin.
 * Server (Node/CommonJS) requires this directly.
 * Client/Admin (browser ES modules) import the mirrored copy at
 * client/utils/constants.js / admin/utils/constants.js — kept in sync manually
 * since browsers can't reach outside their own deployed folder at runtime.
 */

const APP_NAME = 'Divyanshi Studios';

const BOOKING_STATUS = Object.freeze({
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

const SERVICE_TYPES = Object.freeze(['Bridal', 'Red Carpet', 'Editorial']);

const REEL_PLATFORMS = Object.freeze({
  INSTAGRAM: 'instagram',
  YOUTUBE:   'youtube',
  LINK:      'link',
});

const MAX_REELS = 8;
const REELS_VISIBLE_DESKTOP = 4;

/** Keys for every image slot the admin can override on the public site. */
const IMAGE_KEYS = Object.freeze([
  'hero',
  'about',
  'ba_before',
  'ba_after',
  'svc_redcarpet',
  'svc_bridal',
  'svc_editorial',
  'portfolio_1',
  'portfolio_2',
  'portfolio_3',
  'portfolio_4',
]);

const IMAGE_META = Object.freeze({
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
});

const HTTP_STATUS = Object.freeze({
  OK: 200, CREATED: 201, NO_CONTENT: 204,
  BAD_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 404,
  SERVER_ERROR: 500,
});

module.exports = {
  APP_NAME,
  BOOKING_STATUS,
  SERVICE_TYPES,
  REEL_PLATFORMS,
  MAX_REELS,
  REELS_VISIBLE_DESKTOP,
  IMAGE_KEYS,
  IMAGE_META,
  HTTP_STATUS,
};
