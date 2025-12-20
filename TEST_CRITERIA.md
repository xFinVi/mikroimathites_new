# Test Criteria - Mikroi Mathites MVP

## 🧪 Testing Guide

This document provides comprehensive test criteria for all features implemented in the MVP.

---

## 1. Content Detail Pages

### 1.1 Article Detail Pages (`/gia-goneis/[slug]`)

**Test URL:** `/gia-goneis/[any-article-slug-from-sanity]`

**What to Test:**
- [ ] Page loads without errors
- [ ] Article title displays correctly
- [ ] Article excerpt/description shows (if available)
- [ ] Cover image displays (if available)
- [ ] Author information shows (name, profile picture if available)
- [ ] Publish date displays in Greek format
- [ ] Reading time displays (if available)
- [ ] Age group badges display and are clickable
- [ ] Category badge displays and is clickable
- [ ] Full article content renders correctly (PortableText)
- [ ] Images within content display properly
- [ ] Links within content work
- [ ] Share buttons work:
  - [ ] Facebook share opens popup
  - [ ] Twitter share opens popup
  - [ ] WhatsApp share opens app/browser
  - [ ] Copy link copies URL to clipboard
- [ ] Related articles section displays (if configured in Sanity)
- [ ] Related articles are clickable and navigate correctly
- [ ] "Back to articles" link works
- [ ] Page is responsive on mobile/tablet/desktop
- [ ] SEO metadata is correct (check page source)

**Expected Behavior:**
- All content should be in Greek
- Images should be optimized and load quickly
- Share buttons should use the correct page URL
- Related content should only show if configured in Sanity

**Common Issues:**
- If article doesn't exist, should show 404 page
- If no cover image, hero section should not show
- If no author, author section should not show

---

### 1.2 Activity Detail Pages (`/drastiriotites/[slug]`)

**Test URL:** `/drastiriotites/[any-activity-slug-from-sanity]`

**What to Test:**
- [ ] Page loads without errors
- [ ] Activity title displays correctly
- [ ] Summary displays (if available)
- [ ] Cover image displays (if available)
- [ ] Duration displays (if available)
- [ ] Age group badges display and are clickable
- [ ] Category badge displays and is clickable
- [ ] Goals section displays (if available) with checkmarks
- [ ] Materials section displays (if available) as bullet list
- [ ] Steps/Instructions section renders correctly (PortableText)
- [ ] Safety notes section displays (if available) with warning icon
- [ ] Share buttons work correctly
- [ ] Related content section displays (if configured)
- [ ] "Back to activities" link works
- [ ] Page is responsive

**Expected Behavior:**
- Goals should be in a green-highlighted box
- Materials should be in a white card
- Safety notes should be in a blue-highlighted box with warning icon
- All sections should be clearly separated

---

### 1.3 Printable Detail Pages (`/drastiriotites/printables/[slug]`)

**Test URL:** `/drastiriotites/printables/[any-printable-slug-from-sanity]`

**What to Test:**
- [ ] Page loads without errors
- [ ] Printable title displays correctly
- [ ] Summary displays (if available)
- [ ] Cover image displays (if available)
- [ ] Duration displays (if available)
- [ ] Age group badges display
- [ ] Download button displays (if PDF file exists)
- [ ] Download button opens PDF in new tab
- [ ] Preview images display (if available)
- [ ] Preview images are in a grid layout
- [ ] Instructions section renders correctly
- [ ] Goals section displays (if available)
- [ ] Share buttons work correctly
- [ ] "Back to printables" link works
- [ ] Page is responsive

**Expected Behavior:**
- Download button should be prominent (pink background)
- Preview images should be in 3:4 aspect ratio
- If no PDF file, download section should not show

---

## 2. Home Page (`/`)

**Test URL:** `/`

