# Nginx Configuration for Next.js (Improved)

## Updated Nginx Config

Replace your current Nginx configuration with this improved version that handles Next.js RSC requests better:

```nginx
server {
    listen 80;
    server_name mikroimathites.gr www.mikroimathites.gr;

    # Increase timeouts for Next.js RSC requests
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    send_timeout 60s;

    # Buffer settings
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache control
        proxy_cache_bypass $http_upgrade;
        proxy_no_cache $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
```

## Apply Configuration

```bash
# Edit the config file
sudo nano /etc/nginx/sites-available/mikroimathites

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Troubleshooting 502 Errors

If you still get 502 errors:

1. **Check container logs:**
   ```bash
   docker compose logs --tail=100 app
   ```

2. **Check if container is running:**
   ```bash
   docker compose ps
   ```

3. **Check container health:**
   ```bash
   docker compose exec app wget -q -O- http://localhost:3000/api/health
   ```

4. **Check Nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

5. **Increase memory limit (if needed):**
   ```bash
   # Check current memory
   free -h
   
   # If low, consider increasing Docker memory limits in docker-compose.yml
   ```

6. **Restart services:**
   ```bash
   docker compose restart
   sudo systemctl restart nginx
   ```
