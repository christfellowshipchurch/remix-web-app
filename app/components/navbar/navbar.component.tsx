import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";

import Button from "~/primitives/button";
import { cn } from "~/lib/utils";
import { ministriesData, watchReadListenData } from "./navbar.data";
import { MenuContent } from "./menu-content.component";
import {
  angleDownIconStyle,
  navigationMenuContentStyle,
  navigationMenuTriggerStyle,
} from "./navbar.styles";
import MobileMenu from "./mobile/mobile-menu.components";
import Icon from "~/primitives/icon";

const mainLinks = [
  { title: "About", url: "/about" },
  { title: "Locations", url: "/locations" },
  { title: "Events", url: "/events" },
];

const menuLinks = [
  { title: "Get Involved", content: ministriesData },
  { title: "Media", content: watchReadListenData },
];

export function Navbar() {
  const mode = "light"; //or "dark"

  return (
    <nav className="group">
      <div
        className={`z-50 w-screen ${
          mode == "light"
            ? "relative bg-white"
            : "absolute hover:bg-white bg-transparent transition-colors duration-200"
        } py-5 shadow-sm px-6 md:px-16 lg:px-24 xl:px-36 flex justify-between items-center font-bold`}
      >
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
            <NavigationMenuList className="flex items-center space-x-4 lg:space-x-10">
              {/* Links */}
              {mainLinks.map((link) => (
                <NavigationMenuItem key={link.title}>
                  <NavigationMenuLink
                    href={link.url}
                    className={`${
                      mode === "light"
                        ? "text-neutral-dark"
                        : "text-white group-hover:text-text"
                    } transition-colors text-sm lg:text-base xl:text-lg`}
                  >
                    <span className="hover:text-ocean">{link.title}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              {/* Menu Dropdowns */}
              {menuLinks.map((menuLink) => (
                <NavigationMenuItem value={menuLink.title} key={menuLink.title}>
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm lg:text-base xl:text-lg",
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
                      "relative z-10 bg-white shadow-lg", // Adjusting to make it a lower z-index and positioned correctly
                      navigationMenuContentStyle()
                    )}
                  >
                    <MenuContent
                      mainContent={menuLink.content.mainContent}
                      additionalContent={menuLink.content.additionalContent}
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
          <Button size={"md"}>Give now</Button>
        </a>

        {/* Mobile view */}
        <MobileMenu />
      </div>
    </nav>
  );
}
