# Divyanshi Studios

A luxury celebrity makeup-artist website with a full admin panel and a real backend API — bookings, social reels, and site images are now managed through a proper REST API instead of browser localStorage.

## Project Structure

```
project/
│
├── client/                    # Public Website
│   ├── pages/                 #   index.html, 404.html
│   ├── components/            #   navbar, cursor, before-after-slider, reels-carousel...
│   ├── layouts/                #  (reserved — this is a single-page site)
│   ├── assets/
│   │   ├── css/style.css
│   │   ├── js/main.js         #   bootstraps all components
│   │   └── img/
│   ├── hooks/                 #   useScrollReveal, useCounter
│   ├── services/               #  api.service.js — all backend calls
│   └── utils/                 #   dom.js, format.js, config.js
│
├── admin/                     # Admin Panel
│   ├── pages/                 #   index.html
│   ├── components/             #  sidebar, dashboard, bookings-list, booking-detail,
│   │                            #  reels-manager, images-manager
│   ├── layouts/                #  (reserved)
│   ├── forms/                  #  login-form.js, settings-form.js
│   ├── services/               #  api.service.js, auth.service.js, store.js
│   └── utils/                 #   dom.js, format.js, config.js
│
├── server/                    # Backend (Node + Express)
│   ├── api/                   #   mounts all route modules
│   ├── controllers/            #  bookings, reels, images, auth
│   ├── middleware/             #  requireAdmin auth guard, error handler
│   ├── routes/                 #  Express routers per resource
│   ├── services/               #  business logic — only layer touching the DB
│   ├── database/               #  JSON-file datastore (db.json + read/update API)
│   ├── models/                 #  shape/factory definitions
│   ├── uploads/                #  reserved for future file uploads
│   └── utils/                  #  asyncHandler, logger
│
├── shared/                    # Common Code (used by server; mirrored in client/admin)
│   ├── types/                  #  JSDoc type definitions
│   ├── constants/               # IMAGE_KEYS, BOOKING_STATUS, etc.
│   ├── validation/              # validateBookingInput, validateReelUrl...
│   └── helpers/                #  formatDate, timeAgo, generateBookingId...
│
├── docs/
│   ├── API.md                  #  full endpoint reference
│   └── DEPLOYMENT.md           #  step-by-step deploy guide
│
├── scripts/
│   ├── dev.sh                  #  runs server + client + admin together locally
│   └── seed.js                 #  resets the database to demo data
│
├── .env.example
├── package.json
└── README.md
```

---

## What changed from the previous (localStorage) version

Bookings, reels, and image overrides used to live in the browser's
`localStorage`, which only worked when the public site and admin panel
shared the same origin. They are now stored server-side in
`server/database/db.json` and served through a real REST API
(`server/`), so:

- The admin panel can be deployed on a completely different domain from
  the public site, with no data-sync caveats.
- Bookings submitted from the website immediately show up for every admin
  session, on any device, not just the same browser.
- The data layer is isolated behind `server/database/index.js` — swapping
  the JSON file for a real database later only requires editing one file
  (see `docs/DEPLOYMENT.md`).

## Admin Access

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `12345` |

Change it anytime from **Settings → Change Password** inside the admin panel.

---

## Local Development

```bash
# One command — installs server deps, starts API + both frontends
bash scripts/dev.sh
```

This starts:
- API → `http://localhost:5000/api`
- Public site → `http://localhost:3000/pages/index.html`
- Admin panel → `http://localhost:4000/pages/index.html`

Or run pieces individually:
```bash
cd server && npm install && npm start     # API on :5000
npx serve client -l 3000                  # public site
npx serve admin -l 4000                   # admin panel
```

> Both `client/pages/index.html` and `admin/pages/index.html` have an inline
> `<script>window.__API_BASE_URL__ = '...'</script>` near the top of `<head>`
> pointing at `http://localhost:5000/api` by default — update this before
> deploying (see `docs/DEPLOYMENT.md`).

---

## Resetting Demo Data

```bash
node scripts/seed.js
```

---

## Documentation

- [`docs/API.md`](docs/API.md) — every endpoint, request/response shape
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deploying server + client + admin (Render / Firebase)

---

## Tech Stack

| Layer       | Technology                                              |
|-------------|----------------------------------------------------------|
| Frontend    | HTML5 · Tailwind CSS (CDN) · Vanilla JS (ES Modules)     |
| Backend     | Node.js · Express · JSON-file datastore                  |
| Fonts       | Cormorant Garamond · Montserrat (Google Fonts)            |
| Icons       | Font Awesome 6                                             |
| Charts      | Chart.js 4 (admin dashboard)                               |
| Deployment  | Render (server + 2 static sites) **or** Firebase Hosting  |

---

*Built for Divyanshi Studios · 2026*
