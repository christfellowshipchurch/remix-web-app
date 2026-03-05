import React from "react";
import { Link } from "react-router";
import { Icon } from "~/primitives/icon/icon";

const Paths = () => {
  return (
    <section className="w-full content-padding py-12 md:py-16 lg:py-24 bg-[#F9F9F9]">
      <div className="max-w-screen-content mx-auto w-full flex flex-col gap-16 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">
            Choose Your Path
          </p>
          <h2 className="text-[32px] md:text-[40px] lg:text-[52px] font-bold leading-[1.05] text-[#00354d]">
            Two Programs, One Mission
          </h2>
          <p className="text-neutral-default max-w-[540px] w-full mx-auto">
            Whether you’re looking for an immersive summer experience or a
            year-round opportunity alongside your studies, we have a place for
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <PathsItem
            title="Summer Internships"
            description="Experience a summer like never before! Designed for college-aged young adults passionate about ministry, this hands-on experience invites you to dive into the life of our church while making a real Kingdom impact."
            imageSrc="/assets/images/internships/summer.webp"
            duration="12-Week Program"
            pills={["Mid-May – Mid-August", "Full-Time", "Stipend"]}
            ctaLink="/summer-internships"
          />
          <PathsItem
            title="College Internships"
            description="A year-round opportunity designed to equip and develop students for future ministry leadership. Grow personally, professionally, and spiritually while learning from experienced leaders."
            imageSrc="/assets/images/internships/year-round.webp"
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
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <div className="aspect-video h-[280px] relative">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent" />

        {duration && (
          <p className="absolute bottom-0 left-0 bg-ocean text-sm text-bold ml-4 mb-4 py-1 px-2 rounded-[16777200]">
            {duration}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <h3 className="text-[24px] md:text-[32px] font-bold leading-[1.05] text-[#00354d]">
          {title}
        </h3>

        <p className="text-neutral-default text-base md:text-lg leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => (
            <p
              key={pill}
              className="text-neutral-default text-base md:text-lg leading-relaxed"
            >
              {pill}
            </p>
          ))}
        </div>

        <Link
          to={ctaLink}
          className="flex items-center gap-2 text-ocean font-semibold text-[15px]"
        >
          <span>Learn More</span>
          <Icon name="arrowRight" className="size-4 text-ocean" />
        </Link>
      </div>
    </div>
  );
};

export default Paths;
