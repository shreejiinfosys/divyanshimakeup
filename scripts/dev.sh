#!/bin/bash
# scripts/dev.sh — runs the API server + both static frontends locally.
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "→ Installing server dependencies (first run only)..."
(cd "$ROOT/server" && npm install --silent)

echo ""
echo "→ Starting backend API on http://localhost:5000 ..."
(cd "$ROOT/server" && node index.js) &
API_PID=$!

sleep 1

echo "→ Serving client on http://localhost:3000 ..."
npx --yes serve "$ROOT/client" -l 3000 &
CLIENT_PID=$!

echo "→ Serving admin on http://localhost:4000 ..."
npx --yes serve "$ROOT/admin" -l 4000 &
ADMIN_PID=$!

echo ""
echo "✓ All running:"
echo "  API:    http://localhost:5000/api/health"
echo "  Client: http://localhost:3000/pages/index.html"
echo "  Admin:  http://localhost:4000/pages/index.html"
echo ""
echo "Press Ctrl+C to stop everything."

trap "kill $API_PID $CLIENT_PID $ADMIN_PID 2>/dev/null" EXIT
wait