**What to Test:**
- [ ] Page loads without errors
- [ ] Hero section with parallax effect works
- [ ] Carousel displays and auto-plays
- [ ] Carousel navigation works (prev/next)
- [ ] Age cards section displays (4 cards)
- [ ] Age cards are clickable
- [ ] "Για Γονείς" section displays:
  - [ ] Section title shows
  - [ ] "View all" link works
  - [ ] 3 featured articles display (if available in CMS)
  - [ ] Article cards are clickable
  - [ ] If no articles, section should not show
- [ ] "Δραστηριότητες και δημιουργίες" section displays:
  - [ ] Section title shows
  - [ ] "View all" link works
  - [ ] Activities and printables display (up to 4 items)
  - [ ] Cards are clickable
  - [ ] If no content, section should not show
- [ ] Feedback form section displays
- [ ] Page is responsive

**Expected Behavior:**
- Content should come from Sanity CMS
- If no featured content, sections should gracefully hide
- All links should navigate correctly

---

## 3. Articles Listing Page (`/gia-goneis`)

**Test URL:** `/gia-goneis`

**What to Test:**
- [ ] Page loads without errors
- [ ] Hero section with background image displays
- [ ] Page title and description show
- [ ] Category cards section displays:
  - [ ] Section title shows
  - [ ] Category cards from CMS display (up to 6)
  - [ ] Category cards are clickable
  - [ ] If no categories, section should not show
- [ ] Featured articles section displays:
  - [ ] Section title shows
  - [ ] Featured articles grid displays (if available)
  - [ ] Article cards are clickable
  - [ ] Cards show: image, category, title, excerpt, date, reading time
- [ ] Quick tips section displays (placeholder content)
- [ ] Support/CTA section displays with link to `/epikoinonia`
- [ ] Page is responsive

**Expected Behavior:**
- Should show featured articles if available, otherwise latest articles
- Category cards should link to filtered view (when filters are implemented)
- All article cards should link to detail pages

---

## 4. Activities Listing Page (`/drastiriotites`)

**Test URL:** `/drastiriotites`

**What to Test:**
- [ ] Page loads without errors
- [ ] Activities from CMS display
- [ ] Activity cards show: image, title, summary, age groups, category
- [ ] Activity cards are clickable
- [ ] Cards link to detail pages
- [ ] Empty state shows if no activities (with link to Studio)
- [ ] Page is responsive

**Expected Behavior:**
- Should display all activities from Sanity
- Cards should be in a responsive grid

---

## 5. SEO Files

### 5.1 Sitemap (`/sitemap.xml`)

**Test URL:** `/sitemap.xml`

**What to Test:**
- [ ] XML sitemap loads
- [ ] Contains all static routes (home, gia-goneis, drastiriotites, etc.)
- [ ] Contains all article URLs from CMS
- [ ] Contains all activity URLs from CMS
- [ ] Contains all printable URLs from CMS
- [ ] URLs use correct base URL
- [ ] Last modified dates are present
- [ ] Priority and change frequency are set

**Expected Behavior:**
- Should be valid XML
- Should include all published content
- Should update when content changes (after rebuild)

---

### 5.2 Robots.txt (`/robots.txt`)

**Test URL:** `/robots.txt`

**What to Test:**
- [ ] Robots.txt loads
- [ ] Contains allow rules for public pages
- [ ] Contains disallow rules for `/studio/`, `/api/`, `/admin/`
- [ ] Points to sitemap URL

**Expected Behavior:**
- Should be plain text
- Should allow search engines to crawl public content
- Should block admin/studio areas

---

## 6. Error Handling

### 6.1 404 Page (`/not-found`)

**Test URL:** Visit any non-existent page (e.g., `/test-page-123`)

**What to Test:**
- [ ] 404 page displays
- [ ] Shows "Η σελίδα δεν βρέθηκε" message
- [ ] "Back to home" button works
- [ ] Page is responsive

---

### 6.2 500 Error Page

**Test URL:** Trigger an error (if possible)

**What to Test:**
- [ ] Error page displays
- [ ] Shows "Κάτι πήγε στραβά" message
- [ ] "Try again" button works (resets error)
- [ ] "Back to home" button works
- [ ] Error ID displays (if available)
- [ ] Page is responsive

