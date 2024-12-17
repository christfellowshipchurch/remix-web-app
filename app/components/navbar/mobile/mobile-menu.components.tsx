import Icon from "~/primitives/icon";
import { useState, useEffect } from "react";
import MobileMenuContent from "./mobile-menu-content";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
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
        className={`fixed top-18 inset-0 bg-white z-50 transform transition-all duration-300 overflow-y-auto
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
