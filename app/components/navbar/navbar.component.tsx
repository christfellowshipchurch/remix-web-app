import { useLocation, Outlet } from "react-router-dom";
import { useRouteLoaderData } from "react-router";
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
import { RootLoaderData } from "~/routes/navbar/loader";
import { AuthModal } from "../modals";

export function Navbar() {
  // Hooks and state
  const { pathname } = useLocation();
  const rootData = useRouteLoaderData("root") as RootLoaderData;
  const { siteBanner, ministries, watchReadListen } = rootData || {};
  const { isLarge, isXLarge } = useResponsive();
  const navbarRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);

  // State management
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Theme mode state
  let initialMode: "light" | "dark";
  if (pathname === "/") {
    initialMode = isLarge ? "light" : "dark";
  } else {
    initialMode = shouldUseDarkMode(pathname) ? "dark" : "light";
  }
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
        let shouldShow = true;
        if (pathname === "/" && !isLarge && heroScrollRef.current) {
          const node = heroScrollRef.current;
          const atBottom =
            node.scrollHeight - node.scrollTop - node.clientHeight < 10;
          if (atBottom) {
            shouldShow = false;
          }
        }
        setIsVisible(shouldShow);
        setIsSearchOpen(false);
        if (pathname === "/" && !isLarge) {
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
          if (pathname === "/" && !isLarge) {
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
  }, [lastScrollY, defaultMode, pathname, isLarge]);

  // Initial mode setup
  useEffect(() => {
    if (pathname === "/") {
      setDefaultMode(isLarge ? "light" : "dark");
    } else {
      setDefaultMode(shouldUseDarkMode(pathname) ? "dark" : "light");
    }
  }, [pathname, isLarge]);

  // Route change handling
  useEffect(() => {
    let newMode: "light" | "dark";
    // If on home page, set mode based on screen size
    if (pathname === "/") {
      newMode = isLarge ? "light" : "dark";
    } else {
      newMode = shouldUseDarkMode(pathname) ? "dark" : "light";
    }
    setDefaultMode(newMode);
    setMode(newMode);
    setLastScrollY(0);
    setIsVisible(true);
  }, [pathname, isLarge]);

  // Mode sync effect
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

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
    setTimeout(() => {
      const searchInput = document.querySelector(".ais-SearchBox-input");
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (pathname !== "/") return; // Only on home page
    if (isLarge) return; // Only for small screens

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
  }, [pathname, isLarge, heroScrollRef]);

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

                    {menuLinks.map((menuLink) =>
                      menuLink.content ? (
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
                      ) : null
                    )}
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
                <button
                  onClick={handleSearchClick}
                  className="flex items-center"
                >
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
                  <Button
                    href="/locations"
                    className="font-semibold text-base w-[190px]"
                  >
                    <Icon name="mapFilled" size={20} className="mr-2" />
                    Find a Service
                  </Button>
                  <AuthModal
                    buttonStyle={cn(
                      "font-semibold text-base w-[140px] border-1 border-ocean text-ocean rounded-md",
                      mode === "dark" &&
                        "border-white text-white group-hover:text-ocean group-hover:border-ocean"
                    )}
                    buttonText="My Church"
                  />
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
