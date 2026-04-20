/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'csa-primary': 'var(--csa-primary)',
        'csa-shadow': 'var(--csa-shadow)',
        'csa-arbiter': 'var(--csa-arbiter)',
        'csa-surface': 'var(--bg-surface)',
        'csa-bg': 'var(--bg-main)',
        'csa-parchment': 'var(--csa-parchment)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
