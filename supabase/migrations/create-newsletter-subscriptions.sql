-- Migration: Create newsletter_subscriptions table
-- This table stores email addresses for newsletter subscriptions
-- Simple structure for now - can be extended later with marketing service integration

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT, -- Optional: track where subscription came from (e.g., 'homepage', 'footer')
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);

-- Create index on status for filtering active subscriptions
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);

-- Create index on created_at for sorting/exporting
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_created_at ON newsletter_subscriptions(created_at);

-- Add comment for documentation
COMMENT ON TABLE newsletter_subscriptions IS 'Stores newsletter email subscriptions. Can be exported for marketing services.';
COMMENT ON COLUMN newsletter_subscriptions.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN newsletter_subscriptions.status IS 'Subscription status: active or unsubscribed';
COMMENT ON COLUMN newsletter_subscriptions.source IS 'Optional source tracking (e.g., homepage, footer)';

