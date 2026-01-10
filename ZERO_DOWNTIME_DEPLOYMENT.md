# ✅ Zero-Downtime Deployment Fix

## Problem
`docker compose down` stops the container BEFORE building, causing guaranteed downtime (1-3 minutes).

## Solution: Build First, Then Restart

### Strategy
1. **Build new image** while old container is still running
2. **Restart container** with new image (only ~1-2 seconds downtime)

### Changes Made

#### GitHub Actions (`deploy-dev.yml`)
```yaml
# OLD (causes downtime):
docker compose down || true
docker compose build
docker compose up -d

# NEW (zero-downtime):
docker compose build  # Build while old container runs
docker compose up -d --no-deps app  # Restart only app service (~1-2s downtime)
```

#### Manual Script (`redeploy-zero-downtime.sh`)
Same change applied.

## How It Works

1. **Old container** keeps serving traffic on port 3000
2. **Build new image** in background (1-3 minutes)
3. **Restart container** with new image:
   - Stops old container (~0.5s)
   - Starts new container (~0.5s)
   - **Total downtime: ~1-2 seconds** (not minutes!)

## Benefits

✅ **Zero downtime** during build (1-3 minutes)  
✅ **Minimal downtime** during restart (~1-2 seconds)  
✅ **Simple** - no complex blue-green setup needed  
✅ **Works with existing setup** - no infrastructure changes  

## Downtime Comparison

| Method | Build Time | Restart Time | Total Downtime |
|--------|------------|--------------|----------------|
| **Old (down + build + up)** | 1-3 min | 1-2s | **1-3 minutes** ❌ |
| **New (build + restart)** | 0s | 1-2s | **1-2 seconds** ✅ |

## For Production (Future)

If you need **true zero-downtime** (0 seconds), implement **Blue-Green deployment**:

1. Run two containers (blue/green)
2. Build & start green while blue serves traffic
3. Health check green
4. Switch traffic (via Nginx/Caddy)
5. Remove blue

**Current solution is perfect for DEV environment.**

## Testing

After deployment:
1. Monitor application during build - should stay online
2. Brief ~1-2s interruption during restart
3. Application resumes with new version
