import { Button } from "~/primitives/button/button.primitive";

export type DiveInProps = {
  title?: string;
  paragraph?: string;
  ctaText?: string;
  ctaHref?: string;
};

const DiveIn = ({
  title = "Find Your Place",
  paragraph = "Discover your niche by engaging with others and building meaningful connections. Apply today to start your journey.",
  ctaText = "Apply Now",
  ctaHref = "#todo",
}: DiveInProps) => {
  return (
    <section
      className="w-full content-padding py-12 md:py-16"
      id="find-your-place"
    >
      <div className="max-w-screen-content mx-auto w-full">
        <div className="flex flex-col-reverse md:flex-row gap-0 overflow-hidden">
          <div className="flex-1 flex flex-col justify-center gap-6 md:gap-8 p-8 md:p-12 lg:p-16 text-white">
            <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-bold leading-[1.05]">
              {title}
            </h2>
            <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-xl">
              {paragraph}
            </p>
            <Button
              href={ctaHref}
              intent="white"
              className="w-fit min-w-[120px] min-h-[44px] px-6 font-semibold text-dark-navy rounded-[52px] border-none"
            >
              {ctaText}
            </Button>
          </div>

          <img
            src="/assets/images/internships/dive-in.webp"
            alt="Dive In"
            className="w-full md:max-w-[50%] md:min-h-[320px] object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default DiveIn;
