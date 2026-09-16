-- ============================================================
-- Migration 006: Cron Job Tables
-- Run once in the Supabase SQL Editor
-- Creates: names_queue, generation_runs, adds faqs to name_pages
-- ============================================================

-- 1. Add faqs column to name_pages (if it doesn't already exist)
ALTER TABLE name_pages
  ADD COLUMN IF NOT EXISTS faqs          jsonb,         -- [{question, answer}]
  ADD COLUMN IF NOT EXISTS meta_title    text,          -- ≤60 chars for <title>
  ADD COLUMN IF NOT EXISTS meta_description text;       -- ≤160 chars for meta description

-- 2. Create names_queue table
CREATE TABLE IF NOT EXISTS names_queue (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  slug                text UNIQUE NOT NULL,
  name                text NOT NULL,
  gender              text NOT NULL
                          CHECK (gender IN ('girl','boy','unisex')),
  origin              text NOT NULL,

  -- Pronunciation (known at queue time)
  pronunciation_ipa   text NOT NULL,
  pronunciation_text  text NOT NULL,
  syllables           int NOT NULL,
  nicknames           text[],

  -- Popularity data (can be NULL if outside top 1000)
  ssa_rank            int,
  ssa_year            int,
  trend_direction     text
                          CHECK (trend_direction IN ('rising','falling','stable')),
  trend_context       text,

  -- Relationship seeds (AI will generate the detailed content)
  similar_names       text[],    -- array of slugs
  sibling_names       jsonb,     -- { boys: string[], girls: string[] }

  -- Queue management
  status              text NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','processing','published','failed','skipped')),
  priority            int NOT NULL DEFAULT 0,   -- higher = processed first
  fail_reason         text,                     -- set on status='failed'

  -- Timestamps
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- 3. Indexes for the cron's queue-pull query
CREATE INDEX IF NOT EXISTS idx_names_queue_status_priority
  ON names_queue (status, priority DESC, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_names_queue_status
  ON names_queue (status);

-- 4. generation_runs table — one row per cron fire
CREATE TABLE IF NOT EXISTS generation_runs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at              timestamptz DEFAULT now(),

  -- Batch summary
  total               int NOT NULL DEFAULT 0,
  published_count     int NOT NULL DEFAULT 0,
  failed_count        int NOT NULL DEFAULT 0,
  skipped_count       int NOT NULL DEFAULT 0,

  -- Detail
  names_published     text[],     -- array of slugs published this run
  names_failed        jsonb,      -- [{ slug, reason }]

  -- Meta
  duration_ms         int,
  triggered_by        text DEFAULT 'cron'   -- 'cron' | 'manual'
);

CREATE INDEX IF NOT EXISTS idx_generation_runs_run_at
  ON generation_runs (run_at DESC);

-- 5. RLS on names_queue
ALTER TABLE names_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to names_queue" ON names_queue;
DROP POLICY IF EXISTS "Public read pending queue" ON names_queue;

CREATE POLICY "Service role full access to names_queue"
  ON names_queue FOR ALL
  USING (auth.role() = 'service_role');

-- 6. RLS on generation_runs (service role only — internal audit log)
ALTER TABLE generation_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to generation_runs" ON generation_runs;

CREATE POLICY "Service role full access to generation_runs"
  ON generation_runs FOR ALL
  USING (auth.role() = 'service_role');

-- 7. Auto-update updated_at on names_queue (reuse or create trigger)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_names_queue_updated_at ON names_queue;
CREATE TRIGGER set_names_queue_updated_at
  BEFORE UPDATE ON names_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Verify
SELECT 'names_queue' AS table_name, count(*) FROM names_queue
UNION ALL
SELECT 'generation_runs', count(*) FROM generation_runs;
