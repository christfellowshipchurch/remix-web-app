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
import { useEffect, useState } from "react";
import lowerCase from "lodash/lowerCase";

export function Navbar() {
  const { pathname } = useLocation();
  const defaultMode = shouldUseDarkMode(pathname) ? "dark" : "light";
  const fetcher = useFetcher();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mode, setMode] = useState<"light" | "dark">(defaultMode);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10; // pixels to scroll before hiding
      const scrollDelta = currentScrollY - lastScrollY;

      // Always show navbar at the very top of the page
      if (currentScrollY < scrollThreshold) {
        setIsVisible(true);
        setMode(defaultMode);
        setLastScrollY(currentScrollY);
        return;
      }

      // Show navbar when scrolling up, hide when scrolling down
      // Only trigger if we've scrolled more than the threshold
      if (Math.abs(scrollDelta) > scrollThreshold) {
        setIsVisible(scrollDelta < 0);
        setMode(scrollDelta < 0 ? "light" : "dark");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Load the navbar data when component mounts
    fetcher.load("/navbar");
  }, []);

  const isLoading = fetcher.state === "loading";

  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
              style={{ display: isSearchOpen ? "none" : "inline" }}
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
          <div className="hidden lg:flex items-center gap-6 ">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Icon
                name="search"
                color={isSearchOpen ? "#0092BC" : undefined}
                size={20}
                className={`${
                  mode === "light"
                    ? "text-neutral-dark"
                    : "text-white group-hover:text-text"
                } hover:text-ocean transition-colors mb-[3px] cursor-pointer`}
              />
            </button>
            <div className="flex gap-2">
              <Button className="font-semibold text-base">
                <Icon name="mapFilled" size={20} className="mr-2" />
                Find a Service
              </Button>
              <Button
                intent="secondary"
                linkClassName="hidden xl:block"
                className={`font-semibold text-base ${
                  mode === "dark" &&
                  "border-white text-white group-hover:text-ocean group-hover:border-ocean"
                }`}
                href="/about"
              >
                My Church
              </Button>
            </div>
          </div>

          {/* Mobile view */}
          <MobileMenu mode={mode} />
        </div>
      </div>
    </nav>
  );
}
