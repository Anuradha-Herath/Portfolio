# Project Reordering Feature

This feature allows you to manually reorder projects in your portfolio for better presentation.

## What's New

✅ **Drag-and-Drop Reordering**: Visual interface to reorder projects by dragging
✅ **Order Field**: Manual order number input in project forms
✅ **Database Migration**: New `order` column for persistent ordering

## Setup Instructions

### 1. Database Migration

Run this SQL in your Supabase SQL Editor:

```sql
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
```

### 2. How to Use

#### Option 1: Drag-and-Drop (Recommended)
1. Go to Admin → Projects
2. Click "Reorder Projects" button
3. Drag projects to change their order
4. Click "Save Order"

#### Option 2: Manual Order Numbers
1. Edit any project
2. Set the "Display Order" field (0 = first, 1 = second, etc.)
3. Save the project

## Features

- **Visual Feedback**: Projects show their current position numbers
- **Drag Handle**: Clear grip icon for dragging
- **Order Persistence**: Order is saved to database
- **Fallback Ordering**: Uses creation date as fallback
- **Responsive Design**: Works on all screen sizes

## Technical Details

- New `order` field in Project type (TypeScript)
- Database column with index for performance
- HTML5 Drag & Drop API implementation
- Automatic order assignment for new projects
