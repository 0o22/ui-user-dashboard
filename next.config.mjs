import headers from './headers.config.js';
import webpack from './webpack.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers,
  webpack,
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
};

export default nextConfig;
