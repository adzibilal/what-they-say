/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });

    // Menambahkan konfigurasi untuk package.json files
    config.module.rules.push({
      test: /package\.json$/,
      loader: 'json-loader',
      type: 'javascript/auto'
    });

    return config;
  }
};

module.exports = nextConfig; 