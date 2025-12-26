-- Migration: Create content_views table for analytics tracking
-- This table tracks every content view (articles, activities, recipes, printables)
-- Works for both anonymous and authenticated users

CREATE TABLE IF NOT EXISTS content_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content identification
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'activity', 'recipe', 'printable')),
  content_slug TEXT NOT NULL,
  
  -- User identification (anonymous tracking)
  session_id TEXT, -- Generated client-side, stored in localStorage
  user_id UUID, -- NULL for anonymous, set when user logs in (future)
  
  -- View metadata
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  time_spent INTEGER, -- Seconds spent on page (optional, calculated client-side)
  scroll_depth INTEGER, -- Percentage scrolled (0-100)
  read_complete BOOLEAN DEFAULT false, -- Did they read to the end?
  
  -- Source tracking
  referrer TEXT, -- Where they came from
  source_page TEXT, -- Previous page on your site
  search_query TEXT, -- If they came from search
  
  -- Device info (optional, privacy-friendly)
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  is_bot BOOLEAN DEFAULT false, -- Filter out bots
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_content_views_content ON content_views(content_type, content_slug);
CREATE INDEX IF NOT EXISTS idx_content_views_date ON content_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_views_session ON content_views(session_id);
CREATE INDEX IF NOT EXISTS idx_content_views_user ON content_views(user_id) WHERE user_id IS NOT NULL;

-- Composite index for popular content queries
CREATE INDEX IF NOT EXISTS idx_content_views_popular ON content_views(content_type, content_slug, viewed_at DESC);

-- RLS Policies
ALTER TABLE content_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous insert on content_views"
  ON content_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role (admin) to read all
CREATE POLICY "Service role full access on content_views"
  ON content_views
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE content_views IS 'Tracks all content views for analytics. Works for anonymous and authenticated users.';
COMMENT ON COLUMN content_views.session_id IS 'Client-generated session ID stored in localStorage for anonymous tracking';
COMMENT ON COLUMN content_views.content_type IS 'Type of content: article, activity, recipe, or printable';
COMMENT ON COLUMN content_views.content_slug IS 'Slug of the content being viewed';
COMMENT ON COLUMN content_views.time_spent IS 'Time spent on page in seconds';
COMMENT ON COLUMN content_views.scroll_depth IS 'Percentage of page scrolled (0-100)';
COMMENT ON COLUMN content_views.read_complete IS 'Whether user scrolled to the end of the content';

