module.exports = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simulationhockey.com',
        pathname: '/tradingcards/**',
      },
    ],
  },
}
