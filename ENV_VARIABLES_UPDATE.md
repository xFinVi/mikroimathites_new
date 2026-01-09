# Environment Variables Update - Password Reset Feature

## ✅ Required Environment Variables

Add these to your `.env.local` file (if not already present):

### **NEW - Required for Password Reset:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
**Why:** Needed to verify password reset tokens. Get it from Supabase Dashboard → Settings → API → `anon` `public` key.

### **Already Required (should be present):**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Resend)
RESEND_API_KEY=your-resend-key
ADMIN_EMAIL=your-admin-email@example.com

# Site URL (optional but recommended)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or https://yourdomain.com in production

# Production Email From (optional - for production)
RESEND_FROM_EMAIL=Mikroi Mathites <noreply@mikroimathites.gr>
```

## 📝 Complete `.env.local` Template

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2024-03-01
SANITY_TOKEN=your-read-token
SANITY_WRITE_TOKEN=your-write-token

# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key  # ⭐ NEW - Required for password reset
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (Required for Admin)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email (Resend) - REQUIRED
RESEND_API_KEY=your-resend-key
ADMIN_EMAIL=your-admin-email@example.com

# Site URL (Optional but recommended)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production Email From (Optional - for production)
RESEND_FROM_EMAIL=Mikroi Mathites <noreply@mikroimathites.gr>

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX
```

## 🔍 How to Get `NEXT_PUBLIC_SUPABASE_ANON_KEY`

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Find the **`anon` `public`** key (under "Project API keys")
5. Copy it and add to `.env.local`

## ⚠️ Important Notes

- **Development:** In development, password reset emails are sent to `philterzidis@hotmail.com` (verified Resend account email) due to Resend test domain restrictions.
- **Production:** In production, emails are sent to the actual user's email address.
- **Admin Only:** Password reset is only available for admin users (checked via `user_metadata.role === 'admin'`).

## 🚀 After Updating `.env.local`

1. Restart your development server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. Test the password reset flow:
   - Go to `/auth/login`
   - Click "Ξεχάσατε το password;"
   - Enter an admin email
   - Check your email (in development, check `philterzidis@hotmail.com`)

## 📦 Production Deployment

Make sure to add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your production environment variables:
- **VPS:** Add to `.env.production` file
- **Vercel/Other:** Add via dashboard or CLI

---

**Last Updated:** After password reset feature implementation
