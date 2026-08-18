const backendUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? 'http://ec2-13-206-196-136.ap-south-1.compute.amazonaws.com:5001'
    : 'http://localhost:5001')
).replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  generateEtags: false, // Prevents browser from caching 304 responses when files change
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
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
