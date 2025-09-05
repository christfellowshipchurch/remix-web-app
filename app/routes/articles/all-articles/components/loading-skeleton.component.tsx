import { HubsTagsRefinementLoadingSkeleton } from "~/components/hubs-tags-refinement";

export const ArticlesLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      <HubsTagsRefinementLoadingSkeleton />
      <ArticlesCardsLoadingSkeleton />
    </div>
  );
};

export const ArticlesCardsLoadingSkeleton = ({
  wrapperClass = "pr-12 lg:pr-18 grid grid-cols-1 md:grid-cols-2 xl:!grid-cols-3 md:gap-x-4 gap-y-4 lg:gap-8 xl:gap-y-16",
}: {
  wrapperClass?: string;
}) => {
  return (
    <div className={wrapperClass}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-[320px] lg:w-[440px] xl:w-[410px] h-[350px] bg-gray-100 animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
};
