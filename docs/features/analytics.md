# Google Analytics & Google Ads Complete Setup Guide

This comprehensive guide covers Google Analytics (GA4) and Google AdSense setup, verification, and troubleshooting.

---

## 📋 Prerequisites

- Google account
- Access to your website's codebase
- Website must be live (or at least accessible via a domain)

---

## 🚀 Quick Start (Google Analytics Only)

**Good News:** Your app is already set up for Google Analytics! You just need to:
1. Get your Google Analytics Measurement ID
2. Replace the placeholder in `.env.local`

### **Quick Setup Steps**

1. **Get Measurement ID:**
   - Visit: https://analytics.google.com/
   - Create account → Create property → Add web stream
   - Copy Measurement ID (starts with `G-`)

2. **Add to Project:**
   - Open `.env.local`
   - Add: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
   - Restart dev server: `npm run dev`

3. **Verify:**
   - Visit http://localhost:3000
   - Accept cookies
   - Check Google Analytics → Reports → Realtime
   - See your visit appear within 30 seconds

---

## 🔵 Part 1: Google Analytics 4 (GA4) Complete Setup

### Step 1: Create a Google Analytics Account

1. **Go to Google Analytics:**
   - Visit: https://analytics.google.com/
   - Sign in with your Google account

2. **Create an Account:**
   - Click "Start measuring" or "Admin" → "Create Account"
   - Enter account name: "Μικροί Μαθητές" (or your preferred name)
   - Configure account settings:
     - Country: `Greece`
     - Timezone: `(GMT+02:00) Athens`
     - Currency: `Euro (€)`
   - Click "Next"

3. **Create a Property:**
   - Property name: "Mikroi Mathites Website"
   - Reporting timezone: `(GMT+02:00) Athens`
   - Currency: `Euro (€)`
   - Click "Next"

4. **Business Information:**
   - Select industry: "Education" or "Family & Parenting"
   - Select business size: Choose appropriate size
   - Select how you intend to use GA4: Select relevant options
   - Click "Create"

5. **Accept Terms:**
   - Read and accept Google Analytics Terms of Service
   - Accept Data Processing Terms

### Step 2: Get Your Measurement ID

1. **Find Your Measurement ID:**
   - After creating the property, you'll see a "Data Streams" section
   - Click "Add stream" → "Web"
   - Enter:
     - Website URL: `https://mikroimathites.gr` (or your domain)
     - Stream name: "Mikroi Mathites Website"
   - Click "Create stream"

2. **Copy Your Measurement ID:**
   - You'll see a page with your stream details
   - Look for "Measurement ID" - it starts with `G-` (e.g., `G-XXXXXXXXXX`)
   - **Copy this ID** - you'll need it in the next step
   - Example format: `G-ABC123XYZ4`

### Step 3: Add Measurement ID to Your Website

#### Development Environment

1. **Create or Edit `.env.local` file:**
   - In your project root directory
   - Create `.env.local` if it doesn't exist

2. **Add the Measurement ID:**
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   - Replace `G-XXXXXXXXXX` with your actual Measurement ID
   - Keep the `G-` prefix!

3. **Save the file**

4. **Restart your development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

**Important:** Environment variables are only loaded when the server starts, so you MUST restart!

#### Production Environment (Vercel)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings:**
   - Click on your project
   - Go to **"Settings"** tab
   - Click **"Environment Variables"** in the sidebar

