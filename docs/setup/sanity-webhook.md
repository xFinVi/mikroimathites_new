# Sanity Webhook Setup for On-Demand Revalidation

## Problem
When you update content in Sanity Studio (like the Home Hero image), changes don't appear immediately on the frontend because Next.js caches pages.

## Solution
Set up a Sanity webhook to automatically trigger revalidation when content is published.

## Setup Steps

### 1. Get Your Revalidation Secret

Add this to your `.env.local`:
```bash
SANITY_REVALIDATE_SECRET=your-secret-key-here
```

Generate a secure random string:
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use any password generator
```

### 2. Configure Sanity Webhook

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Webhooks**
4. Click **Create webhook**
5. Configure:
   - **Name**: `Next.js Revalidation`
   - **URL**: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
     - Replace `your-domain.com` with your production domain
     - Replace `YOUR_SECRET` with the value from step 1
   - **Dataset**: Select your dataset
   - **Trigger on**: Select **Create**, **Update**, and **Delete**
   - **Filter**: Leave empty (or use: `_type == "homeHero" || _type == "featuredContentSection" || _type == "forParentsSection" || _type == "activitiesPrintablesSection"`)
   - **HTTP method**: `POST`
   - **API version**: `v2021-06-07` or later
   - **Secret**: Leave empty (we're using query param)
   - **Include drafts**: No

6. Click **Save**

### 3. Test the Webhook

After setting up, test it:

1. Update the Home Hero image in Sanity Studio
2. **Publish** the changes (important: must be published, not just saved)
3. Check your Next.js logs - you should see the revalidation request
4. Refresh your homepage - the new image should appear immediately

### 4. Manual Revalidation (Development)

For local development, you can manually trigger revalidation:

```bash
# Using curl
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET"

# Or using the browser
# Visit: http://localhost:3000/api/revalidate?secret=YOUR_SECRET
```

## Important Notes

1. **Must Publish**: Changes only trigger revalidation when **published**, not when saved as drafts
2. **Production Only**: Webhooks only work in production. For local dev, use manual revalidation or wait for cache expiry (10 minutes)
3. **Secret Security**: Never commit your `SANITY_REVALIDATE_SECRET` to git. Keep it in `.env.local` and set it in your production environment variables

## Troubleshooting

### Changes still not appearing?

1. **Check if you published**: Make sure you clicked "Publish" in Sanity Studio, not just "Save"
2. **Check webhook logs**: In Sanity Manage → API → Webhooks, check the webhook delivery logs
3. **Check Next.js logs**: Look for revalidation errors in your production logs
4. **Verify secret**: Make sure the secret in the webhook URL matches your environment variable
5. **Hard refresh**: Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to clear browser cache

### Webhook not triggering?

1. Verify the webhook URL is correct (must be your production domain)
2. Check that the secret matches
3. Verify the webhook is enabled in Sanity
4. Check Sanity webhook delivery logs for errors


