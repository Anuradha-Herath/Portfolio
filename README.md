# Portfolio Project

A modern portfolio website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Route Groups** for organized structure
- **Admin Panel** for content management
- **Portfolio Showcase** for public viewing
- **API Routes** for backend functionality

## Project Structure

```
├── app/
│   ├── (admin)/           # Admin panel routes
│   ├── (portfolio)/       # Public portfolio routes
│   ├── api/              # API endpoints
│   └── globals.css       # Global styles
├── components/
│   ├── (admin)/          # Admin components
│   ├── (portfolio)/      # Portfolio components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
└── public/               # Static assets
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory and add your environment variables:

```env
# Database
DATABASE_URL=

# Authentication
AUTH_SECRET=

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## License

This project is private and proprietary.
