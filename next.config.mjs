import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the correct workspace root to avoid lockfile conflicts
  outputFileTracingRoot: __dirname,
  // Enable webpack's built-in file watcher for better hot reload on Windows
  webpack: (config, { dev, isServer }) => {
    // Optimize for development
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before reloading
        ignored: /node_modules/, // Ignore node_modules for better performance
      };
      
      // Reduce memory usage and improve build times
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate vendor chunk for better caching
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Separate common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Optimize compilation
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Optimize images for faster loading
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phgbjctpwfoemzodwhyn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Reduce bundle size
  transpilePackages: [],
  
  // Optimize for development
  ...(process.env.NODE_ENV === 'development' && {
    typescript: {
      // Skip type checking during development for faster builds
      ignoreBuildErrors: false,
    },
    eslint: {
      // Skip ESLint during development builds for speed
      ignoreDuringBuilds: false,
    },
  }),
};

export default nextConfig;
