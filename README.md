# 🚀 Portfolio Website with Admin Panel

A modern, full-stack portfolio website built with **Next.js 14**, featuring a comprehensive admin panel for content management. This project showcases a professional portfolio with dynamic content management capabilities, real-time updates, and modern web technologies.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

## ✨ Key Features

### 🎨 **Modern Portfolio Website**
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Dark/Light Theme**: Automatic theme switching with user preference persistence
- **Smooth Animations**: Powered by Framer Motion for delightful user interactions
- **Performance Optimized**: Fast loading with Next.js 14 App Router architecture

### 📊 **Comprehensive Content Sections**
- **🔥 Hero Section**: Dynamic introduction with animated elements
- **💼 Projects**: Detailed project showcase with modal views and categorized technologies
- **🛠️ Skills**: Interactive skill matrix with proficiency levels and SVG icons
- **💼 Experience**: Professional work history with technology stacks
- **🎓 Education**: Academic background with institutional icons
- **🏆 Certifications**: Professional certifications with file attachments
- **📞 Contact**: Advanced contact form with spam protection and notifications

### 🔐 **Secure Admin Panel**
- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Access**: Protected admin routes with middleware
- **Content Management**: Full CRUD operations for all content types
- **File Upload System**: Multi-file upload with validation and optimization
- **Real-time Updates**: Instant content synchronization across the platform

### 📱 **Advanced Features**
- **Email Notifications**: Automated Gmail integration for contact form submissions
- **SMS Capabilities**: TextBee API integration for mobile notifications
- **Contact Management**: Advanced message handling with IP tracking and spam protection
- **Storage Management**: Organized file storage with automatic bucket creation
- **CI/CD Pipeline**: Automated testing, building, and deployment workflow

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Custom component library

### **Backend & Database**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with bcrypt hashing
- **File Storage**: Supabase Storage with multi-bucket architecture
- **Email**: Nodemailer with Gmail SMTP
- **SMS**: TextBee API integration

### **DevOps & Deployment**
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Environment**: Docker-ready configuration
- **Monitoring**: Built-in error tracking and performance monitoring

## 📁 Project Structure

```
📦 Portfolio/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (admin)/                  # Protected admin routes
│   │   ├── 📁 admin/                # Admin dashboard pages
│   │   │   ├── 📁 projects/         # Project management
│   │   │   ├── 📁 skills/           # Skills management
│   │   │   ├── 📁 experiences/      # Experience management
│   │   │   ├── 📁 education/        # Education management
│   │   │   ├── 📁 certifications/   # Certification management
│   │   │   ├── 📁 testimonials/     # Testimonial management
│   │   │   ├── 📁 blogs/            # Blog management
│   │   │   ├── 📁 messages/         # Contact message management
│   │   │   └── 📁 blocked-ips/      # IP blocking management
│   │   └── 📁 login/                # Authentication
│   ├── 📁 (portfolio)/              # Public portfolio routes
│   │   ├── layout.tsx               # Portfolio layout
│   │   └── page.tsx                 # Main portfolio page
│   └── 📁 api/                      # API routes
│       ├── 📁 auth/                 # Authentication endpoints
│       ├── 📁 projects/             # Project CRUD operations
│       ├── 📁 skills/               # Skills CRUD operations
│       ├── 📁 contact/              # Contact form handling
│       ├── 📁 upload/               # File upload endpoints
│       └── 📁 storage/              # Storage management
├── 📁 components/                   # React components
│   ├── 📁 (admin)/                  # Admin-specific components
│   │   ├── AdminLayout.tsx          # Admin layout wrapper
│   │   ├── AdminNav.tsx             # Admin navigation
│   │   ├── ProjectForm.tsx          # Project creation/editing
│   │   ├── SkillForm.tsx            # Skill creation/editing
│   │   └── DataCard.tsx             # Reusable data display card
│   ├── 📁 (portfolio)/              # Portfolio-specific components
│   │   ├── Navbar.tsx               # Main navigation
│   │   ├── Footer.tsx               # Site footer
│   │   ├── ProjectModal.tsx         # Project detail modal
│   │   └── 📁 sections/             # Page sections
│   │       ├── HeroSection.tsx      # Hero/landing section
│   │       ├── ProjectsSection.tsx  # Projects showcase
│   │       ├── SkillsSection.tsx    # Skills display
│   │       ├── ExperienceSection.tsx # Work experience
│   │       ├── EducationSection.tsx  # Education background
│   │       ├── CertificationSection.tsx # Certifications
│   │       ├── TestimonialSection.tsx # Testimonials
│   │       ├── BlogSection.tsx      # Blog articles
│   │       └── ContactSection.tsx   # Contact form
│   └── 📁 ui/                       # Reusable UI components
│       ├── Button.tsx               # Custom button component
│       ├── Input.tsx                # Form input component
│       ├── Card.tsx                 # Card layout component
│       ├── Heading.tsx              # Typography component
│       └── LoadingSpinner.tsx       # Loading indicator
├── 📁 lib/                          # Utility libraries
│   ├── auth.ts                      # Authentication utilities
│   ├── db.ts                        # Database connection & operations
│   ├── storage.ts                   # File storage operations
│   ├── types.ts                     # TypeScript type definitions
│   ├── utils.ts                     # General utility functions
│   └── performance.ts               # Performance monitoring
├── 📁 public/                       # Static assets
│   ├── favicon.ico                  # Site favicon
│   ├── resume.pdf                   # Resume download
│   └── 📁 images/                   # Image assets
└── 📁 .github/workflows/            # CI/CD workflows
    └── ci-cd.yml                    # GitHub Actions pipeline
```

