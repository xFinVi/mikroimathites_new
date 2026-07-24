#!/bin/bash

# VPS Cleanup Script
# Cleans up all Docker containers, images, and processes to free resources
# Run this before deployment to ensure clean state

set -e

echo "🧹 VPS Cleanup Script"
echo "===================="
echo ""

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

# 1. Stop all running containers
print_status "Stopping all running Docker containers..."
docker compose down 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || true
print_success "All containers stopped"

# 2. Remove all containers
print_status "Removing all Docker containers..."
docker rm $(docker ps -aq) 2>/dev/null || true
print_success "All containers removed"

# 3. Remove unused images (keep recent ones)
print_status "Removing unused Docker images..."
docker image prune -af --filter "until=24h" 2>/dev/null || true
print_success "Unused images removed"

# 4. Remove unused volumes
print_status "Removing unused Docker volumes..."
docker volume prune -af 2>/dev/null || true
print_success "Unused volumes removed"

# 5. Remove unused networks
print_status "Removing unused Docker networks..."
docker network prune -af 2>/dev/null || true
print_success "Unused networks removed"

# 6. Clean build cache (optional - uncomment if needed)
# print_status "Clearing Docker build cache..."
# docker builder prune -af 2>/dev/null || true
# print_success "Build cache cleared"

# 7. Check system resources
print_status "System resources:"
echo "  CPU: $(nproc) cores"
echo "  RAM: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
echo "  Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')"

# 8. Check for any remaining Docker processes
print_status "Checking for remaining Docker processes..."
if [ $(docker ps -q | wc -l) -eq 0 ]; then
    print_success "No running containers"
else
    print_warning "Some containers still running:"
    docker ps
fi

# 9. Summary
echo ""
print_success "✅ Cleanup complete! System is ready for deployment."
echo ""
print_status "Next steps:"
echo "  1. Run your deployment script"
echo "  2. Monitor build progress"
echo ""
