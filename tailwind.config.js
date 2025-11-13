/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vibe-dark': '#0f0f23',
        'vibe-darker': '#0a0a1a',
        'vibe-blue': '#3b82f6',
        'vibe-blue-light': '#60a5fa',
        'vibe-gray': '#374151',
        'vibe-gray-light': '#6b7280',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
