import Icon from "~/primitives/icon";
import { HeroNavCard, NavCard } from "./nav-cards.component";
import { MenuLink } from "../types";
import { cn } from "~/lib/utils";

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
    <div
      style={{
        background:
          "linear-gradient(to right, white 0%, white 80%, #F3F5FA 80%, #F3F5FA 100%)",
      }}
      className="w-screen shadow-sm flex items-center justify-center content-padding"
    >
      <div className="max-w-screen-content mx-auto w-full flex flex-col lg:flex-row">
        <div className="bg-white grid grid-cols-3 xl:gap-8 w-full ml-auto ">
          {mainContent.map((section, index) => (
            <div className="w-full px-4 py-8" key={index}>
              <h4 className="font-medium text-link-secondary">
                {section.title}
              </h4>
              <hr className="mb-4 mt-1 border-t border-gray-200" />
              <ul className="mt-4 space-y-6">
                {section.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="hover:text-ocean text-link-primary transition-colors"
                  >
                    <a
                      className="flex flex-col"
                      href={item.url}
                      target={item.url.includes("http") ? "_blank" : undefined}
                    >
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="font-light text-sm">{item.description}</p>
                    </a>
                  </li>
                ))}
              </ul>
              {section.link && (
                <a
                  href="/ministries"
                  className="mt-4 flex text-navy hover:text-ocean transition-colors"
                >
                  <span>{section.link}</span>
                  <Icon name="arrowRight" />
                </a>
              )}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "py-6 w-1/2 min-w-[340px] max-w-[400px] bg-gray flex flex-col gap-4 items-end",
            featureCards.length > 1 ? "pl-4 3xl:pl-6!" : "pl-0",
            featureCards.length > 1 && "pb-14",
          )}
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
    </div>
  );
};
