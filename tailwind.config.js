/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF7',
          100: '#FBF9F5',
          200: '#F5F1E9',
          300: '#F2EEE6',
          400: '#E8E2D7',
          500: '#DCD4C7',
        },
        olive: {
          50: '#F4F5F2',
          100: '#E3E6E0',
          200: '#C5CCC0',
          300: '#9DA795',
          400: '#747D68',
          500: '#676F5C',
          600: '#556050',
          700: '#4E5848',
          800: '#3E4739',
          900: '#2A3026',
        },
        charcoal: {
          DEFAULT: '#2C2A29',
          muted: '#4A4846',
          light: '#706D69',
          border: '#E2DDD5',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'arch': '140px 140px 0 0',
        'arch-full': '9999px 9999px 0 0',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'card': '0 15px 35px -5px rgba(78, 88, 72, 0.08)',
        'elevated': '0 20px 40px -10px rgba(44, 42, 41, 0.12)',
      }
    },
  },
  plugins: [],
}
