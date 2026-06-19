/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://ec2-13-206-196-136.ap-south-1.compute.amazonaws.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
