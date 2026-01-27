import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";

const InternshipsHero = ({
  isSecondary = false,
}: {
  isSecondary?: boolean;
}) => {
  return (
    <div
      className={cn(
        isSecondary ? "bg-ocean" : "bg-navy",
        "w-full py-10 md:py-25 content-padding rounded-b-[1rem] md:rounded-b-none",
      )}
    >
      <div className="max-w-screen-content mx-auto w-full flex flex-col-reverse md:items-center md:justify-center md:flex-row gap-10 md:gap-8 xl:gap-20">
        <div className="flex flex-col gap-10 md:gap-12 max-w-[420px]">
          {/* Title and Description */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="text-[40px] md:text-[58px] lg:text-[80px] font-extrabold text-white leading-[1.1]">
              Christ Fellowship Internships
            </h1>
            <p className="text-white/85">
              Join us for a transformative experience that will shape your
              future and help you discover your calling in ministry.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              href="#program-details"
              intent="white"
              className={cn(
                "font-bold text-xs rounded-[52px] text-white bg-transparent py-3 min-h-[30px] px-3 min-w-[80px]",
                isSecondary
                  ? "hover:!bg-navy hover:!border-navy"
                  : "hover:!bg-ocean hover:!border-ocean",
              )}
            >
              Learn More
            </Button>
            <Button
              href="#apply-now"
              intent="primary"
              className={cn(
                "font-bold",
                "text-xs",
                "rounded-[52px]",
                "py-3",
                "min-h-[30px]",
                "px-3",
                "min-w-[80px]",
                isSecondary && "bg-navy hover:!bg-white hover:!text-navy",
              )}
            >
              Apply Now
            </Button>
          </div>
        </div>

        {/* Image */}
        <img
          src="/assets/images/internships/hero.webp"
          alt="Internships Hero"
          className="w-full md:max-w-[360px] lg:max-w-[482px] aspect-video md:aspect-square object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default InternshipsHero;
