/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#f5f5f7',
          card: '#ffffff',
          text: '#1d1d1f',
          secondary: '#86868b',
          tertiary: '#a1a1a6',
          border: 'rgba(0, 0, 0, 0.08)',
          blue: '#0071e3',
          'blue-hover': '#0077ed',
          dark: '#1d1d1f',
          'dark-hover': '#333336'
        },
        agro: {
          forest: '#14532D',
          green: '#166534',
          leaf: '#4D7C0F',
          sage: '#E8F2E8',
          soil: '#795548',
          deepsoil: '#5D4037',
          cream: '#f5f5f7',
          gold: '#D4A72C'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', '-apple-system', 'sans-serif'],
        handwriting: ['Caveat', 'cursive']
      },
      letterSpacing: {
        'apple-display': '-0.022em',
        'apple-headline': '-0.015em'
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-card': '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'apple-float': '0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)'
      }
    },
  },
  plugins: [],
}
