export const HeroContent = ({
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
    <div className="flex flex-col justify-center lg:w-2/5 xl:w-1/2 mt-4 md:mt-24 mr-10 mb-6 md:mb-0 text-white font-medium md:text-xl lg:max-w-[640px] xl:max-w-[720px]">
      <div className="flex flex-col gap-1 xl:gap-2 mb-2 md:mb-4 xl:mb-6">
        <h1
          className="max-w-2xl font-extrabold text-2xl text-pretty leading-tight tracking-tight md:leading-tight md:text-3xl"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-xs font-medium">
          Season {season} | Episode {episodeNumber}
        </p>
        <p className="text-base font-normal">{authors}</p>
      </div>
      {description && (
        <p
          className="mb-6 max-w-2xl lg:mb-8"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};
