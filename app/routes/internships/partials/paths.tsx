import { useId } from "react";
import { Link } from "react-router";
import { getImageUrl } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";

const Paths = () => {
  return (
    <section
      className="w-full content-padding py-12 md:py-16 lg:py-24 bg-[#F9F9F9]"
      id="programs"
    >
      <div className="max-w-[1120px] mx-auto w-full flex flex-col gap-16 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
          <p className="text-sm font-medium uppercase tracking-[2px] text-ocean">
            Choose Your Path
          </p>
          <h2 className="text-[32px] md:text-[40px] lg:text-[52px] font-bold leading-[1.05] text-dark-navy">
            Two Programs, One Mission
          </h2>
          <p className="text-neutral-default max-w-[540px] w-full mx-auto">
            Whether you’re looking for an immersive summer experience or a
            year-round opportunity alongside your studies, we have a place for
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-[1158px]">
          <PathsItem
            title="Summer Internships"
            description="Experience a summer like never before! Designed for college-aged young adults passionate about ministry, this hands-on experience invites you to dive into the life of our church while making a real Kingdom impact."
            imageSrc={getImageUrl("3149952")}
            duration="12-Week Program"
            pills={["Mid-May – Mid-August", "Full-Time", "Stipend"]}
            ctaLink="/summer-internships"
          />
          <PathsItem
            title="College Internships"
            description="A year-round opportunity designed to equip and develop students for future ministry leadership. Grow personally, professionally, and spiritually while learning from experienced leaders."
            imageSrc={getImageUrl("3149959")}
            duration="12-Week Program"
            pills={["August – August", "Part-Time · 25 hrs/wk", "Hourly Wage"]}
            ctaLink="/year-round-internships"
          />
        </div>
      </div>
    </section>
  );
};

const PathsItem = ({
  title,
  description,
  imageSrc,
  duration,
  pills,
  ctaLink,
}: {
  title: string;
  description: string;
  imageSrc: string;
  duration: string;
  pills: string[];
  ctaLink: string;
}) => {
  const headingId = useId();

  return (
    <Link
      to={ctaLink}
      aria-labelledby={headingId}
      className="flex flex-col items-center justify-center w-full rounded-[20px] overflow-hidden shadow-lg text-left no-underline text-inherit transition-transform duration-300 ease-in-out hover:-translate-y-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2"
    >
      <div className="h-auto max-h-[240px] md:max-h-[360px] lg:max-h-[280px] w-full object-cover relative bg-center">
        <img src={imageSrc} alt="" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/40 to-transparent" />

        {duration && (
          <p className="absolute bottom-0 left-0 text-white bg-ocean text-sm text-bold ml-4 mb-4 py-1 px-3 rounded-[16777200px]">
            {duration}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full bg-white p-4 md:p-8">
        <h3
          id={headingId}
          className="text-[24px] md:text-[32px] font-bold leading-[1.05] text-dark-navy"
        >
          {title}
        </h3>

        <p className="text-neutral-default text-base md:text-lg leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => (
            <p
              key={pill}
              className="text-xs font-medium leading-[18px] bg-ocean-subdued text-navy px-4 py-2 rounded-[16777200px]"
            >
              {pill}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-2 text-ocean font-semibold text-[15px]">
          <span>Learn More</span>
          <Icon name="arrowRight" className="size-4 text-ocean" />
        </div>
      </div>
    </Link>
  );
};

export default Paths;
