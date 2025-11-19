/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0C10",
        card: "#131722",
        neonCyan: "#00E5FF",
        imposterRed: "#FF2E2E",
        neutralGray: "#A7A9BE"
      },
      borderRadius: {
        card: "8px"
      },
      fontFamily: {
        hacker: ["Consolas", "Courier New", "monospace"]
      },
      boxShadow: {
        neonCyan: "0 0 10px #00E5FF80",
        neonRed: "0 0 10px #FF2E2E80"
      }
    },
  },
  plugins: [],
};
