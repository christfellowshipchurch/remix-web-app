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
    <div className="hidden md:flex flex-col justify-center lg:w-2/5 xl:w-1/2 md:mt-24 mr-10 text-white font-medium text-xl lg:max-w-[640px] xl:max-w-[720px]">
      <div className="flex flex-col gap-2 mb-4 xl:mb-6">
        <h1
          className="max-w-2xl font-extrabold text-pretty leading-tight tracking-tight text-3xl"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-xs font-medium">
          Season {season} | Episode {episodeNumber}
        </p>
        <p className="text-base font-normal">{authors}</p>
      </div>
      {description && (
        <p
          className="mb-6 lg:mb-8 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};
