import { useResponsive } from "~/hooks/use-responsive";
import BulletPoints from "~/primitives/bullet-points";
import { Button } from "~/primitives/button/button.primitive";
import heroBgImgStyles from "~/styles/hero-bg-image-styles";

export const EventsSingleHero = ({
  imagePath,
  ctas,
  customTitle,
  subtitle = "A really engaging paragraph. Introduction to the event, just one or two sentences.",
  quickPoints,
}: {
  imagePath: string;
  ctas: { title: string; url: string }[];
  customTitle?: string;
  subtitle?: string;
  quickPoints?: string[];
}) => {
  // viewport hook
  const { isSmall, isMedium } = useResponsive();
  return (
    <div className="w-full" style={heroBgImgStyles(imagePath)}>
      <div className="bg-white/85 backdrop-blur-xl w-full">
        <div className="w-full flex items-center content-padding py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full mx-auto gap-2 md:gap-8 lg:gap-16 place-items-center md:items-start self-stretch max-w-screen-content md:mb-12">
            {/* Left / Bottom Side (Desktop) */}
            <div className="order-2 md:order-1 flex flex-col gap-10 mb-4 md:mb-0">
              <div className="flex flex-col gap-3 max-w-[600px]">
                <h1 className="font-extrabold heading-h4 md:heading-h3 lg:text-[52px] text-text-primary leading-tight !text-pretty -mb-1">
                  {customTitle}
                </h1>

                {subtitle && (
                  <p className="font-medium lg:text-lg text-[#717182]">
                    {subtitle}
                  </p>
                )}

                {/* CTAs */}
                <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
                  {ctas?.map((cta, i) => (
                    <Button
                      key={i}
                      href={cta.url}
                      intent={i === 0 ? "primary" : "secondary"}
                      size={isSmall || isMedium ? "md" : "lg"}
                      className="w-full md:w-auto"
                    >
                      {cta.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bullet Points */}
              {quickPoints && quickPoints.length > 0 && (
                <BulletPoints
                  dotStyles="bg-navy size-[6px]"
                  textStyles="text-[#717182] text-sm font-medium"
                  className="gap-1 lg:gap-2"
                  points={quickPoints ?? []}
                />
              )}
            </div>

            {/* Right / Top Side (Mobile) */}
            <img
              src={imagePath}
              alt={customTitle}
              className="order-1 md:order-2 w-full max-w-lg md:max-w-[340px] lg:max-w-[480px] xl:!max-w-[638px] aspect-[638/478] md:aspect-[5/6] lg:aspect-[638/478] object-cover rounded-[14px] shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
