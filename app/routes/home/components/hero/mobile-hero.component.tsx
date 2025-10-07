import { LocationSearch } from "../location-search/location-search.component";
import { MobileFeaturedItems } from "./mobile-features.component";

export const MobileHeroSection = () => {
  return (
    <section className="h-[100dvh] w-full bg-white pb-8 relative max-h-[700px]">
      {/*  Background Video */}
      <div className="absolute inset-0 w-full h-full z-1">
        <img
          src="/assets/images/home/bg-vid.webp"
          alt="Hero Background"
          className="w-full h-full object-cover absolute inset-0 z-1"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />
        <iframe
          src={`https://fast.wistia.net/embed/iframe/ieybr1sv38?fitStrategy=cover`}
          className="w-full h-full absolute inset-0 z-1"
        />
      </div>
      {/*  Background Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full z-2 bg-gradient-to-b from-ocean/40 to-ocean" />
      {/*  Content */}
      <div className="relative z-3 flex flex-col justify-end gap-8 h-full px-4">
        {/*  Top Divider */}
        <div className="md:hidden absolute top-[82px] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-full bg-[#D9D9D9] opacity-50 max-w-[340px] sm:max-w-[500px]" />

        {/*  Main content */}
        <div className="flex flex-col gap-8 justify-end">
          {/*  Title */}
          <h1 className="text-5xl text-white font-extrabold leading-none md:px-4">
            Find your <br className="hidden md:block " />
            People.
            <span className="text-dark-navy">
              {" "}
              Find <br />
              Your Purpose.
            </span>
          </h1>

          {/*  Description */}
          <p className="text-white max-w-[430px] pr-6 md:px-4">
            From inspiring messages to genuine community, Christ Fellowship is a
            place where you and your family can grow in your faith and make
            lifelong friendships.
          </p>

          {/* Location Search */}
          <div className="md:px-4">
            <LocationSearch />
          </div>
        </div>

        {/*  Bottom Divider */}
        {/*  Top spacer */}
        <div className="flex items-center justify-center">
          <div className="h-[1px] w-full bg-[#D9D9D9] opacity-50" />
        </div>
        <MobileFeaturedItems />
      </div>
    </section>
  );
};
