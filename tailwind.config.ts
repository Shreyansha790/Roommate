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
        border: "#e4e4e7",
        input: "#e4e4e7",
        ring: "#e05d44",
        background: "#faf9f6",
        foreground: "#18181b",
        
        cream: {
          DEFAULT: "#faf9f6",
          50: "#ffffff",
          100: "#faf9f6",
          200: "#f4f2eb",
          300: "#ebe8df",
          400: "#dedad0",
          500: "#c4beaf"
        },
        coral: {
          DEFAULT: "#e05d44",
          hover: "#cc4f37",
          50: "#fff5f3",
          100: "#ffe9e4",
          200: "#ffd5cc",
          300: "#fcae9f",
          400: "#f4826b",
          500: "#e05d44",
          600: "#cc4f37",
          700: "#ab3e29"
        },
        sage: {
          DEFAULT: "#059669",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#10b981",
          600: "#059669",
          700: "#047857"
        },
        amber: {
          DEFAULT: "#d97706",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          500: "#f59e0b",
          600: "#d97706"
        },
        ink: {
          DEFAULT: "#18181b",
          secondary: "#3f3f46",
          muted: "#71717a",
          light: "#a1a1aa",
          border: "#e4e4e7",
          card: "#ffffff"
        },
        
        // Fallback tokens cleanly remapped to Light Mode
        obsidian: {
          DEFAULT: "#faf9f6",
          sub: "#f4f2eb",
          card: "#ffffff",
          border: "#e4e4e7"
        },
        tungsten: {
          DEFAULT: "#faf9f6",
          card: "#ffffff",
          panel: "#f4f2eb",
          border: "#e4e4e7",
          muted: "#71717a"
        },
        phosphor: {
          DEFAULT: "#e05d44",
          dim: "#cc4f37",
          glow: "rgba(224, 93, 68, 0.15)",
          dark: "#fff1ee"
        },
        solar: {
          DEFAULT: "#d97706",
          dim: "#b45309",
          glow: "rgba(217, 119, 6, 0.15)",
          dark: "#fef3c7"
        },
        cyan: {
          DEFAULT: "#0284c7",
          dim: "#0369a1",
          glow: "rgba(2, 132, 199, 0.15)",
          dark: "#e0f2fe"
        },
        violet: {
          DEFAULT: "#7c3aed",
          dim: "#6d28d9"
        },
        crimson: {
          DEFAULT: "#e11d48",
          dim: "#be123c"
        },
        steel: {
          DEFAULT: "#52525b",
          muted: "#71717a"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace"
        ]
      },
      boxShadow: {
        "warm-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        "warm": "0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.03)",
        "warm-md": "0 6px 20px -2px rgba(24, 24, 27, 0.07), 0 2px 6px -1px rgba(24, 24, 27, 0.04)",
        "warm-lg": "0 12px 32px -4px rgba(24, 24, 27, 0.09), 0 4px 12px -2px rgba(24, 24, 27, 0.05)",
        "warm-coral": "0 8px 20px -3px rgba(224, 93, 68, 0.25)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;

export default config;
