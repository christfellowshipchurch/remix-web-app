import { useLocation } from "react-router-dom";
import BulletPoints from "~/primitives/bullet-points";
import { Button } from "~/primitives/button/button.primitive";

export const EventsSingleHero = ({
  imagePath,
  ctas,
  customTitle,
  subtitle = "A really engaging paragraph. Introduction to the event, just one or two sentences.",
}: {
  imagePath: string;
  ctas: { title: string; href: string }[];
  customTitle?: string;
  subtitle?: string;
}) => {
  const location = useLocation();
  const pagePath =
    location.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )[0] || "Home";

  return (
    <div className="w-full flex items-center content-padding py-8 md:py-12 lg:py-16">
      <div className="flex flex-col-reverse md:flex-row w-full mx-auto gap-2 md:gap-8 lg:gap-16 xl:!justify-between items-center justify-center self-stretch max-w-screen-content md:mb-12">
        {/* Left / Bottom Side (Desktop) */}
        <div className="flex flex-col gap-10 mb-4 md:mb-0">
          <div className="flex flex-col gap-3 max-w-[600px]">
            <h1 className="font-extrabold heading-h4 md:heading-h3 lg:text-[52px] text-text-primary leading-tight !text-pretty -mb-1">
              {customTitle || pagePath}
            </h1>

            {subtitle && (
              <p className="font-medium lg:text-lg text-[#717182] max-w-[420px]">
                {subtitle}
              </p>
            )}

            {/* CTAs */}
            <div className="mt-5 md:mt-0 flex flex-wrap gap-2 sm:gap-4">
              {ctas?.map((cta, i) => (
                <Button
                  key={i}
                  href={cta.href}
                  intent={i === 0 ? "primary" : "secondary"}
                >
                  {cta.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Bullet Points */}
          <BulletPoints
            dotStyles="bg-navy size-[6px]"
            textStyles="text-[#717182] text-sm font-medium"
            className="gap-1 lg:gap-2"
            points={[
              "Connect with others and build meaningful relationships",
              "Learn and grow through engaging content and discussions",
              "Make a positive impact in your community",
            ]}
          />
        </div>

        {/* Right / Top Side (Mobile) */}
        <img
          src={imagePath}
          alt={customTitle || pagePath}
          className="w-full max-w-[90vw] md:max-w-[340px] lg:max-w-[480px] xl:!max-w-[638px] aspect-[638/478] object-cover rounded-[14px] shadow-xl"
        />
      </div>
    </div>
  );
};
