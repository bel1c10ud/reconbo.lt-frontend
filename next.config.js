/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/rewrite-backend/:region/:path*',
        destination: 'https://:region.backend.reconbo.lt/:path*'
      },
      {
        source: '/rewrite/userinfo',
        destination: 'https://auth.riotgames.com/userinfo',
      },
      {
        source: '/rewrite/entitlements',
        destination: 'https://entitlements.auth.riotgames.com/api/token/v1',
      },
      {
        source: '/rewrite/storefront/:region/:puuid',
        destination: 'https://pd.:region.a.pvp.net/store/v3/storefront/:puuid',
      }
    ]
  },
}
