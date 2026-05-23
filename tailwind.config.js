/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6ebf4',
          100: '#ccd8e9',
          500: '#00338d',
          600: '#002971',
          700: '#001f55',
        },
        background: '#f8fafc',
        surface: '#ffffff',
      }
    },
  },
  plugins: [],
}
