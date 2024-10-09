import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import customColors from "./app/styles/colors";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...customColors,
      },
      fontFamily: {
        sans: ["Proxima-Nova", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      minHeight: {
        ...defaultTheme.height,
      },
      minWidth: {
        ...defaultTheme.width,
      },
      keyframes: {
        /**
         * todo: add modal animations
         */
        //...modalAnimations,
      },
      animation: {
        // modal animations
        dialogOverlayShow:
          "dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogContentShow:
          "dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogOverlayHide:
          "dialogOverlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogContentHide:
          "dialogContentHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
