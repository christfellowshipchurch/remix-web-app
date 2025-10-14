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
    <div
      style={{
        background:
          "linear-gradient(to right, white 0%, white 80%, #F3F5FA 60%, #F3F5FA 100%)",
      }}
      className="w-screen shadow-sm flex items-center justify-center content-padding"
    >
      <div className="max-w-screen-content mx-auto w-full flex flex-col lg:flex-row">
        <div className="bg-white grid grid-cols-3 xl:gap-8 w-full min-w-[640px] max-w-[720px] xl:min-w-[745px] xl:max-w-[760px] 2xl:!max-w-[875px] ml-auto 2xl:!mr-56 3xl:!mr-70 xl:mr-28">
          {mainContent.map((section, index) => (
            <div className="w-full max-w-70 xl:max-w-92 px-4 py-8" key={index}>
              <h4 className="font-medium text-link-secondary">
                {section.title}
              </h4>
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
          className={`pl-4 py-6 3xl:!pl-6 w-full bg-gray flex flex-col gap-4 items-end ${
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
    </div>
  );
};
