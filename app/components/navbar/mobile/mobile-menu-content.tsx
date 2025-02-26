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
} from "./mobile-menu.data";

export default function MobileMenuContent() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-6 space-y-8 pb-24">
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

        <section className="pt-4 border-t border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-navy">My Church</h3>
            <p className="text-gray-600 text-sm">
              Stay up to date with your groups, classes, and more.
            </p>
            <Button intent="primary" className="mt-4 w-full" size="sm">
              Sign In
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
