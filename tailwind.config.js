/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui : {
    color : [
      {
        mytheme : {
          primary: '#1E40AF', // Biru gelap
          secondary: '#9333EA',
          accent: '#14B8A6',
          neutral: '#3D4451',
          'base-100': '#FFFFFF',
        }
      }
    ]
  }
}

