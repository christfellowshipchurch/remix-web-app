import Icon from "~/primitives/icon";
import { HeroNavCard, NavCard, NavCardProps } from "./nav-cards.component";

interface MenuItem {
  title: string;
  description?: string;
  url: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  link?: string;
}

interface AdditionalContent {
  title: string;
  link: string;
}

interface MenuContentProps {
  mainContent: MenuSection[];
  additionalContent: AdditionalContent[];
}

export const MenuContent: React.FC<MenuContentProps> = ({
  mainContent,
  additionalContent,
}) => (
  <div className="lg:pl-8 bg-white w-screen shadow-lg flex flex-col lg:grid grid-cols-3">
    <div className="col-span-2 grid grid-cols-3">
      {mainContent.map((section, index) => (
        <div className="max-w-72 pr-8 p-8" key={index}>
          <h4 className="font-medium text-link-secondary">{section.title}</h4>
          <hr className="my-4 border-t border-gray-200" />
          <ul className="mt-4 space-y-6">
            {section.items.map((item, idx) => (
              <li
                key={idx}
                className="hover:text-ocean text-link-primary transition-colors"
              >
                <a className="flex flex-col" href={item.url}>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="font-light text-sm">{item.description}</p>
                </a>
              </li>
            ))}
          </ul>
          {section.link && (
            <a
              href="#"
              className="text-text-primary mt-4 flex hover:text-ocean transition-colors"
            >
              <span>{section.link}</span>
              <Icon name="arrowRight" />
            </a>
          )}
        </div>
      ))}
    </div>
    <div
      className={`p-6 flex flex-col gap-4 bg-background-secondary items-center ${
        additionalContent.length > 1 && "pb-14"
      }`}
    >
      {additionalContent.map((content, index) => {
        return additionalContent.length > 1 ? (
          <NavCard
            key={index}
            title={content.title}
            subtitle="latest message"
            url={content.link}
            coverImage="https://picsum.photos/400/400"
            linkText="Watch Now"
          />
        ) : (
          <HeroNavCard
            key={index}
            title={content.title}
            subtitle="YOUR FIRST STEP"
            url={content.link}
            coverImage="https://picsum.photos/282/228"
            linkText="Save Your Spot"
          />
        );
      })}
    </div>
  </div>
);
