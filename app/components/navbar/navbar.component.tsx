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
import { useEffect } from "react";
import lowerCase from "lodash/lowerCase";

export function Navbar() {
  const { pathname } = useLocation();
  const mode = shouldUseDarkMode(pathname) ? "dark" : "light";
  const fetcher = useFetcher();

  useEffect(() => {
    // Load the navbar data when component mounts
    fetcher.load("/navbar");
  }, []);

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
    <nav className="group w-full">
      <div
        className={`z-50 ${
          mode == "light"
            ? "bg-white shadow-sm"
            : "absolute top-0 hover:bg-white bg-transparent transition-colors duration-200"
        } py-5 w-full content-padding`}
      >
        <div className="max-w-screen-content mx-auto flex justify-between items-center font-bold">
          {/* Logo */}
          <a
            href="/"
            className="relative flex items-center justify-center gap-2.5"
          >
            <Icon
              name="logo"
              className={`${
                mode === "light"
                  ? "text-ocean"
                  : "text-white group-hover:text-ocean"
              } size-32 my-[-48px]`}
            />
          </a>

          {/* Desktop view */}
          <div className="hidden md:inline">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-6 lg:space-x-10">
                {/* Links */}
                {mainNavLinks.map((link) => (
                  <NavigationMenuItem key={link.title}>
                    <NavigationMenuLink
                      href={link.url}
                      className={`${
                        mode === "light"
                          ? "text-neutral-dark"
                          : "text-white group-hover:text-text"
                      } transition-colors xl:text-lg`}
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
                        "xl:text-lg",
                        `${
                          mode === "light"
                            ? "text-neutral-dark"
                            : "text-white group-hover:text-text"
                        }`
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

          {/* Give Now Button */}
          <a href="#search" className="items-center gap-8 hidden md:flex">
            <Icon
              name="search"
              className={`${
                mode === "light"
                  ? "text-neutral-dark"
                  : "text-white group-hover:text-text"
              } hover:text-ocean transition-colors`}
            />
            <Button size={"md"}>Find a Service</Button>
          </a>

          {/* Mobile view */}
          <MobileMenu mode={mode} />
        </div>
      </div>
    </nav>
  );
}
