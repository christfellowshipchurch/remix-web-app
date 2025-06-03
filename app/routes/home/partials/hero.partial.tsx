import { Link } from "react-router";
import { LocationSearch } from "../components/location-search/location-search.component";
import { IconName } from "~/primitives/button/types";
import { Icon } from "~/primitives/icon/icon";
import { Video } from "~/primitives/video/video.primitive";

export function DesktopHeroSection() {
  return (
    <section className="h-screen w-full bg-white pb-16">
      <div className="flex size-full relative">
        {/* Left Column */}
        <img
          className="absolute inset-0 w-1/2 h-full object-cover object-left z-0"
          src="/assets/images/home/home-hero-bg.webp"
          alt="Hero Background"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 w-1/2 h-full bg-ocean opacity-90 z-1" />
        <div className="flex-1 flex flex-col items-center justify-between xl:items-start gap-10 h-full pt-12 xl:pt-0">
          <div className="flex flex-col gap-8 pl-8 h-full justify-center ml-auto xl:pl-0 xl:mx-auto">
            <h1 className="text-[100px] text-white font-extrabold leading-none max-w-[600px] z-2">
              There's{" "}
              <span className="text-dark-navy">
                something <br />
                for
              </span>{" "}
              you
            </h1>
            <p className="text-white max-w-[540px] text-xl z-2">
              Discover a community where your questions are welcome, your
              journey is honored, and you'll find genuine connection and
              relevant answers for your life right here in Florida.
            </p>
            <div className="flex w-fit relative pb-10 z-2">
              {/* Location Search */}
              <LocationSearch />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="z-2 w-full">
            <BottomBar />
          </div>
        </div>

        {/* Right Column - Background Video */}
        <div className="flex-1 relative h-full">
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src="/assets/images/home/bg-vid.webp"
              alt="Hero Background"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <Video
              wistiaId="ieybr1sv38"
              autoPlay
              muted
              loop
              className="w-full h-full object-cover absolute inset-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export const BottomBar = () => {
  return (
    <div className="w-full px-8 py-8 md:py-12 md:pt-8 md:pb-16 lg:py-12 bg-white xl:pl-0 xl:mx-auto ">
      <div className="flex flex-col md:flex-row justify-center lg:justify-start gap-4 md:gap-8 lg:gap-12 xl:max-w-[600px] xl:mx-auto">
        <BottomBarItem
          iconName="messageSquareDetail"
          heading="Featured Item"
          title="Featured Item Text"
          url="sms:441-441"
        />
        <BottomBarItem
          iconName="church"
          heading="Comunidad Hispana"
          title="Iglesia en Español"
          url="#cfe"
        />
      </div>
    </div>
  );
};

const BottomBarItem = ({
  iconName,
  heading,
  title,
  url,
}: {
  iconName: IconName;
  heading: string;
  title: string;
  url: string;
}) => {
  return (
    <Link
      to={url}
      className="bg-navy-subdued lg:bg-transparent rounded-xl lg:rounded-none flex lg:items-center lg:justify-center gap-4 lg:gap-2 group p-4 lg:p-0 w-full lg:w-auto md:max-w-[304px] lg:max-w-none"
    >
      <div className="bg-ocean lg:bg-dark-navy group-hover:bg-ocean transition-colors duration-300 rounded-sm p-2 ">
        <Icon name={iconName} color="white" />
      </div>
      <div>
        <p className="text-sm text-text-secondary">{heading}</p>
        <h4 className="font-bold">{title}</h4>
      </div>
    </Link>
  );
};

export const MobileHeroSection = () => {
  return (
    <section className="h-[75dvh] w-full bg-white pb-16 relative">
      <div className="absolute inset-0 w-full h-full z-1">
        <img
          src="/assets/images/home/bg-vid.webp"
          alt="Hero Background"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <Video
          wistiaId="ieybr1sv38"
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-dark-navy z-2" />
      <div className="relative z-3 flex flex-col gap-8 pl-8 md:pl-[12%] pr-8 md:pr-0 pt-16 h-full justify-center ml-auto">
        <h1 className="text-[64px] text-white font-extrabold leading-none">
          There's <br className="hidden md:block " />
          <span className="text-ocean">
            something <br />
            for
          </span>{" "}
          you.
        </h1>

        {/* Location Search */}
        <LocationSearch />
      </div>
    </section>
  );
};
