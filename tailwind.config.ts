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
import { desktopHeadings } from "./app/styles/desktop-headings";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // TODO: Fix this - its currently overriding some of our styles(max-w-screen)
  // presets: [require("@relume_io/relume-tailwind")],
  theme: {
    extend: {
      animation: {
        ...navbarAnimations,
        ...modalAnimations,
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
      colors: {
        /** Our CF Branded Color */
        ...customColors,
        /** Shadcn Colors */
        /** Note: Removed colors that would interfere with the CF Branded Colors */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        foreground: "hsl(var(--foreground))",
        input: "hsl(var(--input))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        ring: "hsl(var(--ring))",
      },
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
      },
      maxWidth: {
        "screen-content": "1428px", // this is our default max width for content on the site
      },
      minHeight: {
        ...defaultTheme.minHeight,
      },
      minWidth: {
        ...defaultTheme.minWidth,
      },
      spacing: {
        "18": "72px",
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
