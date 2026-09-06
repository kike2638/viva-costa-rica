/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#f7f5f0', 100: '#efe9dc', 500: '#a67c52', 600: '#8c6239', 700: '#6b4a2b', 800: '#4a3320', 900: '#2e1f14' },
        terra: { 50: '#f4f1ec', 100: '#e8ddd0', 300: '#c8ad8a', 500: '#a67c52', 600: '#8c6239', 700: '#6b4a2b', 800: '#3d2b1f', 900: '#1a120e' },
        gold: { 400: '#d4a574', 500: '#c9953c', 600: '#b0802e' },
        emerald: { 500: '#1a4d3e', 600: '#143c30' },
        dark: '#1a120e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

