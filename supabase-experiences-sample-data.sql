-- Sample data for experiences table
-- This script inserts sample experience entries based on the Experience interface

-- Insert sample experiences
INSERT INTO experiences (id, company, position, start_date, end_date, description, technologies, location) VALUES
(
  'a1b2c3d4-e5f6-4890-abcd-ef1234567890',
  'TechCorp Solutions',
  'Full Stack Developer',
  '2023-06-01',
  NULL, -- Current position
  'Developed and maintained web applications using modern technologies. Led the frontend development of a customer portal that increased user engagement by 40%. Collaborated with cross-functional teams to deliver high-quality software solutions.',
  ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'AWS', 'Docker'],
  'Colombo, Sri Lanka'
),
(
  'b2c3d4e5-f6a7-4901-bcde-f23456789012',
  'Digital Innovations Ltd',
  'Software Engineer Intern',
  '2022-12-01',
  '2023-05-31',
  'Worked on developing RESTful APIs and implementing responsive user interfaces. Participated in code reviews and contributed to improving application performance. Gained hands-on experience with agile development methodologies.',
  ARRAY['Java', 'Spring Boot', 'React', 'MySQL', 'Git', 'Jenkins'],
  'Kandy, Sri Lanka'
),
(
  'c3d4e5f6-a7b8-4012-cdef-345678901234',
  'StartupHub',
  'Frontend Developer',
  '2022-06-01',
  '2022-11-30',
  'Built responsive web applications using React and TypeScript. Implemented pixel-perfect designs and ensured cross-browser compatibility. Worked closely with designers to create intuitive user experiences.',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript', 'Figma'],
  'Remote'
),
(
  'd4e5f6a7-b8c9-4123-defa-456789012345',
  'University Research Lab',
  'Research Assistant',
  '2022-01-01',
  '2022-05-31',
  'Conducted research on machine learning algorithms and data analysis. Developed Python scripts for data processing and visualization. Assisted in writing research papers and presenting findings at conferences.',
  ARRAY['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter', 'R'],
  'Moratuwa, Sri Lanka'
),
(
  'e5f6a7b8-c9d0-4234-efab-567890123456',
  'FreelanceWork',
  'Web Developer',
  '2021-08-01',
  '2021-12-31',
  'Developed custom websites for small businesses and startups. Created responsive designs and implemented content management systems. Managed client relationships and delivered projects on time and within budget.',
  ARRAY['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress', 'MySQL', 'Bootstrap'],
  'Remote'
);

-- Verify the inserted data
SELECT * FROM experiences ORDER BY start_date DESC;
