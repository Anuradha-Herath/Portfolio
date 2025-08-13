/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable webpack's built-in file watcher for better hot reload on Windows
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before reloading
    };
    return config;
  },
  // Explicitly enable Fast Refresh
  experimental: {
    fastRefresh: true,
  },
};
