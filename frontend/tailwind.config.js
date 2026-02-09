/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a0a0c",
        secondary: "#16161a",
        accent: {
          safe: "#00ff88", // Neon Green
          danger: "#ff4444", // Neon Red
          ai: "#6366f1", // Purple/Indigo
          cyan: "#00f2ff",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'safe-gradient': 'linear-gradient(to bottom right, #000000, #064e3b, #00f2ff)',
        'danger-gradient': 'linear-gradient(to bottom right, #000000, #7f1d1d, #991b1b)',
        'neutral-gradient': 'linear-gradient(to bottom right, #000000, #1e1e2e, #312e81)',
      },
    },
  },
  plugins: [],
}
