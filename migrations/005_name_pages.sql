-- ============================================================
-- Namely Name Pages — Supabase SQL Setup
-- Run once in the Supabase SQL Editor
-- ============================================================

-- 1. Create the name_pages table
CREATE TABLE IF NOT EXISTS name_pages (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL,           -- lowercase, e.g. "luna"
  name                text NOT NULL,                  -- display form, e.g. "Luna"
  gender              text NOT NULL                   -- "girl" | "boy" | "unisex"
                          CHECK (gender IN ('girl','boy','unisex')),
  origin              text NOT NULL,
  meaning_short       text NOT NULL,                  -- 1-sentence quick-fact
  meaning_long        text NOT NULL,                  -- 2-3 paragraph prose (plain text, newlines between paragraphs)
  pronunciation_ipa   text NOT NULL,                  -- e.g. "ˈluː.nə"
  pronunciation_text  text NOT NULL,                  -- e.g. "LOO-nuh"
  syllables           int NOT NULL,
  nicknames           text[],
  ssa_rank            int,                            -- current US rank (NULL = outside top 1000)
  ssa_year            int,                            -- e.g. 2023
  trend_direction     text                            -- "rising" | "falling" | "stable"
                          CHECK (trend_direction IN ('rising','falling','stable')),
  trend_context       text,                           -- 1 sentence, e.g. "climbing steadily since 2015…"
  -- JSONB structured data fields
  -- middle_names: { classic: string[], modern: string[], one_syllable: string[], family_friendly: string[] }
  middle_names        jsonb,
  -- similar_names: string[] of slugs for internal links
  similar_names       text[],
  -- sibling_names: { boys: string[], girls: string[] }
  sibling_names       jsonb,
  -- famous_namesakes: [{ name: string, known_for: string }] | null
  famous_namesakes    jsonb,
  personality_note    text NOT NULL,                  -- the non-generic differentiator
  status              text DEFAULT 'published'
                          CHECK (status IN ('draft','published')),
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- 2. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_name_pages_status
  ON name_pages (status);

CREATE INDEX IF NOT EXISTS idx_name_pages_gender
  ON name_pages (gender);

CREATE INDEX IF NOT EXISTS idx_name_pages_ssa_rank
  ON name_pages (ssa_rank ASC NULLS LAST);

-- 3. Enable Row Level Security
ALTER TABLE name_pages ENABLE ROW LEVEL SECURITY;

-- 4. Drop policies if they exist (makes script re-runnable)
DROP POLICY IF EXISTS "Public read published name pages" ON name_pages;
DROP POLICY IF EXISTS "Service role full access to name pages" ON name_pages;

-- 5. Public can SELECT published name pages only
CREATE POLICY "Public read published name pages"
  ON name_pages FOR SELECT
  USING (status = 'published');

-- 6. Service role has full access (used by Next.js server with service key)
CREATE POLICY "Service role full access to name pages"
  ON name_pages FOR ALL
  USING (auth.role() = 'service_role');

-- 7. Verify table was created
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'name_pages'
ORDER BY ordinal_position;
