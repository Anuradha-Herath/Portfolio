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
-- Note: This assumes you'll implement proper authentication later
CREATE POLICY "Allow admin access" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow admin update" ON contacts FOR UPDATE USING (true);

-- Create index for better performance
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
