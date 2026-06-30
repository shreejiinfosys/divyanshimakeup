# Deployment Guide

This project has three independently deployable pieces:

| Folder    | What it is              | Where it runs                          |
|-----------|--------------------------|------------------------------------------|
| `server/` | REST API (Express + JSON file DB) | Render Web Service, Railway, Fly.io, or any Node host |
| `client/` | Public website            | Render Static Site, Firebase Hosting, Netlify |
| `admin/`  | Admin panel                | Render Static Site, Firebase Hosting, Netlify |

`client/` and `admin/` are pure static sites — no build step. `server/` needs
a long-running Node process (it is NOT a static site), since it persists data
to a local JSON file on disk.

---

## 1. Deploy the server first

You'll need its live URL before configuring the frontends.

### Render (recommended — free tier available)
1. Push this repo to GitHub.
2. Render dashboard → **New → Web Service**.
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variable `CORS_ORIGIN` = your client + admin URLs (comma-separated), e.g.
   `https://divyanshi.com,https://admin.divyanshi.com`
7. Deploy. Note the resulting URL, e.g. `https://divyanshi-api.onrender.com`.

> ⚠️ Render's free tier has an ephemeral filesystem on redeploy — `db.json`
> resets when the service restarts after extended inactivity. For production,
> either upgrade to a paid instance with a persistent disk, or swap the
> `server/database` implementation for a real database (see note below).

### Any other Node host (Railway, Fly.io, a VPS, etc.)
```bash
cd server
npm install
npm start          # or: PORT=5000 node index.js
```

---

## 2. Point the frontends at your live API

Edit the inline config line near the top of each page's `<head>`:

**`client/pages/index.html`** and **`admin/pages/index.html`**:
```html
<script>window.__API_BASE_URL__ = 'https://YOUR-API-DOMAIN.com/api';</script>
```

---

## 3. Deploy the client (public website)

### Render Static Site
- Root directory: `client`
- Publish directory: `.` (serves `client/` as-is)
- Add a rewrite so `/` resolves to `pages/index.html`:
  ```yaml
  routes:
    - type: rewrite
      source: /
      destination: /pages/index.html
  ```

### Firebase Hosting
```json
{
  "hosting": {
    "public": "client",
    "rewrites": [{ "source": "/", "destination": "/pages/index.html" }]
  }
}
```
```bash
firebase deploy --only hosting
```

---

## 4. Deploy the admin panel

Same pattern as the client, using the `admin/` folder instead. Add these
extra security headers (already configured in `admin/firebase.json` /
`admin/render.yaml` if present in your version of this repo):

```
X-Robots-Tag: noindex, nofollow
X-Frame-Options: DENY
```

This keeps the admin panel out of search engines.

---

## Swapping the JSON file database for a real database later

Everything in `server/services/*.js` calls `server/database/index.js`'s
`read()` / `update()` functions — nothing else touches `db.json` directly.
To move to MongoDB, PostgreSQL, or Firestore:

1. Replace the implementation inside `server/database/index.js` with calls
   to your chosen database client.
2. Keep the same `read()` / `update(mutator)` function signatures so none
   of the services, controllers, or routes need to change.
