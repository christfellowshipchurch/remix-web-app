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
    <div className="hidden md:flex flex-col justify-center text-white font-medium text-xl">
      <div className="flex flex-col gap-2 mb-4 xl:mb-6">
        <h1
          className="font-extrabold text-pretty leading-tight tracking-tight text-3xl"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-xs font-medium uppercase">
          Season {season} | Episode {episodeNumber}
        </p>
        <p className="text-base font-normal">{authors}</p>
      </div>
      {description && (
        <p
          className="font-medium text-lg"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};
