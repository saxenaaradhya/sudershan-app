/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#7C3AED',
          secondary: '#5B21B6',
          accent: '#A78BFA',
        },
        dark: {
          900: '#0A0A0F',
          800: '#ebebf5',
          700: '#1A1A24',
          600: '#24242F',
          500: '#2E2E3A',
          400: '#3A3A48',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
