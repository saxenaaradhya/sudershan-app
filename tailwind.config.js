/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
          success: 'var(--brand-success)',
        },
        dark: {
          900: 'var(--bg-900)',
          800: 'var(--bg-800)',
          700: 'var(--bg-700)',
          600: 'var(--bg-600)',
          500: 'var(--bg-500)',
          400: 'var(--bg-400)',
        },
        surface: {
          base: 'var(--bg-900)',
          elevated: 'var(--bg-800)',
          hover: 'var(--bg-700)',
          border: 'var(--border-subtle)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          subtle: 'var(--bg-subtle)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          sage: 'var(--border-sage)',
          champagne: 'var(--border-champagne)',
        },
        sage: {
          DEFAULT: 'var(--sage-primary)',
          hover: 'var(--sage-hover)',
          light: 'var(--sage-light)',
          surface: 'var(--sage-surface)',
        },
        champagne: {
          DEFAULT: 'var(--champagne-primary)',
          light: 'var(--champagne-light)',
          surface: 'var(--champagne-surface)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}