import { IconButton } from "~/primitives/button/icon-button.primitive";
import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";

export const HeroMobileContent = () => {
  const { episode } = useLoaderData<LoaderReturnType>();
  const { title, summary, season, episodeNumber, showGuests, publishDate } =
    episode;

  return (
    <div className="w-full bg-white content-padding md:hidden">
      <div className="flex flex-col max-w-screen-content mx-auto">
        <div className="flex flex-col gap-8 pt-8 text-text-primary font-medium">
          <div className="flex flex-col gap-1">
            <h1
              className="max-w-2xl font-extrabold text-2xl text-pretty leading-tight tracking-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-xs font-medium">
              Season {season} | Episode {episodeNumber}
            </p>
            <p className="text-base font-normal">{`${showGuests} - ${publishDate}`}</p>
          </div>
          {summary && (
            <p
              className="text-sm max-w-2xl"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )}
          {/* TODO: Add share functionality */}
          <IconButton withRotatingArrow={true}>Share this episode</IconButton>
        </div>
        <div className="h-[1px] opacity-10 bg-black/75 mt-12" />
      </div>
    </div>
  );
};
