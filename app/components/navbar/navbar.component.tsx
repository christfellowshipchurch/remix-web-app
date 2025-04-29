import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { Button } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";
import { MenuContent } from "./desktop/menu-content.component";
import {
  angleDownIconStyle,
  navigationMenuContentStyle,
  navigationMenuTriggerStyle,
} from "./navbar.styles";
import MobileMenu from "./mobile/mobile-menu.component";
import Icon from "~/primitives/icon";
import { useLocation, useFetcher } from "react-router-dom";
import { shouldUseDarkMode } from "./navbar-routes";
import {
  mainNavLinks,
  ministriesData,
  watchReadListenData,
} from "./navbar.data";
import { MenuLink } from "./types";
import { useEffect, useState, useRef } from "react";
import lowerCase from "lodash/lowerCase";
import { SearchBar } from "./desktop/search/search.component";
import { useResponsive } from "~/hooks/use-responsive";

export function Navbar() {
  const { pathname } = useLocation();
  const [defaultMode, setDefaultMode] = useState<"light" | "dark">(
    shouldUseDarkMode(pathname) ? "dark" : "light"
  );
  const fetcher = useFetcher();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mode, setMode] = useState<"light" | "dark">(defaultMode);
  const { isLarge, isXLarge } = useResponsive();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10; // pixels to scroll before hiding
      const scrollDelta = currentScrollY - lastScrollY;

      // Always show navbar at the very top of the page
      if (currentScrollY < scrollThreshold) {
        setIsVisible(true);
        setIsSearchOpen(false);
        setMode(defaultMode);
        setLastScrollY(currentScrollY);
        return;
      }

      // Show navbar when scrolling up, hide when scrolling down
      // Only trigger if we've scrolled more than the threshold
      if (Math.abs(scrollDelta) > scrollThreshold) {
        setIsVisible(scrollDelta < 0);
        // Only update mode based on scroll if we're not at the top
        if (currentScrollY > scrollThreshold) {
          setMode(scrollDelta < 0 ? "light" : "dark");
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, defaultMode]);

  useEffect(() => {
    // Load the navbar data when component mounts
    fetcher.load("/navbar");
  }, []);

  useEffect(() => {
    const newMode = shouldUseDarkMode(pathname) ? "dark" : "light";
    setDefaultMode(newMode);
    setMode(newMode);
    // Reset scroll position when route changes
    setLastScrollY(0);
    // Force a re-render to ensure mode is applied
    setIsVisible(true);
  }, [pathname]);

  // Effect to sync mode with defaultMode when it changes
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const isLoading = fetcher.state === "loading";

  const menuLinks: MenuLink[] = [
    {
      title: "Get Involved",
      content: {
        mainContent: ministriesData.content.mainContent,
        featureCards: fetcher.data?.ministries?.featureCards || [],
      },
    },
    {
      title: "Media",
      content: {
        mainContent: watchReadListenData.content.mainContent,
        featureCards: fetcher.data?.watchReadListen?.featureCards || [],
      },
    },
  ];

  return (
    <nav
      className={cn(
        "group w-full sticky top-0 z-999 transition-transform duration-300",
        !isVisible && "-translate-y-full"
      )}
      ref={navbarRef}
    >
      <div
        className={cn(
          "w-full content-padding transition-colors duration-200",
          mode === "light"
            ? "bg-white shadow-sm"
            : "bg-transparent group-hover:bg-white"
        )}
      >
        <div
          className={cn(
            "max-w-screen-content mx-auto flex justify-between items-center font-bold py-5"
          )}
          style={{
            gap: isSearchOpen ? "32px" : "0px",
          }}
        >
          {/* Logo */}
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
                    : "text-white group-hover:text-ocean"
                )}
              />
            </a>

            {/* Desktop view */}
            <div
              className="hidden lg:inline"
              style={{
                display: isSearchOpen ? "none" : isLarge ? "inline" : "none",
              }}
            >
              <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-6 xl:space-x-10">
                  {/* Links */}
                  {mainNavLinks.map((link) => (
                    <NavigationMenuItem key={link.title}>
                      <NavigationMenuLink
                        href={link.url}
                        className={cn(
                          "transition-colors xl:text-lg",
                          mode === "light"
                            ? "text-neutral-dark"
                            : "text-white group-hover:text-text"
                        )}
                      >
                        <span className="hover:text-ocean">{link.title}</span>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}

                  {/* Menu Dropdowns */}
                  {menuLinks.map((menuLink) => (
                    <NavigationMenuItem
                      value={menuLink.title}
                      key={menuLink.title}
                    >
                      <NavigationMenuTrigger
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "xl:text-lg cursor-pointer transition-colors duration-200",
                          mode === "light"
                            ? "text-neutral-dark"
                            : "text-white group-hover:text-text"
                        )}
                      >
                        {menuLink.title}
                        <Icon
                          name="chevronDown"
                          className={angleDownIconStyle()}
                          aria-hidden="true"
                        />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent
                        className={cn(
                          "relative z-10 bg-white shadow-lg",
                          navigationMenuContentStyle()
                        )}
                      >
                        <MenuContent
                          menuType={lowerCase(menuLink.title)}
                          isLoading={isLoading}
                          mainContent={menuLink.content.mainContent}
                          featureCards={menuLink.content.featureCards}
                        />
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div
            className="hidden lg:flex items-center gap-6"
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
                onClick={(e) => {
                  setIsSearchOpen(true);
                  setTimeout(() => {
                    const searchInput = document.querySelector(
                      ".ais-SearchBox-input"
                    );
                    if (searchInput instanceof HTMLInputElement) {
                      searchInput.focus();
                    }
                  }, 0);
                }}
                className="flex items-center"
              >
                <Icon
                  name="search"
                  size={20}
                  className={`
                        ${
                          mode === "light"
                            ? "text-neutral-dark"
                            : "text-white group-hover:text-text"
                        } hover:text-ocean transition-colors cursor-pointer
                      `}
                />
              </button>
            )}

            {(!isSearchOpen || isXLarge) && (
              <div className="flex gap-2">
                <Button className="font-semibold text-base w-[190px]">
                  <Icon name="mapFilled" size={20} className="mr-2" />
                  Find a Service
                </Button>
                <Button
                  intent="secondary"
                  linkClassName="hidden xl:block"
                  className={`font-semibold text-base w-[140px] ${
                    mode === "dark" &&
                    "border-white text-white group-hover:text-ocean group-hover:border-ocean"
                  }`}
                  href="/about"
                >
                  My Church
                </Button>
              </div>
            )}
          </div>

          {/* Mobile view */}
          <MobileMenu mode={mode} setMode={setMode} />
        </div>
      </div>
    </nav>
  );
}
