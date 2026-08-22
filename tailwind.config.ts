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
        // Cyber-Cartographic Semantic Palette
        obsidian: {
          DEFAULT: "#05070a",
          sub: "#090d14",
          card: "#0d1117",
          border: "#161d2a"
        },
        tungsten: {
          DEFAULT: "#0d1117",
          card: "#121824",
          panel: "#161f2e",
          border: "#1f2b3e",
          muted: "#2e3f5c"
        },
        phosphor: {
          DEFAULT: "#00ff88",
          dim: "#00cc6a",
          glow: "rgba(0, 255, 136, 0.4)",
          dark: "#00381d"
        },
        solar: {
          DEFAULT: "#ffb700",
          dim: "#d99b00",
          glow: "rgba(255, 183, 0, 0.4)",
          dark: "#3d2c00"
        },
        cyan: {
          DEFAULT: "#00e5ff",
          dim: "#00b4cc",
          glow: "rgba(0, 229, 255, 0.4)",
          dark: "#00343d"
        },
        azure: {
          DEFAULT: "#38bdf8",
          dim: "#0284c7"
        },
        violet: {
          DEFAULT: "#a855f7",
          dim: "#9333ea"
        },
        crimson: {
          DEFAULT: "#ff0055",
          dim: "#e11d48"
        },
        steel: {
          DEFAULT: "#94a3b8",
          muted: "#64748b"
        },
        // Backward-compatible Neo tokens
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
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Cascadia Code",
          "Source Code Pro",
          "Menlo",
          "Consolas",
          "monospace"
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ]
      },
      boxShadow: {
        "glow-phosphor": "0 0 15px rgba(0, 255, 136, 0.45), 0 0 30px rgba(0, 255, 136, 0.2)",
        "glow-solar": "0 0 15px rgba(255, 183, 0, 0.45), 0 0 30px rgba(255, 183, 0, 0.2)",
        "glow-cyan": "0 0 15px rgba(0, 229, 255, 0.45), 0 0 30px rgba(0, 229, 255, 0.2)",
        "glow-violet": "0 0 15px rgba(168, 85, 247, 0.45), 0 0 30px rgba(168, 85, 247, 0.2)",
        "glow-crimson": "0 0 15px rgba(255, 0, 85, 0.45), 0 0 30px rgba(255, 0, 85, 0.2)",
        "tactical-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "tactical-active": "0 0 20px rgba(0, 255, 136, 0.25), inset 0 0 15px rgba(0, 255, 136, 0.1)",
        "neo-sm": "2px 2px 0px 0px #27272a",
        "neo": "4px 4px 0px 0px #27272a",
        "neo-lg": "6px 6px 0px 0px #27272a",
        "neo-lime": "4px 4px 0px 0px #ccff00",
        "neo-orange": "4px 4px 0px 0px #ff5500",
        "neo-blue": "4px 4px 0px 0px #3b82f6",
        "neo-white": "4px 4px 0px 0px #ffffff"
      },
      keyframes: {
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "hud-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" }
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" }
        },
        "waveform": {
          "0%": { transform: "scaleY(0.2)" },
          "100%": { transform: "scaleY(1.0)" }
        },
        ticker: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" }
        }
      },
      animation: {
        "radar-sweep": "radar-sweep 4s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "hud-blink": "hud-blink 1s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
        "waveform": "waveform 1.2s ease-in-out infinite alternate",
        "telemetry-ticker": "ticker 30s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;

export default config;