## 🚀 Quick Start Guide

### 1️⃣ **Prerequisites**

Before you begin, ensure you have the following installed:
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase** account (free tier available)
- A **Gmail** account for email notifications
- A **Vercel** account for deployment (optional)

### 2️⃣ **Clone & Install**

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio.git
cd portfolio

# Install dependencies
npm install
# or
yarn install
```

### 3️⃣ **Environment Configuration**

Create a `.env.local` file in the root directory:

```env
# 🔗 Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 🔐 Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key

# 📧 Email Configuration (Gmail)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASS=your_gmail_app_password

# 📱 SMS Configuration (TextBee - Optional)
TEXTBEE_API_KEY=your_textbee_api_key
TEXTBEE_DEVICE_ID=your_textbee_device_id
ENABLE_SMS_NOTIFICATIONS=true

# 🌐 Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4️⃣ **Database Setup**

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from Settings → API
3. **Run the database initialization**:
   ```bash
   # Copy the contents of supabase-init.sql
   # Run it in your Supabase SQL Editor
   ```
4. **Create storage buckets**:
   ```bash
   # After setup, call this API endpoint to initialize storage
   curl -X POST http://localhost:3000/api/storage/init
   ```

### 5️⃣ **Generate JWT Secret**

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6️⃣ **Gmail Setup (For Contact Form)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `GMAIL_PASS`

### 7️⃣ **Start Development Server**

```bash
npm run dev
# or
yarn dev
```

🎉 **Your portfolio is now running!**
- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login**: http://localhost:3000/login

## 📖 Usage Guide

### **Admin Panel Operations**

#### **🔐 Authentication**
1. Navigate to `/login`
2. Enter your admin credentials
3. Access the admin dashboard at `/admin`

#### **💼 Project Management**
- **Add Projects**: Include detailed information, technologies, and multiple images
- **Categorize Technologies**: Organize by languages, frontend, backend, database, and tools
- **Project Details**: Add key features, contributions, and project metadata
- **Image Management**: Upload main images and additional screenshots
- **Project Ordering**: Control display order with drag-and-drop interface

#### **🛠️ Skills Management**
- **Skill Categories**: Frontend, Backend, Database, Tools, etc.
- **Proficiency Levels**: Beginner, Intermediate, Advanced, Expert
- **Custom Icons**: Upload SVG icons for visual representation
- **Auto-suggestions**: Smart technology suggestions for faster input

