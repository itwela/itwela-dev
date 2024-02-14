/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'main': ['main'],
        'second': ['second'],
        'third': ['third'],
        'fourth': ['fourth'],
        'fifth': ['fifth'],
      },
    },
  },
  plugins: [],
}