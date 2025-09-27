-- Create hero table for managing hero section content
CREATE TABLE IF NOT EXISTS hero (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Anuradha Herath',
  title TEXT NOT NULL DEFAULT 'IT Undergraduate',
  subtitle TEXT NOT NULL DEFAULT 'Full Stack Developer',
  description TEXT NOT NULL DEFAULT 'Hi, I''m Anuradha Herath 👋. I''m an IT undergrad who loves building web apps and exploring AI. I enjoy turning ideas into simple, useful digital solutions.',
  profile_image_url TEXT,
  roles TEXT[] DEFAULT ARRAY['IT Undergraduate', 'Full Stack Developer', 'Problem Solver'],
  github_url TEXT DEFAULT 'https://github.com/Anuradha-Herath',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/herath-anuradha',
  email TEXT DEFAULT 'anuradhaherath2001@gmail.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER update_hero_updated_at BEFORE UPDATE ON hero FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON hero FOR SELECT USING (true);

-- Insert default hero data
INSERT INTO hero (name, title, subtitle, description, roles, github_url, linkedin_url, email) VALUES
('Anuradha Herath', 'IT Undergraduate', 'Full Stack Developer', 'Hi, I''m Anuradha Herath 👋. I''m an IT undergrad who loves building web apps and exploring AI. I enjoy turning ideas into simple, useful digital solutions.', ARRAY['IT Undergraduate', 'Full Stack Developer', 'Problem Solver'], 'https://github.com/Anuradha-Herath', 'https://www.linkedin.com/in/herath-anuradha', 'anuradhaherath2001@gmail.com');