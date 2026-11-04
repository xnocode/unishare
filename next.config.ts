import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      { source: "/login", destination: "/log-in" },
      { source: "/register", destination: "/create-account" },
      { source: "/signup", destination: "/create-account" },
      { source: "/2fa", destination: "/login-2fa-6-digit-otp" },
      { source: "/verify-2fa", destination: "/login-2fa-6-digit-otp" },
      { source: "/wallet", destination: "/wallet-overview" },
      { source: "/rides", destination: "/ride-home-and-search" },
      { source: "/profile", destination: "/my-profile" },
      { source: "/rentals", destination: "/my-rentals" },
      { source: "/products", destination: "/my-products" },
      { source: "/help", destination: "/get-help" },
      { source: "/admin", destination: "/restricted-admin-dashboard" },
      { source: "/search", destination: "/global-search" },
    ];
  },
};

export default nextConfig;
