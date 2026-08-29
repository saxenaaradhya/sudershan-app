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
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          subtle: 'var(--bg-subtle)',
        },
        surface: {
          base: 'var(--bg-base)',
          card: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          subtle: 'var(--bg-subtle)',
          border: 'var(--border-subtle)',
        },
        dark: {
          900: 'var(--bg-base)',
          800: 'var(--bg-surface)',
          700: 'var(--bg-elevated)',
          600: 'var(--bg-subtle)',
          500: 'var(--border-subtle)',
          400: 'var(--text-muted)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
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
          border: 'var(--border-champagne)',
        },
        brand: {
          primary: 'var(--sage-primary)',
          secondary: 'var(--champagne-primary)',
          accent: 'var(--accent-sapphire)',
          success: 'var(--healing-success)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          sage: 'var(--border-sage)',
          champagne: 'var(--border-champagne)',
        },
        healing: {
          success: 'var(--healing-success)',
          warning: '#D97706',
          error: '#DC2626',
          calm: '#4A7C64',
          sleep: '#5B708B',
          mind: '#7C6E8F',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(21, 32, 26, 0.05)',
        'soft': '0 8px 24px -4px rgba(21, 32, 26, 0.06), 0 2px 6px -1px rgba(21, 32, 26, 0.03)',
        'soft-lg': '0 16px 36px -6px rgba(21, 32, 26, 0.08), 0 4px 12px -2px rgba(21, 32, 26, 0.04)',
        'champagne-glow': '0 4px 20px -2px rgba(191, 166, 130, 0.15)',
        'sage-glow': '0 4px 20px -2px rgba(46, 86, 67, 0.12)',
      },
      animation: {
        'breathe-slow': 'breathe 7s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}