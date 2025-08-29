-- Migration to allow null values for end_date in education table
-- This allows for ongoing education entries

ALTER TABLE education
ALTER COLUMN end_date DROP NOT NULL;
