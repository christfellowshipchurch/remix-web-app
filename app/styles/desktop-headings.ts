/**
 * Add this function to tailwind.config.ts to add desktop headings sizes
 */

interface TailwindPluginParams {
  addComponents: (components: Record<string, Record<string, unknown>>) => void;
  theme: (path: string) => string;
}

export function desktopHeadings({
  addComponents,
  theme,
}: TailwindPluginParams) {
  addComponents({
    ".heading-h1": {
      "@apply text-h1 font-extrabold": {}, // Mobile
      [`@media (min-width: ${theme("screens.lg")})`]: {
        fontSize: "100px",
        lineHeight: "100%",
      },
    },
    ".heading-h2": {
      "@apply text-h2 font-extrabold": {},
      [`@media (min-width: ${theme("screens.lg")})`]: {
        fontSize: "52px",
        lineHeight: "100%",
      },
    },
    ".heading-h3": {
      "@apply text-h3 font-extrabold": {},
      [`@media (min-width: ${theme("screens.lg")})`]: {
        fontSize: "32px",
        lineHeight: "100%",
      },
    },
    ".heading-h4": {
      "@apply text-h4 font-extrabold": {},
      [`@media (min-width: ${theme("screens.lg")})`]: {
        fontSize: "24px",
        lineHeight: "130%",
      },
    },
    ".heading-h5": {
      "@apply text-h5 font-extrabold": {},
      [`@media (min-width: ${theme("screens.lg")})`]: {
        fontSize: "18px",
        lineHeight: "140%",
      },
    },
    ".heading-h6": {
      "@apply text-h6 font-extrabold": {},
      [`@media (min-width: ${theme("screens.lg")})`]: {
        fontSize: "16px",
        lineHeight: "140%",
      },
    },
  });
}
