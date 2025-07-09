import { Icon } from "~/primitives/icon/icon";

export const YesHero = () => {
  return (
    <div className="flex flex-col w-full h-full min-h-[110svh]">
      <div className="flex flex-col gap-6 items-center justify-center w-full h-full min-h-[110svh]">
        <div className="flex flex-col gap-3 items-center text-center">
          <h1 className="text-[100px] font-extrabold text-[#00354D] leading-tight">
            You Said <span className="text-white">YES!</span>
          </h1>
          <p className="text-xl text-white">
            You said yes to Jesus, and we’re so excited for you! Now, what’s
            next?
          </p>
        </div>

        {/* Card Sections */}
        <div className="flex gap-4 md:gap-6">
          {HeroCardData.map((card) => (
            <HeroCard key={card.link} copy={card.copy} />
          ))}
        </div>
      </div>
    </div>
  );
};

const HeroCardData: { link: string; copy: string }[] = [
  {
    link: "/app",
    copy: "A two-week course to start your relationship with Jesus.",
  },
  {
    link: "/app",
    copy: "Access resources, submit prayers, & get involved in our app",
  },
  {
    link: "/app",
    copy: "Download the free Bible App from YouVersion",
  },
];

const HeroCard = ({ copy }: { copy: string }) => {
  return (
    <div className="relative flex flex-col items-center gap-4 border-2 border-white max-w-[200px] px-2 pt-8 pb-14 rounded-[36px] group hover:bg-white transition-all duration-400 cursor-pointer">
      <Icon
        name="arrowRight"
        className="absolute -bottom-5 text-white bg-navy rounded-full size-10 p-[2px] -rotate-45 group-hover:rotate-0 transition-all duration-400"
      />
      <p className="text-lg text-center text-[#FAFAFC] font-semibold group-hover:text-text-secondary transition-all duration-400">
        {copy}
      </p>
    </div>
  );
};
