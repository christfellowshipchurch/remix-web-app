import { find } from "lodash";
import { headerData } from "../locations-single.data";

import Button from "~/primitives/button";
import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "../loader";
import { HeroTitleSection } from "../components/hero-title-section.component";

export const LocationsHero = () => {
  // TODO: Get header videos from Rock
  const { name } = useLoaderData<LoaderReturnType>();
  const headerContent = find(headerData, { name });
  const videoSrc = headerContent?.backgroundVideo?.desktop;

  const cfe = name?.includes("Español");
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
        <HeroTitleSection name={name} />
        <div className="w-3/5 md:mt-12 md:border-t md:border-[#E7E7E7]" />
        <div className="flex w-full flex-col gap-4 md:flex-row md:pt-6">
          {/* Add onClick modals */}
          <Button
            href={`${
              name?.includes("Online")
                ? "https://www.youtube.com/user/christfellowship"
                : "#set-a-reminder"
            }`}
            intent="primary"
            className="w-full rounded-xl"
          >
            {cfe
              ? "Recuérdame"
              : name?.includes("Online")
              ? "Join Us Online"
              : "Set a Reminder"}
          </Button>
          <Button intent="white" className="rounded-xl border-0">
            {cfe ? "Conéctate" : "Get Connected"}
          </Button>
        </div>
      </div>
    </div>
  );
};
