/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
      backgroundImage: {
        'solda-background': "url('./public/soldadin.jpg')",
      },
    },
    colors:{
      'navbar': '#364150',
      'headerColor': '#578ebe',
      'successBtn':'#32c5d2',
      'section':'#eef1f5',
      'background': '#FFFFFF',
      'delpRed':'#dc1011',
      'delpRedHover':'#BD2223'
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

