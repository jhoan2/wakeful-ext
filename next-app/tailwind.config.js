/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'blue': colors.blue,
      'black': colors.black,
      'purple': colors.violet,
      'pink': colors.fuchsia,
      'green': colors.emerald,
      'yellow': colors.yellow,
      'gray': colors.gray,
      'slate': colors.slate,
      'red': colors.red,
      'white': colors.white,
      'amber': colors.amber,
      'orange': colors.orange
    },
    extend: {},
  },
  plugins: [],
}

