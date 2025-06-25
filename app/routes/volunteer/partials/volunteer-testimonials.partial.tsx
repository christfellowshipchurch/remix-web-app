import { IconButton } from "~/primitives/button/icon-button.primitive";
import {
  VolunteerTestimonialTabs,
  VolunteerTestimonialsMobile,
} from "../components/volunteer-testimonial-tabs.component";
import { Button } from "~/primitives/button/button.primitive";

export function VolunteerTestimonials() {
  return (
    <>
      <section className="w-full bg-white lg:bg-gray pt-16 pb-12 content-padding">
        <div className="max-w-screen-content mx-auto w-full">
          <div className="w-full flex flex-col justify-center items-center gap-24">
            <div className="flex flex-col items-center justify-center gap-16">
              {/* Heading Section*/}
              <div className="w-full text-center flex flex-col justify-center items-center content-padding lg:px-0">
                <h2 className="text-black text-2xl lg:text-[2rem] font-extrabold">
                  Here from other Volunteers
                </h2>
                <p className="text-text-secondary lg:text-lg text-center max-w-3xl font-medium">
                  Find out what to expect at a service, how we support families,
                  and what guides our faith. These videos feature everyday
                  members sharing their experiences and answering your
                  questions.
                </p>
              </div>

              {/* Tabs Components */}
              <div className="w-full">
                <div className="w-full hidden lg:block">
                  <VolunteerTestimonialTabs />
                </div>
                <div className="w-full max-w-screen lg:hidden">
                  <VolunteerTestimonialsMobile />
                </div>
              </div>
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
          <Button className="lg:hidden w-full max-w-[262px] py-3 rounded-[8px]">
            Help me find a Spot
          </Button>
        </div>
      </div>
    </>
  );
}
