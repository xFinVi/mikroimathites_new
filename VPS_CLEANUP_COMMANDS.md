# 🧹 VPS Cleanup Commands

## Quick Cleanup (Single Command)

Run this on your VPS to clean up everything before deployment:

```bash
docker compose down && \
docker stop $(docker ps -aq) 2>/dev/null; \
docker rm $(docker ps -aq) 2>/dev/null; \
docker image prune -af --filter "until=24h" 2>/dev/null; \
docker volume prune -af 2>/dev/null; \
docker network prune -af 2>/dev/null; \
echo "✅ Cleanup complete!"
```

## Using the Cleanup Script

1. **Copy script to VPS:**
   ```bash
   scp vps-cleanup.sh user@your-vps:/path/to/app/
   ```

2. **SSH into VPS:**
   ```bash
   ssh user@your-vps
   ```

3. **Run cleanup:**
   ```bash
   cd /path/to/app
   chmod +x vps-cleanup.sh
   ./vps-cleanup.sh
   ```

## Manual Step-by-Step Cleanup

If you prefer manual control:

```bash
# 1. Stop all containers
docker compose down

# 2. Stop all running containers
docker stop $(docker ps -aq)

# 3. Remove all containers
docker rm $(docker ps -aq)

# 4. Remove unused images (keeps images from last 24h)
docker image prune -af --filter "until=24h"

# 5. Remove unused volumes
docker volume prune -af

# 6. Remove unused networks
docker network prune -af

# 7. Check resources
free -h
df -h
```

## What Gets Cleaned

✅ **Stopped containers** - All stopped containers removed  
✅ **Unused images** - Images older than 24h removed  
✅ **Unused volumes** - Orphaned volumes removed  
✅ **Unused networks** - Unused Docker networks removed  
⚠️ **Build cache** - Not cleared by default (uncomment in script if needed)

## What's Preserved

✅ **Recent images** - Images from last 24h kept  
✅ **Active volumes** - Volumes in use are kept  
✅ **Your code** - Application files untouched

## After Cleanup

Your VPS will have:
- More free disk space
- More free RAM
- Clean Docker state
- Ready for fresh deployment

## Verify Cleanup

```bash
# Check containers
docker ps -a

# Check images
docker images

# Check disk space
df -h

# Check memory
free -h
```

## Safety Notes

- ⚠️ This removes **all** stopped containers
- ⚠️ This removes **unused** images (keeps recent ones)
- ⚠️ Make sure no important data is in unused volumes
- ✅ Your application code is **not** affected
- ✅ Recent images (24h) are **preserved**
