# API Reference

Base URL (local dev): `http://localhost:5000/api`

All admin-only endpoints require an `Authorization: Bearer <token>` header,
obtained from `POST /auth/login`.

---

## Auth

### `POST /auth/login`
Public. Body: `{ "username": "admin", "password": "12345" }`
→ `200 { "token": "..." }` or `401 { "error": "..." }`

### `POST /auth/logout`
Admin-only. Invalidates the current token.
→ `204 No Content`

### `POST /auth/change-password`
Admin-only. Body: `{ "currentPassword": "...", "newPassword": "..." }`
→ `200 { "success": true }`

---

## Bookings

### `POST /bookings`
Public — called from the website's booking form.
Body: `{ "name", "phone", "date", "service", "message" }`
→ `201 { "booking": {...} }`

### `GET /bookings`
Admin-only. → `200 { "bookings": [...] }`

### `GET /bookings/stats`
Admin-only. → `200 { "total", "pending", "confirmed", "completed", "cancelled", "thisMonth", "unread" }`

### `GET /bookings/:id`
Admin-only. → `200 { "booking": {...} }`

### `PATCH /bookings/:id/status`
Admin-only. Body: `{ "status": "pending"|"confirmed"|"completed"|"cancelled" }`

### `PATCH /bookings/:id/notes`
Admin-only. Body: `{ "notes": "..." }`

### `PATCH /bookings/:id/read`
Admin-only. Marks an inquiry as read.

---

## Reels

### `GET /reels`
Public — feeds the website's "On My Feed" carousel.
→ `200 { "reels": [ {url}|null, ...8 total ] }`

### `PUT /reels`
Admin-only. Body: `{ "urls": ["https://...", "", ...up to 8] }` (empty string = empty slot)

---

## Images

### `GET /images`
Public — website fetches these on load to override default photos.
→ `200 { "images": { "hero": "https://...", ... } }`

### `PUT /images`
Admin-only. Body: `{ "images": { "hero": "https://...", "about": "" } }` (empty string clears that key)

### `DELETE /images/:key`
Admin-only. Restores one image slot to its default.

### `DELETE /images`
Admin-only. Restores all image slots to defaults.

---

## Health

### `GET /health`
→ `200 { "ok": true, "time": "..." }`
