import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import customColors from "./app/styles/colors";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
  ],
  future: {
    // Enable v4 features
    hoverOnlyWhenSupported: true,
    disableColorOpacityUtilitiesByDefault: true,
    respectDefaultRingColorOpacity: true,
  },
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        "0": "0",
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "6": "6px",
        "8": "8px",
        DEFAULT: "1px",
      },
      colors: customColors,
      fontFamily: {
        sans: ["Proxima-Nova", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        h1: ["52px", { lineHeight: "120%" }], // Mobile sizes.
        h2: ["48px", { lineHeight: "120%" }], // Desktop sizes in
        h3: ["40px", { lineHeight: "120%" }], // tailwind.css heading classes.
        h4: ["28px", { lineHeight: "140%" }],
        h5: ["24px", { lineHeight: "140%" }],
        h6: ["18px", { lineHeight: "140%" }],
      },
      maxWidth: {
        "screen-content": "1432px",
      },
      minHeight: {
        ...defaultTheme.minHeight,
      },
      minWidth: {
        ...defaultTheme.minWidth,
      },
      screens: {
        "2xl": "1480px",
        "3xl": "1600px",
      },
      spacing: {
        "18": "72px",
      },
    },
  },
  plugins: [],
} satisfies Config;
