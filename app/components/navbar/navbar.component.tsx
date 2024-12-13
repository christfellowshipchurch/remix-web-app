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

const mainLinks = [
  { title: "About", url: "#" },
  { title: "Locations", url: "#" },
  { title: "Events", url: "#" },
];

const menuLinks = [
  { title: "Ministries", content: ministriesData },
  { title: "Watch, Read, Listen", content: watchReadListenData },
];

export function Navbar() {
  return (
    <div className="z-50 w-screen bg-transparent h-[72px] shadow-sm px-16 flex justify-between items-center font-bold">
      {/* Left Section: Logo and Links */}
      <div className="flex items-center space-x-16">
        {/* Logo */}
        <a
          href="/"
          className="relative flex items-center justify-center gap-2.5"
        >
          <img alt="cf logo" src={logo} width={102} height={44} />
        </a>

        {/* Mobile view still needs to designed 👀 */}
        <div className="hidden lg:inline">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-10">
              {/* Links */}
              {mainLinks.map((link) => (
                <NavigationMenuItem key={link.title}>
                  <NavigationMenuLink
                    href={link.url}
                    className="hover:text-ocean"
                  >
                    {link.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              {/* Menu Dropdowns */}
              {menuLinks.map((menuLink) => (
                <NavigationMenuItem key={menuLink.title}>
                  <NavigationMenuTrigger
                    className={cn(navigationMenuTriggerStyle(), "group")}
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
      </div>

      {/* Right Section: Call to Actions */}
      <div className="flex space-x-8">
        {/* Give Now Button */}
        <Button size={"md"}>Give now</Button>
      </div>
    </div>
  );
}
