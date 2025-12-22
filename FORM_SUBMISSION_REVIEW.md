# Form Submission Review & Testing Guide

## 📋 Current Implementation Review

### 1. **Form Component** (`components/forms/unified-contact-form.tsx`)

**Status:** ✅ **Good**

**What it does:**
- Collects form data based on submission type (feedback, video-idea, question)
- Validates required fields before submission
- Builds payload based on submission type
- Sends POST request to `/api/submissions`
- Handles success/error states
- Shows success message and resets form after 3 seconds

**Payload Structure:**
```typescript
// Feedback
{
  type: "feedback",
  name?: string,
  email?: string,
  message: string,  // from feedback_message
  rating: number,   // 1-5
  child_age_group?: "0-2" | "2-4" | "4-6" | "other"
}

// Video Idea
{
  type: "video-idea",
  name?: string,
  email?: string,
  child_age_group?: "0-2" | "2-4" | "4-6" | "other",
  topic?: "sleep" | "speech" | "food" | "emotions" | "screens" | "routines" | "other",
  message: string
}

// Question (Q&A)
{
  type: "question",
  name?: string,
  email?: string,
  child_age_group?: "0-2" | "2-4" | "4-6" | "other",
  topic?: string,  // from category field
  message: string,
  publish_consent: boolean
}
```

**Potential Issues:**
- ✅ All required fields validated
- ✅ Payload structure matches API expectations
- ⚠️ No source_page or content_slug being sent (API will use referer header)

---

### 2. **API Route** (`app/api/submissions/route.ts`)

**Status:** ✅ **Good** (with one potential issue)

**What it does:**
1. Validates Supabase is configured
2. Parses JSON body
3. Validates required fields (type, message)
4. Normalizes data:
   - `type`: "video-idea" → "video_idea", "feedback" → "feedback", etc.
   - `rating`: Clamps to 1-5, rounds to integer
   - `child_age_group`: "0-2" → "0_2", etc.
   - `topic`: "sleep" → "sleep", etc.
5. Gets source page from referer header if not provided
6. Inserts into Supabase `submissions` table
7. Returns success or error

**Database Insert:**
```typescript
{
  type: "video_idea" | "feedback" | "question" | "review",
  name: string | null,
  email: string | null,
  message: string,
  rating: number | null,
  child_age_group: "0_2" | "2_4" | "4_6" | "other" | null,
  topic: "sleep" | "speech" | ... | null,
  source_page: string | null,
  content_slug: string | null,
  is_approved: boolean,
  status: "new"
}
```

**Potential Issues:**
1. ⚠️ **Database Schema Mismatch**: Schema still has `greek_abroad` in enums, but we removed it from forms
   - `age_group_slug` enum: `('0_2','2_4','4_6','greek_abroad','other')`
   - `submission_topic` enum: `('sleep','speech','food','emotions','screens','routines','greek_abroad','other')`
   - **Fix Needed**: Update database schema to remove `greek_abroad`

2. ✅ Error handling is good (returns proper HTTP status codes)
3. ✅ Validation is good (checks required fields)
4. ✅ Normalization functions work correctly

---

### 3. **Supabase Connection** (`lib/supabase/server.ts`)

**Status:** ✅ **Good**

**What it does:**
- Creates admin client with service role key
- Validates environment variables
- Provides helpful error messages
- Returns `null` if not configured (API route handles this)

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin access)

---

## 🐛 Issues Found

### Issue #1: Database Schema Still Has `greek_abroad` ⚠️

