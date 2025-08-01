import { SectionTitle } from "~/components";
import { BeliefsCarousel } from "../components/beliefs-carousel.component";
import { cn } from "~/lib/utils";
import { BeliefsCarouselMobile } from "../components/beliefs-carousel-mobile.component";

export function BeliefsSection({
  customTitle,
  removeChapel = false,
}: {
  customTitle?: string;
  removeChapel?: boolean;
}) {
  return (
    <section id="beliefs" className="relative md:py-16 lg:pt-40 w-full">
      <div className="content-padding">
        <div className="container max-w-screen-content mx-auto">
          {/* Beliefs Title */}
          <div className="relative flex flex-col gap-6 pb-12 w-full">
            <SectionTitle sectionTitle="our beliefs." />
            <h3 className="font-extrabold text-text-primary text-[28px] md:text-5xl leading-tight">
              {customTitle ? (
                <span>{customTitle}</span>
              ) : (
                <>
                  <span className="hidden lg:block">
                    Beliefs And Theological <br />
                    Positions Drawn From The Bible.
                  </span>
                  <span className="block lg:hidden">
                    Beliefs drawn <br />
                    from the Bible.
                  </span>
                </>
              )}
            </h3>
            {/* Chapel Image */}
            {!removeChapel && (
              <img
                src="/assets/images/about/chapel.webp"
                alt="Beliefs"
                className={cn(
                  "absolute bottom-0 right-0 w-[40vw] object-cover",
                  "sm:w-[30vw]",
                  "md:right-1/12 md:w-[20vw]",
                  "lg:right-1/8 lg:max-w-[300px]"
                )}
              />
            )}
          </div>
          {/* Beliefs Carousel */}
          <div className="hidden md:block">
            <BeliefsCarousel />
          </div>
        </div>
      </div>
      {/* Navy BG */}
      <div className="absolute bottom-0 w-full h-[50%] bg-navy z-[-1]" />
      {/* Mobile Beliefs Carousel */}
      <div className="block md:hidden">
        <BeliefsCarouselMobile />
      </div>
    </section>
  );
}
