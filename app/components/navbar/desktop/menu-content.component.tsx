import Icon from "~/primitives/icon";
import { HeroNavCard, NavCard } from "./nav-cards.component";
import { MenuLink } from "../types";

function FeatureCardSkeleton({ type }: { type: "default" | "hero" }) {
  return type === "default"
    ? [
        <NavCard
          title="_____"
          subtitle="_____"
          callToAction={{ title: "_____", url: "_____" }}
          image="_____"
        />,
        <NavCard
          title="_____"
          subtitle="_____"
          callToAction={{ title: "_____", url: "_____" }}
          image="_____"
        />,
      ]
    : [
        <HeroNavCard
          title="_____"
          subtitle="_____"
          callToAction={{ title: "_____", url: "_____" }}
          image="_____"
        />,
      ];
}

export const MenuContent: React.FC<
  MenuLink["content"] & { isLoading: boolean; menuType: string }
> = ({ mainContent, featureCards, isLoading = true, menuType = "media" }) => {
  return (
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
                href="/ministries"
                className="mt-4 flex hover:text-ocean transition-colors"
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
          featureCards.length > 1 && "pb-14"
        }`}
      >
        {isLoading ? (
          <FeatureCardSkeleton
            type={menuType === "media" ? "default" : "hero"}
          />
        ) : (
          featureCards.map((content, index) => {
            return featureCards.length > 1 ? (
              <NavCard
                key={index}
                title={content.title}
                subtitle={content.subtitle}
                callToAction={content.callToAction}
                image={content.image}
              />
            ) : (
              <HeroNavCard
                key={index}
                title={content.title}
                subtitle={content.subtitle}
                callToAction={content.callToAction}
                image={content.image}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
