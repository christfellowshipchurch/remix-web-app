import Icon from "~/primitives/icon";
import { VolunteerAtChurchCarousel } from "../components/volunteer-at-church-carousel.component";
import { Button } from "~/primitives/button/button.primitive";

export function VolunteerAtChurch() {
  return (
    <section
      id="volunteer-at-church"
      className="w-full bg-dark-navy text-white pl-5 md:pl-12 lg:px-18"
    >
      <div className="mx-auto max-w-[1280px] w-full flex flex-col items-center gap-10 py-16 md:gap-14 md:py-24 lg:py-28">
        <div className="flex w-full flex-col gap-6 pr-5 text-white md:flex-row md:items-end md:justify-between md:pr-12 lg:pr-18 2xl:pr-8! 3xl:pr-0!">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-1 bg-ocean-web" />
              <h3 className="text-ocean-web text-xl font-extrabold">
                Join the Dream Team!
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-[40px] font-extrabold leading-tight md:text-[52px]">
                Volunteer <br className="md:hidden" /> At Church
              </h2>
              <Button
                href="/volunteer-form/welcome"
                intent="primary"
                size="lg"
                className="min-w-[125px] w-full shrink-0 text-start bg-ocean-web text-white transition-all duration-300 text-sm text-bold hover:bg-navy md:w-fit flex md:hidden gap-2"
              >
                <p>
                  Help Me <br />
                  <span className="text-dark-navy">Find My Fit</span>
                </p>
              </Button>
            </div>
          </div>

          <a
            href="/volunteer-form/welcome"
            className="hidden w-full shrink-0 text-white transition-all duration-300 hover:translate-x-1 md:w-fit md:flex gap-2"
          >
            <p className="text-lg font-bold">Help Me Find My Fit</p>
            <Icon name="arrowRight" className="text-white" size={24} />
          </a>
        </div>

        <VolunteerAtChurchCarousel />
      </div>
    </section>
  );
}
