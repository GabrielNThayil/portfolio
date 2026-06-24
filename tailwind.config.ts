import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-space)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-inter)", "ui-sans-serif", "system-ui"]
      },
      colors: {
        void: "#05060f",
        plasma: "#ff5df7",
        ion: "#32d7ff",
        aurora: "#78ffb7",
        ember: "#f7b955"
      },
      boxShadow: {
        glow: "0 0 40px rgba(50, 215, 255, 0.22)",
        magenta: "0 0 46px rgba(255, 93, 247, 0.2)"
      }
    }
  },
  plugins: []
};

export default config;
