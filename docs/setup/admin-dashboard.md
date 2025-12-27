# Admin Dashboard & Authentication Setup

**Status:** Foundation Complete ✅  
**Last Updated:** Current

---

## ✅ Completed Foundation

### 1. Database Structure (Supabase)

#### Migrations Created:
- ✅ `create-submissions-table.sql` - Submissions table with admin fields
  - Fields: type, name, email, message, status, admin_reply, admin_notes, etc.
  - Tracks: published_to_sanity, sanity_qa_item_id
  - Status workflow: new → in_progress → answered → published → archived

- ✅ `create-admin-users.sql` - Admin users metadata table
  - Links to Supabase Auth users
  - Role management (admin, moderator)

**Action Required:** Run these migrations in Supabase Dashboard → SQL Editor

### 2. Authentication System (NextAuth.js v5)

#### Files Created:
- ✅ `lib/auth/config.ts` - NextAuth configuration with Supabase credentials provider
- ✅ `lib/auth/middleware.ts` - Admin route protection helpers
- ✅ `lib/auth/types.ts` - TypeScript types for auth
- ✅ `app/api/auth/[...nextauth]/route.ts` - Auth API route
- ✅ `middleware.ts` - Next.js middleware for route protection
- ✅ `app/auth/login/page.tsx` - Login page UI

**How it works:**
- Uses Supabase Auth for authentication
- Checks user_metadata for admin role
- Protects all `/admin/*` routes
- JWT session strategy (30 days)

**Action Required:** 
- Set `NEXTAUTH_SECRET` in environment variables
- Set `NEXTAUTH_URL` in environment variables
- Create admin user in Supabase Auth with `user_metadata.role = "admin"`

### 3. Email Service (Resend)

#### Files Created:
- ✅ `lib/email/resend.ts` - Email service integration
  - `sendSubmissionNotificationToAdmin()` - Notifies admin on new submission
  - `sendAnswerNotificationToUser()` - Notifies user when Q&A is answered

**Features:**
- HTML email templates
- Admin notifications with dashboard links
- User notifications with answers
- Non-blocking (doesn't fail requests if email fails)

**Action Required:**
- Sign up at resend.com
- Get API key
- Set `RESEND_API_KEY` in environment variables
- Set `ADMIN_EMAIL` in environment variables
- Verify domain (for production)

### 4. Sanity Integration

#### Files Created:
- ✅ `lib/sanity/write-client.ts` - Sanity write client for publishing
  - `createQAItemInSanity()` - Publishes Q&A to Sanity
- ✅ `lib/utils/sanity-mapping.ts` - Mapping utilities
  - `getCategoryIdByTopic()` - Maps topic to category
  - `getAgeGroupIdsByAgeGroup()` - Maps age group to ageGroups
  - `textToPortableText()` - Converts text to PortableText format

**How it works:**
- Creates qaItem documents in Sanity
- Maps submission data to Sanity references
- Updates submission record with Sanity ID

**Action Required:**
- Set `SANITY_WRITE_TOKEN` in environment variables (with write permissions)

### 5. Admin API Routes

#### Created Routes:
- ✅ `GET /api/admin/submissions` - List all submissions (with filters)
- ✅ `GET /api/admin/submissions/[id]` - Get single submission
- ✅ `PATCH /api/admin/submissions/[id]` - Update submission (status, reply, notes)
- ✅ `POST /api/admin/qa/publish` - Publish Q&A to Sanity

**Features:**
- All routes protected by authentication
- Filtering by type and status
- Pagination support
- Full CRUD operations

### 6. Updated Submissions API

#### Enhanced:
- ✅ `POST /api/submissions` - Now sends email notification to admin
- Returns submission ID for tracking

---

## 🔗 Complete Data Flow

### User Submits Question:
```
1. User fills Q&A form → POST /api/submissions
2. Submission saved to Supabase (submissions table)
3. Email sent to admin (via Resend)
4. Admin receives notification
```

### Admin Reviews & Answers:
```
1. Admin logs in → /auth/login
2. Admin views submissions → GET /api/admin/submissions
3. Admin views single submission → GET /api/admin/submissions/[id]
4. Admin writes answer → PATCH /api/admin/submissions/[id]
   - Updates: status, admin_reply, admin_notes
```

### Admin Publishes Q&A:
```
1. Admin clicks "Publish" → POST /api/admin/qa/publish
2. System:
   - Converts answer to PortableText
   - Maps topic → category (Sanity)
   - Maps age_group → ageGroups (Sanity)
   - Creates qaItem in Sanity
   - Updates submission: published_to_sanity = true, sanity_qa_item_id
   - Sends email to user (if email provided)
3. Q&A appears on /epikoinonia page
```

---

## 📋 Environment Variables Required

Add these to your `.env.local`:

```env
# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=your-admin@example.com

# Sanity Write Token
SANITY_WRITE_TOKEN=your-sanity-write-token

# Site URL (for email links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🗄️ Database Setup Steps

### 1. Run Migrations in Supabase:

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/create-submissions-table.sql`
3. Run `supabase/migrations/create-admin-users.sql`

### 2. Create Admin User:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. In user metadata, add:
   ```json
   {
     "role": "admin",
     "isAdmin": true
   }
   ```
5. (Optional) Add user to `admin_users` table:
   ```sql
   INSERT INTO admin_users (id, email, name, role)
   VALUES ('user-id-from-auth', 'admin@example.com', 'Admin Name', 'admin');
   ```

---

## 🚧 Next Steps (To Complete)

### 1. Build Admin Dashboard UI
- [ ] Dashboard overview page (`/admin/dashboard`)
- [ ] Submissions list page (`/admin/submissions`)
- [ ] Submission detail page (`/admin/submissions/[id]`)
- [ ] Q&A management interface
- [ ] Reply/answer interface with rich text editor

### 2. Test Complete Flow
- [ ] Test user submission
- [ ] Test email notification
- [ ] Test admin login
- [ ] Test viewing submissions
- [ ] Test replying to submission
- [ ] Test publishing Q&A to Sanity
- [ ] Test user email notification

### 3. Enhancements
- [ ] Add rich text editor for answers
- [ ] Add search functionality
- [ ] Add bulk actions
- [ ] Add export functionality
- [ ] Add analytics/stats dashboard

---

## 📝 Notes

- All API routes are protected by authentication middleware
- Email notifications are non-blocking (won't fail requests)
- Sanity write operations require write token
- All database operations use Supabase admin client
- Error handling and logging are in place

---

**Ready to build the dashboard UI!** 🎨

