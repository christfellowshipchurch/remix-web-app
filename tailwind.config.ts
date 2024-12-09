const plugin = require("tailwindcss/plugin");
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
import { desktopHeadings } from "./app/styles/desktopHeadings";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("@relume_io/relume-tailwind")],
  theme: {
    extend: {
      fontSize: {
        h1: ["40px", { lineHeight: "120%" }], // Mobile sizes
        h2: ["36px", { lineHeight: "120%" }],
        h3: ["32px", { lineHeight: "120%" }],
        h4: ["24px", { lineHeight: "140%" }],
        h5: ["20px", { lineHeight: "140%" }],
        h6: ["18px", { lineHeight: "140%" }],
      },
      colors: {
        /** Our CF Branded Color */
        ...customColors,
        /** Shadcn Colors */
        /** Note: Removed colors that would interfere with the CF Branded Colors */
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["Proxima-Nova", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
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
      minHeight: {
        ...defaultTheme.minHeight,
      },
      minWidth: {
        ...defaultTheme.minWidth,
      },
      keyframes: {
        ...navbarKeyframes,
        ...modalKeyframes,
      },
      animation: {
        ...navbarAnimations,
        ...modalAnimations,
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(
      ({
        matchUtilities,
      }: {
        matchUtilities: (utilities: Record<string, any>) => void;
      }) => {
        matchUtilities({
          perspective: (value: any) => ({
            perspective: value,
          }),
        });
      }
    ),
    desktopHeadings, // Adds desktop headings sizes
  ],
} satisfies Config;
