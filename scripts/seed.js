#!/usr/bin/env node
/**
 * scripts/seed.js
 * Resets server/database/db.json to its original demo dataset.
 * Useful after testing destructive admin actions (clearing all images, etc).
 *
 * Usage: node scripts/seed.js
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'server', 'database', 'db.json');

const SEED = {
  bookings: [
    { id: 'BK-881024', name: 'Priya Malhotra', phone: '+91 98001 23456', date: '2026-08-17', service: 'Bridal', message: 'Looking for a complete bridal experience for my reception in Udaipur — I want a timeless yet modern dewy finish. Wedding is across 4 days at a heritage property.', submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'confirmed', notes: 'Trial scheduled next Saturday. Client prefers dewy skin, no heavy contouring.', read: true },
    { id: 'BK-771563', name: 'Riya Khandelwal', phone: '+91 99887 65432', date: '2026-07-11', service: 'Red Carpet', message: 'Film premiere at PVR Juhu. Need full glam for the red carpet. Prefer bold eye, clean base, long-wear.', submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'pending', notes: '', read: false },
    { id: 'BK-660891', name: 'Sneha Agarwal', phone: '+91 97654 32109', date: '2026-08-01', service: 'Editorial', message: 'Brand campaign for a luxury skincare label. Three distinct looks over a 2-day studio shoot in Mumbai.', submittedAt: new Date(Date.now() - 4 * 86400000).toISOString(), status: 'confirmed', notes: 'Brief sent and approved. Colour palette: terracotta and nude.', read: true },
    { id: 'BK-554217', name: 'Ananya Joshi', phone: '+91 96543 21098', date: '2026-09-26', service: 'Bridal', message: 'Destination wedding in Goa in October. Looking for a breezy ethereal look with warm gold tones — Hindu ceremony + cocktail night.', submittedAt: new Date(Date.now() - 6 * 86400000).toISOString(), status: 'pending', notes: '', read: false },
    { id: 'BK-443072', name: 'Meera Iyer', phone: '+91 95432 10987', date: '2026-06-15', service: 'Red Carpet', message: 'Award show appearance — short lead time. Structured editorial look that photographs well under flash.', submittedAt: new Date(Date.now() - 21 * 86400000).toISOString(), status: 'completed', notes: 'Event done. Outstanding feedback. Follow up for Filmfare.', read: true },
    { id: 'BK-332859', name: 'Kavya Reddy', phone: '+91 94321 09876', date: '2026-08-31', service: 'Bridal', message: 'Full team needed for mehendi, haldi, and reception — three looks. South Indian bride, gold-heavy jewellery.', submittedAt: new Date(Date.now() - 8 * 86400000).toISOString(), status: 'pending', notes: '', read: false },
  ],
  reels: [],
  images: {},
  adminAuth: { username: 'admin', password: '12345' },
};

fs.writeFileSync(DB_PATH, JSON.stringify(SEED, null, 2), 'utf-8');
console.log(`✓ Database reset with ${SEED.bookings.length} demo bookings → ${DB_PATH}`);
