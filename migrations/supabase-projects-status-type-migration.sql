-- Migration: Add status and type columns to projects table
ALTER TABLE projects
ADD COLUMN status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing')),
ADD COLUMN type text NOT NULL DEFAULT 'individual' CHECK (type IN ('individual', 'group'));

-- Create project-images storage bucket for project image uploads
-- Note: Run this in Supabase SQL Editor or use the storage initialization API endpoint
