import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        neo: {
          lime: "#ccff00",
          orange: "#ff5500",
          blue: "#3b82f6",
          purple: "#a855f7",
          pink: "#ff2e93",
          dark: "#09090b",
          card: "#121217",
          border: "#27272a"
        }
      },
      boxShadow: {
        "neo-sm": "2px 2px 0px 0px #27272a",
        "neo": "4px 4px 0px 0px #27272a",
        "neo-lg": "6px 6px 0px 0px #27272a",
        "neo-lime": "4px 4px 0px 0px #ccff00",
        "neo-orange": "4px 4px 0px 0px #ff5500",
        "neo-blue": "4px 4px 0px 0px #3b82f6",
        "neo-white": "4px 4px 0px 0px #ffffff"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;

export default config;
