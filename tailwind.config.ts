import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plaster: {
          50: "#faf9f6",
          100: "#f5f4ef",
          200: "#eae7dd",
          300: "#ded9cb",
          400: "#c7bfa9",
          500: "#aba084",
          900: "#242017"
        },
        coral: {
          500: "#d95338",
          600: "#c2442b",
          700: "#9e3420"
        },
        obsidian: {
          800: "#1f1f1f",
          900: "#141414",
          950: "#0a0a0a"
        },
        cream: {
          50: "#faf9f6",
          100: "#f5f4ef",
          200: "#ebe8df",
          300: "#ded9cc",
          400: "#ccc4b2",
          500: "#b8ad96"
        },
        sage: {
          50: "#f2f8f5",
          100: "#e1efe8",
          200: "#c5e0d4",
          500: "#498e77",
          600: "#36725f"
        },
        amber: {
          50: "#fdf8ee",
          100: "#faeed6",
          500: "#d97706",
          600: "#b45309"
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif"
        ],
        serif: [
          '"Newsreader"',
          '"Playfair Display"',
          "Georgia",
          "Cambria",
          "serif"
        ]
      },
      boxShadow: {
        "luxury-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 1px 4px -1px rgba(0, 0, 0, 0.02)",
        "luxury": "0 8px 30px -4px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "luxury-lg": "0 20px 48px -8px rgba(0, 0, 0, 0.07), 0 8px 20px -4px rgba(0, 0, 0, 0.04)",
        "luxury-coral": "0 12px 36px -4px rgba(217, 83, 56, 0.25), 0 4px 12px -2px rgba(217, 83, 56, 0.12)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.6)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
