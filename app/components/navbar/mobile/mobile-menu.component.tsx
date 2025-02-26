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
      className={`md:hidden ${
        mode === "light" ? "text-neutral-dark" : "text-white"
      }`}
    >
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1"
      >
        <Icon name={!isOpen ? "menuAltLeft" : "logout"} />
        {!isOpen ? "Menu" : "Back"}
      </button>

      {/* Menu Content */}
      <div
        className={`fixed top-18 right-0 w-4/5 h-full bg-white z-50 transform transition-all duration-300 overflow-y-auto
          ${
            !isOpen
              ? "translate-x-full invisible opacity-0"
              : "translate-x-0 visible opacity-100"
          }`}
      >
        <div
          className={`p-4 h-full flex flex-col transition-opacity duration-500
            ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          <MobileMenuContent />
        </div>
      </div>
    </div>
  );
}
