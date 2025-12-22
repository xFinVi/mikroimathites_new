# Quick Test Guide for Form Submission

## ✅ Pre-Test Checklist

1. **Environment Variables:**
   ```bash
   # Check .env.local has:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Database Setup:**
   - Run `supabase/schema-submissions.sql` in Supabase SQL Editor (if not already done)
   - If database already exists with `greek_abroad`, run `supabase/migrations/remove-greek-abroad.sql`

3. **Start Dev Server:**
   ```bash
   npm run dev
   ```

---

## 🧪 Quick Test Steps

### Test 1: Feedback Submission (Default)

1. Navigate to `/epikoinonia`
2. Verify "Feedback / Σχόλια" is selected by default
3. Select a rating (e.g., 5 stars)
4. Enter feedback: "Test feedback message"
5. Click "Στείλτε"
6. **Expected:** Success message appears
7. **Check Supabase:** Go to Table Editor → `submissions` → Verify new record with:
   - `type`: `feedback`
   - `rating`: `5`
   - `message`: "Test feedback message"
   - `status`: `new`
   - `source_page`: `/epikoinonia`

### Test 2: Video Idea Submission

1. Click "Ιδέα για βίντεο" chip
2. Select age group: "0-2 χρόνων"
3. Select topic: "Ύπνος"
4. Enter message: "Test video idea"
5. Click "Στείλτε"
6. **Expected:** Success message
7. **Check Supabase:** Verify:
   - `type`: `video_idea`
   - `child_age_group`: `0_2`
   - `topic`: `sleep`
   - `message`: "Test video idea"

### Test 3: Question Submission

1. Click "Ερώτηση (Q&A)" chip
2. Select age group: "2-4 χρόνων"
3. Select category: "Ομιλία"
4. Enter question: "Test question"
5. Toggle "Publish consent" checkbox
6. Click "Στείλτε"
7. **Expected:** Success message
8. **Check Supabase:** Verify:
   - `type`: `question`
   - `child_age_group`: `2_4`
   - `topic`: `speech`
   - `is_approved`: `true` (if checkbox was checked)

### Test 4: Validation Errors

1. Try submitting without rating (feedback) → Should show error
2. Try submitting without message → Should show error
3. Verify error messages are in Greek

### Test 5: Network Tab Check

1. Open Browser DevTools → Network tab
2. Submit a form
3. **Verify:**
   - POST request to `/api/submissions`
   - Status: `200 OK`
   - Response: `{"ok": true}`
   - Request payload matches form data

---

## 🔍 Debugging

### If submission fails:

1. **Check Browser Console:**
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Check Server Console:**
   - Look for "Supabase insert error"
   - Check if `supabaseAdmin` is null

3. **Check Supabase Dashboard:**
   - Verify table exists
   - Check RLS policies allow inserts
   - Verify service role key is correct

4. **Test API Directly:**
   ```bash
   curl -X POST http://localhost:3000/api/submissions \
     -H "Content-Type: application/json" \
     -d '{
       "type": "feedback",
       "message": "Test",
       "rating": 5
     }'
   ```

---

## ✅ Success Criteria

- [ ] All three submission types work
- [ ] Data appears correctly in Supabase
- [ ] Success messages display properly
- [ ] Form resets after 3 seconds
- [ ] Validation errors show correctly
- [ ] Source page is tracked
- [ ] No console errors

