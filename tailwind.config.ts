import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import customColors from "./app/styles/colors";

export default {
    darkMode: ["class"],
    content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
                ...customColors,
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: ["Proxima-Nova", ...defaultTheme.fontFamily.sans],
  			serif: ["Merriweather", ...defaultTheme.fontFamily.serif]
  		},
  		borderWidth: {
  			'0': '0',
  			'2': '2px',
  			'3': '3px',
  			'4': '4px',
  			'6': '6px',
  			'8': '8px',
  			DEFAULT: '1px'
  		},
  		minHeight: {
  			': '.height,
                ...defaultTheme.height,: '
  		},
  		minWidth: {
  			': '.width,
                ...defaultTheme.width,: '
  		},
  		keyframes: {},
  		animation: {
  			dialogOverlayShow: 'dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			dialogContentShow: 'dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			dialogOverlayHide: 'dialogOverlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			dialogContentHide: 'dialogContentHide 150ms cubic-bezier(0.16, 1, 0.3, 1)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
