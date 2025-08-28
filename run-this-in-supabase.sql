-- Run this SQL in your Supabase SQL Editor
-- Migration: Add status and type columns to projects table

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing')),
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'individual' CHECK (type IN ('individual', 'group'));

-- Create the project-images storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Note: Storage policies need to be created through the Supabase Dashboard
-- Go to Storage -> project-images bucket -> Policies
-- Or use the storage operations in your Next.js app which will handle bucket creation automatically
