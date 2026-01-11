#!/bin/bash

# Zero-Downtime Deployment Setup with Nginx
# This script sets up nginx as a reverse proxy for zero-downtime deployments

set -e

echo "🚀 Setting up Nginx for Zero-Downtime Deployments..."

# Install nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt update
    apt install -y nginx
fi

# Create nginx configuration for the app
cat > /etc/nginx/sites-available/mikroimathites << 'EOF'
# Upstream backend servers
upstream mikroimathites_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001 backup;  # Backup port for zero-downtime
}

server {
    listen 80;
    server_name mikroimathites.gr www.mikroimathites.gr;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://mikroimathites_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://mikroimathites_backend;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://mikroimathites_backend;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/mikroimathites /etc/nginx/sites-enabled/

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Reload nginx
systemctl reload nginx
systemctl enable nginx

echo "✅ Nginx setup complete!"
echo "🌐 Your site is now served through Nginx with zero-downtime capabilities"
echo ""
echo "📋 Next steps:"
echo "1. Update docker-compose.yml to expose port 3001 as backup"
echo "2. Modify redeploy.sh to use nginx for zero-downtime switching"
echo "3. Test deployment with zero downtime"