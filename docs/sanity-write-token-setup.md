# How to Get Sanity Write Token

## Quick Setup

The `SANITY_WRITE_TOKEN` is required for uploading sponsor logos to Sanity. Here's how to get it:

## Step-by-Step Instructions

### 1. Go to Sanity Dashboard

1. Visit [https://sanity.io/manage](https://sanity.io/manage)
2. Log in to your Sanity account
3. Select your project

### 2. Create API Token

1. Go to **API** → **Tokens** (or **Settings** → **API** → **Tokens`)
2. Click **Add API token** or **Create token**
3. Give it a name: `Sponsor Uploads` or `Write Token`
4. Set permissions: **Editor** (needs write access for assets and documents)
5. Click **Save**

### 3. Copy the Token

- The token will be shown once (e.g., `skAbCdEf...`)
- **Copy it immediately** - you won't be able to see it again!

### 4. Add to Environment Variables

Add to your `.env.local` file:

```env
SANITY_WRITE_TOKEN=skAbCdEf1234567890...
```

### 5. Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Verify It Works

1. Try uploading a logo in the sponsor form
2. Check the terminal - you should NOT see the warning about missing token
3. Upload should succeed

## Token Permissions

The token needs:
- ✅ **Read** access (to fetch existing documents)
- ✅ **Write** access (to upload assets and create/update documents)

**Editor** role provides both.

## Security Notes

- ⚠️ **Never commit** `.env.local` to git (it should be in `.gitignore`)
- ⚠️ **Never expose** the token to the client (it's server-only)
- ✅ Token is only used in API routes (server-side)
- ✅ Token is never sent to the browser

## Troubleshooting

### "Write client not configured" error

- Check `.env.local` exists in project root
- Verify `SANITY_WRITE_TOKEN` is set (no quotes, no spaces)
- Restart dev server after adding token
- Check token hasn't expired (create new one if needed)

### "Unauthorized" error

- Token might not have correct permissions
- Create new token with **Editor** role
- Verify project ID matches your Sanity project

### Token not working

- Make sure you're using the correct project
- Check token hasn't been revoked
- Create a new token if unsure

## Alternative: Use Existing Token

If you already have a Sanity write token from another setup:

1. Check your existing `.env.local` for `SANITY_WRITE_TOKEN` or similar
2. Or check Sanity Studio config files
3. Reuse the same token (it can have multiple permissions)

