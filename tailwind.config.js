module.exports = {
  purge: ["./src/**/*.svelte"],
  theme: {
    fontFamily: {
      'title': ['Montserrat', 'sans-serif'],
      // 'subtitle': ['Exo 2', 'sans-serif'],
      'sans': ['Quicksand', 'sans-serif']
    },
    extend: {
      colors: {
        light: "#F5FAFF",
        dark: "#03174B",
        primary: '#0C266A',
        secondary: '#247ACA',
        action: '#2AD78B',
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
      height: {
        '14': '3.5rem' 
      },
      width: {
        '14': '3.5rem' 
      }
    }
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [],
  future: {
    // purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  }
};
