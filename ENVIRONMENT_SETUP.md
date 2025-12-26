# Environment Setup Guide

## 🔧 Resend Email Service Setup

### Problem
Resend doesn't allow adding `localhost:3000` as a verified domain. For development, we need to use Resend's test domain which only allows sending to your account email.

### Solution: Separate Dev & Production API Keys

#### Step 1: Create Development API Key

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name it: `Mikroi Mathites - Development`
4. Copy the key (starts with `re_`)
5. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

**OR use the script:**
```bash
# Set your master API key first
export RESEND_MASTER_API_KEY=re_xxxxxxxxxxxxx

# Create dev key
npm run resend:create:dev
```

#### Step 2: Create Production API Key

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name it: `Mikroi Mathites - Production`
4. Copy the key
5. **Save it securely** - you'll add it to production environment variables later

**OR use the script:**
```bash
npm run resend:create:prod
```

#### Step 3: Development Environment Behavior

**Current Setup (Development):**
- ✅ Uses `onboarding@resend.dev` (Resend's test domain)
- ✅ Can only send to your account email (`philterzidis@hotmail.com`)
- ✅ User emails are automatically forwarded to admin email
- ✅ Works immediately without domain verification

**How it works:**
- When you reply to a user, the email goes to your admin inbox
- Subject line includes: `[Forward to user@email.com]`
- You can manually forward the email to the user
- This is perfect for development/testing

#### Step 4: Production Environment Setup

**When ready for production:**

1. **Verify your domain:**
   - Go to [Resend Dashboard → Domains](https://resend.com/domains)
   - Add your domain (e.g., `mikroimathites.gr`)
   - Add DNS records (TXT and MX)
   - Wait for verification (5 min - 48 hours)

2. **Update email "from" address:**
   - Edit `lib/email/resend.ts`
   - Change from: `onboarding@resend.dev`
   - Change to: `noreply@mikroimathites.gr` (or your verified domain)

3. **Use production API key:**
   - Add production API key to production environment variables
   - Update `RESEND_API_KEY` in Vercel/your hosting platform

---

## 📊 Google Analytics Setup

### Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **"Start measuring"** or **"Create Account"**
3. Fill in account details:
   - Account name: `Mikroi Mathites`
   - Country: Greece (or your country)
   - Time zone: Your timezone

### Step 2: Create Property

1. Click **"Create Property"**
2. Property name: `Mikroi Mathites Website`
3. Reporting time zone: Your timezone
4. Currency: EUR (or your currency)
5. Click **"Next"**

### Step 3: Set Up Data Stream

1. Select **"Web"** as platform
2. Enter website details:
   - Website URL: `https://mikroimathites.gr` (or your domain)
   - Stream name: `Mikroi Mathites Web`
3. Click **"Create stream"**

### Step 4: Get Measurement ID

1. After creating the stream, you'll see your **Measurement ID**
2. Format: `G-XXXXXXXXXX`
3. Copy this ID

### Step 5: Add to Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**For production:**
- Add the same variable to Vercel/hosting platform environment variables

### Step 6: Verify It's Working

1. Start your dev server: `npm run dev`
2. Visit your site: `http://localhost:3000`
3. Accept cookie consent (if prompted)
4. Go to Google Analytics → Reports → Realtime
5. You should see your visit appear within a few seconds

### Step 7: Test in Production

1. Deploy to production
2. Visit your live site
3. Check Google Analytics Realtime reports
4. Verify events are being tracked

---

## 🔐 Environment Variables Summary

### Development (.env.local)

```env
# Resend (Development - uses test domain)
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=philterzidis@hotmail.com

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel/Platform)

```env
# Resend (Production - with verified domain)
RESEND_API_KEY=re_yyyyyyyyyyyyy
ADMIN_EMAIL=mikrimathites@outlook.com

# Google Analytics (same as dev)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://mikroimathites.gr
```

---

## ✅ Quick Checklist

### Resend Setup
- [ ] Created development API key
- [ ] Added to `.env.local`
- [ ] Tested sending email (should go to admin inbox)
- [ ] Created production API key (save for later)
- [ ] (Production) Verified domain
- [ ] (Production) Updated "from" address in code
- [ ] (Production) Added production API key to hosting platform

### Google Analytics Setup
- [ ] Created Google Analytics account
- [ ] Created property
- [ ] Set up web data stream
- [ ] Copied Measurement ID
- [ ] Added to `.env.local`
- [ ] Tested in development (Realtime reports)
- [ ] Added to production environment variables
- [ ] Verified tracking in production

---

## 🐛 Troubleshooting

### Resend Issues

**Problem:** Can't send to users, only to admin
- **Solution:** This is expected in development. Use production API key + verified domain for production.

**Problem:** Domain verification taking too long
- **Solution:** DNS propagation can take up to 48 hours. Check DNS records are correct.

### Google Analytics Issues

**Problem:** Not seeing data in Analytics
- **Solution:** 
  1. Check cookie consent is accepted
  2. Verify `NEXT_PUBLIC_GA_ID` is set correctly
  3. Check browser console for errors
  4. Wait a few minutes for data to appear

**Problem:** Events not tracking
- **Solution:** Check that cookie consent includes "analytics" category

---

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Domain Setup](https://resend.com/docs/dashboard/domains/introduction)
- [Google Analytics Setup](https://support.google.com/analytics/answer/9304153)
- [Google Analytics 4 Guide](https://support.google.com/analytics/topic/9303319)

