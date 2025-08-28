# Portfolio Admin Panel

This is a Next.js portfolio website with a comprehensive admin panel for managing content. It uses Supabase as the database and includes authentication for admin access, email notifications, SMS capabilities, and file upload functionality.

## Features

- **Portfolio Website**: Modern, responsive portfolio with sections for projects, skills, experience, education, certifications, testimonials, and blog posts
- **Admin Panel**: Complete content management system for adding/editing/deleting portfolio content
- **Database Integration**: Supabase PostgreSQL database with real-time updates
- **Authentication**: JWT-based admin authentication
- **Email Notifications**: Automated email notifications for contact form submissions using Gmail
- **SMS Functionality**: Send SMS messages using TextBee API
- **File Upload**: Upload and manage project images, skill icons, and certificates
- **Contact Management**: View, manage, and respond to contact form messages
- **Modern UI**: Built with Tailwind CSS and Framer Motion animations

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > API to get your project URL and API keys
3. In the SQL Editor, run the contents of `supabase-init.sql` to create tables and sample data
4. Go to Storage and create the following buckets:
   - `skill-icons` (public, for SVG icons)
   - `certificates` (public, for certificate files)
   - `project-images` (public, for project screenshots)

### 3. Configure Environment Variables

Update your `.env.local` file with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Gmail)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASS=your_gmail_app_password
NEXT_PUBLIC_GMAIL_USER=your_gmail_address@gmail.com

# SMS Configuration (TextBee)
TEXTBEE_API_KEY=your_textbee_api_key
TEXTBEE_DEVICE_ID=your_textbee_device_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Generate a JWT Secret

You can generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Set up Gmail App Password

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Use the App Password (not your regular password) for `GMAIL_PASS`

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at:
- Portfolio: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Login: http://localhost:3000/login

## Admin Panel Usage

### Login
1. Go to `/login`
2. Use the credentials you set in your environment variables
3. You'll be redirected to the admin dashboard

### Managing Content

The admin panel allows you to:

- **Projects**: Add, edit, delete projects with technologies, GitHub/live URLs, and featured status
- **Skills**: Manage technical skills with categories and proficiency levels
- **Experience**: Add work experience entries
- **Education**: Manage educational background
- **Certifications**: Add professional certifications with file uploads
- **Testimonials**: Manage client/colleague testimonials
- **Blog Posts**: Create and manage blog content
- **Messages**: View and manage contact form submissions
- **File Uploads**: Upload project images, skill icons, and certificates

### Additional Admin Features

- **Test Email**: Verify email configuration at `/admin/test-email`
- **Storage Management**: Initialize storage buckets at `/api/storage/init`
- **Contact Form**: Automated email notifications for new messages
- **SMS Testing**: Test SMS functionality (when implemented)

## API Endpoints

All admin operations require authentication. The API includes:

### Content Management
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create new project (admin only)
- `PUT /api/projects` - Update project (admin only)
- `DELETE /api/projects?id={id}` - Delete project (admin only)

Similar endpoints exist for skills, experiences, education, certifications, testimonials, and blog posts.

### Contact & Communication
- `GET /api/contact` - Fetch all contact messages
- `POST /api/contact` - Submit contact form
- `GET /api/contact/{id}` - Get specific contact message
- `PATCH /api/contact/{id}` - Update message status
- `DELETE /api/contact/{id}` - Delete contact message
- `POST /api/send-sms` - Send SMS message
- `POST /api/test-email` - Test email configuration

### File Upload
- `POST /api/upload/project-image` - Upload project images
- `POST /api/storage/init` - Initialize storage buckets

## Database Schema

The database includes the following tables:

- `projects` - Portfolio projects
- `skills` - Technical skills and proficiencies
- `experiences` - Work experience
- `education` - Educational background
- `certifications` - Professional certifications
- `testimonials` - Client/colleague recommendations
- `blog_posts` - Blog articles
- `contact_messages` - Contact form submissions

## Technologies Used

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens
- **Email**: Nodemailer with Gmail
- **SMS**: TextBee API
- **File Storage**: Supabase Storage
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── (admin)/           # Admin panel routes
│   │   ├── admin/         # Admin dashboard pages
│   │   └── login/         # Login page
│   ├── (portfolio)/       # Public portfolio routes
│   └── api/              # API endpoints
├── components/
│   ├── (admin)/          # Admin components
│   ├── (portfolio)/      # Portfolio components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
└── supabase-init.sql     # Database initialization script
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Features

- JWT-based authentication
- Row Level Security (RLS) on all database tables
- HTTP-only cookies for token storage
- Input validation and sanitization
- Environment variable protection
- File upload validation and size limits

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Check your JWT secret and admin credentials
2. **Database Connection**: Verify Supabase URL and API keys
3. **Email Not Sending**: Ensure Gmail App Password is correct and 2FA is enabled
4. **SMS Not Working**: Verify TextBee API key and device ID
5. **File Upload Failed**: Check storage bucket permissions and file size limits
6. **Build Errors**: Ensure all TypeScript types are properly defined

### Development Tips

- Use the browser's developer tools to inspect API calls
- Check the Supabase dashboard for database issues
- Monitor the server console for error messages
- Test email functionality at `/admin/test-email`
- Initialize storage buckets by calling `/api/storage/init`

## License

This project is private and proprietary.
