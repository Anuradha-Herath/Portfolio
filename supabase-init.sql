-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT NOT NULL,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date DATE NOT NULL,
  credential_id TEXT,
  url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON blog_posts FOR SELECT USING (true);

-- Create policies for authenticated admin access (you'll need to set up authentication)
-- For now, these will be handled by the service role key

-- Insert sample data
INSERT INTO projects (title, description, image_url, technologies, github_url, live_url, featured) VALUES
('E-Commerce Platform', 'A full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Features include user authentication, product catalog, shopping cart, and payment integration.', '/images/project1.jpg', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'], 'https://github.com/username/ecommerce', 'https://ecommerce-demo.com', true),
('Task Management App', 'A collaborative task management application built with Next.js and Prisma. Includes real-time updates, team collaboration features, and detailed analytics dashboard.', '/images/project2.jpg', ARRAY['Next.js', 'Prisma', 'Socket.io', 'TypeScript', 'Chakra UI'], 'https://github.com/username/task-manager', 'https://taskapp-demo.com', true),
('Weather App', 'A responsive weather application with location-based forecasts, interactive maps, and detailed weather analytics. Built with React and integrated with multiple weather APIs.', '/images/project3.jpg', ARRAY['React', 'OpenWeather API', 'Chart.js', 'CSS Modules'], 'https://github.com/username/weather-app', 'https://weather-demo.com', false);

INSERT INTO skills (name, category, level) VALUES
('React', 'Frontend', 'Expert'),
('Next.js', 'Frontend', 'Advanced'),
('TypeScript', 'Frontend', 'Advanced'),
('JavaScript', 'Frontend', 'Expert'),
('Tailwind CSS', 'Frontend', 'Advanced'),
('HTML/CSS', 'Frontend', 'Expert'),
('Node.js', 'Backend', 'Advanced'),
('Express.js', 'Backend', 'Advanced'),
('Python', 'Backend', 'Intermediate'),
('Django', 'Backend', 'Intermediate'),
('PostgreSQL', 'Database', 'Advanced'),
('MongoDB', 'Database', 'Intermediate'),
('MySQL', 'Database', 'Advanced'),
('Prisma', 'Database', 'Intermediate'),
('Git', 'Tools', 'Advanced'),
('Docker', 'Tools', 'Intermediate'),
('AWS', 'Tools', 'Intermediate'),
('Vercel', 'Tools', 'Advanced');

INSERT INTO experiences (company, position, start_date, end_date, description, technologies, location) VALUES
('TechCorp Solutions', 'Senior Full Stack Developer', '2023-06-01', NULL, 'Leading development of enterprise web applications using React, Node.js, and PostgreSQL. Mentoring junior developers and implementing best practices for code quality and performance.', ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'], 'Colombo, Sri Lanka'),
('Digital Innovations Ltd', 'Frontend Developer', '2022-01-01', '2023-05-31', 'Developed responsive web applications and mobile apps using React and React Native. Collaborated with UI/UX designers to implement pixel-perfect designs and improved user experience.', ARRAY['React', 'React Native', 'JavaScript', 'Redux', 'Styled Components'], 'Remote'),
('StartupXYZ', 'Software Developer Intern', '2021-06-01', '2021-12-31', 'Worked on various features for the company''s main product, including API development, database optimization, and frontend enhancements. Gained experience in agile development methodologies.', ARRAY['Python', 'Django', 'MySQL', 'Vue.js', 'Git'], 'Kandy, Sri Lanka');
