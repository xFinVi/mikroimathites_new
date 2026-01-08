# Deployment Guide - Hostinger VPS with Docker

This guide walks you through deploying Μικροί Μαθητές to a Hostinger VPS using Docker.

## 📋 Prerequisites

- Hostinger VPS with root/SSH access
- Domain name pointed to your VPS IP
- Basic knowledge of Linux commands
- Docker and Docker Compose installed on VPS

## 🚀 Step-by-Step Deployment

### 1. Server Setup

#### Connect to Your VPS

```bash
ssh root@your-vps-ip
# Note: Hostinger may use port 65002 for SSH - check your hPanel for the correct port
```

#### Update System

```bash
apt update && apt upgrade -y
```

#### Install Docker

**Option A: Use Hostinger's Docker Template (Recommended)**
- If available, select Hostinger's Docker VPS template during VPS creation
- Docker will be pre-installed, skip to "Install Docker Compose Plugin" below

**Option B: Manual Installation**

**For Production (Recommended):**
```bash
# Install Docker from official Ubuntu repository
# See: https://docs.docker.com/engine/install/ubuntu/
apt-get update
apt-get install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
```

**Quick Install (Development/Testing Only):**
```bash
# Note: Not recommended for production - use official repo method above
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
docker --version
```

#### Install Docker Compose Plugin

```bash
# Install Docker Compose plugin (v2)
apt-get install docker-compose-plugin -y

# Verify installation
docker compose version
```

**Note:** We use `docker compose` (v2) not `docker-compose` (v1).

### 2. Verify Network & Ports

**Before proceeding, verify:**
- [ ] Your domain DNS points to your VPS IP address
- [ ] Ports 80 and 443 are open in Hostinger hPanel firewall
- [ ] SSH port is accessible (check hPanel for your SSH port - commonly 65002)

### 3. Application Setup

#### Clone Repository

```bash
# Navigate to a suitable directory
cd /opt

# Clone your repository
git clone https://github.com/your-username/mikroimathites_new.git
cd mikroimathites_new

# Switch to production branch (or develop for staging)
git checkout develop
```

#### Create Environment File

```bash
# Create production environment file
nano .env.production
```

**Important:** Add all required environment variables. See README.md for complete list. Key variables:

```env
# Set production URLs
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Use production Sanity dataset
NEXT_PUBLIC_SANITY_DATASET=production

# Set all your production API keys and secrets
# See README.md for complete list of required variables
```

#### Build and Start Application

```bash
# Build and start in one command
docker compose up -d --build

# View logs
docker compose logs -f
```

### 4. Database Setup

**Before deploying, ensure all database migrations are run in your production Supabase:**

1. Go to Supabase Dashboard → SQL Editor
2. Run migrations in order (see `supabase/migrations/MIGRATION_CHECKLIST.md`)
3. Verify all tables exist
4. Create admin user (see separate Supabase setup documentation)

### 5. Nginx Reverse Proxy Setup

#### Install Nginx

```bash
apt install nginx -y
```

#### Create Nginx Configuration (HTTP Only - First)

```bash
nano /etc/nginx/sites-available/mikroimathites
```

Add this configuration (HTTP only - we'll add HTTPS with Certbot):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Site

```bash
# Create symlink
ln -s /etc/nginx/sites-available/mikroimathites /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)

#### Install Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

#### Obtain and Install Certificate

```bash
# Certbot will automatically configure HTTPS in Nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will:
- Obtain the SSL certificate
- Automatically update your Nginx configuration to use HTTPS
- **Offer to redirect HTTP to HTTPS** - choose "Yes" if prompted
- Set up automatic renewal

**That's it!** Certbot handles everything automatically, including the HTTP→HTTPS redirect.

### 7. Firewall Configuration

**⚠️ Important:** Before enabling the firewall, confirm your SSH port:
- Check your Hostinger hPanel for the SSH port
- Hostinger commonly uses port **65002** for SSH (not 22)
- Verify you can still SSH after enabling firewall

#### Configure UFW

```bash
# Allow your SSH port (check hPanel for actual port - may be 65002)
ufw allow 65002/tcp  # or 22/tcp if that's your SSH port

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

## 🔧 Maintenance

### View Application Logs

```bash
# View logs
docker compose logs -f app

# View last 50 lines
docker compose logs --tail=50
```

### Restart Application

```bash
# Restart
docker compose restart

# Or rebuild and restart
docker compose up -d --build
```

### Update Application

```bash
# Pull latest changes
git pull origin develop  # or main for production

# Rebuild and restart
docker compose up -d --build

# View logs
docker compose logs -f
```

### Check Container Status

```bash
# List running containers
docker compose ps

# View resource usage
docker stats
```

## 🔧 Troubleshooting

### Application Won't Start

```bash
# Check logs
docker compose logs app

# Check environment variables
cat .env.production

# Verify Docker is running
docker ps
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Or change port in docker-compose.yml (edit the ports mapping)
```

### Database Connection Issues

- Verify Supabase URL and keys in `.env.production`
- Check Supabase dashboard for connection issues
- Verify network connectivity from VPS

### SSL Certificate Issues

```bash
# Check certificate status
certbot certificates

# Renew manually
certbot renew

# Check Nginx SSL configuration
nginx -t
```

### Nginx Configuration Errors

```bash
# Test configuration
nginx -t

# View error logs
tail -f /var/log/nginx/error.log

# Reload after fixing
systemctl reload nginx
```

## 🔒 Security Checklist

- [ ] Firewall configured (UFW) - **verify SSH port first!**
- [ ] SSL certificate installed and auto-renewing
- [ ] Environment variables secured (not in git)
- [ ] Database credentials secure
- [ ] Admin routes protected
- [ ] Rate limiting enabled

## 📝 Quick Reference

### Common Commands

```bash
# Start application
docker compose up -d --build

# Stop application
docker compose down

# View logs
docker compose logs -f

# Restart application
docker compose restart

# Update application
git pull && docker compose up -d --build

# Check health
curl http://localhost:3000/api/health
```

### File Locations

- Application: `/opt/mikroimathites_new` (or your chosen path)
- Environment: `.env.production` (in application directory)
- Nginx config: `/etc/nginx/sites-available/mikroimathites`
- SSL certificates: `/etc/letsencrypt/live/yourdomain.com/`

## 🆘 Getting Help

If you encounter issues:

1. Check application logs: `docker compose logs -f`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify environment variables
4. Check database connectivity
5. Review this documentation

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose v2](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Hostinger VPS Documentation](https://www.hostinger.com/tutorials/vps)

---

**Last Updated:** January 2025
