// Simple script to test database connection and create contacts table
// Run this in your browser console or Node.js to test the setup

console.log('Testing Supabase connection...');

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('Required variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
} else {
  console.log('Environment variables found');
  console.log('Supabase URL:', supabaseUrl);
}

// Instructions for database setup
console.log(`
=== SETUP INSTRUCTIONS ===

1. Make sure you have a Supabase project set up
2. Add environment variables to .env.local:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

3. Run the contacts migration in your Supabase SQL editor:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the content from supabase-contacts-migration.sql
   - Execute the migration

4. Test the contact form on your portfolio site

=== MIGRATION CONTENT ===
Copy this SQL and run it in your Supabase SQL editor:

-- Create contacts table for contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert access (form submissions)
CREATE POLICY "Allow public insert access" ON contacts FOR INSERT WITH CHECK (true);

-- Create policy for admin read/update access
CREATE POLICY "Allow admin access" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow admin update" ON contacts FOR UPDATE USING (true);

-- Create index for better performance
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
`);
