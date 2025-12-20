# Supabase Setup Guide

This guide will help you set up Supabase for the Mikroi Mathites project.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `mikroi-mathites` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be ready (2-3 minutes)

## 2. Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Find these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Service Role Key** (⚠️ Keep this secret! Never commit to git)

## 3. Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Open the file `supabase/schema-submissions.sql` from this project
3. Copy the entire contents
4. Paste into SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. Verify tables were created:
   - Go to **Table Editor**
   - You should see `submissions` and `submission_answers` tables

## 4. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:**
- `NEXT_PUBLIC_SUPABASE_URL` is safe to expose (used client-side)
- `SUPABASE_SERVICE_ROLE_KEY` is **secret** (server-side only)
- Never commit `.env.local` to git

## 5. Test the Connection

1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Visit `/epikoinonia` page
3. Try submitting a form
4. Check Supabase dashboard → **Table Editor** → `submissions` table
5. You should see your submission!

## 6. RLS Policies (Already Configured)

The schema includes Row Level Security (RLS) policies:
- ✅ Anonymous users can **insert** submissions
- ✅ Service role (admin) has **full access**
- ✅ Regular authenticated users need additional policies (if you add auth later)

## 7. Next Steps

### Admin View Setup

To view submissions in the admin panel:

1. **Option A: Simple Secret Key** (Quick MVP)
   - Add `ADMIN_SECRET_KEY` to `.env.local`
   - Protect `/admin/submissions` route with this key
   - See `app/admin/submissions/page.tsx` for structure

2. **Option B: Supabase Auth** (More Secure)
   - Set up Supabase Authentication
   - Create admin users
   - Use RLS policies to restrict access
   - More setup, but better for production

### Email Notifications (Optional)

To send emails when submissions are received:

1. Set up Supabase Edge Functions
2. Create webhook on `submissions` table
3. Send email via Resend/SendGrid/etc.

## Troubleshooting

### "Supabase is not configured"
- Check `.env.local` has both variables
- Restart dev server after adding variables
- Check variable names match exactly

### "Failed to submit"
- Check Supabase dashboard → **Logs** for errors
- Verify schema was run successfully
- Check RLS policies allow inserts

### Tables not found
- Run `supabase/schema-submissions.sql` again
- Check SQL Editor for errors
- Verify you're in the correct project

## Schema Overview

### `submissions` table
- Stores all user submissions (video ideas, feedback, Q&A, reviews)
- Fields: type, name, email, message, rating, child_age_group, topic, status, etc.

### `submission_answers` table
- Stores answers for Q&A submissions
- Links to `submissions` via `submission_id`

### Enums
- `submission_type`: video_idea, feedback, question, review
- `submission_status`: new, read, archived, approved, rejected, published
- `age_group_slug`: 0_2, 2_4, 4_6, greek_abroad, other
- `submission_topic`: sleep, speech, food, emotions, screens, routines, greek_abroad, other

## Support

If you encounter issues:
1. Check Supabase dashboard logs
2. Verify environment variables
3. Test API route directly: `POST /api/submissions`
4. Check browser console for errors

