#!/bin/bash

# Zero-Downtime Deployment Script with Nginx
# This script deploys new containers without taking the site down

set -e

echo "🚀 Starting Zero-Downtime Deployment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Pull latest changes
print_status "Pulling latest changes from develop branch..."
git pull origin develop

# Check if nginx is available
if command -v nginx &> /dev/null && systemctl is-active --quiet nginx; then
    print_success "Nginx detected - using zero-downtime deployment"

    # Zero-downtime deployment with nginx
    print_status "Building new container image..."
    docker compose build --no-cache

    # Start new container on backup port (3001)
    print_status "Starting new container on backup port (3001)..."
    sed -i 's/3000:3000/3001:3000/g' docker-compose.yml
    docker compose up -d --force-recreate
    sed -i 's/3001:3000/3000:3000/g' docker-compose.yml

    # Wait for new container to be healthy
    print_status "Waiting for new container to be healthy..."
    for i in {1..30}; do
        if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
            print_success "✅ New container is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "❌ New container failed health check"
            docker compose down
            exit 1
        fi
        sleep 2
    done

    # Switch nginx to new container
    print_status "Switching nginx to new container..."
    sed -i 's/server 127.0.0.1:3000;/server 127.0.0.1:3001;/g' /etc/nginx/sites-available/mikroimathites
    sed -i 's/server 127.0.0.1:3001; # Backup/server 127.0.0.1:3000; # Backup/g' /etc/nginx/sites-available/mikroimathites

    # Reload nginx (near-instant switch)
    nginx -s reload

    # Stop old container
    print_status "Stopping old container..."
    docker compose ps -q | head -1 | xargs docker stop
    docker compose ps -q | head -1 | xargs docker rm

    # Switch back to primary port for future deployments
    print_status "Preparing for next deployment..."
    sed -i 's/server 127.0.0.1:3001;/server 127.0.0.1:3000;/g' /etc/nginx/sites-available/mikroimathites
    sed -i 's/server 127.0.0.1:3000; # Backup/server 127.0.0.1:3001; # Backup/g' /etc/nginx/sites-available/mikroimathites
    nginx -s reload

else
    print_warning "Nginx not detected - using minimal downtime approach"

    # Fallback: minimal downtime deployment
    print_status "Building new container image..."
    docker compose build --no-cache

    print_status "Performing quick container replacement..."
    docker compose up -d --force-recreate --timeout 30

    print_status "Waiting for application to stabilize..."
    sleep 25
fi

# Final health check
print_status "Final health check..."
if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
    print_success "✅ Deployment successful - zero/minimal downtime achieved!"
else
    print_error "❌ Deployment failed - application not responding"
    exit 1
fi