/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pama: {
          yellow: '#FFB800',
          dark: '#1A1A2E',
          sidebar: '#0D1117',
          card: '#161B22',
          border: '#30363D',
        },
      },
    },
  },
  plugins: [],
}
