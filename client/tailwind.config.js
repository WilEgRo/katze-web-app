/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'katze-gold': '#C5A059', // dorado sobrio
        'katze-dark': '#121212', // negro profundo para modo oscuro
        'katze-dark-card': '#1E1E1E', // tarjetas oscuras
        'katze-light': '#F9F9F9', // fondo claro (blanco humo)
        'katze-gray': '#888888' // texto secundario
      },
      fontFamily:{
        sans: ['Manrope', 'sans-serif']
      }
    },
  },
  plugins: [],
}

