-- Migration: Add order column to projects table for custom ordering
-- This allows manual reordering of projects in the portfolio

-- Add order column with default values
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Update existing projects with order values based on creation date
-- Newest projects get higher numbers (appear later)
UPDATE projects
SET "order" = sub.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM projects
) sub
WHERE projects.id = sub.id;

-- Create an index for better performance when ordering
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects("order");

-- Add a comment to document the column
COMMENT ON COLUMN projects."order" IS 'Display order for projects (lower numbers appear first)';
