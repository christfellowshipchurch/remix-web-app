/**
 * Add this function to tailwind.config.ts to add desktop headings sizes
 */

export function desktopHeadings({
  addComponents,
}: {
  addComponents: (components: Record<string, any>) => void;
}) {
  addComponents({
    ".heading-h1": {
      "@apply text-h1 font-bold": {}, // Mobile
      "@screen lg": {
        fontSize: "100px",
        lineHeight: "120%",
      },
    },
    ".heading-h2": {
      "@apply text-h2 font-bold": {},
      "@screen lg": {
        fontSize: "52px",
        lineHeight: "120%",
      },
    },
    ".heading-h3": {
      "@apply text-h3 font-bold": {},
      "@screen lg": {
        fontSize: "32px",
        lineHeight: "120%",
      },
    },
    ".heading-h4": {
      "@apply text-h4 font-bold": {},
      "@screen lg": {
        fontSize: "24px",
        lineHeight: "130%",
      },
    },
    ".heading-h5": {
      "@apply text-h5 font-bold": {},
      "@screen lg": {
        fontSize: "18px",
        lineHeight: "140%",
      },
    },
    ".heading-h6": {
      "@apply text-h6 font-bold": {},
      "@screen lg": {
        fontSize: "16px",
        lineHeight: "140%",
      },
    },
  });
}
