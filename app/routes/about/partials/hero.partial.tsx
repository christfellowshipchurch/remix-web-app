import { Link } from "react-router";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import { IconName } from "~/primitives/button/types";
import { Icon } from "~/primitives/icon/icon";

export function DesktopHeroSection() {
  return (
    <section className="h-screen w-full bg-white pb-16">
      <div className="flex size-full relative">
        {/* Left Column */}
        <div
          className="flex-1 flex flex-col items-center justify-between gap-10 h-full"
          style={{
            background:
              "linear-gradient(rgba(0, 146, 188, 0.9), rgba(0, 146, 188, 0.9)), url('/assets/images/home-hero-bg.jpg') left/cover no-repeat",
          }}
        >
          <div className="flex flex-col gap-8 pl-8 pt-16 h-full justify-center ml-auto xl:mx-auto xl:max-w-[500px]">
            <h1 className="text-[64px] lg:text-[105px] text-white font-extrabold leading-none lg:max-w-[600px]">
              There's{" "}
              <span className="text-ocean lg:text-dark-navy">
                something <br />
                for
              </span>{" "}
              you
            </h1>
            <div className="flex w-fit">
              <Link to="/locations" prefetch="intent">
                <IconButton
                  iconName="arrowBack"
                  className="text-white border-white rounded-full py-4 px-8"
                  withRotatingArrow
                  iconClasses="!bg-dark-navy size-[52px]"
                  iconSize={34}
                >
                  Times and Locations
                </IconButton>
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <BottomBar />
        </div>

        {/* Right Column - Background Video */}
        <div className="flex-1 relative">
          <div className="size-full bg-gradient-to-t from-transparent via-transparent via-75% to-white opacity-75 top-0 left-0 absolute z-20" />
          <img
            src="/assets/images/image-holder.jpg"
            alt="friends at church 1"
            className="w-full h-full object-cover relative z-1"
          />
        </div>
      </div>
    </section>
  );
}

const BottomBar = () => {
  return (
    <div className="w-full px-8 py-12 bg-white">
      <div className="max-w-[450px] mx-auto flex justify-between w-full">
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
    <Link to={url} className="flex items-center justify-center gap-2 group">
      <div className="bg-dark-navy group-hover:bg-ocean transition-colors duration-300 rounded-sm p-2">
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
    <section className="h-screen w-full bg-white pb-16">
      <div className="flex flex-col gap-8 pl-8 pt-16 h-full justify-center ml-auto">
        <h1 className="text-[64px] lg:text-[105px] text-white font-extrabold leading-none lg:max-w-[600px]">
          There's{" "}
          <span className="text-ocean lg:text-dark-navy">
            something <br />
            for
          </span>{" "}
          you
        </h1>
      </div>
    </section>
  );
};
