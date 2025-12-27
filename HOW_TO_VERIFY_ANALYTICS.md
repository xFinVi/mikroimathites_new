# 🔍 How to Verify Google Analytics is Active

Multiple ways to check if Google Analytics is working on your site.

---

## ✅ Method 1: Google Analytics Realtime Reports (Recommended)

**This is the easiest and most reliable method.**

### Steps:

1. **Open Google Analytics:**
   - Go to: https://analytics.google.com/
   - Sign in with your Google account
   - Select your property: "Mikroi Mathites Website"

2. **Navigate to Realtime Reports:**
   - Click **"Reports"** in the left sidebar
   - Click **"Realtime"** (or go directly: https://analytics.google.com/analytics/web/#/realtime)

3. **Visit Your Site:**
   - Open your website in a new tab: http://localhost:3000 (dev) or https://mikroimathites.gr (production)
   - **Accept Analytics cookies** (important!)
   - Navigate through a few pages

4. **Check Realtime Dashboard:**
   - Within **30 seconds**, you should see:
     - **Active users: 1** (or more)
     - **Your current page** listed under "Pages"
     - **Events** showing page views
     - **Top pages** showing pages you've visited

### What You Should See:

```
Realtime Overview
├── Active users: 1
├── Pages and screens
│   └── / (or current page)
├── Top pages
│   └── / (1 view)
└── Events
    └── page_view (1 event)
```

**✅ If you see your visit here, Analytics is working!**

---

## ✅ Method 2: Browser DevTools - Network Tab

**Check if Google Analytics scripts are loading.**

### Steps:

1. **Open Your Website:**
   - Visit: http://localhost:3000 (or your production URL)
   - **Accept Analytics cookies**

2. **Open DevTools:**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Go to **"Network"** tab

3. **Filter Requests:**
   - In the filter box, type: `gtag` or `analytics`
   - Or filter by: `google-analytics.com`

4. **What to Look For:**
   - You should see requests like:
     - `https://www.googletagmanager.com/gtag/js?id=G-VBTH9PVDBB`
     - `https://www.google-analytics.com/g/collect?...`
   - Status should be `200` (success)

### Example of What You Should See:

```
Name                          Status  Type
─────────────────────────────────────────────
gtag/js?id=G-VBTH9PVDBB      200     script
g/collect?...                204     img
```

**✅ If you see these requests, Analytics is loading!**

---

## ✅ Method 3: Browser DevTools - Console Tab

**Check for Google Analytics initialization.**

### Steps:

1. **Open Your Website:**
   - Visit your site
   - **Accept Analytics cookies**

2. **Open DevTools Console:**
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to **"Console"** tab

3. **Check for DataLayer:**
   - Type in console: `window.dataLayer`
   - Press Enter
   - You should see an array with analytics data

4. **Check for gtag Function:**
   - Type in console: `typeof gtag`
   - Should return: `"function"`

### Example Console Output:

```javascript
// Check dataLayer
> window.dataLayer
[Array] // Should contain analytics events

// Check gtag function
> typeof gtag
"function" // ✅ This means Analytics is loaded
```

**✅ If `gtag` is a function, Analytics is active!**

---

## ✅ Method 4: Check Cookie Consent Status

**Verify that Analytics cookies are accepted.**

### Steps:

1. **Open Browser DevTools:**
   - Press `F12`
   - Go to **"Application"** tab (Chrome) or **"Storage"** tab (Firefox)

2. **Check Cookies:**
   - Expand **"Cookies"** in the left sidebar
   - Click on your domain (localhost:3000 or mikroimathites.gr)
   - Look for cookies starting with:
     - `_ga` (Google Analytics)
     - `_ga_` (Google Analytics 4)
     - `_gid` (Google Analytics)

3. **Check Local Storage:**
   - Go to **"Local Storage"** in the left sidebar
   - Look for: `cookie-consent` or similar
   - Should show: `analytics: true`

### What You Should See:

```
Cookies:
├── _ga (expires in 2 years)
├── _ga_XXXXXXXXXX (expires in 2 years)
└── _gid (expires in 24 hours)

Local Storage:
└── cookie-consent: { "analytics": true, ... }
```

**✅ If you see `_ga` cookies, Analytics is tracking!**

---

## ✅ Method 5: Visual Code Check

**Verify the component is rendering.**

### Steps:

1. **Check Component Rendering:**
   - Open: `components/analytics/conditional-analytics.tsx`
   - The component should render Script tags when:
     - `gaId` is set (from `NEXT_PUBLIC_GA_ID`)
     - User has accepted analytics cookies
     - Component is not loading

2. **Check Environment Variable:**
   ```bash
   # In your project root
   grep NEXT_PUBLIC_GA_ID .env.local
   ```
   - Should show: `NEXT_PUBLIC_GA_ID=G-VBTH9PVDBB`

3. **Check HTML Source:**
   - Visit your site
   - Right-click → "View Page Source"
   - Search for: `googletagmanager.com/gtag/js`
   - Should find the script tag

**✅ If script tag is in HTML, Analytics is configured!**

---

## ✅ Method 6: Google Tag Assistant (Chrome Extension)

**Use Google's official tool to verify.**

### Steps:

1. **Install Extension:**
   - Install "Tag Assistant Legacy" from Chrome Web Store
   - Or use "Google Tag Assistant" (newer version)

2. **Visit Your Site:**
   - Go to your website
   - Click the Tag Assistant icon in your browser toolbar

3. **Check Results:**
   - Should show: "Google Analytics: Universal Analytics" or "GA4"
   - Should show your Measurement ID: `G-VBTH9PVDBB`

**✅ If Tag Assistant detects GA4, Analytics is working!**

---

## 🚨 Troubleshooting: Analytics Not Working?

### Check These Common Issues:

1. **Cookie Consent Not Accepted:**
   - ❌ Problem: Analytics won't load if cookies are rejected
   - ✅ Solution: Accept "Analytics" cookies in the cookie consent modal

2. **Environment Variable Not Set:**
   - ❌ Problem: `NEXT_PUBLIC_GA_ID` is missing or incorrect
   - ✅ Solution: Check `.env.local` has `NEXT_PUBLIC_GA_ID=G-VBTH9PVDBB`

3. **Server Not Restarted:**
   - ❌ Problem: Environment variables only load on server start
   - ✅ Solution: Restart dev server: `npm run dev`

4. **Ad Blocker Active:**
   - ❌ Problem: Ad blockers can block Google Analytics
   - ✅ Solution: Disable ad blocker for testing

5. **Wrong Measurement ID:**
   - ❌ Problem: Using placeholder or incorrect ID
   - ✅ Solution: Verify ID in Google Analytics dashboard

6. **Development vs Production:**
   - ❌ Problem: Testing in dev but variable only set in production
   - ✅ Solution: Set variable in both `.env.local` and Vercel

---

## 📊 Quick Verification Checklist

Run through this checklist:

- [ ] Environment variable set: `NEXT_PUBLIC_GA_ID=G-VBTH9PVDBB`
- [ ] Dev server restarted after adding env variable
- [ ] Cookie consent accepted (Analytics cookies enabled)
- [ ] Network tab shows `gtag` requests
- [ ] Console shows `gtag` function exists
- [ ] Google Analytics Realtime shows active user
- [ ] Cookies `_ga` and `_ga_` are present

**If all checked ✅, Analytics is definitely working!**

---

## 🎯 Recommended Verification Flow

**For Quick Check:**
1. Accept Analytics cookies
2. Open Google Analytics Realtime reports
3. Visit your site
4. See your visit appear within 30 seconds ✅

**For Detailed Check:**
1. Use Method 1 (Realtime Reports) - Primary verification
2. Use Method 2 (Network Tab) - Verify scripts loading
3. Use Method 3 (Console) - Verify initialization
4. Use Method 4 (Cookies) - Verify tracking enabled

---

## 💡 Pro Tips

1. **Realtime Reports are Instant:**
   - Standard reports take 24-48 hours
   - Realtime reports show data within 30 seconds
   - Use Realtime for immediate verification

2. **Test in Incognito:**
   - Use incognito/private mode to test cookie consent
   - Ensures you see the consent modal

3. **Check Multiple Pages:**
   - Navigate through different pages
   - Verify page views are tracked in Realtime

4. **Production vs Development:**
   - Test in both environments
   - Make sure env variable is set in both

---

**Need Help?** If Analytics still isn't working after checking all methods, review the troubleshooting section or check the browser console for errors.

