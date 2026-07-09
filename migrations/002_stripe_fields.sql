-- Migration: 002_stripe_fields
-- Add Stripe billing columns to the profiles table.
-- Run this directly in the Supabase SQL editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id    TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Index for fast webhook lookups by customer / subscription
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx    ON profiles (stripe_customer_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_subscription_id_idx ON profiles (stripe_subscription_id);
