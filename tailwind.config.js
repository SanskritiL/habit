/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50: '#f0faf9',
          100: '#e0f7f6',
          200: '#b0e5e2',
        },
      }
    },
  },
  safelist: [
    'bg-blue-500',
    'bg-blue-600',
    'bg-green-500',
    'bg-green-600',
    'bg-purple-500',
    'bg-purple-600',
    'bg-pink-500',
    'bg-pink-600',
    'bg-orange-500',
    'bg-orange-600',
    'bg-teal-500',
    'bg-teal-600',
    'bg-indigo-500',
    'bg-indigo-600',
    'bg-rose-500',
    'bg-rose-600'
  ],
  plugins: [],
}