#### **📞 Contact Management**
- **Message Inbox**: View all contact form submissions
- **Status Tracking**: Mark messages as read/unread/replied
- **IP Management**: Block spam IPs automatically
- **Email Notifications**: Receive instant notifications for new messages

### **Content Structure**

#### **📊 Database Schema**

```sql
-- Core content tables
projects              # Portfolio projects with detailed info
skills               # Technical skills with categories
experiences          # Professional work history
education           # Academic background
certifications      # Professional certifications
testimonials        # Client recommendations
blog_posts          # Article content
contact_messages    # Contact form submissions
blocked_ips         # Spam protection
```

#### **🏗️ Project Data Structure**

```typescript
interface Project {
  // Basic Information
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  featured: boolean;
  status: 'completed' | 'ongoing';
  type: 'individual' | 'group';
  
  // Detailed Information
  project_type_detail?: string;  // "Client Project", "Personal"
  role?: string;                 // "Full Stack Developer"
  duration?: string;             // "Mar 2024 - Jul 2025"
  
  // Structured Technologies
  technologies_used?: {
    languages: string[];         // ["JavaScript", "TypeScript"]
    frontend: string[];          // ["React", "Next.js"]
    backend: string[];           // ["Node.js", "Express"]
    database: string[];          // ["PostgreSQL", "Redis"]
    apis_tools: string[];        // ["REST API", "Docker"]
  };
  
  // Project Details
  key_features?: string[];       // Main features list
  my_contributions?: string[];   // Personal contributions
  additional_images?: string[];  // Screenshot gallery
}
```

## 🔧 API Documentation

### **Authentication Endpoints**

```bash
# Login
POST /api/auth/login
Body: { username: string, password: string }

# Logout
POST /api/auth/logout

# Verify Token
GET /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
```

### **Content Management Endpoints**

```bash
# Projects
GET    /api/projects           # Fetch all projects
POST   /api/projects           # Create project (admin)
PUT    /api/projects           # Update project (admin)
DELETE /api/projects?id={id}   # Delete project (admin)

# Skills
GET    /api/skills             # Fetch all skills
POST   /api/skills             # Create skill (admin)
PUT    /api/skills             # Update skill (admin)
DELETE /api/skills?id={id}     # Delete skill (admin)

# Similar endpoints exist for:
# - /api/experiences
# - /api/education
# - /api/certifications
# - /api/testimonials
# - /api/blogs
```

### **File Upload Endpoints**

```bash
# Project Images
POST /api/upload/project-images
Accepts: multipart/form-data

# Skill Icons (SVG only)
POST /api/upload/skill-icons
Accepts: image/svg+xml

# Certificates
POST /api/upload/certificates
Accepts: PDF, JPG, PNG, WebP

# Education Icons
POST /api/upload/education-icons
Accepts: Images and SVG
```

### **Contact & Communication**

```bash
# Contact Messages
GET    /api/contact           # Fetch messages (admin)
POST   /api/contact           # Submit contact form
GET    /api/contact/{id}      # Get specific message (admin)
PATCH  /api/contact/{id}      # Update message status (admin)
DELETE /api/contact/{id}      # Delete message (admin)

# Notifications
POST /api/send-sms           # Send SMS notification (admin)
POST /api/test-email         # Test email configuration (admin)

# IP Management
GET    /api/blocked-ips      # List blocked IPs (admin)
POST   /api/blocked-ips      # Block IP address (admin)
DELETE /api/blocked-ips/{id} # Unblock IP (admin)
```

## 🚀 Deployment Guide

### **Vercel Deployment (Recommended)**

1. **Connect Repository**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Link project
   vercel link
   ```

2. **Set Environment Variables**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from your `.env.local`

3. **Deploy**:
   ```bash
   # Deploy to production
   vercel --prod
   ```

### **Manual Deployment**

```bash
# Build the application
npm run build

