import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";

import Button from "~/primitives/button";
import { cn } from "~/lib/utils";
import logo from "/logo.png";
import { ministriesData, watchReadListenData } from "./navbar.data";
import { MenuContent } from "./menu-content.component";
import {
  angleDownIconStyle,
  navigationMenuContentStyle,
  navigationMenuTriggerStyle,
} from "./navbar.styles";
import MobileMenu from "./mobile/mobile-menu.components";

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
  return (
    <div className="z-50 w-screen bg-transparent h-[72px] shadow-sm px-6 md:px-16 flex justify-between items-center font-bold">
      {/* Logo */}
      <a href="/" className="relative flex items-center justify-center gap-2.5">
        <img alt="cf logo" src={logo} width={102} height={44} />
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
                  className="hover:text-ocean transition-colors text-sm lg:text-base"
                >
                  {link.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {/* Menu Dropdowns */}
            {menuLinks.map((menuLink) => (
              <NavigationMenuItem value={menuLink.title} key={menuLink.title}>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "group text-sm lg:text-base"
                  )}
                >
                  {menuLink.title}
                  <ChevronDown
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
      <div className="items-center gap-4 hidden md:flex">
        <Button size={"md"}>Give now</Button>
      </div>

      {/* Mobile view */}
      <MobileMenu />
    </div>
  );
}
