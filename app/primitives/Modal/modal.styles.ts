// This file contains the keyframes and animations for the modal component and is imported into the tailwind.config.js file
export const modalKeyframes = {
  dialogOverlayShow: {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  dialogContentShow: {
    from: { opacity: "0", transform: "translate(-50%, -48%) scale(0.96)" },
    to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
  },
  dialogOverlayHide: {
    from: { opacity: "1" },
    to: { opacity: "0" },
  },
  dialogContentHide: {
    from: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
    to: { opacity: "0", transform: "translate(-50%, -48%) scale(0.96)" },
  },
};

export const modalAnimations = {
  dialogOverlayShow: "dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
  dialogContentShow: "dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
  dialogOverlayHide: "dialogOverlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
  dialogContentHide: "dialogContentHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
};
