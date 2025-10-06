import { cn } from "~/lib/utils";
import AuthorTabs from "~/routes/author/components/author-tabs";
import { Author } from "~/routes/author/loader";
import { AuthorBio } from "~/routes/author/partials/author-bio";

export const LeadersModal = ({ author }: { author: Author | null }) => {
  if (!author) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      className={cn(
        "overflow-hidden",
        "max-w-screen-content",
        "max-h-[85vh]",
        "overflow-y-auto",
        "xl:!w-6xl",
        "lg:w-4xl",
        "md:w-2xl",
        "sm:w-lg",
        "w-[350px]"
      )}
    >
      <div className="h-full flex flex-col lg:flex-row w-full rounded-xl">
        {/* Left Side */}
        <div
          className="w-full p-4 md:p-10 md:pt-8 flex-shrink-0"
          // className="w-full lg:w-2/5 p-4 md:p-16 md:pt-8 flex-shrink-0"
        >
          <AuthorBio
            id={author?.id}
            fullName={author?.fullName}
            profilePhoto={author?.profilePhoto}
            authorAttributes={author?.authorAttributes}
            variant="leaders"
            hideSocialLinks={true}
          />
        </div>

        {/* Right Side */}
        <div
          className={cn(
            "md:hidden", // Only showing on mobile for now
            "w-full",
            "lg:w-3/5",
            "px-4",
            "bg-white",
            "md:py-4",
            "flex-1",
            "overflow-hidden",
            "lg:rounded-r-xl",
            "rounded-b-xl"
          )}
        >
          <AuthorTabs articles={author?.authorAttributes?.publications} />
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-full md:max-w-[85vw] 2xl:max-w-[70vw]">
    <div className="size-full flex">
      {/* Left Side Loading Skeleton */}
      <div className="w-1/2 p-4">
        <div className="animate-pulse">
          <div className="h-32 w-32 rounded-full bg-gray-200 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>

      {/* Right Side Loading Skeleton */}
      <div className="w-1/2 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
