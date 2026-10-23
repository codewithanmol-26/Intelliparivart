/** @type {import('next').NextConfig} */
// Supports both private server variables (BACKEND_URL, API_URL, BACKEND_INTERNAL_URL)
// and public framework variable (NEXT_PUBLIC_API_URL), defaulting to live Render endpoint.
const backendUrl =
  process.env.BACKEND_URL ||
  process.env.API_URL ||
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://intelliparivart.onrender.com/api';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/$/, '')}/:path*`,
      },
    ];
  },
};

export default nextConfig;
