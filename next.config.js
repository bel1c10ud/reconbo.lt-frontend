/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/api/riot/global/userinfo',
        destination: 'https://auth.riotgames.com/userinfo',
      },
      {
        source: '/api/riot/:reegion/storefront/:puuid',
        destination: 'https://pd.:reegion.a.pvp.net/store/v2/storefront/:puuid',
      }
    ]
  },
}
