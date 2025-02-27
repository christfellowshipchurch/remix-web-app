/**
 * todo : Add link navigation to the menu items
 */
import { useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { MenuSection } from "./menu-section";
import { AccordionSection } from "./accordion-section";
import {
  welcomeMenuItems,
  getInvolvedItems,
  nextStepsItems,
  mediaItems,
  ministriesItems,
  moreMenuItems,
} from "./mobile-menu.data";
import Icon from "~/primitives/icon";
import { Link } from "react-router-dom";

export default function MobileMenuContent() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="pb-24">
        <MenuSection title="Welcome to Church" items={welcomeMenuItems} />
        <MenuSection title="Get Involved" items={getInvolvedItems} />

        <section className="space-y-4">
          <AccordionSection
            id="next-steps"
            title="Next Steps"
            description="Find your next step"
            items={nextStepsItems}
            isOpen={openSection === "next-steps"}
            onToggle={toggleSection}
          />

          <AccordionSection
            id="media"
            title="Media"
            description="Messages, articles and more"
            items={mediaItems}
            isOpen={openSection === "media"}
            onToggle={toggleSection}
          />

          <AccordionSection
            id="ministries"
            title="Ministries"
            description="View all ministries"
            items={ministriesItems}
            isOpen={openSection === "ministries"}
            onToggle={toggleSection}
            layout="grid"
            showViewMore
          />
        </section>

        <section className="p-8 border-t border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-navy">My Church</h3>
            <p className="text-text-primary text-sm font-normal">
              Stay up to date with your groups, classes, and more.
            </p>
            <Button intent="primary" className="mt-4 w-full" size="sm">
              Sign In
            </Button>
          </div>
        </section>

        {/* website feedback */}
        <div className="flex items-center gap-4 border-y-1 border-gray-200 py-4 px-8">
          <Icon name="messageBubble" className="size-6 text-black" />
          <div className="flex flex-col">
            <h3 className="heading-h6 text-navy">Website Feedback</h3>
            <p className="text-text-secondary text-sm font-normal">
              Help us improve the website
            </p>
          </div>
        </div>

        {/* More Menu Items */}
        <div className="flex flex-col gap-4 p-8">
          {moreMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="flex items-start font-normal text-sm text-text-primary"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
