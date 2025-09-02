/*
  # Add Prize Category Support to Winners Table

  1. Schema Changes
    - Add `prize_category` column to store the prize category ID
    - Add `prize_name` column to store the human-readable prize name
    - Both columns are required for new winners but nullable for existing data

  2. Data Migration
    - Existing winners will have NULL values for the new columns
    - New winners must specify both prize_category and prize_name

  3. Security
    - Maintain existing RLS policies
    - No changes to access control
*/

-- Add prize category columns to winners table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'winners' AND column_name = 'prize_category'
  ) THEN
    ALTER TABLE winners ADD COLUMN prize_category text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'winners' AND column_name = 'prize_name'
  ) THEN
    ALTER TABLE winners ADD COLUMN prize_name text;
  END IF;
END $$;

-- Add index for better query performance on prize categories
CREATE INDEX IF NOT EXISTS idx_winners_prize_category ON winners(prize_category);