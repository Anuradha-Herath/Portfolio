-- Update certifications table to support categories and file uploads
ALTER TABLE certifications 
ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('course', 'competition')) DEFAULT 'course',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS certificate_file_url TEXT;

-- Update existing records to have a default category
UPDATE certifications SET category = 'course' WHERE category IS NULL;

-- Make category NOT NULL after setting defaults
ALTER TABLE certifications ALTER COLUMN category SET NOT NULL;

-- Create storage bucket for certificate files
-- Note: Run this in Supabase Dashboard > Storage or use the dashboard to create the bucket
-- You can also create this programmatically through the API

-- Sample data for both categories
INSERT INTO certifications (title, issuer, date, credential_id, url, image_url, category, description) VALUES
('AWS Certified Developer - Associate', 'Amazon Web Services', '2023-10-15', 'AWS-DEV-2023-001234', 'https://aws.amazon.com/certification/', '/images/aws-cert.png', 'course', 'Professional certification demonstrating expertise in developing applications on AWS platform'),
('Google Analytics Certified', 'Google', '2023-06-20', 'GA-2023-789012', 'https://analytics.google.com/analytics/academy/', '/images/google-cert.png', 'course', 'Certification in Google Analytics for web analytics and digital marketing'),
('MongoDB Developer Certification', 'MongoDB University', '2023-04-10', 'MDB-DEV-2023-345678', 'https://university.mongodb.com/', '/images/mongodb-cert.png', 'course', 'Developer certification for MongoDB database development and administration'),
('International Collegiate Programming Contest', 'ICPC', '2023-03-15', 'ICPC-2023-567890', 'https://icpc.global/', '/images/icpc-cert.png', 'competition', 'Ranked 3rd in regional programming competition'),
('Google Code Jam', 'Google', '2023-05-20', 'GCJ-2023-123456', 'https://codingcompetitions.withgoogle.com/codejam', '/images/codejam-cert.png', 'competition', 'Qualified for Round 2 in Google Code Jam programming competition'),
('HackerRank Problem Solving Gold Badge', 'HackerRank', '2023-08-10', 'HR-GOLD-2023-789123', 'https://hackerrank.com/', '/images/hackerrank-cert.png', 'competition', 'Gold badge in problem solving domain on HackerRank platform');
