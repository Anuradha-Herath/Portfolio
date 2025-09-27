-- Create cv_files table for managing CV/resume files
CREATE TABLE IF NOT EXISTS cv_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER update_cv_files_updated_at BEFORE UPDATE ON cv_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE cv_files ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON cv_files FOR SELECT USING (true);

-- Insert default CV file (if resume.pdf exists)
INSERT INTO cv_files (name, file_url, file_size, is_active) VALUES
('Resume', '/resume.pdf', 0, true);