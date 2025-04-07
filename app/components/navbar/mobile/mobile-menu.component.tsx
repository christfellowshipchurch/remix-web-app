import Icon from "~/primitives/icon";
import { useState, useEffect } from "react";
import MobileMenuContent from "./mobile-menu-content";
import { useHydrated } from "~/hooks/use-hydrated";
import { useAuth } from "~/providers/auth-provider";
import { Button } from "~/primitives/button/button.primitive";
import { MobileSearch } from "./search/mobile-search.component";
import { useResponsive } from "~/hooks/use-responsive";
const mobileMenuButtonStyle =
  "cursor-pointer transition-colors duration-300 active:scale-95 active:opacity-80";

export default function MobileMenu({
  mode,
  setMode,
}: {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [orginalMode, setOrginalMode] = useState(mode);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isHydrated = useHydrated();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { isMedium } = useResponsive();

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (!isHydrated) return;

    if (isOpen || isSearchOpen) {
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
      className={`lg:hidden ${
        mode === "light" ? "text-[#727272]" : "text-white"
      }`}
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
        className={`fixed md:top-[90px] inset-0 bg-black/50 z-10 transition-opacity duration-300 lg:hidden
          ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Search & Menu Buttons */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <Button className="font-semibold text-base">
            <Icon name="mapFilled" size={20} className="mr-2" />
            Find a Service
          </Button>
        </div>
        <button
          className={mobileMenuButtonStyle}
          onClick={() => {
            setIsSearchOpen(!isSearchOpen);
            setTimeout(() => {
              setMode(
                orginalMode === "dark" && isMedium
                  ? !isSearchOpen
                    ? "light"
                    : "dark"
                  : orginalMode
              );
            }, 0);
            setIsOpen(false);
            setTimeout(() => {
              const searchInput = document.querySelector(
                ".ais-SearchBox-input"
              );
              if (searchInput instanceof HTMLInputElement) {
                searchInput.focus();
              }
            }, 0);
          }}
        >
          <Icon name="search" size={20} className="mb-[2px]" />
        </button>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setMode(
              orginalMode === "dark" && isMedium
                ? !isOpen
                  ? "light"
                  : "dark"
                : orginalMode
            );
            setIsSearchOpen(false);
          }}
          className={mobileMenuButtonStyle}
        >
          <Icon
            name={isOpen ? "x" : "menu"}
            size={isOpen ? 30 : 24}
            className={`${!isOpen && "mr-[6px]"}`}
          />
        </button>
      </div>

      {/* Menu Content */}
      <div
        className={`fixed top-0 md:top-[90px] right-0 w-4/5 max-w-[400px] h-full bg-white z-50 transform transition-all duration-300 overflow-y-auto
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
          <MobileMenuContent
            closeMenu={() => setIsOpen(false)}
            auth={{
              authLoading,
              logout,
              user,
            }}
          />
        </div>
      </div>

      {/* Search Open */}
      <div
        className={`fixed top-0 md:top-[90px] right-0 w-full h-full bg-white z-50 transform transition-all duration-300 overflow-y-auto
          ${
            !isSearchOpen
              ? "translate-x-full invisible opacity-0"
              : "translate-x-0 visible opacity-100"
          }`}
      >
        <div
          className={`h-full flex flex-col transition-opacity duration-500
            ${isSearchOpen ? "opacity-100" : "opacity-0"}`}
        >
          <MobileSearch mode={mode} setIsSearchOpen={setIsSearchOpen} />
        </div>
      </div>
    </div>
  );
}
