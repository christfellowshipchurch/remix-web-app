import Icon from "~/primitives/icon";
import { cn } from "~/lib/utils";
import "./navbar-simple.styles.css";
import MobileMenuContent from "../navbar/mobile/mobile-menu-content";

/**
 * NavbarSimple Component
 *
 * A simplified version of the navbar component that removes React Router dependencies
 * and uses only Tailwind and vanilla CSS classes. We need this because we are using a dynamic page from Webflow that requires us to disable React Router scripts on the front end.
 *
 * Example:
 * All links use simple anchor tags (<a>) instead of React Router's <Link> component.
 *
 * Note: This is NOT complete and is more of a proof of concept. There are still many things we need to solve, fix, and improve. I would like to wait until we update our Webflow porject to remove CSS conflicts before moving forward.
 */

export function NavbarSimple() {
  // Default navigation links - all use simple anchor tags instead of React Router Links
  const navLinks = [
    { title: "About", url: "/about" },
    { title: "Locations", url: "/locations" },
    { title: "Events", url: "/events" },
    { title: "Get Involved", url: "/ministries" },
    { title: "Media", url: "/messages" },
  ];

  // Shared navigation component to eliminate duplication
  const NavigationLinks = ({ className = "" }: { className?: string }) => (
    <div className={cn("flex items-baseline space-x-4", className)}>
      {navLinks.map((link) => (
        <a
          key={link.title}
          href={link.url}
          className={cn(
            "navbar-simple-link",
            "px-3 py-2",
            "text-lg",
            "rounded-md",
            "font-bold"
          )}
        >
          {link.title}
        </a>
      ))}
    </div>
  );

  // Shared logo component
  const Logo = () => (
    <div className="flex-shrink-0">
      <a href="/" className="flex items-center">
        <Icon name="logo" size={120} />
      </a>
    </div>
  );

  // Shared desktop actions component
  const DesktopActions = () => (
    <div className="desktop-actions">
      <div className="ml-4 flex items-center space-x-4">
        <a href="/locations" className="navbar-simple-button">
          <Icon name="mapFilled" size={20} />
          Find a Service
        </a>
      </div>
    </div>
  );

  return (
    <nav className="navbar-simple w-full bg-white shadow-sm py-2 font-[Proxima-Nova]">
      {/* CSS-only mobile menu container */}
      <div className="mobile-menu-container">
        {/* Hidden checkbox for CSS-only toggle */}
        <input
          type="checkbox"
          id="mobile-menu-toggle"
          className="mobile-menu-toggle"
          style={{ display: "none" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo />
              {/* Desktop Navigation */}
              <div className="desktop-nav ml-10">
                <NavigationLinks />
              </div>
            </div>

            <DesktopActions />

            {/* Mobile menu button */}
            <div className="mobile-menu-button">
              <label
                htmlFor="mobile-menu-toggle"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                <span className="sr-only">Open main menu</span>
                <Icon name="menu" size={24} className="mobile-menu-icon" />
                <Icon name="x" size={24} className="mobile-close-icon" />
              </label>
            </div>
          </div>
        </div>

        {/* Mobile menu - CSS-only approach */}
        <div className="mobile-menu">
          {/* Reusable Mobile Menu Content - styling needs to be fixed */}
          <MobileMenuContent
            closeMenu={() => {}}
            auth={{
              authLoading: false,
              logout: () => {},
              user: null,
            }}
          />
        </div>
      </div>
    </nav>
  );
}
