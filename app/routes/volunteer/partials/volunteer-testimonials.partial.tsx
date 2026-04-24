import { IconButton } from "~/primitives/button/icon-button.primitive";
import { VolunteerTestimonialCarousel } from "../components/volunteer-testimonial-carousel.component";
import { Button } from "~/primitives/button/button.primitive";

export function VolunteerTestimonials() {
  return (
    <>
      <section className="w-full bg-white lg:bg-gray pt-16 pb-12 content-padding">
        <div className="max-w-screen-content mx-auto w-full">
          <div className="flex flex-col items-center justify-center gap-8 md:gap-14">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-navy text-center text-xs font-bold uppercase tracking-[2.4px] md:hidden">
                REAL IMPACT
              </p>
              <h2 className="text-black text-center text-[40px] lg:text-[52px] font-extrabold max-w-[820px] leading-tight">
                Stories of{" "}
                <span className="inline md:hidden">Transformation</span>
                <span className="hidden md:inline">
                  Lives Transformed Through Our Support
                </span>
              </h2>
            </div>

            <div className="w-full">
              <VolunteerTestimonialCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <div className="w-full pt-12 pb-32 md:pb-52 content-padding bg-gray">
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-11 lg:gap-7 max-w-screen-content mx-auto">
          <p className="w-fit text-text-secondary text-center lg:text-left lg:text-xl font-semibold text-pretty">
            Let's find the right fit for you. Just fill out your information,
            and we'll help with the rest.
          </p>
          <div className="hidden lg:block">
            <IconButton
              to="/volunteer-form/welcome"
              withRotatingArrow
              className="bg-white border-neutral-300 text-neutral-dark rounded-full hover:enabled:bg-soft-white hover:enabled:text-neutral-dark"
            >
              Get Started
            </IconButton>
          </div>
          <Button className="lg:hidden w-full max-w-[262px] py-3 rounded-lg">
            Help me find a Spot
          </Button>
        </div>
      </div>
    </>
  );
}
