/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8',
        accent: '#0ea5e9',
        'pro-base':     '#0c0f1a',
        'pro-surface':  '#111929',
        'pro-card':     '#1a2438',
        'pro-elevated': '#1f2d48',
        'pro-border':   '#2a3a56',
        'pro-gold':     '#f0c040',
        'pro-gold-dim': '#c49a20',
        'pro-text':     '#e8edf5',
        'pro-sub':      '#8a9bb8',
        'pro-muted':    '#4a5a78',
      }
    },
  },
  plugins: [],
}
