/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.kitsu.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.kitsu.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        port: '',
        pathname: '/**',
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
