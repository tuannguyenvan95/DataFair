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
        dark: {
          950: '#030712',
          900: '#070c18',
          850: '#0c1322',
          800: '#111b2e',
          750: '#17233a',
          700: '#1e2c47',
          600: '#2c3e61',
        },
        cyber: {
          blue: '#00e5ff',
          neon: '#38bdf8',
          purple: '#a855f7',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'SF Mono', 'Courier New', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 15px -3px rgba(0, 229, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px 2px rgba(0, 229, 255, 0.5)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
