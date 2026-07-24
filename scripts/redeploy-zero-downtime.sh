#!/bin/bash
set -e

ENV_FILE="/opt/mikroimathites/.env.production"
APP_DIR="/opt/mikroimathites/app"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; }

info "Starting deploy..."
cd "$APP_DIR" || { err "Cannot cd to $APP_DIR"; exit 1; }

if [ ! -f "$ENV_FILE" ]; then
  err "Missing env file: $ENV_FILE"
  exit 1
fi

info "Pulling latest changes..."
git fetch origin
git checkout develop
git pull origin develop

info "Building container..."
DOCKER_BUILDKIT=0 docker compose --env-file "$ENV_FILE" build

info "Restarting app..."
docker compose --env-file "$ENV_FILE" up -d --no-deps app

info "Health check..."
for i in {1..30}; do
  if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
    ok "Deployment successful."
    exit 0
  fi
  sleep 2
done

err "Health check failed."
docker compose --env-file "$ENV_FILE" logs --tail=120 app || true
exit 1