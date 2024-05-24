import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    screens: {
      sm: "735px",
      md: "950px",
      lg: "1200px",
    },
    extend: {
      colors: {
        background: {
          body: "#F1F1F1",
          surface: "#F4F2F1",
          orange: "#FFEADE",
          disabled: "#F4F4F5",
          muted: "#34343419",
        },
        border: {
          primary: "#E2E2E2",
        },
        content: {
          primary: "#2F2F2E",
          secondary: "#83807F",
          disabled: "#83807F8C",
        },
        semantic: {
          brand: "#1D8CD2",
          info: "#0570DE",
          success: "#2CA237",
          warning: "#C84801",
          critical: "#DF1B41",
        },
        data: {
          series1: "#1D8CD2",
          series2: "#FB9318",
          series3: "#AD4796",
          series4: "#5547AD",
          series5: "#8CAD47",
          series6: "#47ADA1",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        0: "0px 0px 2px 0px rgba(9, 9, 11, 0.05)",
        1: "0px 1px 1px 0px rgba(9, 9, 11, 0.04), 0px 0px 4px 0px rgba(9, 9, 11, 0.02), 0px 0px 8px 0px rgba(9, 9, 11, 0.04)",
        2: "0px -1px 10px 2px rgba(9, 9, 11, 0.05)",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