3. **Add Environment Variable:**
   - Click **"Add New"**
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX` (your actual Measurement ID)
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

4. **Redeploy:**
   - Go to **"Deployments"** tab
   - Click **"..."** on the latest deployment
   - Click **"Redeploy"**

---

## ✅ Verification: How to Confirm Google Analytics is Working

### Method 1: Google Analytics Realtime Reports (Recommended)

**This is the easiest and most reliable method.**

1. **Open Google Analytics:**
   - Go to: https://analytics.google.com/
   - Select your property: "Mikroi Mathites Website"

2. **Navigate to Realtime Reports:**
   - Click **"Reports"** in the left sidebar
   - Click **"Realtime"**

3. **Visit Your Site:**
   - Open your website in a new tab
   - **Accept Analytics cookies** (important!)
   - Navigate through a few pages

4. **Check Realtime Dashboard:**
   - Within **30 seconds**, you should see:
     - **Active users: 1** (or more)
     - **Your current page** listed under "Pages"
     - **Events** showing page views

**✅ If you see your visit here, Analytics is working!**

### Method 2: Browser DevTools - Network Tab

1. **Open Your Website:**
   - Visit your site
   - **Accept Analytics cookies**

2. **Open DevTools:**
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to **"Network"** tab

3. **Filter Requests:**
   - In the filter box, type: `gtag` or `analytics`

4. **What to Look For:**
   - You should see requests like:
     - `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
     - `https://www.google-analytics.com/g/collect?...`
   - Status should be `200` (success)

**✅ If you see these requests, Analytics is loading!**

### Method 3: Browser Console Check

1. **Open DevTools Console:**
   - Press `F12`
   - Go to **"Console"** tab

2. **Check for DataLayer:**
   ```javascript
   window.dataLayer
   ```
   - Should return an array with analytics data

3. **Check for gtag Function:**
   ```javascript
   typeof gtag
   ```
   - Should return: `"function"`

**✅ If `gtag` is a function, Analytics is active!**

### Method 4: Check Cookies

1. **Open DevTools:**
   - Press `F12`
   - Go to **"Application"** tab (Chrome) or **"Storage"** tab (Firefox)

2. **Check Cookies:**
   - Expand **"Cookies"** in the left sidebar
   - Look for cookies starting with:
     - `_ga` (Google Analytics)
     - `_ga_` (Google Analytics 4)
     - `_gid` (Google Analytics)

**✅ If you see `_ga` cookies, Analytics is tracking!**

---

## 🟢 Part 2: Google AdSense Setup

### Step 1: Create an AdSense Account

1. **Go to Google AdSense:**
   - Visit: https://www.google.com/adsense/
   - Sign in with your Google account

2. **Start Application:**
   - Click "Get started"
   - Select your country: `Greece`
   - Enter your website URL: `https://mikroimathites.gr`
   - Click "Continue"

3. **Complete Application:**
   - Choose payment country: `Greece`
   - Enter payment details (bank account required)
   - Accept AdSense Terms and Conditions
   - Click "Create AdSense account"

### Step 2: Add Your Website

1. **Add Site:**
   - In AdSense dashboard, go to "Sites"
   - Click "Add site"
   - Enter your website URL: `https://mikroimathites.gr`

2. **Verify Ownership:**
   - **Option 1: HTML file upload** (Recommended)
     - Download the HTML file
     - Upload it to your website's `public/` folder
   - **Option 2: HTML tag**
     - Add the meta tag to your `<head>` in `app/layout.tsx`

3. **Wait for Review:**
   - Google will review your site (usually 1-7 days)
   - You'll receive an email when approved

### Step 3: Get Your Publisher ID

1. **Find Publisher ID:**
   - Once approved, go to AdSense dashboard
   - Click "Account" → "Account information"
   - Find "Publisher ID" - starts with `ca-pub-`
   - **Copy this ID**

