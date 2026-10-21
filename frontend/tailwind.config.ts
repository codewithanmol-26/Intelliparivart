import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#0B1F3A", // Deep Institutional Navy
          800: "#132E52",
          700: "#1E4273",
          600: "#2B5894",
          500: "#3B72B9",
          100: "#EBF3FC",
          50: "#F4F8FD",
        },
        teal: {
          500: "#0D9488",
          600: "#0F766E",
          700: "#115E59",
        },
        accent: {
          gold: "#D97706",
          emerald: "#059669",
          rose: "#E11D48",
          sky: "#0284C7",
        }
      },
    },
  },
  plugins: [],
};
export default config;
