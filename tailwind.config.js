const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: false, 
  purge: [
    './src/**/*.svelte',
    './src/**/*.css',
    './public/*.html',
  ],
  theme: {
    fontFamily: {
      'title': ["QanelasSoft", 'sans'],
      'primary': ['Comfortaa', 'cursive'],
      'secondary': ['Quicksand', 'sans-serif']
    },
    extend: {
      colors: {
        gray: colors.blueGray,
        dark: "#051F45",
        primary: '#033784',
        'primary-darker': "#0A1A52",
        secondary: '#003399',
        'secondary-lighter': "#2377C5",
        tertiary: "#6BBDEB",
        action: '#2AD78B',
        'info-lighter': '#FFF9C2',
        info: '#FCDB85',
        'info-darker': '#C67E13',
        danger: "#FFC4B1",
        'smoke-darkest': 'rgba(0, 0, 0, 0.9)',
        'smoke-darker': 'rgba(0, 0, 0, 0.75)',
        'smoke-dark': 'rgba(0, 0, 0, 0.6)',
        'smoke': 'rgba(0, 0, 0, 0.5)',
        'smoke-light': 'rgba(0, 0, 0, 0.4)',
        'smoke-lighter': 'rgba(0, 0, 0, 0.25)',
        'smoke-lightest': 'rgba(0, 0, 0, 0.1)',
        'light-100': '#F4F6F9',
        'light-200': '#E9EDF1',
        'light-300': '#D0D6DF',
        'light-400': "#BBC4CC",
        'light-500': '#97A3B1'
      },
      fontSize: {
        'xxs': '.65rem'
      }
    }
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [],
};
