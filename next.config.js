/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/rewrite/auth-riotgames/userinfo',
        destination: 'https://auth.riotgames.com/userinfo',
      },
      {
        source: '/rewrite/riot-pvp/:reegion/offers',
        destination: 'https://pd.:reegion.a.pvp.net/store/v1/offers/',
      },
      {
        source: '/rewrite/riot-pvp/:reegion/storefront/:puuid',
        destination: 'https://pd.:reegion.a.pvp.net/store/v2/storefront/:puuid',
      }
    ]
  },
}
