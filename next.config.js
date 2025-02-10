module.exports = {
  swcMinify: true,
  transpilePackages: ['crypto-js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simulationhockey.com',
        port: '',
        pathname: '/tradingcards/**',
      },
      {
        protocol: 'https',
        hostname: 'simulationhockey.com',
        port: '',
        pathname: '/uploads/avatars/**',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: ['preset-default'],
            },
            dimensions: false,
            memo: true,
            svgProps: {
              role: 'img',
            },
          },
        },
      ],
    })
    return config
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
}
