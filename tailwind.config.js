/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        Green: '#576032',
        LightGreen: '#ACB195',
        White: '#FFF8EF',
        Title: '#FEF9E0',
        Red: '#E13D3D',
        Yellow: '#E1B33D',
        Grey: '#777777',
        Black: '#0C0C0C',
        Modal: '#0C0C0C50',
        Blue: '#3D57E1',
      },
    },
  },
  extend: {},
  plugins: [],
}
