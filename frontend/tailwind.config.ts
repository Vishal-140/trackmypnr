import type { Config } from "tailwindcss";

// Design tokens (Section 19): a small, deliberate palette defined in one
// place. Status colors (CNF/RAC/WL) stay consistent across the status
// badge, confirmation gauge, and history timeline everywhere they appear.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
        },
        border: "var(--color-border)",
        brand: {
          DEFAULT: "var(--color-brand)",
          dark: "var(--color-brand-dark)",
          light: "var(--color-brand-light)",
        },
        accent: "var(--color-accent)",
        status: {
          cnf: "var(--color-cnf)",
          "cnf-bg": "var(--color-cnf-bg)",
          rac: "var(--color-rac)",
          "rac-bg": "var(--color-rac-bg)",
          wl: "var(--color-wl)",
          "wl-bg": "var(--color-wl-bg)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "fade-slide-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gauge-fill": {
          "0%": { strokeDashoffset: "var(--gauge-circumference)" },
          "100%": { strokeDashoffset: "var(--gauge-offset)" },
        },
        "check-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-slide-in": "fade-slide-in 0.4s ease-out both",
        "gauge-fill": "gauge-fill 0.8s ease-out 0.1s both",
        "check-pop": "check-pop 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
