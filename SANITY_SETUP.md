# Sanity Setup Guide

## ✅ Current Configuration

Your `env.local` is configured with:
- **Project ID**: `4umly1wd`
- **Dataset**: `mikroimathites_2026`
- **API Version**: `2024-03-01`
- **Token**: Set (write token)
- **Revalidation Secret**: Generated

## 🔍 Verify Your Sanity Tokens

### 1. Check Your API Tokens

1. Go to [Sanity Manage](https://sanity.io/manage)
2. Select your project: **4umly1wd**
3. Go to **API** → **Tokens**
4. Verify you have:
   - **Read token** (optional, for read-only access)
   - **Write token** (required, for Studio access)

### 2. Verify Your Token Permissions

Your current token should have:
- ✅ **Read** access (to fetch content)
- ✅ **Write** access (to edit in Studio)
- ✅ **Project** scope (not just dataset)

If your token doesn't work, create a new one:
1. In Sanity Manage → API → Tokens
2. Click **Add API token**
3. Name it: "Mikroi Mathites Website"
4. Select permissions: **Editor** (read + write)
5. Copy the token and update `SANITY_TOKEN` in `env.local`

## 🚀 Test Your Setup

### Option 1: Access Sanity Studio

1. Make sure dev server is running: `npm run dev`
2. Visit: **http://localhost:3000/studio**
3. You should see the Sanity Studio login
4. Log in with your Sanity account
5. You should see your content types (Article, Activity, etc.)

### Option 2: Test API Connection

Run the test script:
```bash
node scripts/test-sanity.js
```

This will verify:
- ✅ Environment variables are set
- ✅ Connection to Sanity works
- ✅ Token has correct permissions

## 🔗 Set Up Webhook for Revalidation

### 1. Get Your Revalidation Secret

Your secret is already generated in `env.local`:
```
SANITY_REVALIDATE_SECRET=c021ff4e6ff91a31701b6e3b4bf5fc0a35a88747ff80d8e2647e4fe41f48ec21
```

### 2. Configure Webhook in Sanity

1. Go to [Sanity Manage](https://sanity.io/manage)
2. Select your project: **4umly1wd**
3. Go to **API** → **Webhooks**
4. Click **Create webhook**
5. Configure:
   - **Name**: "Next.js Revalidation"
   - **URL**: `https://your-domain.com/api/revalidate?secret=c021ff4e6ff91a31701b6e3b4bf5fc0a35a88747ff80d8e2647e4fe41f48ec21`
     - ⚠️ Replace `your-domain.com` with your actual domain (e.g., `mikroimathites.vercel.app`)
   - **Dataset**: `mikroimathites_2026`
   - **Trigger on**: 
     - ✅ Create
     - ✅ Update
     - ✅ Delete
   - **Filter**: Leave empty (or add specific document types if needed)
   - **HTTP method**: `POST`
   - **API version**: `v2021-03-25` or `v2021-06-07`
   - **Secret**: Leave empty (we use query param instead)
   - **Enabled**: ✅ Yes

### 3. For Local Development

For local testing, you can use a tool like [ngrok](https://ngrok.com/) to expose your local server:
```bash
ngrok http 3000
```
Then use the ngrok URL in the webhook configuration.

## 📝 Create Your First Content

1. Visit **http://localhost:3000/studio**
2. Log in with your Sanity account
3. Create content:
   - **Age Groups**: Create age groups (0-2, 2-4, 4-6, etc.)
   - **Categories**: Create categories (Activities, Printables, etc.)
   - **Activities**: Create your first activity
   - **Articles**: Create your first article

## ✅ Verification Checklist

- [ ] Can access Studio at `/studio`
- [ ] Can log in to Studio
- [ ] Can see content types (Article, Activity, etc.)
- [ ] Can create/edit content
- [ ] Content appears on `/drastiriotites` page
- [ ] Webhook is configured (for production)

## 🐛 Troubleshooting

### Studio won't load
- Check that `SANITY_PROJECT_ID` and `SANITY_DATASET` are correct
- Verify your token has write permissions
- Check browser console for errors

### Can't fetch content
- Verify `SANITY_TOKEN` is set correctly
- Check token has read permissions
- Verify dataset name matches exactly

### Images not loading
- Check `next.config.ts` has Sanity CDN configured (already done)
- Verify image URLs are being generated correctly

## 📚 Next Steps

1. ✅ Create Age Groups and Categories in Studio
2. ✅ Add your first Activities
3. ✅ Add your first Articles
4. ✅ Configure webhook for production
5. ✅ Test content appears on pages


