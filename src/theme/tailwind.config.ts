import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        background: {
          surface: "#F2F0EF",
          card: "#FFFFFF",
        },
        border: {
          primary: "#E2E2E2",
        },
        content: {
          primary: "#2F2F2E",
          secondary: "#83807F",
          brand: "#1D8CD2",
          info: "#0068D4",
          success: "#2B8887",
          warning: "#C84801",
          critical: "#DF1B41",
        },
        data: {
          brand: "#1D8CD2",
          info: "#AD4796",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
