#!/usr/bin/env bash
#
# Production deploy for mikroimathites.gr
# --------------------------------------
# Pulls the latest code, rebuilds the Docker image, restarts the container,
# and health-checks it. Run ON THE VPS from the app directory:
#
#   cd /home/mikroimathites/app && ./deploy.sh                # normal (fast, cached)
#   cd /home/mikroimathites/app && ./deploy.sh --no-cache     # full clean rebuild
#   cd /home/mikroimathites/app && ./deploy.sh develop        # deploy a branch other than main
#
# Notes:
# - The Next.js build happens INSIDE the Docker image (see Dockerfile), so the
#   real "cache" that matters is Docker's layer cache. Use --no-cache when you
#   suspect a stale build; otherwise the default cached build is much faster.
# - Requires a real .env on the VPS (secrets) — this script never touches it.

set -euo pipefail

# --- args ---------------------------------------------------------------
BRANCH="main"
NO_CACHE=0
for arg in "$@"; do
  case "$arg" in
    --no-cache) NO_CACHE=1 ;;
    -*) echo "Unknown option: $arg"; exit 2 ;;
    *) BRANCH="$arg" ;;
  esac
done

cd "$(dirname "$0")"

echo "🚀 Deploying branch '$BRANCH'..."

# --- 1. Latest code -----------------------------------------------------
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
echo "📦 Now at: $(git log --oneline -1)"

# --- 2. Clear any stale host-side build output --------------------------
# .next is normally built inside the image, but remove it if it ever leaked
# onto the host so it can't be copied into the build context.
rm -rf .next

# --- 3. Build -----------------------------------------------------------
if [ "$NO_CACHE" -eq 1 ]; then
  echo "🧼 Clean rebuild (no Docker cache)..."
  docker compose build --no-cache
  docker compose up -d
else
  echo "🔨 Building and restarting (cached)..."
  docker compose up -d --build
fi

# --- 4. Reclaim disk from old image layers ------------------------------
docker image prune -f >/dev/null 2>&1 || true

# --- 5. Health check (retry up to ~60s) ---------------------------------
echo "🏥 Waiting for the app to become healthy..."
for _ in $(seq 1 30); do
  if curl -fs http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "✅ Healthy — deploy complete ($(git log --oneline -1))"
    exit 0
  fi
  sleep 2
done

echo "⚠️  Health check failed after 60s. Recent container logs:"
docker compose logs --tail=50 app
exit 1
