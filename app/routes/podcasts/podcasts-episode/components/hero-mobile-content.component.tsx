import { IconButton } from "~/primitives/button/icon-button.primitive";

export const HeroMobileContent = ({
  title,
  description,
  season,
  episodeNumber,
  authors,
}: {
  title: string;
  description: string;
  season: string;
  episodeNumber: string;
  authors: string;
}) => {
  return (
    <div className="w-full bg-white content-padding">
      <div className="flex flex-col max-w-screen-content mx-auto">
        <div className="flex flex-col gap-8 pt-16 text-text-primary font-medium">
          <div className="flex flex-col gap-1">
            <h1
              className="max-w-2xl font-extrabold text-2xl text-pretty leading-tight tracking-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-xs font-medium">
              Season {season} | Episode {episodeNumber}
            </p>
            <p className="text-base font-normal">{authors}</p>
          </div>
          {description && (
            <p
              className="mb-6 text-sm max-w-2xl"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          {/* TODO: Add share functionality */}
          <IconButton withRotatingArrow={true}>Share this episode</IconButton>
        </div>
      </div>
    </div>
  );
};
