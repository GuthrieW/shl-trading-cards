const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  important: true,
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './tailwind-components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      blue600: '#1E88E5',
      blue700: '#1976D2',
      grey900: '#212529',
      grey800: '#343A40',
      grey700: '#495057',
      grey650: '#6B737B',
      grey600: '#6C757D',
      grey500: '#ADB5BD',
      grey400: '#CED4DA',
      grey300: '#DEE2E6',
      grey200: '#E9ECEF',
      grey100: '#F8F9FA',
      red200: '#EF9A9A',
    },
    fontFamily: {
      raleway: ['var(--font-raleway)', ...fontFamily.sans],
      mont: ['var(--font-montserrat)', ...fontFamily.sans],
    },
    extend: {
      fontSize: {
        sm: '14px',
        md: '16px',
        lg: '20px',
        xl: '24px',
      },
      screen: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
      },
    },
  },
  plugins: [],
}
