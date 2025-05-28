/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0d6efd',
        success: '#4ade80',
        danger: '#f87171',
        warning: '#fbbf24',
        info: '#93c5fd',
        neutral: '#e5e7eb',
      },
    },
  },
  plugins: [],
}