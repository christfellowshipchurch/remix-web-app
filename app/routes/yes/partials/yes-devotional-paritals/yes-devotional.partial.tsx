import { AppSection } from "~/routes/home/partials/app.partial";
import { YesDevotionalPartial as DevotionalPartial } from "./yes-devotional-partial";
import { YesHero as HeroPartial } from "./yes-hero-partial";

export const YesDevotional = () => {
  return (
    <div className="flex flex-col w-full relative">
      <img
        src="/assets/images/yes-hero.webp"
        alt="Yes Hero"
        className="w-full h-[118svh] 2xl:h-[110svh] object-cover absolute top-0 left-0"
      />
      {/* Hero */}
      <HeroPartial />

      {/* Devotional */}
      <DevotionalPartial />

      {/* App Download */}
      <AppSection />
    </div>
  );
};

export default YesDevotional;
