-- AlterTable
ALTER TABLE "sports" ADD COLUMN     "statSuggestions" JSONB NOT NULL DEFAULT '[]';

-- Backfill curated suggestions for existing sports (matches the defaults
-- previously hardcoded in lib/player-stats.ts) so the new admin page
-- starts populated instead of empty.
UPDATE "sports" SET "statSuggestions" = '["40-Yard Dash","10-Yard Split","Shuttle","3-Cone Drill","Broad Jump","Vertical Jump","Bench Press (reps)"]'::jsonb WHERE "slug" = 'football';
UPDATE "sports" SET "statSuggestions" = '["60-Yard Dash","Exit Velocity","Throwing Velocity","Pop Time","Home to First"]'::jsonb WHERE "slug" = 'baseball';
UPDATE "sports" SET "statSuggestions" = '["60-Yard Dash","Home to First","Exit Velocity","Throwing Velocity","Pop Time"]'::jsonb WHERE "slug" = 'softball';
UPDATE "sports" SET "statSuggestions" = '["Vertical Jump","Standing Reach","Wingspan","Lane Agility","3/4 Court Sprint"]'::jsonb WHERE "slug" = 'basketball';
UPDATE "sports" SET "statSuggestions" = '["40-Yard Dash","Beep Test Level","Vertical Jump","5-10-5 Agility"]'::jsonb WHERE "slug" = 'soccer';
UPDATE "sports" SET "statSuggestions" = '["Vertical Jump","Approach Jump","Standing Reach","Block Touch"]'::jsonb WHERE "slug" = 'volleyball';
UPDATE "sports" SET "statSuggestions" = '["100m","200m","400m","800m","1600m","3200m","Long Jump","Triple Jump","High Jump","Shot Put","Discus"]'::jsonb WHERE "slug" = 'track-and-field';
UPDATE "sports" SET "statSuggestions" = '["40-Yard Dash","Shuttle","Vertical Jump","Shot Speed"]'::jsonb WHERE "slug" = 'lacrosse';
UPDATE "sports" SET "statSuggestions" = '["Takedowns per Match","Pin Percentage"]'::jsonb WHERE "slug" = 'wrestling';
UPDATE "sports" SET "statSuggestions" = '["UTR Rating","Serve Speed"]'::jsonb WHERE "slug" = 'tennis';
UPDATE "sports" SET "statSuggestions" = '["Handicap Index","Driving Distance","Scoring Average"]'::jsonb WHERE "slug" = 'golf';
UPDATE "sports" SET "statSuggestions" = '["50 Free","100 Free","200 Free","100 Back","100 Breast","100 Fly","200 IM"]'::jsonb WHERE "slug" = 'swimming';
