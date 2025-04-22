import { SectionTitle } from "~/components";
import { BeliefsCarousel } from "../components/beliefs-carousel.component";
import { cn } from "~/lib/utils";
import { BeliefsCarouselMobile } from "../components/beliefs-carousel-mobile.component";

export function BeliefsSection() {
  return (
    <section className="relative py-0 md:py-16 lg:pt-40">
      <div className="content-padding">
        <div className="container max-w-screen-content mx-auto">
          {/* Beliefs Title */}
          <div className="relative flex flex-col gap-6 pb-12 w-full">
            <SectionTitle sectionTitle="our beliefs." />
            <h3 className="font-extrabold text-text-primary text-[28px] md:text-5xl leading-tight">
              <span className="hidden md:block">
                History of Christ <br />
                Fellowship Church
              </span>
              <span className="block md:hidden">
                Beliefs drawn <br />
                from the Bible.
              </span>
            </h3>
            {/* Chapel Image */}
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
          </div>
          {/* Beliefs Carousel */}
          <div className="hidden md:block">
            <BeliefsCarousel />
          </div>
        </div>
      </div>
      {/* Navy BG */}
      <div className="absolute bottom-0 w-full h-[50%] bg-dark-navy z-[-1]" />
      {/* Mobile Beliefs Carousel */}
      <div className="block md:hidden">
        <BeliefsCarouselMobile />
      </div>
    </section>
  );
}
