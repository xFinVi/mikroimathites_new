# Google Analytics 4 Setup

## Setup Instructions

1. **Create a Google Analytics 4 Property**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property for your website
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add to Environment Variables**
   - Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **Restart Development Server**
   - Restart your Next.js dev server to load the new environment variable

4. **Verify Installation**
   - Visit your website
   - Check Google Analytics Real-Time reports to see if tracking is working
   - Or use browser DevTools → Network tab to see GA requests

## What's Tracked

- **Page Views**: Automatically tracked on all pages
- **Form Submissions**: Can be added via event tracking (see below)

## Adding Custom Event Tracking

To track form submissions or other events, add this to your components:

```typescript
// Track form submission
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'form_submission', {
    event_category: 'engagement',
    event_label: 'contact_form',
  });
}
```

## Privacy & GDPR

- Consider adding a cookie consent banner
- Google Analytics respects Do Not Track settings
- For GDPR compliance, you may need to:
  - Add cookie consent
  - Anonymize IP addresses (can be configured in GA4)
  - Provide opt-out mechanism

## Production

- Make sure `NEXT_PUBLIC_GA_ID` is set in your production environment variables
- The component will automatically load only if the ID is provided

