/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.kitsu.app', // Corrected hostname based on error
        port: '',
        pathname: '/anime/poster_images/**',
      },
      {
        protocol: 'https',
        hostname: 'media.kitsu.app', // Corrected hostname based on error
        port: '',
        pathname: '/anime/*/poster_image/**', // Added singular path
      },
      {
        protocol: 'https',
        hostname: 'media.kitsu.app', // Corrected hostname based on error
        port: '',
        pathname: '/anime/cover_images/**',
      },
      {
        protocol: 'https',
        hostname: 'media.kitsu.app',
        port: '',
        pathname: '/episodes/thumbnails/**',
      },
      {
        protocol: 'https',
        hostname: 'media.kitsu.app',
        port: '',
        pathname: '/episode/**', // Added to support episode thumbnails
      },
      {
        protocol: 'https',
        hostname: 'media.kitsu.app',
        port: '',
        pathname: '/anime/*/cover_image/**', // Added to support cover images with ID pattern
      },
    ],
  },
  reactStrictMode: true,
  // Removed swcMinify and experimental.appDir as they're unrecognized
  // Ensure proper handling of API routes and dynamic paths
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
