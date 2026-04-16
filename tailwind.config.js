/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'apis-charcoal': '#121212',
        'apis-amber': '#FFBF00',
        'apis-white': '#FFFFFF',
        'apis-secondary': '#907335',
        'apis-tertiary': '#00DCFF',
        'apis-card': '#F8F9FA',
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'beehive': "url('/beehive-pattern.svg')",
      }
    },
  },
  plugins: [],
}
