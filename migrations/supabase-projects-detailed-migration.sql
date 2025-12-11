-- Migration to add detailed project fields
-- Run this script in your Supabase SQL editor

-- Add new columns to projects table
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing')),
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'individual' CHECK (type IN ('individual', 'group')),
  ADD COLUMN IF NOT EXISTS project_type_detail TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS duration TEXT,
  ADD COLUMN IF NOT EXISTS technologies_used JSONB DEFAULT '{"languages": [], "frontend": [], "backend": [], "database": [], "apis_tools": []}',
  ADD COLUMN IF NOT EXISTS key_features TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS my_contributions TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS additional_images TEXT[] DEFAULT '{}';

-- Update the existing technologies column to be consistent with new structure
-- Note: This will migrate existing technologies array to the new structure
UPDATE projects 
SET technologies_used = jsonb_build_object(
  'languages', '[]'::jsonb,
  'frontend', '[]'::jsonb,
  'backend', '[]'::jsonb,
  'database', '[]'::jsonb,
  'apis_tools', array_to_json(technologies)::jsonb
)
WHERE technologies_used IS NULL OR technologies_used = '{"languages": [], "frontend": [], "backend": [], "database": [], "apis_tools": []}'::jsonb;

-- Optionally, you can remove the old technologies column after confirming the migration worked
-- UNCOMMENT the line below after verifying the migration:
-- ALTER TABLE projects DROP COLUMN IF EXISTS technologies;

-- Add some sample data with the new structure
UPDATE projects 
SET 
  project_type_detail = 'Solo Project',
  role = 'Full Stack Developer',
  duration = 'Jan 2024 - Mar 2024',
  technologies_used = '{"languages": ["JavaScript", "TypeScript"], "frontend": ["React", "Tailwind CSS"], "backend": ["Node.js", "Express.js"], "database": ["PostgreSQL"], "apis_tools": ["Stripe API", "JWT"]}',
  key_features = ARRAY['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Integration', 'Admin Dashboard'],
  my_contributions = ARRAY['Database Design', 'API Development', 'Frontend Implementation', 'Payment Gateway Integration']
WHERE title = 'E-Commerce Platform';

UPDATE projects 
SET 
  project_type_detail = 'Team Project',
  role = 'Lead Frontend Developer',
  duration = 'Apr 2024 - Jun 2024',
  type = 'group',
  technologies_used = '{"languages": ["TypeScript"], "frontend": ["Next.js", "Chakra UI"], "backend": ["Prisma", "Node.js"], "database": ["PostgreSQL"], "apis_tools": ["Socket.io", "Vercel"]}',
  key_features = ARRAY['Real-time Collaboration', 'Task Assignment', 'Progress Tracking', 'Team Analytics', 'File Sharing'],
  my_contributions = ARRAY['Component Architecture', 'Real-time Features', 'State Management', 'UI/UX Implementation']
WHERE title = 'Task Management App';

UPDATE projects 
SET 
  project_type_detail = 'Personal Project',
  role = 'Solo Developer',
  duration = 'Dec 2023 - Jan 2024',
  technologies_used = '{"languages": ["JavaScript"], "frontend": ["React", "CSS Modules"], "backend": [], "database": [], "apis_tools": ["OpenWeather API", "Chart.js", "Geolocation API"]}',
  key_features = ARRAY['Location-based Forecasts', 'Interactive Maps', 'Weather Analytics', 'Responsive Design'],
  my_contributions = ARRAY['API Integration', 'Data Visualization', 'Responsive Design', 'Performance Optimization']
WHERE title = 'Weather App';

-- Verify the migration
SELECT id, title, status, type, project_type_detail, role, duration, technologies_used, key_features, my_contributions 
FROM projects 
LIMIT 3;
