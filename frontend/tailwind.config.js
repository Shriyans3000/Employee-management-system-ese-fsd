export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: '#f0f0f0',
          yellow: '#fcee0a',
          pink: '#ff90e8',
          blue: '#90c2ff',
          green: '#bbf089',
          orange: '#ff8a5b',
          black: '#000000',
          white: '#ffffff',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'brutal-active': '0px 0px 0px 0px rgba(0,0,0,1)', // For active state
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'], // Or just standard heavy sans
      }
    },
  },
  plugins: [],
}
