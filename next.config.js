
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The project is structured to support both the client-facing VPN app (at the root)
  // and the admin panel (under /admin).
};

module.exports = nextConfig;
