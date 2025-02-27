import Icon from "~/primitives/icon";
import { useState, useEffect } from "react";
import MobileMenuContent from "./mobile-menu-content";
import { useHydrated } from "~/hooks/use-hydrated";

export default function MobileMenu({ mode }: { mode: "light" | "dark" }) {
  const [isOpen, setIsOpen] = useState(false);
  const isHydrated = useHydrated();

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (!isHydrated) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isHydrated]);

  return (
    <div
      className={`lg:hidden ${mode === "light" ? "text-ocean" : "text-white"}`}
    >
      {/* Back Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="text-white fixed left-4 top-1/2 -translate-y-1/2 z-[60] pointer-events-auto"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        aria-label="Close menu"
      >
        <Icon name="chevronLeft" size={50} />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-10 transition-opacity duration-300 lg:hidden
          ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 cursor-pointer transition-colors duration-300"
      >
        <Icon name="search" size={20} className="mb-[2px]" />
        <Icon name="menu" />
      </button>

      {/* Menu Content */}
      <div
        className={`fixed top-0 right-0 w-4/5 max-w-[400px] h-full bg-white z-50 transform transition-all duration-300 overflow-y-auto
          ${
            !isOpen
              ? "translate-x-full invisible opacity-0"
              : "translate-x-0 visible opacity-100"
          }`}
      >
        <div
          className={`h-full flex flex-col transition-opacity duration-500
            ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          <MobileMenuContent />
        </div>
      </div>
    </div>
  );
}
