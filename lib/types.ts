export interface Hero {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  profile_image_url?: string;
  roles: string[];
  github_url?: string;
  linkedin_url?: string;
  email?: string;
}

export interface CVFile {
  id: string;
  name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  featured: boolean;
  status: 'completed' | 'ongoing'; // Project status
  type: 'individual' | 'group';   // Project type
  order: number; // Display order (lower numbers appear first)

  // --- Detailed view fields (all optional) ---
  project_type_detail?: string; // e.g., Solo Project, Team Project, Client Project
  role?: string; // e.g., Full Stack Developer, Lead Developer
  duration?: string; // e.g., Mar 2024 - Jul 2025
  technologies_used?: {
    languages: string[];
    frontend: string[];
    backend: string[];
    database: string[];
    apis_tools: string[];
  };
  key_features?: string[];
  my_contributions?: string[];
  additional_images?: string[]; // URLs of additional images
  // Removed: challenges, solutions, outcome, future_enhancements
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description: string;
  grade?: string;
  icon_url?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  technologies: string[];
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credential_id?: string;
  url?: string;
  image_url?: string;
  category: 'course' | 'competition';
  description?: string;
  certificate_file_url?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  image_url?: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_at: string;
  tags: string[];
  read_time: number;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
  ip?: string; // IP address of the sender
}

export interface BlockedIP {
  id: string;
  ip: string;
  reason?: string;
  blocked_at: string;
  blocked_by: string;
}