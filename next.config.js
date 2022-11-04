/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/rewrite/:region/:path*',
        destination: 'https://:region.backend.reconbo.lt/:path*'
      }
    ]
  },
}
