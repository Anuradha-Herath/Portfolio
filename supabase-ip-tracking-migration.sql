-- Migration to add IP tracking and blocking for contacts

-- Add IP column to contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS ip TEXT;

-- Create blocked_ips table
CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ip TEXT NOT NULL UNIQUE,
  reason TEXT,
  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_by TEXT DEFAULT 'system'
);

-- Enable RLS on blocked_ips
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;

-- Policies for blocked_ips (admin only)
CREATE POLICY "Allow admin access to blocked_ips" ON blocked_ips FOR ALL USING (true);

-- Create index for IP lookups
CREATE INDEX idx_contacts_ip ON contacts(ip);
CREATE INDEX idx_blocked_ips_ip ON blocked_ips(ip);
