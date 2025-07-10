import { AppSection } from "~/routes/home/partials/app.partial";
import { DevotionalSection } from "../components/yes-devotional.component";
import { YesHero as HeroSection } from "../components/yes-devotional-hero.component";

export const YesDevotional = () => {
  return (
    <div className="flex flex-col w-full relative">
      {/* Mobile Image */}
      <img
        src="/assets/images/yes-hero-mobile.png"
        alt="Yes Hero"
        className="md:hidden w-full h-screen object-cover absolute top-0"
      />

      {/* Desktop Image */}
      <img
        src="/assets/images/yes-hero.webp"
        alt="Yes Hero"
        className="hidden lg:block w-full h-[118svh] 2xl:h-[110svh] object-cover absolute top-0 left-0"
      />
      {/* Hero */}
      <HeroSection />

      {/* Devotional */}
      <DevotionalSection />

      {/* App Download */}
      <AppSection />
    </div>
  );
};

export default YesDevotional;
