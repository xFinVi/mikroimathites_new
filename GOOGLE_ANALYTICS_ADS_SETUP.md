# Google Analytics & Google Ads Setup Guide

This guide will walk you through setting up Google Analytics (GA4) and Google AdSense for your website.

---

## 📋 Prerequisites

- Google account
- Access to your website's codebase
- Website must be live (or at least accessible via a domain)

---

## 🔵 Part 1: Google Analytics 4 (GA4) Setup

### Step 1: Create a Google Analytics Account

1. **Go to Google Analytics:**
   - Visit: https://analytics.google.com/
   - Sign in with your Google account

2. **Create an Account:**
   - Click "Start measuring" or "Admin" → "Create Account"
   - Enter account name: "Μικροί Μαθητές" (or your preferred name)
   - Configure account settings (timezone, currency)
   - Click "Next"

3. **Create a Property:**
   - Property name: "Mikroi Mathites Website" (or your preferred name)
   - Select timezone: `(GMT+02:00) Athens`
   - Select currency: `Euro (€)`
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

### Step 3: Add Measurement ID to Your Website

1. **Add to Environment Variables:**
   - Open your `.env.local` file (or create it if it doesn't exist)
   - Add this line:
     ```env
     NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
     ```
   - Replace `G-XXXXXXXXXX` with your actual Measurement ID

2. **Verify Setup:**
   - Restart your development server: `npm run dev`
   - Visit your website
   - Accept cookies (if cookie consent is shown)
   - Go to Google Analytics → Reports → Realtime
   - You should see your visit appear within 30 seconds

### Step 4: Verify Installation (Optional but Recommended)

1. **Use Google Tag Assistant:**
   - Install Chrome extension: "Tag Assistant Legacy" or "Google Tag Assistant"
   - Visit your website
   - Click the extension icon
   - It should show "Google Analytics: Universal Analytics" or "GA4" as detected

2. **Check Network Tab:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Filter by "gtag" or "analytics"
   - You should see requests to `google-analytics.com`

---

## 🟢 Part 2: Google AdSense Setup

### Step 1: Create an AdSense Account

1. **Go to Google AdSense:**
   - Visit: https://www.google.com/adsense/
   - Sign in with your Google account (preferably the same as Analytics)

2. **Start Application:**
   - Click "Get started"
   - Select your country: `Greece`
   - Enter your website URL: `https://mikroimathites.gr`
   - Click "Continue"

3. **Complete Application:**
   - Choose payment country: `Greece`
   - Enter payment details (you'll need a bank account)
   - Accept AdSense Terms and Conditions
   - Click "Create AdSense account"

### Step 2: Add Your Website

1. **Add Site:**
   - In AdSense dashboard, go to "Sites"
   - Click "Add site"
   - Enter your website URL: `https://mikroimathites.gr`
   - Click "Continue"

2. **Verify Ownership:**
   - Google will provide verification methods:
     - **Option 1: HTML file upload** (Recommended)
       - Download the HTML file
       - Upload it to your website's `public/` folder
       - Access it via: `https://mikroimathites.gr/adsense-verification.html`
     - **Option 2: HTML tag**
       - Add the meta tag to your `<head>` in `app/layout.tsx`
       - We can add this if needed

3. **Wait for Review:**
   - Google will review your site (usually 1-7 days)
   - You'll receive an email when approved

### Step 3: Get Your Publisher ID

1. **Find Publisher ID:**
   - Once approved, go to AdSense dashboard
   - Click "Account" → "Account information"
   - Find "Publisher ID" - it starts with `ca-pub-` (e.g., `ca-pub-1234567890123456`)
   - **Copy this ID**

2. **Add to Environment Variables:**
   - Open your `.env.local` file
   - Add this line:
     ```env
     NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
     ```
   - Replace with your actual Publisher ID

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
   - Click "Create"

2. **Get Ad Slot ID:**
   - After creating, you'll see an "Ad unit code"
   - Find the `data-ad-slot` value (e.g., `1234567890`)
   - **Copy this slot ID**

3. **Add Ad to Your Website:**
   ```tsx
   // In any component where you want to show ads
   import { AdUnit } from "@/components/ads/ad-unit";

   // In your JSX:
   <AdUnit slot="1234567890" format="auto" />
   ```

### Step 5: Enable Auto Ads (Optional)

1. **Enable Auto Ads:**
   - Go to AdSense dashboard → "Ads" → "Auto ads"
   - Click "Get started"
   - Select your site
   - Enable Auto ads
   - Google will automatically place ads on your site

2. **No Code Needed:**
   - Auto ads work automatically once enabled
   - Just make sure `NEXT_PUBLIC_ADSENSE_CLIENT` is set in your environment

---

## 🔧 Part 3: Environment Variables Setup

### Complete `.env.local` File

Add these to your `.env.local` file:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

### Production Environment Variables

When deploying to production (Vercel, etc.):

1. **Vercel:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add:
     - `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`
     - `NEXT_PUBLIC_ADSENSE_CLIENT` = `ca-pub-XXXXXXXXXXXXXXXX`
   - Redeploy your site

2. **Other Platforms:**
   - Add the same environment variables in your hosting platform's settings
   - Restart/redeploy your application

---

## ✅ Part 4: Verification & Testing

### Test Google Analytics

1. **Real-time Reports:**
   - Go to Google Analytics → Reports → Realtime
   - Visit your website
   - You should see your visit appear within 30 seconds

2. **Check Events:**
   - Navigate through your site
   - Check if page views are being tracked
   - Look for custom events (if any)

### Test Google AdSense

1. **Ad Preview Tool:**
   - Go to AdSense dashboard → "Ads" → "Ad preview"
   - Enter your website URL
   - Check if ads are showing correctly

2. **Live Site:**
   - Visit your website
   - Accept cookies (if advertising cookies are allowed)
   - Ads should appear in designated areas

3. **Note:** Ads may not show in development mode. Test in production.

---

## 📍 Part 5: Adding Ads to Specific Pages

### Example: Add Ad to Homepage

```tsx
// app/page.tsx
import { AdUnit } from "@/components/ads/ad-unit";

export default function HomePage() {
  return (
    <div>
      {/* Your content */}
      
      {/* Ad unit */}
      <div className="my-8">
        <AdUnit slot="1234567890" format="auto" />
      </div>
      
      {/* More content */}
    </div>
  );
}
```

### Example: Add Ad to Article Sidebar

```tsx
// components/articles/article-content.tsx
import { AdUnit } from "@/components/ads/ad-unit";

export function ArticleContent({ article }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        {/* Article content */}
      </div>
      
      {/* Sidebar with ad */}
      <aside className="lg:col-span-1">
        <div className="sticky top-4">
          <AdUnit slot="1234567890" format="vertical" />
        </div>
      </aside>
    </div>
  );
}
```

### Ad Format Options

- `"auto"` - Responsive, adapts to container
- `"rectangle"` - 300x250 or 336x280
- `"vertical"` - 300x600 (skyscraper)
- `"horizontal"` - 728x90 (banner)

---

## 🛡️ Part 6: GDPR Compliance

### Cookie Consent

Our implementation already handles GDPR compliance:

1. **Cookie Consent Modal:**
   - Shows on first visit
   - Users can accept/reject cookies
   - Separate controls for Analytics and Advertising

2. **Conditional Loading:**
   - Analytics only loads if user accepts "analytics" cookies
   - Ads only load if user accepts "advertising" cookies

3. **No Action Needed:**
   - The code already respects cookie preferences
   - Just make sure your Privacy Policy mentions:
     - Google Analytics usage
     - Google AdSense usage
     - Cookie types used

---

## 🐛 Troubleshooting

### Analytics Not Working

1. **Check Environment Variable:**
   - Verify `NEXT_PUBLIC_GA_ID` is set correctly
   - Restart dev server after adding env var

2. **Check Cookie Consent:**
   - Make sure user has accepted "analytics" cookies
   - Check browser console for errors

3. **Check Network Tab:**
   - Open DevTools → Network
   - Filter by "gtag" or "analytics"
   - Should see requests to `google-analytics.com`

4. **Real-time Reports:**
   - GA4 can take 24-48 hours to show data in standard reports
   - Use "Realtime" reports for immediate verification

### Ads Not Showing

1. **Check Approval Status:**
   - Make sure your AdSense account is approved
   - Check email for approval notification

2. **Check Environment Variable:**
   - Verify `NEXT_PUBLIC_ADSENSE_CLIENT` is set correctly
   - Restart dev server after adding env var

3. **Check Cookie Consent:**
   - Make sure user has accepted "advertising" cookies
   - Ads won't show if advertising cookies are rejected

4. **Ad Blocker:**
   - Disable ad blockers for testing
   - Users with ad blockers won't see ads (this is normal)

5. **Development Mode:**
   - Ads may not show in `localhost`
   - Test in production environment

6. **Ad Unit Code:**
   - Verify the slot ID is correct
   - Make sure the ad unit is active in AdSense dashboard

---

## 📊 Part 7: Monitoring & Optimization

### Google Analytics

1. **Key Metrics to Monitor:**
   - Users, Sessions, Page views
   - Bounce rate
   - Average session duration
   - Top pages

2. **Set Up Goals:**
   - Go to Admin → Events
   - Create custom events for important actions
   - Track conversions

### Google AdSense

1. **Monitor Performance:**
   - Check "Overview" dashboard
   - Monitor RPM (Revenue per 1000 impressions)
   - Track CTR (Click-through rate)

2. **Optimize Ad Placement:**
   - Test different ad positions
   - Use "Ad preview" tool to see user experience
   - Balance revenue with user experience

---

## 📝 Checklist

### Google Analytics Setup
- [ ] Created Google Analytics account
- [ ] Created GA4 property
- [ ] Added website as data stream
- [ ] Copied Measurement ID (G-XXXXXXXXXX)
- [ ] Added `NEXT_PUBLIC_GA_ID` to `.env.local`
- [ ] Verified in Realtime reports
- [ ] Tested cookie consent integration

### Google AdSense Setup
- [ ] Created AdSense account
- [ ] Added website to AdSense
- [ ] Verified website ownership
- [ ] Received approval email
- [ ] Copied Publisher ID (ca-pub-XXXXXXXXXX)
- [ ] Added `NEXT_PUBLIC_ADSENSE_CLIENT` to `.env.local`
- [ ] Created ad units (if using manual placement)
- [ ] Added ads to website pages
- [ ] Tested ad display
- [ ] Verified cookie consent integration

### Production Deployment
- [ ] Added environment variables to hosting platform
- [ ] Redeployed website
- [ ] Verified Analytics in production
- [ ] Verified Ads in production
- [ ] Updated Privacy Policy with cookie information

---

## 🎯 Next Steps

1. **Set up Google Analytics goals** for important actions
2. **Create multiple ad units** for different page types
3. **Monitor performance** and optimize ad placement
4. **Set up custom events** in Analytics for better insights
5. **Review Privacy Policy** to ensure compliance

---

## 📚 Additional Resources

- **Google Analytics Help:** https://support.google.com/analytics
- **Google AdSense Help:** https://support.google.com/adsense
- **GDPR Compliance:** https://gdpr.eu/
- **Next.js Third-Parties Docs:** https://nextjs.org/docs/app/api-reference/next-config-js/thirdPartyScripts

---

**Need Help?** If you encounter any issues, check the troubleshooting section or contact the development team.


