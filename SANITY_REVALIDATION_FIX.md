# Fix Sanity Revalidation in Production

## Problem
Content updates from Sanity work in localhost but not in production (mikroimathites.gr).

## Root Causes
1. **Missing `SANITY_REVALIDATE_SECRET` in production** - The environment variable is not set on the VPS
2. **Sanity webhook not configured for production** - The webhook URL points to localhost or is missing
3. **Webhook not triggering** - Even if configured, the webhook might not be firing

## Solution Steps

### 1. Add `SANITY_REVALIDATE_SECRET` to Production

**On your VPS:**
```bash
# SSH to VPS
ssh your-user@your-vps-host

# Edit .env.production
cd /path/to/your/app
nano .env.production
```

**Add this line:**
```env
SANITY_REVALIDATE_SECRET=your-secret-key-here
```

**Generate a secure secret:**
```bash
# On your local machine or VPS
openssl rand -base64 32
```

**After adding, restart containers:**
```bash
docker compose restart
```

### 2. Configure Sanity Webhook for Production

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Webhooks**
4. **Check if webhook exists:**
   - If it exists, edit it
   - If it doesn't exist, click **Create webhook**

5. **Configure the webhook:**
   - **Name**: `Next.js Production Revalidation`
   - **URL**: `https://mikroimathites.gr/api/revalidate?secret=YOUR_SECRET`
     - ⚠️ **Important**: Replace `YOUR_SECRET` with the same value you added to `.env.production`
   - **Dataset**: Select your production dataset
   - **Trigger on**: Select **Create**, **Update**, and **Delete**
   - **Filter**: Leave empty (to catch all content changes)
   - **HTTP method**: `POST`
   - **API version**: `v2021-06-07` or later
   - **Secret**: Leave empty (we're using query param)
   - **Include drafts**: No

6. Click **Save**

### 3. Test the Webhook

**Option A: Manual Test (from VPS)**
```bash
# SSH to VPS
ssh your-user@your-vps-host

# Test the revalidate endpoint
curl -X POST "https://mikroimathites.gr/api/revalidate?secret=YOUR_SECRET"
```

**Expected response:**
```json
{
  "revalidated": true,
  "now": 1234567890,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "paths": ["/", "/gia-goneis", "/drastiriotites", ...]
}
```

**Option B: Test via Sanity**
1. Update any content in Sanity Studio
2. **Publish** the changes (important: must be published!)
3. Check Sanity webhook logs:
   - Go to Sanity Manage → API → Webhooks
   - Click on your webhook
   - Check "Delivery logs" tab
   - You should see successful POST requests

4. Check VPS logs:
   ```bash
   docker compose logs -f app | grep -i revalidat
   ```

5. Refresh your production site - changes should appear immediately

### 4. Verify Environment Variable

**Check if the variable is loaded:**
```bash
# On VPS
docker compose exec app printenv | grep SANITY_REVALIDATE_SECRET
```

If it's empty, make sure:
- `.env.production` has the variable
- You restarted containers after adding it
- The variable name is exactly `SANITY_REVALIDATE_SECRET` (no typos)

## Troubleshooting

### Changes still not appearing?

1. **Check webhook is firing:**
   - Sanity Manage → API → Webhooks → Your webhook → Delivery logs
   - Look for recent POST requests
   - Check if they're successful (200 status) or failed

2. **Check VPS logs:**
   ```bash
   docker compose logs app | grep -i revalidat
   ```
   - Should see "Revalidation successful" messages
   - If you see "No secret set; revalidate skipped" → `SANITY_REVALIDATE_SECRET` is missing
   - If you see "Invalid secret" → The secret in webhook URL doesn't match `.env.production`

3. **Test endpoint manually:**
   ```bash
   curl -X POST "https://mikroimathites.gr/api/revalidate?secret=YOUR_SECRET"
   ```
   - Should return `{"revalidated": true, ...}`
   - If 401 → Secret mismatch
   - If 500 → Check logs for errors

4. **Hard refresh browser:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)
   - Clears browser cache

5. **Check if you published:**
   - Sanity changes only trigger webhooks when **published**
   - Drafts don't trigger revalidation

### Webhook not triggering?

1. **Verify webhook URL:**
   - Must be `https://mikroimathites.gr/api/revalidate?secret=...`
   - Not `http://localhost:3000` or `http://...`
   - Must be HTTPS (not HTTP)

2. **Check webhook is enabled:**
   - Sanity Manage → API → Webhooks
   - Make sure webhook is not disabled/paused

3. **Check webhook filter:**
   - If you have a filter, make sure it matches the content type you're editing
   - Try removing the filter to catch all changes

4. **Check dataset:**
   - Make sure webhook is configured for the correct dataset (usually "production")

## Quick Checklist

- [ ] `SANITY_REVALIDATE_SECRET` is set in `.env.production` on VPS
- [ ] Containers restarted after adding the variable
- [ ] Sanity webhook URL is `https://mikroimathites.gr/api/revalidate?secret=...`
- [ ] Webhook secret matches the one in `.env.production`
- [ ] Webhook is enabled and configured for production dataset
- [ ] Webhook triggers on Create, Update, Delete
- [ ] Tested manually: `curl -X POST "https://mikroimathites.gr/api/revalidate?secret=..."`

## After Fix

Once configured:
1. Update content in Sanity
2. **Publish** the changes
3. Changes should appear on mikroimathites.gr within seconds
4. No need to wait 10 minutes (the fallback revalidation time)
