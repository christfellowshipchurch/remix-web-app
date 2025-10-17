import { LocationSearch } from "../location-search/location-search.component";
import { DesktopFeaturedItems } from "./desktop-features.component";

export function DesktopHeroSection() {
  return (
    <section className="h-[100vh] w-full bg-white pb-16 mt-[-26px]">
      <div className="flex size-full relative">
        {/* Left Column */}
        <img
          className="absolute inset-0 w-1/2 h-full object-cover object-left z-0"
          src="/assets/images/home/home-hero-bg.webp"
          alt="Hero Background"
          loading="eager"
          // @ts-expect-error - fetchpriority is a valid HTML attribute but not in React types
          fetchpriority="high"
        />
        <div className="absolute inset-0 w-1/2 h-full bg-ocean opacity-90 z-1" />
        <div className="flex-1 flex flex-col items-center justify-between xl:items-start gap-10 h-full pt-12 xl:pt-0">
          <div className="flex flex-col gap-8 pl-8 h-full justify-center ml-auto xl:pl-0 xl:mx-auto">
            <h1 className="text-[64px] xl:text-[86px] text-white font-extrabold leading-none max-w-[600px] z-2">
              Find Your <br />
              People.{" "}
              <span className="text-dark-navy">
                Find <br />
                Your Purpose.
              </span>
            </h1>
            <p className="text-white max-w-[529px] text-xl z-2">
              From inspiring messages to genuine community, Christ Fellowship is
              a place where you and your family can grow in your faith and make
              lifelong friendships.
            </p>
            <div className="flex w-fit relative pb-10 z-3">
              {/* Location Search */}
              <LocationSearch />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="z-1 w-full">
            <DesktopFeaturedItems />
          </div>
        </div>

        {/* Right Column - Background Video */}
        <div className="flex-1 relative h-full">
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src="/assets/images/home/bg-vid.webp"
              alt="Hero Background"
              className="w-full h-full object-cover absolute inset-0 z-0"
              loading="eager"
              // @ts-expect-error - fetchpriority is a valid HTML attribute but not in React types
              fetchpriority="high"
            />
            <iframe
              src={`https://fast.wistia.net/embed/iframe/ieybr1sv38?fitStrategy=cover`}
              className="w-full h-full absolute inset-0 z-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
