import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F5",
        creamPanel: "#EFE9E1",
        stripe: "#E7DFD3",
        dark: "#2B2926",
        button: "#000000",
        body: "#5A544C",
        body2: "#4A4642",
        footerLink: "#C9C2B8",
        copyright: "#8C857A",
        accent: "#8C7C6B",
        linkHover: "#8C6B5E",
        rule: "#D8CFC2",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        condensed: ["var(--font-barlow)", "sans-serif"],
        display: ["var(--font-bebas)", "sans-serif"],
        script: ["var(--font-aston)", "cursive"],
      },
      keyframes: {
        "search-in": {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "search-in": "search-in 220ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
