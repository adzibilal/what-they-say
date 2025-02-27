/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'javascript/auto'
    });

    // Konfigurasi node polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false
    };

    return config;
  }
};

module.exports = nextConfig; 