**Problem:**
- Database enums still include `greek_abroad`
- Forms no longer send this value
- This is OK (won't break), but schema should match code

**Location:**
- `supabase/schema-submissions.sql`
- `scripts/setup-supabase.sql`
- Database (if already created)

**Fix:**
Need to run migration to remove `greek_abroad` from enums:
```sql
-- Remove greek_abroad from age_group_slug enum
ALTER TYPE age_group_slug DROP VALUE IF EXISTS 'greek_abroad';

-- Remove greek_abroad from submission_topic enum  
ALTER TYPE submission_topic DROP VALUE IF EXISTS 'greek_abroad';
```

**Note:** This is safe - we're not using it, so removing it won't break anything.

---

### Issue #2: Missing Source Page Tracking ⚠️

**Current State:**
- Form doesn't send `source_page` or `content_slug`
- API route uses `referer` header as fallback
- This works, but might not be accurate

**Impact:**
- Low - referer header should work for most cases
- Could be improved by explicitly passing source page

**Optional Enhancement:**
```typescript
// In form component
const sourcePage = window.location.pathname;
payload.source_page = sourcePage;
```

---

## ✅ What's Working Well

1. **Form Validation** - All required fields validated before submission
2. **Error Handling** - Proper error messages shown to user
3. **Success Feedback** - Clear success messages with icons
4. **Data Normalization** - Proper conversion from form values to DB values
5. **Type Safety** - TypeScript interfaces ensure type safety
6. **API Structure** - Clean separation of concerns

---

## 🧪 Testing Checklist

### Manual Testing Steps:

1. **Test Feedback Submission:**
   - [ ] Select "Feedback / Σχόλια" (should be default)
   - [ ] Select a rating (1-5 stars)
   - [ ] Enter feedback message
   - [ ] Optionally add name/email
   - [ ] Click "Στείλτε"
   - [ ] Verify success message appears
   - [ ] Check Supabase dashboard - verify record created

2. **Test Video Idea Submission:**
   - [ ] Select "Ιδέα για βίντεο"
   - [ ] Select age group (optional)
   - [ ] Select topic (optional)
   - [ ] Enter idea message
   - [ ] Optionally add name/email
   - [ ] Click "Στείλτε"
   - [ ] Verify success message
   - [ ] Check Supabase - verify type is "video_idea"

3. **Test Question Submission:**
   - [ ] Select "Ερώτηση (Q&A)"
   - [ ] Select age group (optional)
   - [ ] Select category (optional)
   - [ ] Enter question
   - [ ] Toggle publish consent checkbox
   - [ ] Click "Στείλτε"
   - [ ] Verify success message
   - [ ] Check Supabase - verify type is "question", is_approved matches checkbox

4. **Test Validation:**
   - [ ] Try submitting without rating (feedback) - should show error
   - [ ] Try submitting without message - should show error
   - [ ] Verify error messages are in Greek

5. **Test Error Handling:**
   - [ ] Disconnect internet - should show error
   - [ ] Check browser console for errors
   - [ ] Check network tab - verify POST request sent

6. **Test Database:**
   - [ ] Open Supabase dashboard
   - [ ] Check `submissions` table
   - [ ] Verify all fields are populated correctly
   - [ ] Verify `status` is "new"
   - [ ] Verify `created_at` timestamp is set

---

## 🔧 Recommended Fixes

### Priority 1: Update Database Schema

**Action:** Remove `greek_abroad` from database enums

**SQL Migration:**
```sql
-- Run in Supabase SQL Editor
ALTER TYPE age_group_slug DROP VALUE IF EXISTS 'greek_abroad';
ALTER TYPE submission_topic DROP VALUE IF EXISTS 'greek_abroad';
```

**Files to Update:**
- `supabase/schema-submissions.sql`
- `scripts/setup-supabase.sql`

---

### Priority 2: Add Source Page Tracking (Optional)

**Enhancement:** Explicitly track source page

**Implementation:**
```typescript
// In unified-contact-form.tsx
const sourcePage = typeof window !== 'undefined' ? window.location.pathname : undefined;
payload.source_page = sourcePage;
```

---

### Priority 3: Add Better Error Logging

**Enhancement:** Log errors to console for debugging

**Current:** `console.error("Supabase insert error", error);`
**Enhancement:** Could add more context (payload, user agent, etc.)

---

## 📊 Data Flow Diagram

```
User fills form
    ↓
Form validates (client-side)
    ↓
POST /api/submissions
    ↓
API validates (server-side)
    ↓
Normalize data (convert formats)
    ↓
Insert into Supabase submissions table
    ↓
Return success/error
    ↓
Form shows success message
    ↓
Form resets after 3 seconds
```

---

## 🔍 Debugging Tips

### If submissions aren't saving:

1. **Check Environment Variables:**
   ```bash
   # Verify these are set in .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Check Browser Console:**
   - Look for JavaScript errors
   - Check Network tab for failed requests
   - Verify POST request is sent

3. **Check Server Logs:**
   - Look for "Supabase insert error" in console
   - Check if Supabase client is null

4. **Check Supabase Dashboard:**
   - Verify table exists: `submissions`
   - Check table structure matches schema
   - Verify RLS policies allow inserts (or service role bypasses them)

5. **Test API Route Directly:**
   ```bash
   curl -X POST http://localhost:3000/api/submissions \
     -H "Content-Type: application/json" \
     -d '{
       "type": "feedback",
       "message": "Test message",
       "rating": 5
     }'
   ```

---

## ✅ Summary

**Overall Status:** 🟢 **Good** - Form submission should work correctly

**What Works:**
- ✅ Form validation
- ✅ API route structure
- ✅ Data normalization
- ✅ Error handling
- ✅ Success feedback

**What Needs Fixing:**
- ⚠️ Database schema still has `greek_abroad` (won't break, but should be removed)
- ⚠️ Source page tracking could be improved

**Next Steps:**
1. Test form submission manually
2. Update database schema to remove `greek_abroad`
3. Verify data appears in Supabase dashboard
4. Test all three submission types

