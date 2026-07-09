-- Add ai_explanation to cache AI generated name insights
ALTER TABLE names ADD COLUMN IF NOT EXISTS ai_explanation TEXT;
ALTER TABLE ai_names ADD COLUMN IF NOT EXISTS ai_explanation TEXT;
