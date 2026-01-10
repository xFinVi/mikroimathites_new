#!/bin/bash

# Simple Deployment Script
# This script deploys new containers with minimal downtime

set -e

echo "🚀 Starting Deployment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Pull latest changes
print_status "Pulling latest changes from develop branch..."
git fetch origin || { print_error "Failed to fetch from origin"; exit 1; }
git checkout develop || { print_error "Failed to checkout develop"; exit 1; }
git pull origin develop || { print_error "Failed to pull from develop"; exit 1; }

# Stop and remove old containers if they exist
print_status "Stopping existing containers..."
docker compose down || true

# Build and start containers
print_status "Building and starting containers..."
echo "⏱️ Build started at $(date +'%H:%M:%S')"
docker compose build || { print_error "Docker build failed"; exit 1; }
echo "⏱️ Build finished at $(date +'%H:%M:%S')"
docker compose up -d || { 
    print_error "Docker compose up failed"
    echo "📋 Showing logs for debugging:"
    docker compose logs --tail=50
    exit 1
}

# Wait for application to be ready
print_status "Waiting for application to be ready..."
sleep 10

# Health check
print_status "Checking application health..."
for i in {1..30}; do
    if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "✅ Deployment successful - application is healthy!"
        exit 0
    fi
    if [ $i -eq 30 ]; then
        print_error "❌ Application failed health check after 60 seconds"
        echo "📋 Container status:"
        docker compose ps
        echo "📋 Recent logs:"
        docker compose logs --tail=50
        exit 1
    fi
    sleep 2
done