**Note:** This is harder to test manually. May need to intentionally break something or wait for a real error.

---

## 7. Forms

### 7.1 Contact Form (`/epikoinonia`)

**Test URL:** `/epikoinonia`

**What to Test:**
- [ ] Form loads correctly
- [ ] Name and email fields are required
- [ ] Submission type dropdown works
- [ ] Age group dropdown appears after type selection
- [ ] Type-specific fields appear correctly:
  - [ ] Video Idea: topic dropdown, message textarea
  - [ ] Feedback: star rating (5 clickable stars), feedback textarea
  - [ ] Question: category dropdown, question textarea, publish consent checkbox
- [ ] Star rating is interactive (hover, click)
- [ ] Form validation works (required fields)
- [ ] Submit button is disabled until required fields are filled
- [ ] Form submits successfully
- [ ] Success message displays after submission
- [ ] Form resets after 3 seconds
- [ ] Error messages display if submission fails
- [ ] Data appears in Supabase `submissions` table

**Expected Behavior:**
- Feedback form should show stars first, then textarea, then name/email
- All submissions should be stored in Supabase
- Success message should be in Greek

---

## 8. CMS Integration

### 8.1 Sanity Studio (`/studio`)

**Test URL:** `/studio`

**What to Test:**
- [ ] Studio loads (may need CORS setup)
- [ ] Can log in to Sanity
- [ ] Can view all content types
- [ ] Can create/edit articles
- [ ] Can create/edit activities
- [ ] Can create/edit printables
- [ ] Can upload images
- [ ] Can upload PDFs
- [ ] Changes reflect on frontend (after revalidation)

**Note:** Requires Sanity credentials and CORS configuration

---

## 9. Navigation & Links

**What to Test:**
- [ ] Header navigation works on all pages
- [ ] Footer links work
- [ ] Logo links to home page
- [ ] All internal links navigate correctly
- [ ] External links open in new tab (if applicable)
- [ ] Back buttons work on detail pages
- [ ] Breadcrumbs work (if implemented)

---

## 10. Responsive Design

**What to Test:**
- [ ] All pages work on mobile (320px+)
- [ ] All pages work on tablet (768px+)
- [ ] All pages work on desktop (1024px+)
- [ ] Images scale correctly
- [ ] Text is readable on all sizes
- [ ] Navigation works on mobile (hamburger menu if applicable)
- [ ] Forms are usable on mobile
- [ ] Cards/grids adapt to screen size

---

## 11. Performance

**What to Test:**
- [ ] Pages load quickly (< 3 seconds)
- [ ] Images load progressively
- [ ] No console errors
- [ ] No broken images
- [ ] No 404s for assets
- [ ] Fonts load correctly

**Tools to Use:**
- Chrome DevTools Lighthouse
- Network tab
- Console tab

---

## 12. Browser Compatibility

**What to Test:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🐛 Common Issues & Solutions

### Issue: "Article not found" on detail pages
**Solution:** Check that article exists in Sanity and has a slug

### Issue: Images not loading
**Solution:** Check Sanity image URLs and CORS settings

### Issue: Forms not submitting
**Solution:** Check Supabase credentials in `.env.local`

### Issue: Studio not loading
**Solution:** Check CORS settings in Sanity dashboard, add `http://localhost:3000`

### Issue: Sitemap empty
**Solution:** Check that content exists in Sanity and rebuild the site

---

## 📝 Test Checklist Summary

Before marking as complete, ensure:
- [ ] All detail pages work
- [ ] Home page shows CMS content
- [ ] Listing pages show CMS content
- [ ] Forms submit successfully
- [ ] SEO files are accessible
- [ ] Error pages work
- [ ] Navigation works
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] All links work

---

## 🚀 Next Steps After Testing

1. Document any bugs found
2. Test with real content in Sanity
3. Test form submissions in Supabase
4. Verify SEO metadata
5. Check performance metrics
6. Test on multiple devices/browsers

---

**Last Updated:** After detail pages implementation
**Tested By:** [Your Name]
**Date:** [Date]

