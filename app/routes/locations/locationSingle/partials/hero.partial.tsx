import { find } from "lodash";
import { headerData } from "../locations-single.data";

import Button from "~/primitives/button";
import { CampusName } from "../location-single.types";

export const LocationsHero = ({ name }: CampusName) => {
  const headerContent = find(headerData, { name });

  const videoSrc =
    headerContent?.backgroundVideo?.desktop ||
    "https://embed.wistia.com/deliveries/d7da7955aeaabad13c81b0d28eb0a906.mp4";

  return (
    <div className="relative h-[780px] w-full">
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className="absolute left-0 top-0 size-full object-cover"
      />
      {/* Dark Overlay */}
      <div className="absolute size-full bg-[rgba(0,0,0,0.5)]" />

      {/* Hero Content */}
      <div className="absolute top-0 flex size-full flex-col justify-between gap-4 px-4 py-8 text-white md:top-[40%] md:h-auto md:w-full md:justify-start md:px-6 lg:px-10 xl:left-1/2 xl:top-1/2 xl:w-screen xl:max-w-[1240px] xl:-translate-x-1/2 xl:-translate-y-1/2">
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold md:text-6xl">
            Christ Fellowship Church <br className="hidden md:block" /> in{" "}
            <br className="md:hidden" />
            {name}
          </h1>
          <p className="mt-2 max-w-[320px] text-[20px] font-semibold md:max-w-none">
            A church that wants to help you live the life you were created for.
          </p>
        </div>
        <div className="w-3/5 md:mt-12 md:border-t md:border-[#E7E7E7]" />
        <div className="flex w-full flex-col gap-4 md:flex-row md:pt-6">
          <Button
            href="#set-a-reminder"
            intent="primary"
            className="w-full rounded-xl"
          >
            Set a Reminder
          </Button>
          <Button intent="white" className="rounded-xl border-0">
            Get Connected
          </Button>
        </div>
      </div>
    </div>
  );
};
