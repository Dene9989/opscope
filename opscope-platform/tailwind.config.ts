import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./src/**/*.{mdx}", "./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        background: "#0b0f14",
        surface: "#121823",
        card: "#161d2a",
        border: "#243042",
        primary: "#1fb26b",
        primaryDark: "#158750",
        warning: "#d97706",
        danger: "#dc2626",
        muted: "#8b98a9"
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
