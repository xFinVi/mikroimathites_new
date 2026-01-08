-- Migration: Create content_downloads table for tracking printable downloads
-- This table tracks every download of printables
-- Works for both anonymous and authenticated users

CREATE TABLE IF NOT EXISTS content_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content identification
  content_type TEXT NOT NULL CHECK (content_type IN ('printable')),
  content_slug TEXT NOT NULL,
  
  -- User identification (anonymous tracking)
  session_id TEXT, -- Generated client-side, stored in localStorage
  user_id UUID, -- NULL for anonymous, set when user logs in (future)
  
  -- Download metadata
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Source tracking
  referrer TEXT, -- Where they came from
  source_page TEXT, -- Previous page on your site
  
  -- Device info (optional, privacy-friendly)
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  is_bot BOOLEAN DEFAULT false, -- Filter out bots
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_content_downloads_content ON content_downloads(content_type, content_slug);
CREATE INDEX IF NOT EXISTS idx_content_downloads_date ON content_downloads(downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_downloads_session ON content_downloads(session_id);
CREATE INDEX IF NOT EXISTS idx_content_downloads_user ON content_downloads(user_id) WHERE user_id IS NOT NULL;

-- Composite index for popular content queries
CREATE INDEX IF NOT EXISTS idx_content_downloads_popular ON content_downloads(content_type, content_slug, downloaded_at DESC);

-- RLS Policies
ALTER TABLE content_downloads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous insert on content_downloads"
  ON content_downloads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read their own downloads
CREATE POLICY "Allow read own downloads"
  ON content_downloads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow public read for aggregated counts (no personal data)
-- This allows the download count API to work
CREATE POLICY "Allow public read for counts"
  ON content_downloads
  FOR SELECT
  TO anon, authenticated
  USING (true);

