#!/bin/bash

# MikroiMathites Redeploy Script
# This script helps redeploy the application with updated environment variables

set -e

echo "🚀 Starting MikroiMathites redeployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Are you in the project root?"
    exit 1
fi

# Create symlink for environment variables
print_status "Setting up environment variables..."
if [ -f ".env.production" ]; then
    ln -sf .env.production .env
    print_success "Environment variables linked (.env.production -> .env)"
else
    print_warning ".env.production not found. Please ensure your environment variables are set."
fi

# Pull latest changes
print_status "Pulling latest changes from develop branch..."
git pull origin develop

# Minimal downtime deployment strategy
print_status "Starting minimal downtime deployment..."

# Build new image while old container keeps running
print_status "Building new container image..."
docker compose build --no-cache

# Quick container replacement with minimal downtime (< 10 seconds)
print_status "Performing quick container replacement..."
docker compose up -d --force-recreate --timeout 30

# Extended wait for startup to ensure stability
print_status "Waiting for application to stabilize..."
sleep 25

# Verify deployment success
print_status "Verifying deployment..."
if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
    print_success "✅ Deployment successful - application is responding"
else
    print_warning "⚠️ Health check failed - application may still be starting"
fi

# Check logs
print_status "Checking deployment logs..."
docker compose logs --tail=20

# Test health check
print_status "Testing application health..."
if curl -f -s https://mikroimathites.gr/api/health > /dev/null 2>&1; then
    print_success "Health check passed! ✅"
else
    print_error "Health check failed! ❌"
    print_status "Checking container logs..."
    docker compose logs --tail=20 app
    exit 1
fi

# Test AdSense script
print_status "Checking AdSense script..."
if curl -s https://mikroimathites.gr | grep -q "adsbygoogle"; then
    print_success "AdSense script found in HTML!"
else
    print_warning "AdSense script not found in HTML. Check environment variables."
fi

print_success "Redeployment completed!"
print_status "Application should be available at: https://mikroimathites.gr"