2. **Add to Environment Variables:**
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
   ```

### Step 4: Create Ad Units (After Approval)

1. **Create Ad Unit:**
   - Go to AdSense dashboard → "Ads" → "By ad unit"
   - Click "Create ad unit"
   - Choose ad type:
     - **Display ads** (recommended for most pages)
     - **In-feed ads** (for article lists)
     - **In-article ads** (between article content)
   - Enter ad unit name: e.g., "Homepage Sidebar"
   - Select ad size: "Responsive" (recommended)

2. **Get Ad Slot ID:**
   - After creating, find the `data-ad-slot` value
   - **Copy this slot ID**

3. **Add Ad to Your Website:**
   ```tsx
   import { AdUnit } from "@/components/ads/ad-unit";
   
   <AdUnit slot="1234567890" format="auto" />
   ```

---

## 🔐 Environment Variables Summary

### Complete `.env.local` File

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense (after approval)
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

### Production Environment Variables

Add the same variables to your hosting platform (Vercel, etc.)

---

## 🛡️ GDPR Compliance

Our implementation already handles GDPR compliance:

1. **Cookie Consent Modal:**
   - Shows on first visit
   - Users can accept/reject cookies
   - Separate controls for Analytics and Advertising

2. **Conditional Loading:**
   - Analytics only loads if user accepts "analytics" cookies
   - Ads only load if user accepts "advertising" cookies

3. **What's Already Implemented:**
   - ✅ Google Analytics component
   - ✅ Cookie consent integration
   - ✅ Automatic page view tracking
   - ✅ GDPR compliance

---

## 🐛 Troubleshooting

### Analytics Not Working

**Problem:** Not seeing data in Analytics

**Solutions:**
1. ✅ Check that `NEXT_PUBLIC_GA_ID` is set correctly in `.env.local`
2. ✅ Restart your dev server after adding the env variable
3. ✅ Make sure you accepted Analytics cookies
4. ✅ Check that you're looking at **Realtime** reports (not standard reports)
5. ✅ Wait 30-60 seconds for data to appear
6. ✅ Check browser console for errors

**Problem:** Analytics not loading

**Solutions:**
1. ✅ Verify the Measurement ID format: Should start with `G-`
2. ✅ Check browser console for JavaScript errors
3. ✅ Check Network tab - should see requests to `google-analytics.com`

**Problem:** Works in dev but not production

**Solutions:**
1. ✅ Verify environment variable is set in Vercel/hosting platform
2. ✅ Make sure variable name is exactly: `NEXT_PUBLIC_GA_ID`
3. ✅ Redeploy after adding environment variable

### Ads Not Showing

**Problem:** No ads visible

**Solutions:**
1. ✅ Check Approval Status (AdSense account must be approved)
2. ✅ Verify `NEXT_PUBLIC_ADSENSE_CLIENT` is set correctly
3. ✅ Make sure user has accepted "advertising" cookies
4. ✅ Disable ad blockers for testing
5. ✅ Ads may not show in `localhost` - test in production

---

## 📊 What Gets Tracked Automatically

Your implementation automatically tracks:
- ✅ **Page views** - Every page navigation
- ✅ **User sessions** - When users visit your site
- ✅ **User engagement** - Time on page, scroll depth
- ✅ **Traffic sources** - Where users come from
- ✅ **Device information** - Desktop, mobile, tablet

**Note:** All tracking respects cookie consent. If users reject Analytics cookies, nothing is tracked.

---

## ✅ Complete Checklist

### Google Analytics Setup
- [ ] Created Google Analytics account
- [ ] Created GA4 property
- [ ] Added website as data stream
- [ ] Copied Measurement ID (G-XXXXXXXXXX)
- [ ] Added `NEXT_PUBLIC_GA_ID` to `.env.local`
- [ ] Restarted dev server
- [ ] Verified in Realtime reports (development)
- [ ] Added to production environment variables
- [ ] Redeployed to production
- [ ] Verified in Realtime reports (production)
- [ ] Tested cookie consent integration

### Google AdSense Setup (Optional)
- [ ] Created AdSense account
- [ ] Added website to AdSense
- [ ] Verified website ownership
- [ ] Received approval email
- [ ] Copied Publisher ID (ca-pub-XXXXXXXXXX)
- [ ] Added `NEXT_PUBLIC_ADSENSE_CLIENT` to `.env.local`
- [ ] Created ad units
- [ ] Added ads to website pages
- [ ] Tested ad display
- [ ] Updated Privacy Policy

---

## 📚 Additional Resources

- [Google Analytics Help](https://support.google.com/analytics)
- [Google Analytics 4 Guide](https://support.google.com/analytics/topic/9303319)
- [Google AdSense Help](https://support.google.com/adsense)
- [GDPR Compliance](https://gdpr.eu/)
- [Next.js Third-Parties Docs](https://nextjs.org/docs/app/api-reference/next-config-js/thirdPartyScripts)

---

**That's it!** Once you add your Measurement ID and restart the server, Google Analytics will start tracking automatically. 🎉

