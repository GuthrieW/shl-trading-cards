module.exports = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simulationhockey.com',
        port: '',
        pathname: '/tradingcards/**',
      },
    ],
  },
}
