import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import customColors from "./app/styles/colors";
import {
  navbarAnimations,
  navbarKeyframes,
} from "./app/components/navbar/navbar.styles";
import {
  modalAnimations,
  modalKeyframes,
} from "./app/primitives/Modal/modal.styles";
import { desktopHeadings } from "./app/styles/desktop-headings";

import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    // Enable v4 features
    hoverOnlyWhenSupported: true,
    disableColorOpacityUtilitiesByDefault: true,
    respectDefaultRingColorOpacity: true,
  },
  theme: {
    extend: {
      animation: {
        ...navbarAnimations,
        ...modalAnimations,
        gradient: "gradient 3s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-in-out",
        "slide-out": "slide-out 0.3s ease-in-out",
      },
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
        h1: ["52px", { lineHeight: "120%" }], // These are mobile sizes.
        h2: ["48px", { lineHeight: "120%" }], // See desktop-headings.ts
        h3: ["40px", { lineHeight: "120%" }], // below for desktop.
        h4: ["28px", { lineHeight: "140%" }],
        h5: ["24px", { lineHeight: "140%" }],
        h6: ["18px", { lineHeight: "140%" }],
      },
      keyframes: {
        ...navbarKeyframes,
        ...modalKeyframes,
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
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
    screens: {
      shorter: { raw: "(max-height: 900px)" },
    },
  },
  plugins: [tailwindcssAnimate, desktopHeadings],
} satisfies Config;
