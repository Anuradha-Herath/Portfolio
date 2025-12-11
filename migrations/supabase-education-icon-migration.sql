-- Migration to add icon_url column to education table
-- This allows storing institution icons/logos

ALTER TABLE education
ADD COLUMN icon_url TEXT;