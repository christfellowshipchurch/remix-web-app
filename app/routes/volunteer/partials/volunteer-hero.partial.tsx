import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

export const VolunteerHero = () => {
  return (
    <section
      aria-label="Volunteer Hero"
      className="bg-[#F1F4F5] w-full"
    >
      <div
        className={
          "max-w-screen-content mx-auto " +
          "px-5 md:px-12 lg:px-18 py-12 lg:py-24 " +
          "flex flex-col-reverse gap-10 " +
          "lg:grid lg:grid-cols-2 lg:items-center lg:gap-16"
        }
      >
        {/* TEXT COLUMN */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <h1 className="font-extrabold heading-h1 text-[3rem] md:text-[4rem] lg:text-[5.5rem] leading-[1.05] text-navy">
            Find Your Place
            <br />
            <span className="text-[#0092BC]">to Volunteer</span>
          </h1>

          <p className="text-navy/80 text-lg lg:text-xl max-w-[520px]">
            We want every volunteer&apos;s experience at Church to be a
            fulfilling journey where they feel welcomed and can share the love
            of Jesus. Our hope is that every volunteer understands the impact
            they have, knowing they are making a difference in the lives of
            others.
          </p>

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <Button
              intent="primary"
              href="#TBD"
              className="w-full md:w-auto min-w-[240px] gap-2"
            >
              Find Your Fit
              <Icon name="arrowRight" size={18} className="text-white" />
            </Button>

            <Button
              intent="secondary"
              href="#volunteer-at-church"
              className="w-full md:w-auto min-w-[240px]"
            >
              <span className="lg:hidden">Browse All</span>
              <span className="hidden lg:inline">Browse All Opportunities</span>
            </Button>
          </div>
        </div>

        {/* IMAGE COLUMN */}
        <div className="relative">
          {/* Soft blue glow — desktop only */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute -inset-6 -z-10 bg-[#0092BC]/15 blur-3xl rounded-full"
          />

          <img
            src="/assets/images/volunteer/hero.webp"
            alt="A volunteer smiling while serving food at a community event"
            fetchPriority="high"
            decoding="async"
            className="w-full h-auto rounded-xl object-cover lg:rotate-[-3deg] lg:shadow-2xl"
          />

          {/* Stat badge — desktop only */}
          <div className="hidden lg:flex absolute bottom-6 -left-6 items-center gap-3 bg-white rounded-xl shadow-lg px-5 py-3">
            <div className="size-10 rounded-full bg-[#0092BC]/10 flex items-center justify-center">
              <Icon name="heart" size={20} className="text-[#0092BC]" />
            </div>
            <div>
              <div className="font-bold text-navy text-xl leading-none">
                695k+
              </div>
              <div className="text-xs uppercase tracking-wider text-navy/60 mt-1">
                Lives Impacted
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
