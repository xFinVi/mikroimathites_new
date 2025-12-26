-- Migration: Fix infinite recursion in users table RLS policies
-- The issue: Admin policies were querying the users table, causing recursion
-- Solution: Use user_metadata from auth.users instead

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

-- Create new admin policies that check auth.users metadata instead
-- This avoids recursion because we're not querying the users table

-- Admins can read all users (check user_metadata instead of users table)
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  USING (
    -- Check if user has admin role in auth.users metadata
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin' OR
    (SELECT (raw_user_meta_data->>'isAdmin')::boolean FROM auth.users WHERE id = auth.uid()) = true
  );

-- Admins can update all users (check user_metadata instead of users table)
CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  USING (
    -- Check if user has admin role in auth.users metadata
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin' OR
    (SELECT (raw_user_meta_data->>'isAdmin')::boolean FROM auth.users WHERE id = auth.uid()) = true
  );

-- Add comment
COMMENT ON POLICY "Admins can read all users" ON users IS 'Allows admins to read all users. Checks auth.users metadata to avoid RLS recursion.';
COMMENT ON POLICY "Admins can update all users" ON users IS 'Allows admins to update all users. Checks auth.users metadata to avoid RLS recursion.';

