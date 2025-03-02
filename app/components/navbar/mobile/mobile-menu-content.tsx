/**
 * todo : Add link navigation to the menu items
 */
import { useState } from "react";
import Icon from "~/primitives/icon";
import {
  locationsData,
  ministriesData,
  watchReadListenData,
} from "../navbar.data";
import { Button } from "~/primitives/button/button.primitive";
import { NavCard } from "../desktop/nav-cards.component";

interface MenuScreen {
  id: string;
  title: string;
  content?: any;
}

const mainMenuItems: MenuScreen[] = [
  { id: "about", title: "About" },
  { id: "locations", title: "Locations", content: locationsData },
  { id: "events", title: "Events" },
  { id: "ministries", title: "Get Involved", content: ministriesData },
  { id: "media", title: "Media", content: watchReadListenData },
];

export default function MobileMenuContent() {
  const [activeScreen, setActiveScreen] = useState<MenuScreen | null>(null);

  const handleBack = () => {
    setActiveScreen(null);
  };

  const handleMenuItemClick = (item: MenuScreen) => {
    if (item.content) {
      setActiveScreen(item);
    }
  };

  return (
    <div className="h-full relative overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-300 overflow-y-auto`}
      >
        <div className="flex justify-between items-center ml-4 mb-6 border-b-2 border-b-ocean pb-6">
          <Button intent="primary" size={"sm"}>
            Give Now
          </Button>
          <Button intent="secondary" size={"sm"}>
            Join Us Online
          </Button>
        </div>
        <ul className="flex flex-col gap-6 p-4">
          {mainMenuItems.map((item) => (
            <li className="border-b border-b-gray-200 pb-6" key={item.id}>
              <button
                onClick={() => handleMenuItemClick(item)}
                className="flex items-center justify-between w-full text-lg font-bold "
              >
                {item.title}
                {item.content && (
                  <Icon className="text-gray-500 size-8" name="chevronRight" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`absolute inset-0 bg-white transition-transform duration-300 transform z-10
          ${activeScreen ? "translate-x-0" : "translate-x-full"}`}
      >
        {activeScreen && (
          <>
            <div className="sticky top-0 z-20 flex items-center gap-2 p-4 border-b-2 border-b-ocean bg-white">
              <button onClick={handleBack}>
                <Icon className="text-text-primary/75" name="arrowBack" />
              </button>
              <h2 className="text-lg  font-bold">{activeScreen.title}</h2>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-10rem)]">
              {activeScreen.content.mainContent?.map(
                (section: any, idx: number) => {
                  return (
                    <div key={idx} className="mb-6">
                      <h3 className="font-medium mb-2 text-link-secondary border-b border-b-gray-200 pb-2">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.items.map((item: any, itemIdx: number) => (
                          <li key={itemIdx}>
                            <a href={item.url} className=" font-bold">
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              )}

              {activeScreen.content.additionalContent.length > 0 &&
                (activeScreen.id === "locations" ? (
                  // Locations menu - simple links
                  <ul className="space-y-6">
                    {activeScreen.content.additionalContent.map(
                      (content: any, idx: number) => (
                        <li key={idx}>
                          <a href={content.url} className=" text-lg font-bold">
                            {content.title}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  // Other menus - NavCards
                  activeScreen.content.additionalContent.map(
                    (content: any, idx: number) => (
                      <div
                        key={idx}
                        className={`mb-4 ${idx === 0 ? "mt-10" : ""}`}
                      >
                        <NavCard
                          title={content.title}
                          url={content.link}
                          subtitle="LATEST CONTENT"
                          coverImage="https://picsum.photos/282/228"
                          linkText="Learn More"
                        />
                      </div>
                    )
                  )
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
