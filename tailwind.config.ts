import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FAF5EE',
          100: '#F5E8D5',
          200: '#EBD0B0',
          300: '#DCB585',
          400: '#C99660',
          500: '#B4783D',
          600: '#9A5F2C',
          700: '#7D4C22',
          800: '#633C1C',
          900: '#4E2F16',
          950: '#281808',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark:    '#F2EAE0',
        },
        sand: '#E8DDD0',
      },
      fontFamily: {
        sans:    ['Poppins', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(90,60,30,0.08)',
        'card-hover': '0 6px 24px 0 rgba(90,60,30,0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config
