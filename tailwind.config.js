/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0F1A',
        'bg-secondary': '#121826',
        'bg-tertiary': '#1C2436',
        'accent-blue': '#2563EB',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        'border-primary': '#1E293B',
        primary: "#0d59f2",
        secondary: "#6366f1",
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
      keyframes: {
        'emoji-float': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '70%': { transform: 'translateY(-60vh) scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'translateY(-80vh) scale(0.8)', opacity: '0' },
        },
        'wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(14deg)' },
          '30%': { transform: 'rotate(-8deg)' },
          '40%': { transform: 'rotate(14deg)' },
          '50%': { transform: 'rotate(-4deg)' },
          '60%': { transform: 'rotate(10deg)' },
          '70%': { transform: 'rotate(0deg)' },
        },
        'music-bar-1': {
          '0%, 100%': { height: '4px' },
          '50%': { height: '12px' },
        },
        'music-bar-2': {
          '0%, 100%': { height: '8px' },
          '50%': { height: '4px' },
        },
        'music-bar-3': {
          '0%, 100%': { height: '12px' },
          '50%': { height: '6px' },
        },
      },
      animation: {
        'emoji-float': 'emoji-float 3s ease-out forwards',
        'wave': 'wave 1s ease-in-out infinite',
        'music-bar-1': 'music-bar-1 0.8s ease-in-out infinite',
        'music-bar-2': 'music-bar-2 0.6s ease-in-out infinite',
        'music-bar-3': 'music-bar-3 0.7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
