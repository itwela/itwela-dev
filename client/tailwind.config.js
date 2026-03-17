/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'sans-serif'],
      },
      colors: {
        'mac-glass': 'rgba(255,255,255,0.08)',
        'mac-border': 'rgba(255,255,255,0.12)',
      },
      boxShadow: {
        'mac': '0 22px 70px 4px rgba(0,0,0,0.56)',
        'mac-dock': '0 8px 32px 0 rgba(0,0,0,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
