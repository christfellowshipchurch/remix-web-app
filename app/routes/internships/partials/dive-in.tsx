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
      className="w-full bg-navy content-padding py-12 md:py-16"
      id="find-your-place"
    >
      <div className="max-w-[1120px] mx-auto w-full">
        <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-8 overflow-hidden">
          <div className="flex-1 flex flex-col justify-center gap-3 md:gap-8">
            <h2 className="text-[32px] md:text-[44px] font-bold leading-[1.05] text-white">
              {title}
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-white/80 max-w-xl">
              {paragraph}
            </p>
            <Button
              href={ctaHref}
              intent="primary"
              className="mt-3 md:mt-0 w-fit min-w-[120px] min-h-[44px] px-6 font-semibold rounded-[52px] border-ocean hover:border-white"
            >
              {ctaText}
            </Button>
          </div>

          <img
            src="/assets/images/internships/dive-in.webp"
            alt="Dive In"
            className="w-full md:max-w-[50%] md:min-h-[320px] object-cover object-center rounded-[1rem]"
          />
        </div>
      </div>
    </section>
  );
};

export default DiveIn;
