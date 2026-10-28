const backendUrl = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5001'
).replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  generateEtags: false, // Prevents browser from caching 304 responses when files change
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
