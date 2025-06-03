import { useLocation, useLoaderData } from "react-router-dom";
import { loader } from "~/routes/navbar/loader";
import { useEffect, useState, useRef } from "react";
import { useResponsive } from "~/hooks/use-responsive";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import lowerCase from "lodash/lowerCase";

import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { MenuContent } from "./desktop/menu-content.component";
import MobileMenu from "./mobile/mobile-menu.component";
import { SearchBar } from "./desktop/search/search.component";

import { cn } from "~/lib/utils";
import { shouldUseDarkMode } from "./navbar-routes";
import {
  angleDownIconStyle,
  navigationMenuContentStyle,
  navigationMenuTriggerStyle,
} from "./navbar.styles";

// Data
import {
  mainNavLinks,
  ministriesData,
  watchReadListenData,
} from "./navbar.data";
import { MenuLink } from "./types";
import { SiteBanner } from "../site-banner";

export function Navbar() {
  // Hooks and state
  const { pathname } = useLocation();
  const { siteBanner, ministries, watchReadListen } =
    useLoaderData<typeof loader>();
  const { isLarge, isXLarge } = useResponsive();
  const navbarRef = useRef<HTMLDivElement>(null);

  // State management
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Theme mode state
  const initialMode = shouldUseDarkMode(pathname, isLarge) ? "dark" : "light";
  const [defaultMode, setDefaultMode] = useState<"light" | "dark">(initialMode);
  const [mode, setMode] = useState<"light" | "dark">(defaultMode);

  const [showSiteBanner, setShowSiteBanner] = useState<boolean>(false);

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
        setIsVisible(true);
        setIsSearchOpen(false);
        setMode(defaultMode);
        setLastScrollY(currentScrollY);
        return;
      }

      // Handle scroll direction
      if (Math.abs(scrollDelta) > scrollThreshold) {
        setIsVisible(scrollDelta < 0);
        if (currentScrollY > scrollThreshold) {
          setMode(scrollDelta < 0 ? "light" : "dark");
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, defaultMode]);

  // Initial mode setup
  useEffect(() => {
    setDefaultMode(shouldUseDarkMode(pathname, isLarge) ? "dark" : "light");
  }, []);

  // Route change handling
  useEffect(() => {
    const newMode = shouldUseDarkMode(pathname) ? "dark" : "light";
    setDefaultMode(newMode);
    setMode(newMode);
    setLastScrollY(0);
    setIsVisible(true);
  }, [pathname]);

  // Mode sync effect
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  // Menu data
  const menuLinks: MenuLink[] = [
    {
      title: "Get Involved",
      content: {
        mainContent: ministriesData.content.mainContent,
        featureCards: ministries.featureCards,
      },
    },
    {
      title: "Media",
      content: {
        mainContent: watchReadListenData.content.mainContent,
        featureCards: watchReadListen.featureCards,
      },
    },
  ];

  // Search handling
  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      const searchInput = document.querySelector(".ais-SearchBox-input");
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus();
      }
    }, 0);
  };

  return (
    <nav
      className={cn(
        "group w-full sticky top-0 z-400 transition-transform duration-300",
        !isVisible && "-translate-y-full"
      )}
      ref={navbarRef}
    >
      <div className={cn(showSiteBanner ? "block" : "hidden")}>
        <SiteBanner
          content={siteBanner.content}
          onClose={() => setShowSiteBanner(false)}
        />
      </div>
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
              <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-6 xl:space-x-10">
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
                          isLoading={false}
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

          {/* Desktop Actions */}
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
              <button onClick={handleSearchClick} className="flex items-center">
                <Icon
                  name="search"
                  size={20}
                  className={cn(
                    "hover:text-ocean transition-colors cursor-pointer",
                    mode === "light"
                      ? "text-neutral-dark"
                      : "text-white group-hover:text-text"
                  )}
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
                  className={cn(
                    "font-semibold text-base w-[140px]",
                    mode === "dark" &&
                      "border-white text-white group-hover:text-ocean group-hover:border-ocean"
                  )}
                  href="/about"
                >
                  My Church
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu mode={mode} setMode={setMode} />
        </div>
      </div>
    </nav>
  );
}
