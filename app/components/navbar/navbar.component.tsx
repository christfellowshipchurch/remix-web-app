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
import { useAuth } from "~/providers/auth-provider";

const authButtonStyle = (mode: "light" | "dark") => {
  return `font-semibold cursor-pointer hover:text-ocean transition-colors ${
    mode === "light" ? "text-neutral-dark" : "text-white group-hover:text-text"
  }`;
};

export function Navbar() {
  const { pathname } = useLocation();
  const mode = shouldUseDarkMode(pathname) ? "dark" : "light";
  const fetcher = useFetcher();
  const { logout, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Load the navbar data when component mounts
    fetcher.load("/navbar");
  }, []);

  const isLoading = fetcher.state === "loading";

  const userData = fetcher.data?.userData;
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
    <nav className="group w-full">
      <div
        className={`z-50 ${
          mode == "light"
            ? "bg-white shadow-sm"
            : "absolute top-0 hover:bg-white bg-transparent transition-colors duration-200"
        } py-5 w-full content-padding`}
      >
        <div
          className="max-w-screen-content mx-auto flex justify-between items-center font-bold"
          style={{
            gap: isSearchOpen ? "24px" : "0px",
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
                className={`${
                  mode === "light"
                    ? "text-ocean"
                    : "text-white group-hover:text-ocean"
                } size-32 my-[-48px]`}
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
                          "cursor-pointer",
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
          </div>

          {/* Desktop Buttons */}
          <div
            className="hidden lg:flex items-center gap-6"
            style={{
              width: isSearchOpen ? "100%" : "auto",
              justifyContent: isSearchOpen ? "space-between" : "start",
            }}
          >
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center"
              >
                <Icon
                  name="search"
                  color={isSearchOpen ? "#0092BC" : undefined}
                  size={20}
                  className={`${
                    mode === "light"
                      ? "text-neutral-dark"
                      : "text-white group-hover:text-text"
                  } hover:text-ocean transition-colors cursor-pointer`}
                />
              </button>

              {isSearchOpen && (
                <div className="absolute left-0 top-[56px] w-[60vw] bg-[#F3F5FA] rounded-b-lg shadow-lg p-4">
                  <div className="flex items-center gap-2 pb-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <h2 className="text-xs text-[#2F2F2F] opacity-50 font-semibold">
                        I'M LOOKING FOR
                      </h2>
                      <div className="flex gap-4 mt-4">
                        <Button
                          intent="secondary"
                          className="border-[#AAAAAA] text-[#444444] border-[0.7px]"
                        >
                          Events
                        </Button>
                        <Button
                          intent="secondary"
                          className="border-[#AAAAAA] text-[#444444] border-[0.7px]"
                        >
                          Articles
                        </Button>
                        <Button
                          intent="secondary"
                          className="border-[#AAAAAA] text-[#444444] border-[0.7px]"
                        >
                          Messages
                        </Button>
                        <Button
                          intent="secondary"
                          className="border-[#AAAAAA] text-[#444444] border-[0.7px]"
                        >
                          Pages
                        </Button>
                        <Button
                          intent="secondary"
                          className="border-[#AAAAAA] text-[#444444] border-[0.7px]"
                        >
                          People
                        </Button>
                        <Button
                          intent="secondary"
                          className="border-[#AAAAAA] text-[#444444] border-[0.7px]"
                        >
                          Podcasts
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="mt-6 space-y-4">
                    {/* <div className="flex flex-col gap-2 mt-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="file" size={14} />
                      Article
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="calendar" size={14} />
                      Event
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="windowAlt" size={14} />
                      Ministry Page
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="moviePlay" size={14} />
                      Message
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="user" size={14} />
                      Author
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="microphone" size={14} />
                      Podcast
                    </button>
                  </div> */}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {/* Auth Info / Button */}
              {/* <div className="min-w-[50px] flex justify-end">
                {authLoading ? (
                  <div className={authButtonStyle(mode)}>Login</div> // optimistically show login button
                ) : userData ? (
                  <button className={authButtonStyle(mode)} onClick={logout}>
                    Logout
                  </button>
                ) : (
                  <AuthModal buttonStyle={authButtonStyle(mode)} />
                )}
              </div> */}

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