# Start production server
npm start
```

### **Docker Deployment**

```dockerfile
# Dockerfile (create in root directory)
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run with Docker
docker build -t portfolio .
docker run -p 3000:3000 --env-file .env.local portfolio
```

## 🔒 Security Features

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: XSS protection for token storage
- **Password Hashing**: bcrypt encryption for credentials
- **Session Management**: Automatic token expiration and refresh

### **Data Protection**
- **Row Level Security (RLS)**: Database-level access control
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries with Supabase
- **CSRF Protection**: Built-in Next.js CSRF protection

### **File Upload Security**
- **File Type Validation**: Strict MIME type checking
- **File Size Limits**: Configurable upload size restrictions
- **Virus Scanning**: Integration-ready for virus scanning services
- **Secure File Storage**: Isolated storage buckets with access control

### **Network Security**
- **IP Blocking**: Automatic spam IP management
- **Rate Limiting**: API endpoint rate limiting
- **CORS Configuration**: Strict cross-origin resource sharing
- **HTTPS Enforcement**: Automatic HTTPS redirect in production

## 🧪 Testing

### **Available Test Scripts**

```bash
# Run all tests
npm run test

# Type checking
npm run type-check

# Lint code
npm run lint

# Test environment setup
npm run validate-env

# CI pipeline (lint + type-check + build)
npm run ci
```

### **Testing Utilities**

```bash
# Test email configuration
curl -X POST http://localhost:3000/api/test-email

# Test SMS functionality
curl -X POST http://localhost:3000/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message", "phone": "+1234567890"}'

# Validate storage buckets
curl -X POST http://localhost:3000/api/storage/init
```

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **🔐 Authentication Problems**
```bash
# Issue: "JWT Secret not configured"
# Solution: Generate and set JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Issue: "Invalid credentials"
# Solution: Check ADMIN_USERNAME and ADMIN_PASSWORD in .env.local
```

#### **📧 Email Issues**
```bash
# Issue: "Email not sending"
# Solution: Verify Gmail app password and 2FA
# Test with: curl -X POST localhost:3000/api/test-email
```

#### **💾 Database Connection**
```bash
# Issue: "Database connection failed"
# Solution: Verify Supabase credentials
# Check: NEXT_PUBLIC_SUPABASE_URL and keys are correct
```

#### **📁 File Upload Problems**
```bash
# Issue: "Storage bucket not found"
# Solution: Initialize storage buckets
curl -X POST localhost:3000/api/storage/init

# Issue: "File upload failed"
# Solution: Check file size limits and MIME types
```

#### **🚀 Deployment Issues**
```bash
# Issue: "Build failed on Vercel"
# Solution: Check environment variables are set in Vercel dashboard
# Run locally: npm run build

# Issue: "API routes not working"
# Solution: Ensure serverless functions are properly configured
```

### **Debug Tools**

```bash
# Check database connection
node debug-projects.js

# Validate education data
node check-education.js

# Test contact form setup
node test-contact-setup.js

# Environment validation
node validate-env.js
```

## 📚 Additional Resources

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### **Deployment Guides**
- [Vercel Deployment Guide](https://vercel.com/docs/deployments)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [CI/CD Pipeline Setup](./CI_CD_SETUP.md)
- [Storage Bucket Creation](./STORAGE_BUCKET_CREATION_GUIDE.md)

### **Feature Implementation Guides**
- [Project Details Implementation](./PROJECT_DETAILS_IMPLEMENTATION.md)
- [Certification System](./CERTIFICATIONS_IMPLEMENTATION_GUIDE.md)
- [Contact Form Setup](./CONTACT_IMPLEMENTATION_GUIDE.md)
- [Skills SVG Upload](./SKILLS_SVG_UPLOAD.md)
- [Project Modal Feature](./PROJECT_MODAL_FEATURE.md)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure tests pass
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Portfolio: [your-portfolio-url.com](https://your-portfolio-url.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- GitHub: [github.com/yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

### 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Supabase** for the backend-as-a-service platform
- **Vercel** for the deployment platform
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for the animation library

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ using Next.js, TypeScript, and Supabase

</div>
