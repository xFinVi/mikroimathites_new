# Nginx Configuration for mikroimathites.gr

> **Single source of truth.** The live config is `/etc/nginx/sites-enabled/mikroimathites.conf`
> (symlink to `sites-available`). Do **not** create a second file with overlapping
> `server_name` blocks — nginx silently picks one and the other is ignored, which is
> exactly the bug fixed on 2026-07-08 (a stale port-80 config was shadowing the
> HTTPS redirect for months).

## Canonical config (as deployed 2026-07-08)

Canonical host is `https://mikroimathites.gr`. All other host/scheme variants 301 there.

```nginx
# HTTP (both hosts): ACME challenge + redirect everything else to https apex
server {
  listen 80;
  server_name mikroimathites.gr www.mikroimathites.gr;

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    return 301 https://mikroimathites.gr$request_uri;
  }
}

# HTTPS www -> apex
server {
  listen 443 ssl http2;
  server_name www.mikroimathites.gr;

  ssl_certificate /etc/letsencrypt/live/mikroimathites.gr/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/mikroimathites.gr/privkey.pem;

  return 301 https://mikroimathites.gr$request_uri;
}

# HTTPS apex: main site
server {
  listen 443 ssl http2;
  server_name mikroimathites.gr;

  ssl_certificate /etc/letsencrypt/live/mikroimathites.gr/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/mikroimathites.gr/privkey.pem;

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
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

Notes:

- **No nginx-level static caching.** Next.js already sets correct `Cache-Control`
  per asset (hashed `/_next/static` files are immutable; icons and images are not).
  A blanket `expires 1y, immutable` on all `.png/.js/.css` would cache-stick
  non-hashed files like `/icon.png` after a redesign.
- The app container binds to `127.0.0.1:3000` only (see `docker-compose.yml`) —
  nginx is the sole public entry point.

## Apply changes

```bash
sudo nano /etc/nginx/sites-available/mikroimathites.conf
sudo nginx -t                  # must pass before reloading
sudo systemctl reload nginx
```

A backup of the pre-2026-07-08 configs lives in `/root/nginx-backup-2026-07-08/` on the VPS.

## Verify from outside

```bash
curl -sI http://mikroimathites.gr      | grep -iE 'HTTP|location'   # 301 -> https apex
curl -sI http://www.mikroimathites.gr  | grep -iE 'HTTP|location'   # 301 -> https apex
curl -sI https://www.mikroimathites.gr | grep -iE 'HTTP|location'   # 301 -> https apex
curl -sI https://mikroimathites.gr     | grep -iE 'HTTP'            # 200
curl -s --max-time 5 http://62.72.16.175:3000/api/health            # should time out / refuse
```

## Troubleshooting 502 errors

1. **Check container logs:** `docker compose logs --tail=100 app`
2. **Check if container is running:** `docker compose ps`
3. **Check container health:** `docker compose exec app wget -q -O- http://localhost:3000/api/health`
4. **Check nginx error logs:** `sudo tail -f /var/log/nginx/error.log`
5. **Check memory:** `free -h`
6. **Restart services:** `docker compose restart && sudo systemctl restart nginx`
