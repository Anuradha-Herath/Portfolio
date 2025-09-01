import { createClient } from '@supabase/supabase-js';
import { Project, Skill, Experience, Education, Certification, Testimonial, BlogPost, ContactMessage, BlockedIP } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client for read operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for write operations (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id'>;
        Update: Partial<Omit<Project, 'id'>>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, 'id'>;
        Update: Partial<Omit<Skill, 'id'>>;
      };
      experiences: {
        Row: Experience;
        Insert: Omit<Experience, 'id'>;
        Update: Partial<Omit<Experience, 'id'>>;
      };
      education: {
        Row: Education;
        Insert: Omit<Education, 'id'>;
        Update: Partial<Omit<Education, 'id'>>;
      };
      certifications: {
        Row: Certification;
        Insert: Omit<Certification, 'id'>;
        Update: Partial<Omit<Certification, 'id'>>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, 'id'>;
        Update: Partial<Omit<Testimonial, 'id'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id'>;
        Update: Partial<Omit<BlogPost, 'id'>>;
      };
      contacts: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>>;
      };
      blocked_ips: {
        Row: BlockedIP;
        Insert: Omit<BlockedIP, 'id' | 'blocked_at'>;
        Update: Partial<Omit<BlockedIP, 'id' | 'blocked_at'>>;
      };
    };
  };
}

// Database operations
export const dbOperations = {
  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false }); // Fallback for projects without order
    
    if (error) throw error;
    return data as Project[];
  },

  async createProject(project: Omit<Project, 'id'>) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  async updateProject(id: string, updates: Partial<Omit<Project, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  async deleteProject(id: string) {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Skills
  async getSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) throw error;
    return data as Skill[];
  },

  async createSkill(skill: Omit<Skill, 'id'>) {
    const { data, error } = await supabaseAdmin
      .from('skills')
      .insert(skill)
      .select()
      .single();
    
    if (error) throw error;
    return data as Skill;
  },

  async updateSkill(id: string, updates: Partial<Omit<Skill, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Skill;
  },

  async deleteSkill(id: string) {
    const { error } = await supabaseAdmin
      .from('skills')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Experiences
  async getExperiences() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data as Experience[];
  },

  async createExperience(experience: Omit<Experience, 'id'>) {
    const { data, error } = await supabaseAdmin
      .from('experiences')
      .insert(experience)
      .select()
      .single();
    
    if (error) throw error;
    return data as Experience;
  },

  async updateExperience(id: string, updates: Partial<Omit<Experience, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Experience;
  },

  async deleteExperience(id: string) {
    const { error } = await supabaseAdmin
      .from('experiences')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Education
  async getEducation() {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data as Education[];
  },

  async createEducation(education: Omit<Education, 'id'>) {
    const { data, error } = await supabaseAdmin
      .from('education')
      .insert(education)
      .select()
      .single();
    
    if (error) throw error;
    return data as Education;
  },

  async updateEducation(id: string, updates: Partial<Omit<Education, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from('education')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Education;
  },

  async deleteEducation(id: string) {
    const { error } = await supabaseAdmin
      .from('education')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Certifications
  async getCertifications() {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as Certification[];
  },

  async createCertification(certification: Omit<Certification, 'id'>) {
    const { data, error } = await supabaseAdmin
      .from('certifications')
      .insert(certification)
      .select()
      .single();
    
    if (error) throw error;
    return data as Certification;
  },

  async updateCertification(id: string, updates: Partial<Omit<Certification, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from('certifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Certification;
  },

  async deleteCertification(id: string) {
    const { error } = await supabaseAdmin
      .from('certifications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Testimonials
  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Testimonial[];
  },

  async createTestimonial(testimonial: Omit<Testimonial, 'id'>) {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
    
    if (error) throw error;
    return data as Testimonial;
  },

  async updateTestimonial(id: string, updates: Partial<Omit<Testimonial, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Testimonial;
  },

  async deleteTestimonial(id: string) {
    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Blog Posts
  async getBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data as BlogPost[];
  },

  async createBlogPost(blogPost: Omit<BlogPost, 'id'>) {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert(blogPost)
      .select()
      .single();
    
    if (error) throw error;
    return data as BlogPost;
  },

  async updateBlogPost(id: string, updates: Partial<Omit<BlogPost, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as BlogPost;
  },

  async deleteBlogPost(id: string) {
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Contact Messages
  async getContactMessages() {
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ContactMessage[];
  },

  async createContactMessage(contact: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single();
    
    if (error) throw error;
    return data as ContactMessage;
  },

  async updateContactMessage(id: string, updates: Partial<Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ContactMessage;
  },

  async deleteContactMessage(id: string) {
    const { error } = await supabaseAdmin
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async markContactAsRead(id: string) {
    return this.updateContactMessage(id, { status: 'read' });
  },

  async markContactAsReplied(id: string) {
    return this.updateContactMessage(id, { status: 'replied' });
  },

  // Blocked IPs
  async getBlockedIPs() {
    const { data, error } = await supabaseAdmin
      .from('blocked_ips')
      .select('*')
      .order('blocked_at', { ascending: false });
    
    if (error) throw error;
    return data as BlockedIP[];
  },

  async blockIP(ip: string, reason?: string, blockedBy: string = 'system') {
    const { data, error } = await supabaseAdmin
      .from('blocked_ips')
      .insert({ ip, reason, blocked_by: blockedBy })
      .select()
      .single();
    
    if (error) throw error;
    return data as BlockedIP;
  },

  async unblockIP(ip: string) {
    const { error } = await supabaseAdmin
      .from('blocked_ips')
      .delete()
      .eq('ip', ip);
    
    if (error) throw error;
  },

  async isIPBlocked(ip: string) {
    const { data, error } = await supabaseAdmin
      .from('blocked_ips')
      .select('ip')
      .eq('ip', ip)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return !!data;
  }
};