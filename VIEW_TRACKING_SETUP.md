# View Tracking System

## Overview

The view tracking system automatically tracks how many times articles, activities, recipes, and printables are viewed. View counts are displayed on content detail pages.

## Features

- ✅ Automatic view tracking on all content pages
- ✅ Bot detection (excludes crawlers from counts)
- ✅ View count display on detail pages
- ✅ Privacy-friendly (no personal data stored)
- ✅ Session-based tracking for anonymous users

## Setup

### 1. Run Database Migration

If you haven't already, run the migration to create the `content_views` table:

```bash
# In Supabase Dashboard SQL Editor, run:
supabase/migrations/create-content-views.sql
```

Or if using Supabase CLI:
```bash
supabase migration up
```

### 2. Verify Tracking is Working

1. Visit any article, activity, recipe, or printable page
2. The view is automatically tracked via the `ContentTracker` component
3. View counts appear in the meta section of each page

## How It Works

### Tracking Flow

1. **Page Load**: When a user visits a content page, the `ContentTracker` component mounts
2. **Session ID**: A unique session ID is generated and stored in localStorage (for anonymous tracking)
3. **API Call**: The view is sent to `/api/analytics/view` with:
   - Content type (article, activity, recipe, printable)
   - Content slug
   - Session ID
   - Device type
   - Referrer information
4. **Database**: View is stored in `content_views` table (bot views are filtered out)
5. **Display**: View count is fetched and displayed via the `ViewCount` component

### Components

- **`ContentTracker`**: Client component that tracks views on page load
  - Used on: `/gia-goneis/[slug]`, `/drastiriotites/[slug]`, `/gia-goneis/recipes/[slug]`, `/drastiriotites/printables/[slug]`
  
- **`ViewCount`**: Client component that displays view counts
  - Used in: `ArticleMeta`, `ActivityMeta`, `PrintableMeta`, recipe pages

### API Endpoints

- **`POST /api/analytics/view`**: Records a new view
- **`GET /api/analytics/views`**: Fetches view counts
  - Single item: `?content_type=article&content_slug=example`
  - Multiple items: `?items=[{"content_type":"article","content_slug":"example"}]`

### Database Schema

The `content_views` table stores:
- `content_type`: Type of content (article, activity, recipe, printable)
- `content_slug`: Slug of the content
- `session_id`: Anonymous session identifier
- `viewed_at`: Timestamp of the view
- `is_bot`: Whether the view was from a bot/crawler
- `device_type`: mobile, tablet, or desktop
- `time_spent`: Optional time spent on page (future)
- `scroll_depth`: Optional scroll depth (future)

## View Count Display

View counts are displayed:
- ✅ On article detail pages (in `ArticleMeta`)
- ✅ On activity detail pages (in `ActivityMeta`)
- ✅ On recipe detail pages (inline)
- ✅ On printable detail pages (in `PrintableMeta`)

The view count shows:
- An eye icon
- The number of views (formatted with Greek locale)
- "προβολές" label (for non-compact mode)

## Query Functions

Located in `lib/analytics/queries.ts`:

- `getContentViewCount()`: Get view count for a single item
- `getContentViewCounts()`: Get view counts for multiple items (batch)
- `getMostViewedContent()`: Get most viewed content (with time period filter)
- `getTrendingContent()`: Alias for `getMostViewedContent()`

## Future Enhancements

Potential improvements:
- [ ] Track unique views (by session)
- [ ] Track time spent reading
- [ ] Track scroll depth
- [ ] Display view counts on listing pages (cards)
- [ ] Admin dashboard analytics
- [ ] Popular content widget
- [ ] Trending content section

## Privacy

- No personal information is stored
- Session IDs are generated client-side and stored in localStorage
- Bot views are automatically filtered out
- GDPR-friendly (no cookies required for basic tracking)


