-- Migration to ensure image_url column exists in certifications table
-- This is a safety check in case the column doesn't exist

-- Add image_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'certifications' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE certifications ADD COLUMN image_url TEXT;
    END IF;
END
$$;

-- Update existing sample data with some placeholder images if needed
-- You can run this to add sample images for testing
UPDATE certifications 
SET image_url = CASE 
    WHEN title LIKE '%AWS%' THEN '/images/aws-cert-badge.png'
    WHEN title LIKE '%Google%' AND category = 'course' THEN '/images/google-cert-badge.png'
    WHEN title LIKE '%MongoDB%' THEN '/images/mongodb-cert-badge.png'
    WHEN title LIKE '%ICPC%' THEN '/images/icpc-cert-badge.png'
    WHEN title LIKE '%Code Jam%' THEN '/images/codejam-cert-badge.png'
    WHEN title LIKE '%HackerRank%' THEN '/images/hackerrank-cert-badge.png'
    ELSE NULL
END
WHERE image_url IS NULL;
