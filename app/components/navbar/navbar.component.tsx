import { useLocation, Outlet } from "react-router-dom";
import { useRouteLoaderData } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useResponsive } from "~/hooks/use-responsive";
import lowerCase from "lodash/lowerCase";

import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { MenuContent } from "./desktop/menu-content.component";
import MobileMenu from "./mobile/mobile-menu.component";
import { SearchBar } from "./desktop/search/search.component";

import { cn } from "~/lib/utils";
import { shouldUseDarkMode } from "./navbar-routes";
// Data
import {
  mainNavLinks,
  ministriesData,
  watchReadListenData,
} from "./navbar.data";
import { MenuLink } from "./types";
import { SiteBanner } from "../site-banner";
import { RootLoaderData } from "~/routes/navbar/loader";
import { AuthModal } from "../modals";
import { useNavbarVisibility } from "~/providers/navbar-visibility-context";

export function Navbar() {
  // Hooks and state
  const { pathname } = useLocation();
  const rootData = useRouteLoaderData("root") as RootLoaderData;
  const { siteBanner, ministries, watchReadListen } = rootData || {};
  const { isSmall, isLarge, isXLarge } = useResponsive();
  const navbarRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);

  // State management
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Theme mode state
  let initialMode: "light" | "dark";
  if (pathname === "/") {
    initialMode = isSmall ? "dark" : "light";
  } else {
    initialMode = shouldUseDarkMode(pathname) ? "dark" : "light";
  }
  const [defaultMode, setDefaultMode] = useState<"light" | "dark">(initialMode);
  const [mode, setMode] = useState<"light" | "dark">(defaultMode);

  const [showSiteBanner, setShowSiteBanner] = useState<boolean>(false);

  const { setIsNavbarVisible } = useNavbarVisibility();

  // Click outside detection to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    if (siteBanner && siteBanner?.content?.length > 0) {
      setShowSiteBanner(true);
    }
  }, [siteBanner]);

  // Scroll handling effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;
      const scrollDelta = currentScrollY - lastScrollY;

      // Reset at top of page
      if (currentScrollY < scrollThreshold) {
        let shouldShow = true;
        if (pathname === "/" && isSmall && heroScrollRef.current) {
          const node = heroScrollRef.current;
          const atBottom =
            node.scrollHeight - node.scrollTop - node.clientHeight < 10;
          if (atBottom) {
            shouldShow = false;
          }
        }
        setIsVisible(shouldShow);
        setIsSearchOpen(false);
        if (pathname === "/" && isSmall) {
          setMode("dark");
        } else {
          setMode(defaultMode);
        }
        setLastScrollY(currentScrollY);
        return;
      }

      // Handle scroll direction
      if (Math.abs(scrollDelta) > scrollThreshold) {
        setIsVisible(scrollDelta < 0);
        if (currentScrollY > scrollThreshold) {
          if (pathname === "/" && isSmall) {
            if (scrollDelta < 0) {
              // Scrolling up, show navbar in light mode
              setMode("light");
            } else {
              // Scrolling down, keep current mode (handled by hero scroll)
              // Optionally, you could setMode("light") or do nothing
            }
          } else if (pathname !== "/") {
            setMode(scrollDelta < 0 ? "light" : "dark");
          } else {
            setMode(defaultMode);
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, defaultMode, pathname, isSmall]);

  // Initial mode setup
  useEffect(() => {
    if (pathname === "/") {
      setDefaultMode(isSmall ? "dark" : "light");
    } else {
      setDefaultMode(shouldUseDarkMode(pathname) ? "dark" : "light");
    }
  }, [pathname, isSmall]);

  // Route change handling
  useEffect(() => {
    let newMode: "light" | "dark";
    // If on home page, set mode based on screen size
    if (pathname === "/") {
      newMode = isSmall ? "dark" : "light";
    } else {
      newMode = shouldUseDarkMode(pathname) ? "dark" : "light";
    }
    setDefaultMode(newMode);
    setMode(newMode);
    setLastScrollY(0);
    setIsVisible(true);
  }, [pathname, isSmall]);

  // Mode sync effect
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  useEffect(() => {
    setIsNavbarVisible(isVisible);
  }, [isVisible, setIsNavbarVisible]);

  // Menu data
  const menuLinks: MenuLink[] = [
    {
      title: "Get Involved",
      content: {
        mainContent: ministriesData.content?.mainContent ?? [],
        featureCards: ministries?.featureCards ?? [],
      },
    },
    {
      title: "Media",
      content: {
        mainContent: watchReadListenData.content?.mainContent ?? [],
        featureCards: watchReadListen?.featureCards ?? [],
      },
    },
  ];

  // Search handling
  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setOpenDropdown(null); // Close any open dropdown
    setTimeout(() => {
      const searchInput = document.querySelector(".ais-SearchBox-input");
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus();
      }
    }, 0);
  };

  // Dropdown handling
  const handleDropdownToggle = (dropdownTitle: string) => {
    if (openDropdown === dropdownTitle) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownTitle);
      setIsSearchOpen(false); // Close search when opening dropdown
    }
  };

  useEffect(() => {
    if (pathname !== "/") return; // Only on home page
    if (!isSmall) return; // Only for small screens

    const node = heroScrollRef.current;
    if (!node) return;

    const handleHeroScroll = () => {
      const atTop = node.scrollTop < 10;
      const atBottom =
        node.scrollHeight - node.scrollTop - node.clientHeight < 10;
      if (atBottom) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
        if (atTop) {
          setMode("dark");
        } else {
          setMode("light");
        }
      }
    };

    node.addEventListener("scroll", handleHeroScroll, { passive: true });
    // Set initial mode and visibility based on current scroll position
    handleHeroScroll();

    return () => node.removeEventListener("scroll", handleHeroScroll);
  }, [pathname, isSmall, heroScrollRef]);

  // Pass the ref to the Outlet context
  return (
    <>
      <nav
        className={cn(
          "group w-full sticky top-0 z-400 transition-transform duration-300",
          !isVisible && "-translate-y-full"
        )}
        ref={navbarRef}
      >
        <div className={cn(showSiteBanner ? "block" : "hidden")}>
          <SiteBanner
            content={siteBanner?.content ?? ""}
            onClose={() => setShowSiteBanner(false)}
          />
        </div>
        <div
          className={cn(
            "w-full content-padding transition-colors duration-200",
            mode === "light"
              ? "bg-white shadow-sm"
              : openDropdown
              ? "bg-white shadow-sm"
              : "bg-transparent group-hover:bg-white"
          )}
        >
          <div
            className={cn(
              "max-w-screen-content mx-auto flex justify-between items-center font-bold py-5"
            )}
            style={{ gap: isSearchOpen ? "32px" : "0px" }}
          >
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center gap-8">
              <a
                href="/"
                className="relative flex items-center justify-center gap-2.5"
              >
                <Icon
                  name="logo"
                  className={cn(
                    "size-32 my-[-48px] transition-colors duration-200",
                    mode === "light"
                      ? "text-ocean"
                      : openDropdown
                      ? "text-ocean"
                      : "text-white group-hover:text-ocean"
                  )}
                />
              </a>

              {/* Desktop Navigation Menu */}
              <div
                className="hidden lg:inline"
                style={{
                  display: isSearchOpen ? "none" : isLarge ? "inline" : "none",
                }}
              >
                <nav className="flex items-center space-x-6 xl:space-x-10">
                  {mainNavLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      className={cn(
                        "transition-colors xl:text-lg",
                        mode === "light"
                          ? "text-neutral-dark"
                          : openDropdown
                          ? "text-neutral-dark"
                          : "text-white group-hover:text-text"
                      )}
                    >
                      <span className="hover:text-ocean">{link.title}</span>
                    </a>
                  ))}

                  {menuLinks.map((menuLink) =>
                    menuLink.content ? (
                      <div key={menuLink.title} className="relative">
                        <button
                          onClick={() => handleDropdownToggle(menuLink.title)}
                          className={cn(
                            "transition-colors xl:text-lg cursor-pointer",
                            openDropdown === menuLink.title &&
                              "border-b-3 border-ocean",
                            mode === "light"
                              ? "text-neutral-dark"
                              : openDropdown
                              ? "text-neutral-dark"
                              : "text-white group-hover:text-text"
                          )}
                        >
                          <span className="hover:text-ocean flex items-center gap-1">
                            {menuLink.title}
                            <Icon
                              name="chevronDown"
                              className={cn(
                                "relative top-[1px] size-4 lg:size-6 transition duration-200",
                                openDropdown === menuLink.title && "rotate-180"
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </button>

                        {openDropdown === menuLink.title && (
                          <div
                            className={cn(
                              "fixed top-[82px] left-0 w-full bg-white shadow-sm border-t border-gray-100 z-50",
                              "animate-in slide-in-from-top-2 duration-200"
                            )}
                          >
                            <MenuContent
                              menuType={lowerCase(menuLink.title)}
                              isLoading={false}
                              mainContent={menuLink.content.mainContent}
                              featureCards={menuLink.content.featureCards}
                            />
                          </div>
                        )}
                      </div>
                    ) : null
                  )}
                </nav>
              </div>
            </div>

            {/* Desktop Actions */}
            <div
              className="hidden lg:flex items-center gap-1 ml-2 xl:ml-0"
              style={{
                width: isSearchOpen ? "100%" : "auto",
                alignItems: isSearchOpen ? "end" : "center",
                justifyContent: isSearchOpen ? "space-between" : "start",
                height: isSearchOpen ? "52px" : "auto",
              }}
            >
              <div
                style={{
                  display: isSearchOpen ? "block" : "none",
                  width: "100%",
                }}
              >
                <SearchBar
                  mode={mode}
                  isSearchOpen={isSearchOpen}
                  setIsSearchOpen={setIsSearchOpen}
                />
              </div>

              {!isSearchOpen && (
                <button
                  onClick={handleSearchClick}
                  className="flex items-center"
                >
                  <Icon
                    name="search"
                    className={cn(
                      "hover:text-ocean transition-colors cursor-pointer size-4 xl:size-5",
                      mode === "light"
                        ? "text-neutral-dark"
                        : openDropdown
                        ? "text-neutral-dark"
                        : "text-white group-hover:text-text"
                    )}
                  />
                </button>
              )}

              {(!isSearchOpen || isXLarge) && (
                <div className="flex gap-2">
                  <AuthModal
                    buttonStyle={cn(
                      "font-semibold text-sm xl:text-base w-[70px] xl:w-[90px] py-2 min-h-0 h-auto px-0 min-w-0 cursor-pointer hover:text-ocean",
                      mode === "dark" &&
                        !openDropdown &&
                        "border-white text-white group-hover:text-ocean group-hover:border-ocean"
                    )}
                    buttonText="Login"
                  />
                  <Button
                    href="/locations"
                    className="font-semibold text-sm xl:text-base w-[150px] xl:w-[190px] py-2 min-h-0 h-auto px-2 min-w-0"
                  >
                    <Icon
                      name="mapFilled"
                      className="mr-1 xl:mr-2 size-4 xl:size-5"
                    />
                    Find a Service
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <MobileMenu mode={mode} setMode={setMode} />
          </div>
        </div>
      </nav>
      {pathname === "/" && <Outlet context={{ heroScrollRef }} />}
    </>
  );
}
