import { cva } from "class-variance-authority";

export const navbarKeyframes = {
  enterFromRight: {
    from: { opacity: "0", transform: "translateX(200px)" },
    to: { opacity: "1", transform: "translateX(0)" },
  },
  enterFromLeft: {
    from: { opacity: "0", transform: "translateX(-200px)" },
    to: { opacity: "1", transform: "translateX(0)" },
  },
  exitToRight: {
    from: { opacity: "1", transform: "translateX(0)" },
    to: { opacity: "0", transform: "translateX(200px)" },
  },
  exitToLeft: {
    from: { opacity: "1", transform: "translateX(0)" },
    to: { opacity: "0", transform: "translateX(-200px)" },
  },
  scaleIn: {
    from: { opacity: "0", transform: "rotateX(-10deg) scale(0.9)" },
    to: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
  },
  scaleOut: {
    from: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
    to: { opacity: "0", transform: "rotateX(-10deg) scale(0.95)" },
  },
  fadeIn: {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  fadeOut: {
    from: { opacity: "1" },
    to: { opacity: "0" },
  },
};

export const navbarAnimations = {
  scaleIn: "scaleIn 200ms ease",
  scaleOut: "scaleOut 200ms ease",
  fadeIn: "fadeIn 200ms ease",
  fadeOut: "fadeOut 200ms ease",
  enterFromLeft: "enterFromLeft 250ms ease",
  enterFromRight: "enterFromRight 250ms ease",
  exitToLeft: "exitToLeft 250ms ease",
  exitToRight: "exitToRight 250ms ease",
};

export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:border-b-3 border-ocean text-base font-bold"
);

export const navigationMenuContentStyle = cva(
  "fixed top-[83px] left-0 data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto"
);

export const angleDownIconStyle = cva(
  "relative top-[1px] ml-0 lg:ml-1 size-4 lg:size-6 transition duration-200 group-data-[state=open]:rotate-180"
);
