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
        cream: {
          50: "#faf9f6",
          100: "#f5f4ef",
          200: "#ebe8df",
          300: "#ded9cc",
          400: "#ccc4b2",
          500: "#b8ad96"
        },
        coral: {
          50: "#fff5f3",
          100: "#ffe8e4",
          200: "#ffd5cd",
          300: "#ffb4a6",
          400: "#f88570",
          500: "#e05d44",
          600: "#cc4f37",
          700: "#a93e2a",
          800: "#8b3526",
          900: "#733024"
        },
        sage: {
          50: "#f2f8f5",
          100: "#e1efe8",
          200: "#c5e0d4",
          300: "#9dc9b7",
          400: "#6eab94",
          500: "#498e77",
          600: "#36725f",
          700: "#2c5c4d",
          800: "#264a3f",
          900: "#213e35"
        },
        amber: {
          50: "#fdf8ee",
          100: "#faeed6",
          200: "#f4dbac",
          300: "#ecc278",
          400: "#e2a445",
          500: "#d97706",
          600: "#b45309",
          700: "#8f3b0c",
          800: "#752f10",
          900: "#612711"
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09"
        }
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
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
        "luxury-coral": "0 12px 36px -4px rgba(224, 93, 68, 0.22), 0 4px 12px -2px rgba(224, 93, 68, 0.12)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.6)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
