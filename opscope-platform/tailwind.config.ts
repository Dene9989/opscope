import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./src/**/*.{mdx}", "./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        background: "#0f141b",
        surface: "#172130",
        card: "#1b2535",
        border: "#2f3b4f",
        primary: "#1fb26b",
        primaryDark: "#158750",
        warning: "#d97706",
        danger: "#dc2626",
        muted: "#dbe3f2"
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
