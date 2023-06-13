/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
      })
    );
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/grenzeit/:slug*",
        destination: `${process.env.NEXT_PUBLIC_GRENZEIT_API_SCHEME}://${process.env.NEXT_PUBLIC_GRENZEIT_API_HOST}/api/latest/:slug*`,
      },
    ];
  },
};

module.exports = nextConfig;
