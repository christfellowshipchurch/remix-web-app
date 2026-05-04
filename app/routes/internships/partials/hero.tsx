import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";

export type InternshipsHeroProps = {
  /** Summer (and similar) variant: subheading above title, single Apply Now CTA, image on right */
  subheading: string;
  title: string;
  subtitle: string;
  ctas: {
    href: string;
    text: string;
  }[];
  imageSrc: string;
  imageAlt: string;
};

const InternshipsHero = ({
  subheading,
  title,
  subtitle,
  ctas,
  imageSrc,
  imageAlt = "Internships Hero",
}: InternshipsHeroProps) => {
  return (
    <section
      className={cn(
        "bg-navy",
        "w-full py-10 md:py-16 lg:py-20 content-padding rounded-b-2xl md:rounded-b-none",
      )}
    >
      <div className="max-w-[1120px] mx-auto w-full flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-10 md:gap-8 xl:gap-16">
        <div className="flex flex-col gap-8 md:gap-10 max-w-[520px]">
          {subheading && (
            <p className="text-ocean text-sm font-medium uppercase tracking-[2px] leading-[21px]">
              {subheading}
            </p>
          )}
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="text-[40px] md:text-[52px] lg:text-[60px] font-bold text-white leading-none">
              {title}
            </h1>
            <p className="text-white/85 md:text-lg leading-[26px]">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {ctas.map((cta, index) => (
              <Button
                key={index}
                href={cta.href}
                intent={index === 0 ? "white" : "primary"}
                className={cn(
                  "font-bold text-base rounded-[52px] py-3 min-h-[30px] px-5 min-w-[80px] transition-colors duration-300",
                  index === 0
                    ? "text-white bg-transparent hover:bg-white/10! hover:border-white/20!"
                    : "hover:bg-dark-navy! hover:border-dark-navy!",
                )}
              >
                {cta.text}
              </Button>
            ))}
          </div>
        </div>

        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn(
            "w-full object-cover rounded-xl bg-gray-200",
            "md:max-w-[360px] lg:max-w-[482px] aspect-video md:aspect-square",
          )}
        />
      </div>
    </section>
  );
};

export default InternshipsHero;
