import lodash from "lodash";
import { headerData } from "../locations-single.data";

import { Button } from "~/primitives/button/button.primitive";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";
import { SetAReminderModal, ConnectCardModal } from "~/components";

export const LocationsHero = ({
  bgVideo,
  ctas,
}: {
  bgVideo: string;
  ctas: { href: string; title: string }[];
}) => {
  const { name } = useLoaderData<LoaderReturnType>();

  const isEspanol = name?.includes("Español");
  return (
    <div className="relative h-[780px] w-full">
      <video
        src={bgVideo}
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
        <div className="w-3/5 md:mt-12 md:border-t md:border-[#E7E7E7]" />
        <div className="flex w-full flex-col gap-4 md:flex-row md:pt-6">
          {!name?.includes("Online") ? (
            <SetAReminderModal />
          ) : (
            <Button
              href="https://www.youtube.com/user/christfellowship"
              intent="primary"
              className="rounded-xl"
            >
              Join Us Online
            </Button>
          )}
          <ConnectCardModal isEspanol={isEspanol} />
        </div>
      </div>
    </div>
  );
};
