module.exports = {
  swcMinify: true,
  transpilePackages: ['crypto-js'],
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
